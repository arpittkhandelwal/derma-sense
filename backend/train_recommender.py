import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

def train_recommender():
    print("--- Training Skincare Recommendation Engine ---")
    
    products_path = 'dataset/products.csv'
    interactions_path = 'dataset/interactions.csv'
    
    if not os.path.exists(products_path):
        print("Products dataset not found!")
        return

    # Load datasets
    df_products = pd.read_csv(products_path)
    print(f"Loaded {len(df_products)} products.")

    # Content-Based Filtering using Ingredients
    # Replace NaN with empty string and replace '|' with spaces for TF-IDF
    df_products['Ingredients'] = df_products['Ingredients'].fillna('').str.replace('|', ' ')
    
    # We want to match skin type and acne concerns to ingredients.
    # For example, Salicylic_Acid is good for Acne/Oily skin. 
    # Hyaluronic_Acid is good for Dry skin.
    
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df_products['Ingredients'])
    
    # Compute similarity matrix between products
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    models_dir = 'models'
    os.makedirs(models_dir, exist_ok=True)
    
    # Save the TF-IDF Vectorizer and the product dataframe
    model_data = {
        'vectorizer': tfidf,
        'tfidf_matrix': tfidf_matrix,
        'products_df': df_products
    }
    
    with open(os.path.join(models_dir, 'recommender.pkl'), 'wb') as f:
        pickle.dump(model_data, f)
        
    print("Successfully trained and saved recommender.pkl")

if __name__ == '__main__':
    train_recommender()
