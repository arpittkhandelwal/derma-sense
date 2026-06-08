import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add realAnalysis state and fallback data
state_injection = """  const [realRecommendations, setRealRecommendations] = useState(null);
  const [realAnalysis, setRealAnalysis] = useState({
        glow_score: 74, skin_age: 24, predicted_skin_type: "Combination & Sensitive", confidence: 99.8,
        acne_spots: 4, inflammation_level: "Moderate", cystic_risk: 15,
        hydration_score: 81, moisture_status: "Healthy Moisture",
        texture_score: 92, visible_pores: "Minimal", surface_smoothness: "Excellent",
        pigmentation_risk: 22, uneven_tone: "Slight (Cheeks)", dark_spots: 0,
        oily_t_zone: "Oily (T-Zone)", dark_circle_darkness: "Visible",
        redness_irritation: "Elevated", ai_sensitivity_pred: "Possibly Sensitive Skin"
  });"""
content = content.replace("  const [realRecommendations, setRealRecommendations] = useState(null);", state_injection)

# 2. Fix the fetch to use scanImages.front instead of a dummy string!
fetch_logic_old = """        // Send a dummy file just to trigger the API, since we simulate the model
        const blob = new Blob(["dummy_image_data"], { type: "image/jpeg" });
        formData.append("file", blob, "face_scan.jpg");"""

fetch_logic_new = """        // Convert the base64 image from the camera to a Blob
        const res = await fetch(scanImages.front);
        const blob = await res.blob();
        formData.append("file", blob, "face_scan.jpg");"""
content = content.replace(fetch_logic_old, fetch_logic_new)

# 3. Save real analysis on successful fetch
fetch_success_old = """        if (response.ok) {
          const data = await response.json();
          setRealRecommendations(data.recommendations);
        }"""
fetch_success_new = """        if (response.ok) {
          const data = await response.json();
          setRealRecommendations(data.recommendations);
          if (data.analysis) {
             setRealAnalysis(data.analysis);
          }
        }"""
content = content.replace(fetch_success_old, fetch_success_new)

# --- REPLACEMENTS (Careful string matching) ---

reps = {
    "74<span": "{realAnalysis.glow_score}<span",
    "24 <span": "{realAnalysis.skin_age} <span",
    "Combination <span style={{color: '#0F172A'}}>& Sensitive</span>": "{realAnalysis.predicted_skin_type}",
    "AI Confidence: 99.8%": "AI Confidence: {realAnalysis.confidence}%",
    
    # Acne
    "4 detected</span>": "{realAnalysis.acne_spots} detected</span>",
    "Moderate</span>": "{realAnalysis.inflammation_level}</span>",
    "<span>15%</span>": "<span>{realAnalysis.cystic_risk}%</span>",
    "width: '15%'": "width: `${realAnalysis.cystic_risk}%`",
    
    # Hydration
    "Healthy Moisture</span>": "{realAnalysis.moisture_status}</span>",
    "<span>81%</span>": "<span>{realAnalysis.hydration_score}%</span>",
    "width: '81%'": "width: `${realAnalysis.hydration_score}%`",
    
    # Texture
    "Minimal</span>": "{realAnalysis.visible_pores}</span>",
    "Excellent</span>": "{realAnalysis.surface_smoothness}</span>",
    "<span>92%</span>": "<span>{realAnalysis.texture_score}%</span>",
    "width: '92%'": "width: `${realAnalysis.texture_score}%`",
    
    # Pigmentation
    "Slight (Cheeks)</span>": "{realAnalysis.uneven_tone}</span>",
    "0 detected</span>": "{realAnalysis.dark_spots} detected</span>",
    "<span>22%</span>": "<span>{realAnalysis.pigmentation_risk}%</span>",
    "width: '22%'": "width: `${realAnalysis.pigmentation_risk}%`",
    
    # Oily Map
    "Oily (T-Zone)</span>": "{realAnalysis.oily_t_zone}</span>",
    
    # Dark Circle
    "Visible</span>": "{realAnalysis.dark_circle_darkness}</span>",
    
    # Sensitivity
    "Elevated</span>": "{realAnalysis.redness_irritation}</span>",
    "Possibly Sensitive Skin</span>": "{realAnalysis.ai_sensitivity_pred}</span>"
}

for old, new in reps.items():
    content = content.replace(old, new)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Dashboard.jsx updated successfully!")
