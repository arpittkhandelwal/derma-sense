from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from recommender import get_recommendations
from cv_analyzer import analyze_image
import os
import shutil
import asyncio

app = FastAPI(title="DermaSense AI Backend")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "DermaSense API is running"}

@app.get("/health")
def read_health():
    return {"status": "healthy"}

def save_upload_file(upload_file: UploadFile, destination: str):
    with open(destination, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

def remove_file(path: str):
    if os.path.exists(path):
        os.remove(path)

@app.post("/analyze-skin")
async def analyze_skin(file: UploadFile = File(...), background_tasks: BackgroundTasks = BackgroundTasks()):
    """
    Receives an image from the frontend, runs it through the CV heuristics analyzer,
    and returns detected skin conditions and product recommendations.
    Uses asyncio.to_thread to prevent blocking the ASGI event loop during heavy ML inference.
    """
    temp_dir = os.path.join(os.path.dirname(__file__), "temp")
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    
    # 1. Save uploaded image safely without blocking
    await asyncio.to_thread(save_upload_file, file, file_path)
        
    # 2. Run Image Analysis (Pixel-based heuristics & PyTorch inference)
    # Offloaded to a thread pool so multiple users can hit this endpoint concurrently
    try:
        analysis_results = await asyncio.to_thread(analyze_image, file_path)
    except Exception as e:
        background_tasks.add_task(remove_file, file_path)
        return {"status": "error", "message": str(e)}
    
    # Extract keys for recommender
    detected_type = analysis_results.pop("raw_skin_type", "combination")
    detected_concerns = analysis_results.pop("concerns", ["maintenance"])
    
    # 3. Get Recommendations using our Pandas Recommender Engine
    # Pandas operations are fast enough, but thread them just in case of large datasets
    recommendations = await asyncio.to_thread(get_recommendations, detected_type, detected_concerns, 4)
    
    # 4. Clean up asynchronously after response is sent
    background_tasks.add_task(remove_file, file_path)
        
    return {
        "status": "success",
        "analysis": analysis_results,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
