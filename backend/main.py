from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from recommender import get_recommendations
from cv_analyzer import analyze_image
import os
import shutil

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

@app.post("/analyze-skin")
async def analyze_skin(file: UploadFile = File(...)):
    """
    Receives an image from the frontend, runs it through the CV heuristics analyzer,
    and returns detected skin conditions and product recommendations.
    """
    # 1. Save uploaded image temporarily
    temp_dir = os.path.join(os.path.dirname(__file__), "temp")
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Run Image Analysis (Pixel-based heuristics)
    analysis_results = analyze_image(file_path)
    
    # Extract keys for recommender
    detected_type = analysis_results.pop("raw_skin_type")
    detected_concerns = analysis_results.pop("concerns")
    
    # 3. Get Recommendations using our Pandas Recommender Engine
    recommendations = get_recommendations(skin_type=detected_type, concerns=detected_concerns, limit=4)
    
    # Clean up
    if os.path.exists(file_path):
        os.remove(file_path)
        
    return {
        "status": "success",
        "analysis": analysis_results,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
