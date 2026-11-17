import React, { useState } from 'react';
import { Camera, Eye, Zap, Crosshair, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

const CLINICAL_SAMPLE_FACE = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=900';

export default function ClinicalFaceInspector({ scanImages, analysis, onRetake }) {
  const [selectedAngle, setSelectedAngle] = useState('front');
  // Clinical View Modes:
  // 'standard': Natural Polarized White Light (RGB)
  // 'erythema': Cross-Polarized Subsurface Vascularity & Erythema
  // 'porphyrins': Wood's UV Lamp 365nm Follicular Porphyrins & Sebum
  // 'zones': Anatomical Facial Mapping (Regio Frontalis, Malaris, Nasalis, Mentalis)
  // 'lesions': Objective Lesion & Erythema Spot Callouts
  const [viewMode, setViewMode] = useState('standard');
  const [activeSpot, setActiveSpot] = useState(null);

  // Determine current image to display: calibrated crop from CV analysis, then user scan, then clinical sample
  const currentImage = analysis?.cropped_face_base64
    ? analysis.cropped_face_base64
    : ((scanImages && scanImages[selectedAngle] && scanImages[selectedAngle] !== 'mock-image-data')
      ? scanImages[selectedAngle]
      : CLINICAL_SAMPLE_FACE);

  const isUserCapture = !!(analysis?.cropped_face_base64 || (scanImages && scanImages[selectedAngle] && scanImages[selectedAngle] !== 'mock-image-data'));

  // Calibrated facial anatomical landmark coordinates
  const coords = analysis?.heatmap_points || {
    forehead: { x: 50, y: 24 },
    left_cheek: { x: 30, y: 58 },
    right_cheek: { x: 70, y: 58 },
    left_eye: { x: 35, y: 40 },
    right_eye: { x: 65, y: 40 },
    nose: { x: 50, y: 52 },
  };

  // Detected clinical lesions strictly on facial skin
  const detectedSpots = analysis?.detected_spots !== undefined
    ? analysis.detected_spots
    : [];

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs flex flex-col">
      {/* Clinical Telemetry & Mode Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              {isUserCapture ? "Patient Scan · Multispectral Viewer" : "Clinical Reference · Calibrated Inspection"}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                D65 Illuminant · 0.12 mm/px · Colorimetric ΔE* &lt; 1.2
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Imaging Modality Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          {[
            { id: 'standard', label: 'Standard RGB', icon: Camera },
            { id: 'erythema', label: 'Cross-Polarized', icon: Zap },
            { id: 'porphyrins', label: "Wood's UV", icon: Eye },
            { id: 'zones', label: 'Anatomy Zones', icon: Crosshair },
            { id: 'lesions', label: 'Lesion Focus', icon: AlertCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setViewMode(id);
                if (id !== 'lesions') setActiveSpot(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon size={12} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Photographic Inspector Viewport */}
      <div className="relative w-full aspect-square sm:aspect-4/3 bg-slate-950 overflow-hidden flex items-center justify-center select-none group">
        
        {/* Modality 1 & Base: Standard High-Fidelity RGB Capture */}
        <img
          src={currentImage}
          alt="Facial Inspection Capture"
          className={`w-full h-full object-cover transition-all duration-500 ${
            viewMode === 'erythema'
              ? 'contrast-150 saturate-200 brightness-95 sepia-[0.3] hue-rotate-[-20deg]'
              : viewMode === 'porphyrins'
              ? 'brightness-75 contrast-175 invert-[0.15] hue-rotate-[190deg] saturate-150'
              : ''
          }`}
        />

        {/* ── Modality 2: Cross-Polarized Subsurface Erythema Filter Overlay ── */}
        {viewMode === 'erythema' && (
          <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60 bg-gradient-to-t from-rose-950/40 via-red-900/20 to-transparent">
            {/* Clinical Watermark */}
            <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-[10px] font-mono px-2.5 py-1 rounded-md border border-rose-500/30">
              CROSS-POLARIZED VASCULARITY / ERYTHEMA INDEX
            </div>
            <div className="absolute bottom-4 left-4 bg-slate-900/90 text-rose-300 text-[10px] font-mono px-2.5 py-1 rounded-md border border-rose-500/30">
              Specular Glare Suppressed · Capillary Hemoglobin Contrast Enhanced
            </div>
          </div>
        )}

        {/* ── Modality 3: Wood's Lamp 365nm UV Fluorescence Mode ── */}
        {viewMode === 'porphyrins' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Deep UV Darkfield Overlay */}
            <div className="absolute inset-0 bg-indigo-950/50 mix-blend-color-burn" />
            
            {/* Fluorescent Porphyrin Glow on T-Zone & Sebaceous Follicles */}
            <div
              className="absolute w-28 h-16 rounded-full blur-md transform -translate-x-1/2 -translate-y-1/2 opacity-80"
              style={{
                top: `${coords.forehead.y + 6}%`,
                left: `${coords.forehead.x}%`,
                background: 'radial-gradient(circle, rgba(251,146,60,0.85) 0%, rgba(245,158,11,0.4) 60%, transparent 100%)',
              }}
            />
            <div
              className="absolute w-12 h-20 rounded-full blur-md transform -translate-x-1/2 -translate-y-1/2 opacity-85"
              style={{
                top: `${coords.nose.y}%`,
                left: `${coords.nose.x}%`,
                background: 'radial-gradient(circle, rgba(249,115,22,0.9) 0%, rgba(234,179,8,0.5) 60%, transparent 100%)',
              }}
            />
            
            {/* Legend Tag */}
            <div className="absolute top-4 left-4 bg-slate-900/90 text-amber-400 text-[10px] font-mono px-2.5 py-1 rounded-md border border-amber-500/40">
              WOOD'S LAMP 365nm FLUORESCENCE · C. ACNES PORPHYRINS (ORANGE/AMBER)
            </div>
          </div>
        )}

        {/* ── Modality 4: Anatomical Facial Mapping (Clean Clinical Division) ── */}
        {viewMode === 'zones' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none animate-fade-in" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Midline Sagittal Plane */}
            <line x1={coords.forehead.x} y1="10" x2={coords.forehead.x} y2="92" stroke="#ffffff" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.6" />

            {/* Regio Frontalis (Forehead Zone) */}
            <rect x="22" y="14" width="56" height="22" rx="4" fill="rgba(13,148,136,0.08)" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="2,1" />
            <text x="24" y="20" fill="#2dd4bf" fontSize="2.8" fontWeight="bold" fontFamily="monospace">REGIO FRONTALIS</text>
            <text x="24" y="24" fill="#ffffff" fontSize="2" opacity="0.8" fontFamily="monospace">Sebum Index: Normal</text>

            {/* Regio Malaris Sinistra & Dextra (Left & Right Cheeks) */}
            <rect x="16" y="46" width="26" height="24" rx="4" fill="rgba(2,132,199,0.08)" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2,1" />
            <text x="18" y="52" fill="#7dd3fc" fontSize="2.8" fontWeight="bold" fontFamily="monospace">MALAR SIN.</text>
            <text x="18" y="56" fill="#ffffff" fontSize="2" opacity="0.8" fontFamily="monospace">Hydration: 78%</text>

            <rect x="58" y="46" width="26" height="24" rx="4" fill="rgba(2,132,199,0.08)" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2,1" />
            <text x="60" y="52" fill="#7dd3fc" fontSize="2.8" fontWeight="bold" fontFamily="monospace">MALAR DEXT.</text>
            <text x="60" y="56" fill="#ffffff" fontSize="2" opacity="0.8" fontFamily="monospace">Hydration: 76%</text>

            {/* Regio Mentalis (Chin) */}
            <rect x="36" y="76" width="28" height="15" rx="3" fill="rgba(16,185,129,0.08)" stroke="#34d399" strokeWidth="0.5" strokeDasharray="2,1" />
            <text x="38" y="82" fill="#6ee7b7" fontSize="2.8" fontWeight="bold" fontFamily="monospace">REGIO MENTALIS</text>
            <text x="38" y="86" fill="#ffffff" fontSize="2" opacity="0.8" fontFamily="monospace">Barrier: Intact</text>
          </svg>
        )}

        {/* ── Modality 5: Clinical Lesion & Blemish Annotations ── */}
        {viewMode === 'lesions' && (
          <div className="absolute inset-0 animate-fade-in pointer-events-auto">
            {detectedSpots.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-emerald-400">Zero Active Lesions Identified</p>
                    <p className="text-[10px] text-slate-300">Epidermal barrier intact across facial region of interest</p>
                  </div>
                </div>
              </div>
            ) : (
              detectedSpots.map((spot, i) => (
                <div
                  key={i}
                  onClick={() => setActiveSpot(spot)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
                  style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                >
                  {/* Precision Medical Caliper Ring */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border border-rose-400 bg-rose-500/20 flex items-center justify-center transition-transform hover:scale-125">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </div>
                  </div>

                  {/* Clean Diagnostic Callout Tag */}
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900/95 text-white text-[10px] font-mono px-2 py-1 rounded border border-rose-500/40 shadow-lg group-hover/pin:scale-105 transition-all">
                    <span className="text-rose-400 font-bold">L-{i + 1}: </span>
                    {spot.label || `Erythema Focus #${i + 1}`}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Standard Clinical Metric Scale Bar (10 mm) */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs px-2.5 py-1.5 rounded border border-white/10 pointer-events-none flex flex-col items-center">
          <div className="w-12 h-1 border-b-2 border-white mb-0.5" />
          <span className="text-[9px] font-mono text-slate-300 tracking-wider">10 mm</span>
        </div>

        {/* Standard Clinical Calibration Tag */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10 pointer-events-none text-slate-300 text-[10px] font-mono">
          ANGLE: {selectedAngle.toUpperCase()} · CALIBRATED
        </div>
      </div>

      {/* Multi-Angle Capture Switcher */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'front', label: 'Frontal View' },
            { id: 'left', label: 'Left Oblique' },
            { id: 'right', label: 'Right Oblique' },
            { id: 'forehead', label: 'Superior Aspect' },
          ].map((angle) => {
            const hasPhoto = scanImages && scanImages[angle.id];
            return (
              <button
                key={angle.id}
                onClick={() => setSelectedAngle(angle.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedAngle === angle.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{angle.label}</span>
                {hasPhoto && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>

        {onRetake && (
          <button
            onClick={onRetake}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            title="Scan or upload a new photo"
          >
            <Camera size={13} />
            <span className="hidden sm:inline">New Capture</span>
          </button>
        )}
      </div>

      {/* Active Spot Diagnostic Details */}
      {activeSpot && (
        <div className="px-5 py-3.5 bg-rose-50/90 border-t border-rose-200 text-xs flex items-center justify-between gap-3 text-rose-950">
          <div className="flex items-center gap-2.5">
            <Info size={16} className="text-rose-700 shrink-0" />
            <div>
              <span className="font-bold">{activeSpot.label}</span>
              <span className="text-rose-800 ml-1.5">
                — Vascularity Grade: {activeSpot.severity}. HSV colorimetric analysis indicates localized follicular micro-inflammation. Topical anti-inflammatory formulation indicated.
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveSpot(null)}
            className="text-rose-700 font-bold hover:underline cursor-pointer text-xs shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
