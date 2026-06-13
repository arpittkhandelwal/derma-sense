import React from 'react';
import { Home, Camera, LineChart, MessageSquare, Users, FileText, Settings, ActivitySquare, Brain, Package } from 'lucide-react';
import '../OrbitUI.css';

// 9 Exact Cards from the Screenshot in precise Left/Right stagger
const cardsData = [
  { id: '01', title: 'AI Skin Analysis', desc: 'Advanced AI scans your skin and detects issues', icon: Brain, color: '112, 0, 255', y: -450, angle: 70 }, // Right
  { id: '02', title: 'Face Scan', desc: 'Scan your face in real-time for detailed insights', icon: Camera, color: '0, 229, 255', y: -350, angle: 290 }, // Left
  { id: '03', title: 'Acne Detection', desc: 'Detects acne, spots and inflammation', icon: ActivitySquare, color: '0, 200, 83', y: -250, angle: 90 }, // Right
  { id: '04', title: 'Product Recommendations', desc: 'Personalized products for your skin', icon: Package, color: '255, 109, 0', y: -150, angle: 270 }, // Left
  { id: '05', title: 'Progress Tracking', desc: 'Track your skin improvement over time', icon: LineChart, color: '255, 64, 129', y: 150, angle: 90 }, // Right
  { id: '06', title: 'AI Dermatologist', desc: 'Get expert advice from AI dermatologist', icon: MessageSquare, color: '112, 0, 255', y: 250, angle: 270 }, // Left
  { id: '07', title: 'Community', desc: 'Connect, share and learn with others', icon: Users, color: '0, 229, 255', y: 350, angle: 70 }, // Right
  { id: '08', title: 'Reports', desc: 'Detailed reports and skin health insights', icon: FileText, color: '0, 200, 83', y: 450, angle: 290 }, // Left
  { id: '09', title: 'Settings', desc: 'Personalize your experience', icon: Settings, color: '112, 0, 255', y: 550, angle: 90 }, // Right
];

export default function OrbitUI() {
  const radius = 450; // Distance from center

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

  return (
    <section className="orbit-section">
      
      {/* Dynamic Style Injection for Anti-Orbit Math */}
      <style>{`
        ${cardsData.map(card => `
          @keyframes anti-orbit-${card.id} {
            from { transform: rotateY(-${card.angle}deg); }
            to { transform: rotateY(-${card.angle + 360}deg); }
          }
        `).join('\n')}
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

      {/* Top and Bottom Glowing Portals */}
      <div className="orbit-portal top"></div>
      <div className="orbit-portal bottom">
        <div className="orbit-portal-text">Your Skin. Your Data. <span style={{ color: '#00E5FF' }}>Smarter Care.</span></div>
      </div>

      {/* Main 3D Orbit Scene */}
      <div className="orbit-scene">
        
        {/* Exact Glowing Dotted DNA Pillar */}
        <div className="orbit-dna-pillar" style={{ top: '-10px' }}>
           {renderDna()}
        </div>

        {/* Central "Skin Genome" Orb */}
        <div className="orbit-center-orb">
          <h3>Skin Genome</h3>
          <p>Your unique skin ID</p>
          <div style={{ margin: '8px 0', width: '40px', height: '1px', background: 'rgba(0,229,255,0.5)' }}></div>
          <p>Data • AI • Care</p>
        </div>

        {/* The Revolving System */}
        <div className="orbit-spinner">
          {cardsData.map((card) => (
            <div 
              key={card.id} 
              className="orbit-card-wrapper" 
              style={{ 
                transform: `translateY(${card.y}px) rotateY(${card.angle}deg) translateZ(${radius}px)` 
              }}
            >
              {/* Swooping Curved Dotted Tether Line */}
              <div style={{ position: 'absolute', right: '150px', top: '50%', width: radius, height: '100px', transformOrigin: 'right center', transform: 'translateY(-50px)' }}>
                <svg width="100%" height="100%" viewBox={`0 0 ${radius} 100`} preserveAspectRatio="none">
                  <path d={`M 0,50 Q ${radius/2},100 ${radius},50`} stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="5 5" fill="none" opacity="0.6" filter="drop-shadow(0 0 5px #00E5FF)" />
                  <circle cx="0" cy="50" r="4" fill="#00E5FF" filter="drop-shadow(0 0 8px #00E5FF)" />
                </svg>
              </div>

              {/* The counter-rotating dark glass card */}
              <div 
                className="orbit-card-inner"
                style={{ animation: `anti-orbit-${card.id} 40s infinite linear` }}
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
