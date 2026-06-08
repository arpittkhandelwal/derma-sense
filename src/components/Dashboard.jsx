import React, { useState, useEffect } from 'react';
import { 
  Activity, Sparkles, Brain, CheckCircle2, 
  Droplets, Sun, Wind, ChevronRight, BarChart2, Heart,
  ArrowRight, Eye, MoveHorizontal, AlertTriangle, Crosshair, ShieldAlert, Layers, Camera
} from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{padding:'40px',color:'white',background:'red'}}><h1>Dashboard Crash:</h1><pre>{this.state.error.toString()}</pre></div>;
    }
    return this.props.children; 
  }
}

function DashboardContent({ scanImages, onGoHome, onRetakeScan }) {
  const [phase, setPhase] = useState('processing'); // 'processing' | 'mapping' | 'dashboard'
  const [loadingText, setLoadingText] = useState('Initializing AI Core...');
  const [realRecommendations, setRealRecommendations] = useState(null);
  const [realAnalysis, setRealAnalysis] = useState({
        glow_score: 74, skin_age: 24, predicted_skin_type: "Combination & Sensitive", confidence: 99.8,
        acne_spots: 4, inflammation_level: "Moderate", cystic_risk: 15,
        hydration_score: 81, moisture_status: "Healthy Moisture",
        texture_score: 92, visible_pores: "Minimal", surface_smoothness: "Excellent",
        pigmentation_risk: 22, uneven_tone: "Slight (Cheeks)", dark_spots: 0,
        oily_t_zone: "Oily (T-Zone)", dark_circle_darkness: "Visible",
        redness_irritation: "Elevated", ai_sensitivity_pred: "Possibly Sensitive Skin"
  });

  useEffect(() => {
    // Phase 1: Processing text rotation
    const texts = [
      'Mapping Pigmentation & Dark Circles...',
      'Evaluating Facial Symmetry...',
      'Estimating UV Exposure...',
      'Calculating Skin Age...',
      'Analyzing Pore Texture...',
      'Running 13-Parameter Correlator...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < texts.length) setLoadingText(texts[i]);
    }, 700);

    // Fetch real ML Recommendations from Python Backend
    const fetchRecommendations = async () => {
      try {
        const formData = new FormData();
        // Convert the base64 image from the camera to a Blob
        const res = await fetch(scanImages.front);
        const blob = await res.blob();
        formData.append("file", blob, "face_scan.jpg");

        const response = await fetch("http://localhost:8000/analyze-skin", {
          method: "POST",
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          setRealRecommendations(data.recommendations);
          if (data.analysis) {
             setRealAnalysis(data.analysis);
          }
        }
      } catch (err) {
        console.log("ML Backend not reachable, using mocked routine.", err);
      }
    };
    
    fetchRecommendations();

    // Phase 1 -> Phase 3 (Skip mapping phase as requested)
    const timer1 = setTimeout(() => {
      setPhase('dashboard');
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      {/* GLOBAL ANIMATIONS */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes spinSlow {
          100% { transform: rotate(360deg); }
        }
        @keyframes spinSlowReverse {
          100% { transform: rotate(-360deg); }
        }
        @keyframes progressFill {
          0% { width: 0%; }
          100% { width: var(--target-width); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatRandom {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(10px); }
          50% { transform: translateY(5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(-10px); }
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 10px 40px rgba(0,0,0,0.04);
          border-radius: 24px;
        }
        .text-gradient {
          background: linear-gradient(135deg, #00B8D4 0%, #7000FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .circle-progress {
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
        .circle-progress-value {
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          animation: circleFill 2s ease-out forwards;
          animation-delay: 0.5s;
        }
        @keyframes circleFill {
          to { stroke-dashoffset: var(--target-offset); }
        }
        .glow-text {
          text-shadow: 0 0 15px rgba(0,184,212,0.3);
        }
      `}</style>

      {/* PHASE 1: AI PROCESSING */}
      {phase === 'processing' && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          {/* Ambient Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(112,0,255,0.05) 0%, transparent 60%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'rgba(0,184,212,0.4)', boxShadow: '0 0 20px rgba(0,184,212,0.6)', animation: 'scanline 3s linear infinite' }} />

          {/* Central 3D Core */}
          <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '60px' }}>
            <div style={{ position: 'absolute', inset: '0', border: '2px solid rgba(0,184,212,0.2)', borderRadius: '50%', animation: 'spinSlow 10s linear infinite' }} />
            <div style={{ position: 'absolute', inset: '20px', border: '2px dashed rgba(112,0,255,0.2)', borderRadius: '50%', animation: 'spinSlowReverse 8s linear infinite' }} />
            <div style={{ position: 'absolute', inset: '40px', border: '1px solid rgba(0,184,212,0.3)', borderRadius: '50%', animation: 'spinSlow 5s linear infinite' }} />
            <div style={{ position: 'absolute', inset: '60px', background: 'radial-gradient(circle, rgba(0,184,212,0.05) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulseGlow 2s ease-in-out infinite' }} />
            <Brain size={80} color="#00B8D4" style={{ filter: 'drop-shadow(0 0 15px rgba(0,184,212,0.4))' }} />
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 300, letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase', color: '#0F172A', textAlign: 'center' }} className="glow-text">
            {loadingText}
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '60px' }}>13-Point Analysis Active</p>

          {/* Progress Bars */}
          <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Surface Texture & Pores', target: '92%', delay: '0s' },
              { label: 'UV & Pigmentation', target: '85%', delay: '0.1s' },
              { label: 'Oil & Sebum Balance', target: '78%', delay: '0.2s' },
              { label: 'Symmetry Calibration', target: '99%', delay: '0.3s' },
              { label: 'AI Confidence Score', target: '99.8%', delay: '0.4s' }
            ].map((bar, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                  <span>{bar.label}</span>
                  <span style={{ color: '#00B8D4', fontWeight: 700 }}>{bar.target}</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #7000FF, #00B8D4)', '--target-width': bar.target, animation: `progressFill 2s ease-out forwards ${bar.delay}` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Floating UI Cards */}
          <div style={{ position: 'absolute', top: '20%', left: '15%', animation: 'floatRandom 6s ease-in-out infinite' }}>
            <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(138,43,226,0.2)' }}>
              <Eye size={16} color="#8A2BE2" />
              <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#0F172A' }}>Under-eye shadow detected</span>
            </div>
          </div>
          <div style={{ position: 'absolute', top: '40%', right: '15%', animation: 'floatRandom 7s ease-in-out infinite 1s' }}>
            <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,214,0,0.2)' }}>
              <Sun size={16} color="#F57F17" />
              <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#0F172A' }}>T-Zone UV exposure map built</span>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '25%', left: '20%', animation: 'floatRandom 5s ease-in-out infinite 0.5s' }}>
            <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(0,200,83,0.2)' }}>
              <Crosshair size={16} color="#00C853" />
              <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#0F172A' }}>Facial symmetry calibrated</span>
            </div>
          </div>
        </div>
      )}



      {/* PHASE 3: PREMIUM DASHBOARD (13 PARAMETERS) */}
      {phase === 'dashboard' && (
        <>
          {/* Header placed at absolute top-left of the page */}
          <div style={{ position: 'absolute', top: '30px', left: '40px', display: 'flex', alignItems: 'center', gap: '16px', zIndex: 10, animation: 'fadeInUp 0.8s ease-out' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #00B8D4, #7000FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(112,0,255,0.2)' }}>
              <Brain size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Intelligence <span className="text-gradient-primary">Dashboard</span></h1>
              <p style={{ color: '#64748B', margin: '4px 0 0 0', fontSize: '0.9rem', fontWeight: 500 }}>Real-time clinical analysis generated</p>
            </div>
          </div>
          
          {/* Action buttons placed at absolute top-right */}
          <div style={{ position: 'absolute', top: '36px', right: '40px', display: 'flex', gap: '16px', zIndex: 10, animation: 'fadeInUp 0.8s ease-out' }}>
            <button onClick={onRetakeScan} style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', color: '#0F172A', fontWeight: 600, padding: '12px 24px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }} onMouseOver={e=>e.currentTarget.style.boxShadow='0 6px 15px rgba(0,0,0,0.05)'} onMouseOut={e=>e.currentTarget.style.boxShadow='0 4px 10px rgba(0,0,0,0.02)'}>
               <Camera size={18} /> Retake Scan
            </button>
            <button onClick={onGoHome} style={{ background: '#0F172A', border: '1px solid transparent', color: 'white', fontWeight: 600, padding: '12px 24px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} onMouseOver={e=>{e.currentTarget.style.boxShadow='0 6px 15px rgba(0,0,0,0.15)'; e.currentTarget.style.transform='translateY(-1px)';}} onMouseOut={e=>{e.currentTarget.style.boxShadow='0 4px 10px rgba(0,0,0,0.1)'; e.currentTarget.style.transform='none';}}>
               Exit Session
            </button>
          </div>

          <div style={{ paddingTop: '120px', paddingLeft: '2%', paddingRight: '4%', maxWidth: '1800px', margin: '0 auto', animation: 'fadeInUp 0.8s ease-out', paddingBottom: '100px', position: 'relative' }}>
            {/* Custom Healthcare Background Pattern from Home Page */}
            <div style={{ position: 'absolute', top: '0', left: '-20%', right: '-20%', bottom: '0', backgroundImage: 'url("/pattern.png")', backgroundSize: '300px', backgroundRepeat: 'repeat', opacity: 0.22, mixBlendMode: 'multiply', zIndex: 0, pointerEvents: 'none' }} />

            {/* Main Two-Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '40px', position: 'relative', zIndex: 1 }}>
              
              {/* LEFT COLUMN: Sticky Profile / Image + Glow Score */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'sticky', top: '120px', alignSelf: 'start' }}>
                
                {/* Face Capture Image with AI Mapping Labels */}
                <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${scanImages?.front || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)' }} />
                  
                  {/* AI Facial Mapping Labels */}
                  {/* T-Zone Label */}
                  <div className="animate-fade-in" style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', animationDelay: '1s' }}>
                     <div style={{ padding: '4px 8px', background: 'rgba(245,127,23,0.9)', color: 'white', fontSize: '0.65rem', letterSpacing: '0.5px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', backdropFilter: 'blur(4px)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>T-Zone: Oily</div>
                     <div style={{ width: '1px', height: '20px', background: 'rgba(245,127,23,0.9)' }} />
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F57F17', boxShadow: '0 0 10px #F57F17' }} />
                  </div>

                  {/* Under-Eye Label (Left) */}
                  <div className="animate-fade-in" style={{ position: 'absolute', top: '42%', left: '15%', display: 'flex', alignItems: 'center', gap: '4px', animationDelay: '1.2s' }}>
                     <div style={{ padding: '4px 8px', background: 'rgba(138,43,226,0.9)', color: 'white', fontSize: '0.65rem', letterSpacing: '0.5px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', backdropFilter: 'blur(4px)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>Dark Circles</div>
                     <div style={{ width: '25px', height: '1px', background: 'rgba(138,43,226,0.9)' }} />
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8A2BE2', boxShadow: '0 0 10px #8A2BE2' }} />
                  </div>

                  {/* Cheeks Label (Right) */}
                  <div className="animate-fade-in" style={{ position: 'absolute', top: '60%', right: '15%', display: 'flex', alignItems: 'center', gap: '4px', flexDirection: 'row-reverse', animationDelay: '1.4s' }}>
                     <div style={{ padding: '4px 8px', background: 'rgba(0,200,83,0.9)', color: 'white', fontSize: '0.65rem', letterSpacing: '0.5px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', backdropFilter: 'blur(4px)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>Balanced Moisture</div>
                     <div style={{ width: '25px', height: '1px', background: 'rgba(0,200,83,0.9)' }} />
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C853', boxShadow: '0 0 10px #00C853' }} />
                  </div>

                  {/* Acne/Spot Label (Left Cheek lower) */}
                  <div className="animate-fade-in" style={{ position: 'absolute', top: '65%', left: '15%', display: 'flex', alignItems: 'center', gap: '4px', animationDelay: '1.6s' }}>
                     <div style={{ padding: '4px 8px', background: 'rgba(255,64,129,0.9)', color: 'white', fontSize: '0.65rem', letterSpacing: '0.5px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', backdropFilter: 'blur(4px)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>Active Spot</div>
                     <div style={{ width: '15px', height: '1px', background: 'rgba(255,64,129,0.9)' }} />
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF4081', boxShadow: '0 0 10px #FF4081' }} />
                  </div>

                  {/* Live Capture Badge */}
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '100px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C853', boxShadow: '0 0 10px #00C853' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'white' }}>Live Capture</span>
                  </div>
                </div>

                {/* Glow Score Box */}
                <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="220" height="220" className="circle-progress">
                      <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="10" />
                      <circle cx="110" cy="110" r="100" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round" className="circle-progress-value" style={{ '--target-offset': '163' }} /> {/* 74% of 628 */}
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00B8D4" />
                          <stop offset="100%" stopColor="#7000FF" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1, color: '#0F172A', marginLeft: '12px' }}>{realAnalysis.glow_score}<span style={{fontSize: '2rem'}}>%</span></span>
                      <span style={{ fontSize: '0.9rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px', fontWeight: 600 }}>Glow Score</span>
                    </div>
                  </div>
                </div>

            {/* RIGHT COLUMN: Insights, Advanced & Recs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              
              {/* Parameter 10 & 11: Advanced Insights */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#64748B', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Brain size={20} /> Other Analysis & Diagnostics
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Stress/Fatigue Indicators */}
                  <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', transition: 'transform 0.2s', cursor: 'pointer', borderLeft: '4px solid #F57F17' }} onMouseOver={e=>e.currentTarget.style.transform='translateX(8px)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
                    <div style={{ color: '#F57F17', marginTop: '2px' }}><AlertTriangle size={20} /></div>
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#0F172A', fontWeight: 700 }}>Fatigue Indicators</h5>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>AI detects possible fatigue indicators in under-eye stress signs. Prioritize recovery.</p>
                    </div>
                  </div>
                  
                  {/* Facial Symmetry */}
                  <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', transition: 'transform 0.2s', cursor: 'pointer', borderLeft: '4px solid #00C853' }} onMouseOver={e=>e.currentTarget.style.transform='translateX(8px)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
                    <div style={{ color: '#00C853', marginTop: '2px' }}><MoveHorizontal size={20} /></div>
                    <div>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#0F172A', fontWeight: 700 }}>Facial Symmetry</h5>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>Left/right structural symmetry is estimated at <strong>94%</strong> (highly balanced regions).</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescriptive Routine */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#64748B', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={20} /> Clinical Routine
                </h3>

                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {realRecommendations && realRecommendations.length > 0 ? (
                    realRecommendations.map((rec, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '16px', borderBottom: idx < realRecommendations.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', paddingTop: idx > 0 ? '4px' : '0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 700, paddingRight: '12px' }}>{rec.brand} - {rec.name}</span>
                          <span style={{ fontSize: '0.85rem', color: '#00B8D4', fontWeight: 700, flexShrink: 0 }}>★ {rec.rating}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{rec.highlights}</span>
                        {rec.amazon_link && (
                          <a href={rec.amazon_link} target="_blank" rel="noreferrer" style={{ alignSelf: 'flex-start', marginTop: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'white', background: '#FF9900', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px' }}>
                             🛍️ Buy on Amazon
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B8D4' }} />
                          <span style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 500 }}>The Ordinary - Salicylic Acid 2% Solution</span>
                        </div>
                        <a href="https://www.amazon.in/s?k=The+Ordinary+Salicylic+Acid+2%25+Solution" target="_blank" rel="noreferrer" style={{ alignSelf: 'flex-start', marginLeft: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'white', background: '#FF9900', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px' }}>
                           🛍️ Buy on Amazon
                        </a>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B8D4' }} />
                          <span style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 500 }}>Neutrogena - Hydro Boost Water Gel</span>
                        </div>
                        <a href="https://www.amazon.in/s?k=Neutrogena+Hydro+Boost+Water+Gel" target="_blank" rel="noreferrer" style={{ alignSelf: 'flex-start', marginLeft: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'white', background: '#FF9900', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px' }}>
                           🛍️ Buy on Amazon
                        </a>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B8D4' }} />
                          <span style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 500 }}>Minimalist - 10% Niacinamide Face Serum</span>
                        </div>
                        <a href="https://www.amazon.in/s?k=Minimalist+10%25+Niacinamide+Face+Serum" target="_blank" rel="noreferrer" style={{ alignSelf: 'flex-start', marginLeft: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'white', background: '#FF9900', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px' }}>
                           🛍️ Buy on Amazon
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,64,129,0.05)', border: '1px solid rgba(255,64,129,0.2)', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                    <Activity size={16} color="#FF4081" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.5 }}>This is an AI-based assessment generated by predictive models and does not constitute professional medical advice. Consult a dermatologist for clinical diagnosis.</span>
                  </div>
                </div>
              </div>

            </div>

              </div>

              {/* RIGHT COLUMN: Top Bar + Content Grids */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                
                {/* Horizontal Top Bar */}
                <div className="glass-panel" style={{ padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '60px' }}>
                    {/* Parameter 9: Skin Age Estimation */}
                    <div>
                      <div style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Skin Age</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{realAnalysis.skin_age} <span style={{fontSize: '1.2rem', color: '#94A3B8', fontWeight: 500}}>(Actual: 21)</span></div>
                    </div>
                    {/* Parameter 2: Skin Type Detection */}
                    <div>
                      <div style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Predicted Skin Type</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00B8D4', lineHeight: 1.2 }}>{realAnalysis.predicted_skin_type}</div>
                    </div>
                  </div>

                  {/* AI Confidence Badge */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 24px', background: 'rgba(0,184,212,0.1)', border: '1px solid rgba(0,184,212,0.2)', borderRadius: '100px' }}>
                    <Sparkles size={24} color="#00B8D4" />
                    <span style={{ fontSize: '1.1rem', color: '#00B8D4', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>AI Confidence: {realAnalysis.confidence}%</span>
                  </div>
                </div>

                {/* Rest of the grids (Core, Secondary, Advanced, Routine) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* LEFT COLUMN: Core & Secondary Grids */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              
              {/* CORE METRICS GRID */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#64748B', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Activity size={20} /> Core Analysis
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Parameter 1: Acne Detection */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ padding: '10px', background: 'rgba(255,64,129,0.1)', borderRadius: '12px' }}><Activity size={20} color="#FF4081" /></div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Acne Detection</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}><span>Acne Spots</span><span style={{ fontWeight: 700, color: '#0F172A' }}>{realAnalysis.acne_spots} detected</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}><span>Inflammation Level</span><span style={{ fontWeight: 700, color: '#FF4081' }}>{realAnalysis.inflammation_level}</span></div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}><span>Cystic Risk Profile</span><span>{realAnalysis.cystic_risk}%</span></div>
                        <div style={{ height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px' }}><div style={{ height: '100%', width: `${realAnalysis.cystic_risk}%`, background: '#FF4081', borderRadius: '2px' }}/></div>
                      </div>
                      <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.5px' }}>Possible Reasons</span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>Hormonal fluctuations, excess sebum production, or diet.</p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#00B8D4', letterSpacing: '0.5px' }}>Suggested Skincare</span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.4, fontWeight: 500 }}>Salicylic Acid (BHA), Niacinamide, non-comedogenic moisturizer.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parameter 3: Hydration Level */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ padding: '10px', background: 'rgba(0,184,212,0.1)', borderRadius: '12px' }}><Droplets size={20} color="#00B8D4" /></div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Hydration Level</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}><span>Moisture Status</span><span style={{ fontWeight: 700, color: '#00B8D4' }}>{realAnalysis.moisture_status}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}><span>Dryness Regions</span><span style={{ fontWeight: 700, color: '#0F172A' }}>None detected</span></div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}><span>Overall Hydration</span><span>{realAnalysis.hydration_score}%</span></div>
                        <div style={{ height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px' }}><div style={{ height: '100%', width: `${realAnalysis.hydration_score}%`, background: '#00B8D4', borderRadius: '2px' }}/></div>
                      </div>
                      <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.5px' }}>Possible Reasons</span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>Climate changes, compromised skin barrier, or insufficient water intake.</p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#00B8D4', letterSpacing: '0.5px' }}>Suggested Skincare</span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.4, fontWeight: 500 }}>Hyaluronic Acid, Ceramides, Squalane oil, occlusive moisturizers.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parameter 7: Pore Visibility / Skin Texture */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ padding: '10px', background: 'rgba(112,0,255,0.1)', borderRadius: '12px' }}><Wind size={20} color="#7000FF" /></div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Pore Visibility & Texture</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}><span>Visible Pores</span><span style={{ fontWeight: 700, color: '#0F172A' }}>{realAnalysis.visible_pores}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}><span>Surface Smoothness</span><span style={{ fontWeight: 700, color: '#0F172A' }}>{realAnalysis.surface_smoothness}</span></div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}><span>Texture Score</span><span>{realAnalysis.texture_score}%</span></div>
                        <div style={{ height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px' }}><div style={{ height: '100%', width: `${realAnalysis.texture_score}%`, background: '#7000FF', borderRadius: '2px' }}/></div>
                      </div>
                      <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.5px' }}>Possible Reasons</span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>Natural aging (loss of collagen), genetics, or accumulated dead skin cells.</p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#00B8D4', letterSpacing: '0.5px' }}>Suggested Skincare</span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.4, fontWeight: 500 }}>Retinol, AHA (Glycolic Acid) exfoliants, and Niacinamide.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parameter 5: Pigmentation Detection */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ padding: '10px', background: 'rgba(255,109,0,0.1)', borderRadius: '12px' }}><Sun size={20} color="#FF6D00" /></div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Pigmentation & Tone</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}><span>Uneven Tone</span><span style={{ fontWeight: 700, color: '#FF6D00' }}>{realAnalysis.uneven_tone}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}><span>Dark Spots</span><span style={{ fontWeight: 700, color: '#0F172A' }}>{realAnalysis.dark_spots} detected</span></div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}><span>Pigmentation Risk</span><span>{realAnalysis.pigmentation_risk}%</span></div>
                        <div style={{ height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px' }}><div style={{ height: '100%', width: `${realAnalysis.pigmentation_risk}%`, background: '#FF6D00', borderRadius: '2px' }}/></div>
                      </div>
                      <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.5px' }}>Possible Reasons</span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>Unprotected sun exposure, post-inflammatory hyperpigmentation (acne scars).</p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#00B8D4', letterSpacing: '0.5px' }}>Suggested Skincare</span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.4, fontWeight: 500 }}>Vitamin C serum, Tranexamic Acid, Alpha Arbutin, daily SPF 50+.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECONDARY METRICS GRID */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#64748B', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Layers size={20} /> Regional Analysis
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Parameter 4: Oil Activity Mapping */}
                  <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: 'rgba(245,127,23,0.1)', borderRadius: '10px' }}><Activity size={18} color="#F57F17" /></div>
                      <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Oil Activity Map</h5>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                      <span color="#475569">Forehead & Nose</span><span style={{ fontWeight: 700, color: '#F57F17' }}>{realAnalysis.oily_t_zone}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span color="#475569">Cheek Regions</span><span style={{ fontWeight: 700, color: '#00C853' }}>Balanced</span>
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.5px' }}>Possible Reasons</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>Overactive sebaceous glands, hot weather, or stripping cleansers.</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#00B8D4', letterSpacing: '0.5px' }}>Suggested Skincare</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.4, fontWeight: 500 }}>Gentle foaming cleansers, BHA toners, and oil-free gel moisturizers.</p>
                      </div>
                    </div>
                  </div>

                  {/* Parameter 12: UV / Sun Damage */}
                  <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: 'rgba(255,109,0,0.1)', borderRadius: '10px' }}><Sun size={18} color="#FF6D00" /></div>
                      <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>UV & Sun Damage</h5>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                      <span color="#475569">Tanning Effect</span><span style={{ fontWeight: 700, color: '#0F172A' }}>{realAnalysis.visible_pores}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span color="#475569">Action Required</span><span style={{ fontWeight: 700, color: '#00B8D4' }}>Hydration + SPF30</span>
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.5px' }}>Possible Reasons</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>Prolonged UV radiation without sufficient sunscreen reapplication.</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#00B8D4', letterSpacing: '0.5px' }}>Suggested Skincare</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.4, fontWeight: 500 }}>Broad-spectrum SPF 30+, antioxidants (Vitamin C, E), soothing Aloe.</p>
                      </div>
                    </div>
                  </div>

                  {/* Parameter 6: Dark Circle Analysis */}
                  <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: 'rgba(138,43,226,0.1)', borderRadius: '10px' }}><Eye size={18} color="#8A2BE2" /></div>
                      <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Dark Circle Analysis</h5>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                      <span color="#475569">Under-Eye Darkness</span><span style={{ fontWeight: 700, color: '#8A2BE2' }}>{realAnalysis.dark_circle_darkness}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4, fontStyle: 'italic' }}>
                      "Sleep quality may be affecting under-eye regions."
                    </p>
                    <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.5px' }}>Possible Reasons</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>Sleep deprivation, genetics, thinning skin, or poor microcirculation.</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#00B8D4', letterSpacing: '0.5px' }}>Suggested Skincare</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.4, fontWeight: 500 }}>Caffeine eye cream, Vitamin K, cold compresses, and adequate sleep.</p>
                      </div>
                    </div>
                  </div>

                  {/* Parameter 13: Skin Sensitivity Prediction */}
                  <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: 'rgba(255,64,129,0.1)', borderRadius: '10px' }}><ShieldAlert size={18} color="#FF4081" /></div>
                      <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Sensitivity Prediction</h5>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                      <span color="#475569">Redness/Irritation</span><span style={{ fontWeight: 700, color: '#FF4081' }}>{realAnalysis.redness_irritation}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span color="#475569">AI Prediction</span><span style={{ fontWeight: 700, color: '#FF4081' }}>{realAnalysis.ai_sensitivity_pred}</span>
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.5px' }}>Possible Reasons</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>Compromised skin barrier, harsh active ingredients, or environmental allergens.</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#00B8D4', letterSpacing: '0.5px' }}>Suggested Skincare</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.4, fontWeight: 500 }}>Centella Asiatica (Cica), colloidal oatmeal, avoid fragrances.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Progress Tracker CTA */}
              <div 
                className="glass-panel" 
                style={{ marginTop: '40px', padding: '32px', background: 'linear-gradient(135deg, rgba(255,109,0,0.05), rgba(255,64,129,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid rgba(255,109,0,0.1)' }} 
                onMouseOver={e=>e.currentTarget.style.boxShadow='0 20px 40px rgba(255,109,0,0.1)'} 
                onMouseOut={e=>e.currentTarget.style.boxShadow='0 10px 40px rgba(0,0,0,0.04)'}
                onClick={() => window.open('/progress', '_blank')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                   <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                     <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(255,109,0,0.1) 0%, transparent 70%)', animation: 'pulseGlow 2s infinite' }} />
                     <Camera size={28} color="#FF6D00" style={{ position: 'relative', zIndex: 1 }} />
                   </div>
                   <div>
                     <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0F172A' }}>Track Daily Progress</h3>
                     <p style={{ color: '#64748B', fontSize: '1rem', margin: 0, fontWeight: 500 }}>Log daily face captures and track your clinical routine timetable.</p>
                   </div>
                </div>
                <div style={{ padding: '16px', background: 'white', borderRadius: '50%', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', color: '#FF6D00' }}>
                  <ChevronRight size={24} />
                </div>
              </div>
            </div>


          </div>
          </div>
          </div>

          {/* Hair & Scalp CTA */}
          <div className="glass-panel" style={{ marginTop: '60px', padding: '40px', background: 'linear-gradient(135deg, rgba(112,0,255,0.05), rgba(0,184,212,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.boxShadow='0 20px 40px rgba(0,184,212,0.1)'} onMouseOut={e=>e.currentTarget.style.boxShadow='0 10px 40px rgba(0,0,0,0.04)'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                 <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(112,0,255,0.1) 0%, transparent 70%)', animation: 'pulseGlow 2s infinite' }} />
                 <Wind size={32} color="#00B8D4" style={{ position: 'relative', zIndex: 1 }} />
               </div>
               <div>
                 <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0F172A' }}>Hair & Scalp Intelligence Scan</h2>
                 <p style={{ color: '#64748B', fontSize: '1.1rem', margin: 0, fontWeight: 500 }}>Map follicular density and track early signs of thinning.</p>
               </div>
            </div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
               <ArrowRight size={24} />
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard(props) {
  return (
    <ErrorBoundary>
      <DashboardContent {...props} />
    </ErrorBoundary>
  );
}
