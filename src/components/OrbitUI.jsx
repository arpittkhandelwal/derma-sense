import React from 'react';
import { Home, Camera, LineChart, MessageSquare, Users, FileText, Settings, ActivitySquare, Droplets, Brain, Stethoscope, Wind, Package } from 'lucide-react';
import '../OrbitUI.css';

// 9 Exact Cards from the Screenshot
const cardsData = [
  { id: '01', title: 'AI Skin Analysis', desc: 'Advanced AI scans your skin and detects issues', icon: Brain, color: '112, 0, 255', y: -450, angle: 0 },
  { id: '02', title: 'Face Scan', desc: 'Scan your face in real-time for detailed insights', icon: Camera, color: '0, 184, 212', y: -350, angle: 140 },
  { id: '03', title: 'Acne Detection', desc: 'Detects acne, spots and inflammation', icon: ActivitySquare, color: '0, 200, 83', y: -250, angle: 280 },
  { id: '04', title: 'Product Recommendations', desc: 'Personalized products for your skin', icon: Package, color: '255, 109, 0', y: -150, angle: 60 },
  { id: '05', title: 'Progress Tracking', desc: 'Track your skin improvement over time', icon: LineChart, color: '255, 64, 129', y: 150, angle: 200 },
  { id: '06', title: 'AI Dermatologist', desc: 'Get expert advice from AI dermatologist', icon: MessageSquare, color: '112, 0, 255', y: 250, angle: 340 },
  { id: '07', title: 'Community', desc: 'Connect, share and learn with others', icon: Users, color: '0, 184, 212', y: 350, angle: 120 },
  { id: '08', title: 'Reports', desc: 'Detailed reports and skin health insights', icon: FileText, color: '0, 200, 83', y: 450, angle: 260 },
  { id: '09', title: 'Settings', desc: 'Personalize your experience', icon: Settings, color: '112, 0, 255', y: 550, angle: 40 },
];

export default function OrbitUI() {
  const radius = 450; // Distance from center

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
        <div className="orbit-portal-text">Your Skin. Your Data. <span style={{ color: 'var(--primary-royal-purple)' }}>Smarter Care.</span></div>
      </div>

      {/* Main 3D Orbit Scene */}
      <div className="orbit-scene">
        
        {/* Continuous DNA Pillar */}
        <div className="orbit-dna-pillar">
           {/* We use SVG waves for a DNA look, stacked seamlessly */}
           {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
             <svg key={i} width="80" height="100" viewBox="0 0 80 100" className="orbit-dna-segment">
               <path d="M10,0 C40,50 70,50 70,100" fill="none" stroke="var(--primary-cyan)" strokeWidth="3" opacity="0.8" />
               <path d="M70,0 C40,50 10,50 10,100" fill="none" stroke="var(--primary-royal-purple)" strokeWidth="3" opacity="0.8" />
               <circle cx="40" cy="50" r="4" fill="white" />
               <line x1="25" y1="25" x2="55" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
               <line x1="25" y1="75" x2="55" y2="75" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
             </svg>
           ))}
        </div>

        {/* Central "Skin Genome" Orb */}
        <div className="orbit-center-orb">
          <h3>Skin Genome</h3>
          <p>Your unique skin ID</p>
          <div style={{ margin: '8px 0', width: '40px', height: '1px', background: 'rgba(0,184,212,0.5)' }}></div>
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
              {/* The Tether Line pointing back to center */}
              <div 
                className="orbit-tether" 
                style={{ width: `${radius}px` }}
              ></div>

              {/* The actual counter-rotating glass card */}
              <div 
                className="orbit-card-inner"
                style={{ animation: `anti-orbit-${card.id} 30s infinite linear` }}
              >
                <div className="orbit-card-number">{card.id}</div>
                <div className="orbit-card-icon" style={{ color: `rgb(${card.color})`, borderColor: `rgba(${card.color}, 0.4)` }}>
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
