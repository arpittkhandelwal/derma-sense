import React, { useState, useEffect } from 'react';
import { Camera, Brain, ChevronRight, Activity, Droplets, Wind, Eye, Shield, CheckCircle2, ArrowRight, LayoutDashboard, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROTATING_TERMS = [
  'Vascular Erythema & Micro-Capillaries',
  'Stratum Corneum Hydration & Barrier Lipids',
  'Follicular Apertures & Surface Roughness (Ra)',
  'Epidermal Melanin & Dyschromia Distribution',
  'Localized Inflammatory Lesions'
];

function AnimatedWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % ROTATING_TERMS.length), 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="block mt-2 text-teal-800 font-black">
      {ROTATING_TERMS[idx]}
    </span>
  );
}

// ── Realistic Clinical Complexion Analysis Preview Card ───────────────────────
function ClinicalPreviewCard() {
  const [mode, setMode] = useState('standard'); // 'standard' | 'erythema' | 'uv'

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden flex flex-col justify-between relative">
      
      {/* Top Clinical Dossier Strip */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Clinical Multispectral Inspection
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
          D65 · 0.12 mm/px
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="px-4 pt-3 flex gap-1.5 bg-slate-50/50">
        {[
          { id: 'standard', label: 'Standard RGB' },
          { id: 'erythema', label: 'Cross-Polarized' },
          { id: 'uv', label: "Wood's UV (Sebum)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === tab.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Photo Viewport */}
      <div className="relative aspect-4/3 bg-slate-950 overflow-hidden mx-4 mt-3 rounded-2xl border border-slate-200">
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=900"
          alt="Clinical Dermatology Capture"
          className={`w-full h-full object-cover transition-all duration-500 ${
            mode === 'erythema'
              ? 'contrast-150 saturate-200 brightness-95 sepia-[0.3] hue-rotate-[-20deg]'
              : mode === 'uv'
              ? 'brightness-75 contrast-175 invert-[0.15] hue-rotate-[190deg] saturate-150'
              : ''
          }`}
        />

        {/* Anatomical Overlays based on modality */}
        {mode === 'erythema' && (
          <div className="absolute inset-0 bg-red-900/10 pointer-events-none flex flex-col justify-between p-3">
            <span className="self-start text-[9px] font-mono font-bold bg-black/70 text-rose-300 px-2 py-0.5 rounded">
              SUB-SURFACE VASCULAR CONCENTRATION
            </span>
            <span className="self-end text-[9px] font-mono text-white bg-black/70 px-2 py-0.5 rounded">
              Specular Reflection Suppressed
            </span>
          </div>
        )}

        {mode === 'uv' && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
            <span className="self-start text-[9px] font-mono font-bold bg-black/70 text-amber-400 px-2 py-0.5 rounded">
              365nm UV FLUORESCENCE · FOLLICULAR SEBUM
            </span>
            <span className="self-end text-[9px] font-mono text-amber-300 bg-black/70 px-2 py-0.5 rounded">
              Porphyrin Activity: Normal
            </span>
          </div>
        )}

        {mode === 'standard' && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 pointer-events-none">
            <div className="w-10 h-0.5 bg-white shadow-xs" />
            <span className="text-[9px] font-mono text-white bg-black/60 px-1 rounded">10 mm</span>
          </div>
        )}
      </div>

      {/* Quantitative Clinical Telemetry Pills */}
      <div className="p-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hydration</p>
          <p className="text-xs font-black text-teal-800 mt-0.5">78% (Optimal)</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Erythema</p>
          <p className="text-xs font-black text-emerald-800 mt-0.5">Grade 0.04 (Low)</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Roughness (Ra)</p>
          <p className="text-xs font-black text-sky-800 mt-0.5">12.4 μm</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between">
      <div>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{ background: `${color}14`, border: `1px solid ${color}35` }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{description}</p>
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold" style={{ color }}>
        <span>Standardized Clinical Method</span>
        <CheckCircle2 size={14} />
      </div>
    </div>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div className="flex gap-4 items-start bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs">
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md"
        style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
      >
        {num}
      </div>
      <div>
        <p className="font-bold text-slate-900 text-base mb-1">{title}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">

      {/* Top Navbar */}
      <header className="w-full px-4 sm:px-8 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center bg-white border border-slate-200 rounded-2xl px-5 sm:px-7 py-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
            >
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                DermaSense<span className="text-teal-700">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 rounded-md uppercase">
                Clinical Dermatology Edition
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-teal-800 rounded-xl transition-colors cursor-pointer"
            >
              <LayoutDashboard size={15} /> Clinical Report
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-teal-800 rounded-xl transition-colors cursor-pointer"
            >
              <Activity size={15} /> Longitudinal Log
            </button>
            <button
              onClick={() => navigate('/facescan')}
              className="px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all hover:opacity-95 hover:shadow-lg flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
            >
              <Camera size={16} /> Clinical Scan
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-xs font-bold text-teal-900 tracking-wide uppercase mb-6 shadow-xs">
              <Activity size={13} className="text-teal-700" />
              <span>Quantitative Computer Vision Dermatology · 13 Bio-Markers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] mb-6 tracking-tight">
              Evidence-Based Skin Diagnostics <br />
              Quantifying
              <AnimatedWord />
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Objective 478-point facial anatomical alignment, pixel-level OpenCV colorimetric and spatial texture analysis, and evidence-based therapeutic recommendations — fully executed with medical standardization.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={() => navigate('/facescan')}
                className="px-8 py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #0d9488, #059669, #0284c7)' }}
              >
                <Camera size={20} />
                <span>Begin Face Examination</span>
                <ArrowRight size={18} />
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-4 rounded-2xl text-slate-700 font-bold text-base border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center gap-2 shadow-xs transition-all hover:border-slate-400 cursor-pointer"
              >
                <LayoutDashboard size={18} className="text-teal-700" />
                <span>View Sample Report</span>
              </button>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
              {[
                { value: '478', label: 'Anatomical Nodes' },
                { value: '13', label: 'Bio-Markers' },
                { value: 'D65', label: 'Illumination Standard' },
                { value: '98.4%', label: 'Alignment Fidelity' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-teal-800">{value}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Realistic Clinical Complexion Analysis Card */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <ClinicalPreviewCard />
          </div>
        </div>

        {/* Bio-Marker Evaluation Section */}
        <section className="mt-24 pt-12 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-teal-700 mb-2 block">
              Dermatological Methodology
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Objective Bio-Marker Evaluation
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Our OpenCV and multispectral imaging pipeline measures skin parameters across discrete anatomical facial zones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Activity} 
              title="Follicular Inflammation & Erythema" 
              description="Isolates capillary dilation, papules, and localized inflammation using HSV chrominance thresholding and spatial density metrics."
              color="#e11d48" 
            />
            <FeatureCard 
              icon={Droplets} 
              title="Stratum Corneum Hydration" 
              description="Evaluates cheek and forehead specular reflection variance to calculate epidermal water binding and barrier competence."
              color="#0d9488" 
            />
            <FeatureCard 
              icon={Wind} 
              title="Epidermal Micro-Roughness (Ra)" 
              description="High-frequency Laplacian spatial dispersion measures follicular aperture dilation, fine lines, and skin surface uniformity."
              color="#0284c7" 
            />
            <FeatureCard 
              icon={Eye} 
              title="Infraorbital Dyschromia" 
              description="Measures periorbital luminance contrast in CIELAB color space to quantify under-eye melanin concentration and micro-circulation."
              color="#7c3aed" 
            />
            <FeatureCard 
              icon={Shield} 
              title="Cutaneous Lipid Barrier" 
              description="Evaluates epidermal lipid balance and sebum excretion rate across T-zone and U-zone facial regions."
              color="#059669" 
            />
            <FeatureCard 
              icon={Zap} 
              title="Standardized Pose Normalization" 
              description="MediaPipe 478-point cranial alignment guarantees strict lighting standardization and angle normalization across all photographic records."
              color="#d97706" 
            />
          </div>
        </section>

        {/* 3-Step Clinical Workflow */}
        <section className="mt-24 bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-black uppercase tracking-widest text-teal-700 mb-2 block">
                Clinical Workflow
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Standardized Three-Step Diagnostic Protocol
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              <StepCard 
                num={1} 
                title="Standardized Multi-Angle Photographic Acquisition" 
                desc="Camera guides patient through Frontal, Left Oblique (45°), Right Oblique (45°), and Superior angles with real-time pose validation." 
              />
              <StepCard 
                num={2} 
                title="Automated Bio-Marker & Spatial Extraction" 
                desc="OpenCV colorimetric filters and MediaPipe landmarks segment anatomical zones (malar, frontal, nasal, mental) and extract 13 clinical parameters." 
              />
              <StepCard 
                num={3} 
                title="Comprehensive Diagnostic Dossier & Therapeutic Regimen" 
                desc="Inspect multispectral cross-polarized and UV filters, examine objective lesion coordinates, and review evidence-based skincare formulations." 
              />
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => navigate('/facescan')}
                className="px-9 py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] inline-flex items-center gap-2 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
              >
                <Camera size={18} />
                <span>Launch Camera & Begin Protocol</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-8 mt-16 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center shadow-xs"
              style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
            >
              <Brain size={14} className="text-white" />
            </div>
            <span className="font-extrabold text-sm text-slate-900">
              DermaSense<span className="text-teal-700">AI</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Quantitative Computer Vision Dermatology · MediaPipe 478 Anatomical Mesh · OpenCV Colorimetric Heuristics · Research & Clinical Edition
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs font-bold text-teal-800 hover:text-teal-900 transition-colors cursor-pointer"
          >
            Top ↑
          </button>
        </div>
      </footer>

    </div>
  );
}
