# 🧬 DermaSense AI: Next-Gen Clinical Dermatology Platform

DermaSense AI is an advanced, full-stack application that leverages computer vision heuristics and a sophisticated product recommendation engine to analyze facial skin health and generate clinical-grade skincare routines. 

The project features a stunning, high-end frosted-glass UI and is powered by a robust Python-based AI backend.

---

## ✨ Key Features

- **Live Facial Scanning**: Seamless webcam integration to capture high-resolution imagery.
- **Computer Vision Analysis**: Calculates 13 distinct skin parameters including glow score, texture variance, hydration proxy, erythema (redness) proxy, and cystic acne risk.
- **Pandas Recommendation Engine**: Dynamically filters a vast dataset of top-tier global skincare brands (restricted to those officially available in India) to generate personalized clinical routines.
- **Smart Amazon Integration**: Automatically generates precise Amazon search links for every recommended product.
- **Mission Control Progress Tracker**: A standalone, highly aesthetic tracking dashboard featuring a massive circular daily adherence ring, neon clinical step-trackers, and side-by-side historical face log comparisons.
- **Offline Mock Resilience**: If the AI backend is unreachable, the frontend gracefully falls back to a locally mocked clinical routine, maintaining the premium user experience.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
- **React.js** (via Vite)
- **Vanilla CSS** (Custom Glassmorphism, Micro-animations, CSS Grid/Flexbox layouts)
- **Lucide React** (Premium iconography)

### Backend (AI & Machine Learning)
- **Python 3**
- **FastAPI** (High-performance API routing)
- **Uvicorn** (ASGI Web Server)
- **Pillow (PIL)** (Image processing and statistical pixel analysis)
- **Pandas** (Data manipulation and recommendation filtering)

---

## 🚀 How to Run Locally

Because DermaSense AI uses a split-stack architecture, you must run both the Frontend and the Backend servers simultaneously.

### 1. Start the AI Backend
The backend handles the heavy lifting, image processing, and dataset filtering.
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*The server will start running at `http://localhost:8000`.*

### 2. Start the React Frontend
The frontend provides the interactive user interface. Open a **new terminal window** and run:
```bash
npm install
npm run dev
```
*The frontend will be accessible at `http://localhost:5173` (or similar).*

---

## 🌍 Deployment on Netlify

This repository is pre-configured for **Netlify deployment**. A `netlify.toml` file is included in the root directory to automatically handle Vite build commands and Single-Page Application (SPA) routing fallbacks (e.g., ensuring the `/progress` route works).

To deploy:
1. Drag and drop this folder into your Netlify dashboard OR connect it to your GitHub repository.
2. Netlify will automatically run `npm run build` and publish the `dist` folder.

*(Note: Netlify only hosts the frontend. For live ML analysis, the Python backend must be hosted separately on a platform like Render, Railway, or Heroku, or run locally by the user viewing the site).*
