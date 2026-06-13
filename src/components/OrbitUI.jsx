import React from 'react';
import { Home, Camera, LineChart, MessageSquare, Users, FileText, Settings, Brain, Package } from 'lucide-react';
import '../OrbitUI.css';

// 6 Exact Cards spaced evenly for the Helical DNA Orbit
// 360deg / 6 = 60deg apart. 30s / 6 = 5s stagger delay.
const cardsData = [
  { id: '01', title: 'Face Scan', desc: 'Real-time biometric facial mapping', icon: Camera, color: '0, 229, 255', angle: 0, delay: 0 },
  { id: '02', title: 'AI Analysis', desc: 'Deep neural network diagnostics', icon: Brain, color: '112, 0, 255', angle: 60, delay: -5 },
  { id: '03', title: 'Product Recommendations', desc: 'Algorithmic personalized routines', icon: Package, color: '255, 109, 0', angle: 120, delay: -10 },
  { id: '04', title: 'Progress Tracking', desc: 'Dynamic temporal skin metrics', icon: LineChart, color: '255, 64, 129', angle: 180, delay: -15 },
  { id: '05', title: 'Community', desc: 'Global peer-to-peer data nodes', icon: Users, color: '0, 229, 255', angle: 240, delay: -20 },
  { id: '06', title: 'Reports', desc: 'Volumetric clinical grade exports', icon: FileText, color: '0, 200, 83', angle: 300, delay: -25 },
];

export default function OrbitUI() {
  const radius = 350; // Distance from center
  const duration = 30; // Seconds for one full cycle

  const renderDna = () => {
    const segments = [];
    for (let i = 0; i < 40; i++) {
      const y = i * 25;
      const x1 = 50 + Math.sin(y * 0.02) * 35;
      const x2 = 50 + Math.sin(y * 0.02 + Math.PI) * 35;
      segments.push(
        <g key={i}>
          <line x1={x1} y1={y} x2={x2} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx={x1} cy={y} r="3" fill="#00E5FF" filter="drop-shadow(0 0 6px #00E5FF)" />
          <circle cx={x2} cy={y} r="3" fill="#7000FF" filter="drop-shadow(0 0 6px #7000FF)" />
        </g>
      );
    }
    return <svg width="100" height="1000" viewBox="0 0 100 1000">{segments}</svg>;
  };

  // Generates 101 keyframes per card to calculate true physical Z-depth blurring, scale, and opacity at 60fps.
  const generateZDepthKeyframes = () => {
    return cardsData.map(card => {
      let keyframes = '';
      for (let pct = 0; pct <= 100; pct++) {
        const t = pct / 100;
        const spinnerAngle = 360 * t;
        const totalAngle = card.angle + spinnerAngle;
        const normalized = totalAngle % 360;
        const distFromBack = Math.abs(normalized - 180);
        const backness = 1 - (distFromBack / 180); 
        
        const blurPx = backness * 8; // Blur heavily at back
        const scale = 1 - (backness * 0.35); // Shrink at back
        const opacity = 1 - (backness * 0.6); // Fade into shadows
        
        keyframes += `
          ${pct}% { 
            transform: rotateY(-${totalAngle}deg) scale(${scale}); 
            filter: blur(${blurPx}px); 
            opacity: ${opacity}; 
          }
        `;
      }
      return `@keyframes anti-orbit-zdepth-${card.id} { ${keyframes} }`;
    }).join('\n');
  };

  return (
    <section className="orbit-section">
      
      {/* Hardware Accelerated Math Injection */}
      <style>{`
        ${generateZDepthKeyframes()}
        
        @keyframes helical-rise {
          0% { transform: translateY(450px) rotateY(var(--card-angle)) translateZ(${radius}px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(-450px) rotateY(var(--card-angle)) translateZ(${radius}px); opacity: 0; }
        }

        @keyframes synced-revolve {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>

      {/* Floating Left Sidebar */}
      <div className="orbit-sidebar">
        <Home size={24} className="orbit-sidebar-icon active" />
        <Camera size={24} className="orbit-sidebar-icon" />
        <LineChart size={24} className="orbit-sidebar-icon" />
        <MessageSquare size={24} className="orbit-sidebar-icon" />
        <Users size={24} className="orbit-sidebar-icon" />
        <FileText size={24} className="orbit-sidebar-icon" />
        <Settings size={24} className="orbit-sidebar-icon" style={{ marginTop: '40px' }} />
      </div>

      {/* Top and Bottom Portals */}
      <div className="orbit-portal top"></div>
      <div className="orbit-portal bottom">
        <div className="orbit-portal-text">Living Data <span style={{ color: '#00E5FF' }}>Ecosystem</span></div>
      </div>

      {/* 3D Scene */}
      <div className="orbit-scene">
        
        {/* Continuous DNA Core */}
        <div className="orbit-dna-pillar" style={{ top: '-10px' }}>
           {renderDna()}
        </div>

        {/* Central Core Sphere */}
        <div className="orbit-center-orb">
          <h3>Core System</h3>
          <p>Dermasense Neural Net</p>
          <div style={{ margin: '8px 0', width: '40px', height: '1px', background: 'rgba(0,229,255,0.5)' }}></div>
          <p>Processing...</p>
        </div>

        {/* The Revolving System (Forced to exact same duration to sync perfectly) */}
        <div className="orbit-spinner" style={{ animation: `synced-revolve ${duration}s infinite linear` }}>
          {cardsData.map((card) => (
            <div 
              key={card.id} 
              className="orbit-card-wrapper" 
              style={{ 
                '--card-angle': `${card.angle}deg`,
                animation: `helical-rise ${duration}s linear infinite`,
                animationDelay: `${card.delay}s`
              }}
            >
              {/* Sweeping Tether Line pointing backwards (-90deg) to the center axis! */}
              <div style={{ position: 'absolute', right: '150px', top: '50%', width: radius, height: '100px', transformOrigin: 'right center', transform: 'translateY(-50px) rotateY(-90deg)' }}>
                <svg width="100%" height="100%" viewBox={`0 0 ${radius} 100`} preserveAspectRatio="none">
                  <path d={`M 0,50 Q ${radius/2},100 ${radius},50`} stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="5 5" fill="none" opacity="0.6" filter="drop-shadow(0 0 5px #00E5FF)" />
                  <circle cx="0" cy="50" r="4" fill="#00E5FF" filter="drop-shadow(0 0 8px #00E5FF)" />
                </svg>
              </div>

              {/* Z-Depth Counter-Rotating Card */}
              <div 
                className="orbit-card-inner"
                style={{ animation: `anti-orbit-zdepth-${card.id} ${duration}s infinite linear`, animationDelay: `0s` }}
              >
                <div className="orbit-card-number">{card.id}</div>
                <div className="orbit-card-icon" style={{ color: `rgb(${card.color})`, borderColor: `rgba(${card.color}, 0.5)` }}>
                  <card.icon size={24} />
                </div>
                <div className="orbit-card-text">
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
