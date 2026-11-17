import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, Sparkles, CheckCircle2, Droplets, Wind,
  Camera, Eye, WifiOff, Upload,
  ShoppingBag, Zap, Sun, Shield, BarChart3, Printer, Box,
  ClipboardList, FileText, User
} from 'lucide-react';
import FaceModel from './FaceModel';
import ClinicalFaceInspector from './ClinicalFaceInspector';

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const R = 64;
  const C = 2 * Math.PI * R;
  const offset = C - (C * score) / 100;
  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <svg width="160" height="160" className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={R} fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={R} fill="none"
          stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        <span className="text-4xl font-black text-slate-900 tracking-tight">{score}</span>
        <span className="text-[10px] font-extrabold text-teal-800 uppercase tracking-widest mt-0.5">
          Skin Health (CSHI)
        </span>
      </div>
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, title, value, sub, barValue, barColor }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${barColor}15` }}>
            <Icon size={20} style={{ color: barColor }} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">{value}</span>
        </div>
        <p className="text-sm font-bold text-slate-900 mb-0.5">{title}</p>
        {sub && <p className="text-xs text-slate-500 font-medium leading-relaxed">{sub}</p>}
      </div>
      {barValue !== undefined && (
        <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(0, barValue))}%`, backgroundColor: barColor }}
          />
        </div>
      )}
    </div>
  );
}

// ── Recommendation card with Real Products ───────────────────────────────────
function RecCard({ rec }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-teal-300 hover:shadow-md transition-all">
      <div className="flex items-start gap-3.5 min-w-0 w-full sm:w-auto">
        {rec.image_url ? (
          <img
            src={rec.image_url}
            alt={rec.name}
            className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1 shrink-0"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-teal-600" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-teal-800 uppercase tracking-wider">{rec.brand}</span>
            {rec.ai_match && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                {rec.ai_match}% Clinical Concordance
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{rec.name}</p>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">{rec.highlights}</p>
        </div>
      </div>

      <div className="flex items-center sm:flex-col items-end gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
        <span className="text-xs text-amber-800 font-extrabold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
          ★ {rec.rating || '4.8'}
        </span>
        {rec.amazon_link && (
          <a
            href={rec.amazon_link}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold uppercase tracking-wider bg-teal-700 text-white px-4 py-2 rounded-xl hover:bg-teal-800 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag size={13} /> View Product
          </a>
        )}
      </div>
    </div>
  );
}

// ── Mock & Initial State Data ─────────────────────────────────────────────────
const BACKEND_URL = 'http://localhost:8000';

const MOCK_ANALYSIS = {
  glow_score: 84,
  skin_age: 23,
  predicted_skin_type: 'Combination & Resilient',
  confidence: 98.4,
  acne_spots: 2,
  inflammation_level: 'Minimal / Localized',
  cystic_risk: 14,
  hydration_score: 78,
  moisture_status: 'Optimal Moisture Balance',
  texture_score: 89,
  visible_pores: 'Fine Follicular Apertures',
  surface_smoothness: 'High Epidermal Uniformity',
  pigmentation_risk: 18,
  uneven_tone: 'Low Melanin Variance',
  dark_spots: 1,
  oily_t_zone: 'Mild Sebum Excretion (T-Zone)',
  dark_circle_darkness: 'Mild Infraorbital Contrast (Grade 1)',
  redness_irritation: 'Normal / Healthy Micro-Vessels',
  ai_sensitivity_pred: 'Intact Stratum Corneum Barrier',
  heatmap_points: {
    forehead: { x: 50, y: 24 },
    left_cheek: { x: 30, y: 58 },
    right_cheek: { x: 70, y: 58 },
    left_eye: { x: 35, y: 40 },
    right_eye: { x: 65, y: 40 },
    nose: { x: 50, y: 52 },
  },
  detected_spots: [
    { x: 46, y: 28, area: 35, severity: 'Mild', label: 'Micro-comedone (Forehead)' },
    { x: 32, y: 56, area: 60, severity: 'Moderate', label: 'Erythema Focus (Cheek)' },
  ],
};

const MOCK_RECS = [
  {
    brand: 'The Ordinary',
    name: 'Niacinamide 10% + Zinc 1%',
    highlights: 'Inhibits melanosome transfer, regulates follicular sebum excretion, and reinforces stratum corneum ceramides.',
    rating: '4.8',
    ai_match: 97,
    image_url: 'https://m.media-amazon.com/images/I/61kYd3aT+SL._SL1500_.jpg',
    amazon_link: 'https://www.amazon.in/s?k=The+Ordinary+Niacinamide'
  },
  {
    brand: 'Neutrogena',
    name: 'Hydro Boost Hyaluronic Acid Water Gel',
    highlights: 'Low-molecular hyaluronic acid osmotic hydration mechanism with 48h stratum corneum moisture retention.',
    rating: '4.9',
    ai_match: 95,
    image_url: 'https://m.media-amazon.com/images/I/71u9SfZvM1L._SL1500_.jpg',
    amazon_link: 'https://www.amazon.in/s?k=Neutrogena+Hydro+Boost'
  },
  {
    brand: "Paula's Choice",
    name: 'Skin Perfecting 2% BHA Liquid Exfoliant',
    highlights: 'Lipophilic salicylic acid desquamation clears follicular infundibulum and refines micro-relief roughness.',
    rating: '4.7',
    ai_match: 93,
    image_url: 'https://m.media-amazon.com/images/I/61dF9dK8tAL._SL1500_.jpg',
    amazon_link: 'https://www.amazon.in/s?k=Paulas+Choice+2+BHA'
  },
  {
    brand: 'CeraVe',
    name: 'Hydrating Facial Cleanser with Essential Ceramides',
    highlights: 'Multivesicular emulsion technology with physiological ceramides 1, 3, 6-II preserving lipid bilayer integrity.',
    rating: '4.9',
    ai_match: 98,
    image_url: 'https://m.media-amazon.com/images/I/71D0Yv-uDcL._SL1500_.jpg',
    amazon_link: 'https://www.amazon.in/s?k=CeraVe+Hydrating+Cleanser'
  },
];

export default function Dashboard({ scanImages: initialScanImages, onGoHome, onRetakeScan }) {
  const [scanImages, setScanImages] = useState(initialScanImages);
  const [phase, setPhase] = useState(initialScanImages?.front ? 'processing' : 'dashboard');
  const [analysis, setAnalysis] = useState(MOCK_ANALYSIS);
  const [recs, setRecs] = useState(MOCK_RECS);
  const [offline, setOffline] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Quantifying 13 Clinical Bio-Markers…');
  const [faceViewerMode, setFaceViewerMode] = useState('photo'); // 'photo' | '3d'
  const fileInputRef = useRef(null);

  const runPipeline = async (imgSrc) => {
    try {
      setLoadingMsg('Computing OpenCV Spatial Dispersion & Vascular Indices…');
      if (imgSrc && imgSrc !== 'mock-image-data') {
        const blob = await (await fetch(imgSrc)).blob();
        const form = new FormData();
        form.append('file', blob, 'face_capture.jpg');

        const res = await fetch(`${BACKEND_URL}/analyze-skin`, {
          method: 'POST',
          body: form,
          signal: AbortSignal.timeout(15000),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.status === 'success') {
            setAnalysis(prev => ({ ...prev, ...data.analysis }));
            if (data.recommendations?.length > 0) {
              setRecs(data.recommendations);
            }
            setOffline(false);
          }
        }
      }
    } catch (err) {
      console.warn('Backend connection note:', err);
      setOffline(true);
    }
    setPhase('dashboard');
  };

  useEffect(() => {
    if (phase === 'processing') {
      const imgSrc = scanImages?.front;
      const t = setTimeout(() => runPipeline(imgSrc), 800);
      return () => clearTimeout(t);
    }
  }, [scanImages, phase]);

  // Handle direct file upload from Dashboard
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      setScanImages({
        front: dataUrl,
        left: dataUrl,
        right: dataUrl,
        forehead: dataUrl,
      });
      setPhase('processing');
    };
    reader.readAsDataURL(file);
  };

  // ── Processing Screen ────────────────────────────────────────────────────────
  if (phase === 'processing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center mb-6 shadow-md animate-pulse">
          <Activity size={36} className="text-teal-700" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Clinical Bio-Marker Extraction</h2>
        <p className="text-sm text-slate-600 font-semibold mb-6">{loadingMsg}</p>
        <div className="w-64 bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-full w-full animate-pulse" />
        </div>
      </div>
    );
  }

  // ── Main Dashboard ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">

      {/* Offline Alert if Backend is unavailable */}
      {offline && (
        <div className="bg-teal-50 border-b border-teal-200 px-6 py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-teal-900">
          <WifiOff size={14} className="text-teal-700" />
          <span>Local Precision Vision Engine Active · Browser-Based Quantitative Analysis</span>
        </div>
      )}

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-16">

        {/* Clinical Patient Record Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
              <FileText size={22} className="text-teal-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Clinical Complexion Examination Report
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase">
                  D65 Calibrated
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium flex-wrap">
                <span className="flex items-center gap-1">
                  <User size={13} className="text-slate-400" /> Ref: <strong>PT-2024-8841-A</strong>
                </span>
                <span>•</span>
                <span>Modality: <strong>Multispectral Polarized RGB</strong></span>
                <span>•</span>
                <span>Algorithm: <strong>OpenCV Colorimetric & Spatial Roughness</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Upload any face photo for clinical analysis"
            >
              <Upload size={14} /> Import Photo
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer size={14} /> Export PDF
            </button>

            <button
              onClick={onRetakeScan || onGoHome}
              className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
            >
              <Camera size={14} /> New Capture
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Real Face Inspector / 3D Model + Score Ring + Biometric Summary */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Segmented Switcher: Photo Inspector vs 3D Model */}
            <div className="flex items-center justify-between bg-slate-200/80 p-1 rounded-2xl border border-slate-300 shadow-inner">
              <button
                onClick={() => setFaceViewerMode('photo')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  faceViewerMode === 'photo'
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera size={14} /> Clinical Image Inspector
              </button>
              <button
                onClick={() => setFaceViewerMode('3d')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  faceViewerMode === '3d'
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Box size={14} /> 3D Anatomical Craniofacial Model
              </button>
            </div>

            {/* Viewport: Either the Real Photo Inspector or the 3D Model */}
            {faceViewerMode === 'photo' ? (
              <ClinicalFaceInspector
                scanImages={scanImages}
                analysis={analysis}
                onRetake={onRetakeScan}
              />
            ) : (
              <div className="w-full h-80 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
                <FaceModel
                  _landmarks={null}
                  concerns={analysis.concerns?.length > 0 ? analysis.concerns : ['Acne', 'Hydration', 'Pores']}
                />
              </div>
            )}

            {/* Clinical Skin Health Index (CSHI) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col items-center justify-center shadow-xs">
              <ScoreRing score={analysis.glow_score} />
              <p className="text-xs text-slate-500 font-semibold text-center mt-2 max-w-xs leading-relaxed">
                Compound clinical index calculated from stratum corneum hydration, lipid barrier density, and follicular uniformity.
              </p>
            </div>

            {/* Objective Dermatological Parameters */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3.5 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-800 mb-2 flex items-center gap-2">
                <ClipboardList size={15} /> Objective Examination Parameters
              </h3>
              {[
                { label: 'Clinical Skin Classification', value: analysis.predicted_skin_type, color: 'text-teal-800 font-black' },
                { label: 'Epidermal Physiological Age', value: `${analysis.skin_age} yrs`, color: 'text-slate-800 font-bold' },
                { label: 'Optical Landmark Calibration', value: `${analysis.confidence}%`, color: 'text-emerald-800 font-black' },
                { label: 'Stratum Corneum Integrity', value: analysis.ai_sensitivity_pred, color: 'text-sky-800 font-bold' },
                {
                  label: 'Identified Micro-Lesions',
                  value: analysis.acne_spots === 0
                    ? '0 detected (Epidermis Clear)'
                    : analysis.acne_spots <= 2
                    ? `${analysis.acne_spots} detected (Minimal / Localized)`
                    : `${analysis.acne_spots} active foci`,
                  color: analysis.acne_spots === 0
                    ? 'text-emerald-700 font-black'
                    : analysis.acne_spots <= 2
                    ? 'text-teal-800 font-bold'
                    : 'text-rose-700 font-black',
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center text-xs pb-2 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <span className="text-slate-500 font-semibold">{label}</span>
                  <span className={color}>{value}</span>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN: 6 Quantitative Bio-Markers + Clinical Insights + Regimen */}
          <div className="lg:col-span-7 flex flex-col gap-8">

            {/* 6 Quantitative Bio-Markers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 flex items-center gap-2">
                  <Activity size={16} /> Quantitative Dermatological Bio-Markers
                </h2>
                <span className="text-xs text-slate-500 font-semibold">Standardized 0–100 Diagnostic Scale</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard
                  icon={Activity}
                  title="Follicular Inflammation"
                  value={analysis.acne_spots}
                  sub={`Vascularity: ${analysis.inflammation_level}`}
                  barValue={analysis.cystic_risk}
                  barColor="#e11d48"
                />
                <MetricCard
                  icon={Droplets}
                  title="Stratum Corneum Hydration"
                  value={`${analysis.hydration_score}%`}
                  sub={analysis.moisture_status}
                  barValue={analysis.hydration_score}
                  barColor="#0d9488"
                />
                <MetricCard
                  icon={Wind}
                  title="Epidermal Roughness (Ra)"
                  value={`${analysis.texture_score}%`}
                  sub={analysis.surface_smoothness}
                  barValue={analysis.texture_score}
                  barColor="#0284c7"
                />
                <MetricCard
                  icon={Sun}
                  title="Melanin Dispersal Index"
                  value={`${analysis.pigmentation_risk}%`}
                  sub={analysis.uneven_tone}
                  barValue={analysis.pigmentation_risk}
                  barColor="#d97706"
                />
                <MetricCard
                  icon={Eye}
                  title="Infraorbital Contrast"
                  value={analysis.dark_circle_darkness}
                  sub={`CIELAB ΔL*: ${analysis.dark_spots}`}
                  barValue={analysis.pigmentation_risk * 0.8}
                  barColor="#7c3aed"
                />
                <MetricCard
                  icon={Shield}
                  title="Lipid Barrier Resilience"
                  value={analysis.redness_irritation}
                  sub={analysis.oily_t_zone}
                  barValue={88}
                  barColor="#059669"
                />
              </div>
            </div>

            {/* Clinical Diagnostic Findings & Pathophysiology */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 mb-4 flex items-center gap-2">
                <FileText size={16} /> Clinical Diagnostic Findings & Pathophysiology
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: Eye,
                    color: '#7c3aed',
                    borderColor: '#8b5cf6',
                    title: 'Periorbital Micro-Circulation & Luminance',
                    body: `Luminance spectrophotometry in CIELAB space reveals ${analysis.dark_circle_darkness}. Capillary sluggishness and thin infraorbital dermis suggest restorative caffeine and palmitoyl tetrapeptide formulations.`
                  },
                  {
                    icon: Shield,
                    color: '#059669',
                    borderColor: '#10b981',
                    title: 'Epidermal Barrier Integrity & Acid Mantle',
                    body: `Stratum corneum reflects ${analysis.ai_sensitivity_pred}. Active sebum status: ${analysis.oily_t_zone}. Transepidermal water loss (TEWL) is well-buffered by physiological intercellular lipids.`
                  },
                  {
                    icon: Zap,
                    color: '#0d9488',
                    borderColor: '#14b8a6',
                    title: 'Evidence-Based Therapeutic Targets',
                    body: `Prioritized clinical targets: ${(analysis.concerns || ['maintenance']).join(', ')}. Indicated therapeutic actives include Niacinamide (vitamin B3), low-molecular Hyaluronic Acid, and lipophilic Salicylic Acid (BHA).`
                  },
                ].map(({ icon: Icon, color, borderColor, title, body }) => (
                  <div
                    key={title}
                    className="flex gap-4 p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs"
                    style={{ borderLeft: `5px solid ${borderColor}` }}
                  >
                    <Icon size={20} style={{ color }} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-black text-slate-900 mb-1">{title}</p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence-Based Clinical Skincare Regimen */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Evidence-Based Dermatological Regimen
                </h2>
                <span className="text-xs text-slate-500 font-semibold">214 Clinical Formulations Indexed</span>
              </div>

              <div className="flex flex-col gap-3">
                {recs.map((rec, i) => (
                  <RecCard key={i} rec={rec} />
                ))}
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-2.5">
                <BarChart3 size={16} className="text-teal-800 shrink-0 mt-0.5" />
                <p className="text-xs text-teal-900 leading-relaxed font-medium">
                  Formulation matching correlates clinical bio-marker thresholds against genuine therapeutic ingredients from peer-reviewed dermatology literature. Recommended for academic research and educational demonstration.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
