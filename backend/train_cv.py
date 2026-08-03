import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
import copy
import time

def train_model(model, dataloaders, criterion, optimizer, num_epochs=2, device='cpu'):
    since = time.time()
    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0

    for epoch in range(num_epochs):
        print(f'Epoch {epoch}/{num_epochs - 1}')
        print('-' * 10)

        for phase in ['train', 'valid']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(dataloaders[phase].dataset)
            epoch_acc = running_corrects.double() / len(dataloaders[phase].dataset)

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

            if phase == 'valid' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())

        print()

    time_elapsed = time.time() - since
    print(f'Training complete in {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s')
    print(f'Best val Acc: {best_acc:4f}')

    model.load_state_dict(best_model_wts)
    return model

def build_model(num_classes):
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, num_classes)
    return model

def main():
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    data_transforms = {
        'train': transforms.Compose([
            transforms.Resize(256),
            transforms.RandomCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(15),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'valid': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    models_dir = 'models'
    os.makedirs(models_dir, exist_ok=True)

    # 1. Train Skin Type Model
    skin_type_dir = 'dataset/Oily-Dry-Skin-Types'
    if os.path.exists(skin_type_dir):
        print("\n--- Training Skin Type Model ---")
        image_datasets = {x: datasets.ImageFolder(os.path.join(skin_type_dir, x), data_transforms[x]) for x in ['train', 'valid']}
        dataloaders = {x: DataLoader(image_datasets[x], batch_size=32, shuffle=True, num_workers=0) for x in ['train', 'valid']}
        class_names = image_datasets['train'].classes
        print(f"Classes: {class_names}")

        model = build_model(len(class_names))
        model = model.to(device)
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=0.001)

        model = train_model(model, dataloaders, criterion, optimizer, num_epochs=10, device=device)
        torch.save({'state_dict': model.state_dict(), 'classes': class_names}, os.path.join(models_dir, 'skintype_model.pth'))
        print("Saved skintype_model.pth")

    # 2. Train Acne Model
    acne_dir = 'dataset/AcneDataset'
    if os.path.exists(acne_dir):
        print("\n--- Training Acne Model ---")
        image_datasets = {x: datasets.ImageFolder(os.path.join(acne_dir, x), data_transforms[x]) for x in ['train', 'valid']}
        dataloaders = {x: DataLoader(image_datasets[x], batch_size=32, shuffle=True, num_workers=0) for x in ['train', 'valid']}
        class_names = image_datasets['train'].classes
        print(f"Classes: {class_names}")

        model = build_model(len(class_names))
        model = model.to(device)
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=0.001)

        model = train_model(model, dataloaders, criterion, optimizer, num_epochs=10, device=device)
        torch.save({'state_dict': model.state_dict(), 'classes': class_names}, os.path.join(models_dir, 'acne_model.pth'))
        print("Saved acne_model.pth")

if __name__ == '__main__':
    main()
