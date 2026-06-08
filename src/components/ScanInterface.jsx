import React, { useState, useEffect } from 'react';
import { Camera, Activity, Shield, AlertCircle } from 'lucide-react';

export default function ScanInterface() {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setTimeout(() => setScanProgress(p => p + 1), 30);
      return () => clearTimeout(timer);
    } else if (scanProgress >= 100) {
      setIsScanning(false);
      setScanComplete(true);
    }
  }, [isScanning, scanProgress]);

  const handleStartScan = () => {
    setScanProgress(0);
    setScanComplete(false);
    setIsScanning(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', height: '100%' }}>
      {/* Main Scan Area */}
      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.9)' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 600 }}>
            <Camera size={20} className="text-gradient-primary" />
            Live AI Camera Feed
          </h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isScanning ? 'var(--accent-red)' : 'var(--accent-emerald)', boxShadow: isScanning ? '0 0 10px var(--accent-red)' : '0 0 10px var(--accent-emerald)', animation: isScanning ? 'pulseGlow 1s infinite' : 'none' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{isScanning ? 'Processing...' : 'Ready'}</span>
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url(https://images.unsplash.com/photo-1512413913437-5eb110183b0f?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', filter: isScanning ? 'brightness(0.9) contrast(1.1)' : 'brightness(1)' }}>
          {/* Facial mapping overlay mock */}
          {isScanning && (
            <>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, transparent, rgba(0, 184, 212, 0.2), transparent)', animation: 'scanLine 2s linear infinite' }} />
              <style>{`
                @keyframes scanLine {
                  0% { transform: translateY(-100%); }
                  100% { transform: translateY(100%); }
                }
                .tracking-point {
                  position: absolute;
                  width: 6px;
                  height: 6px;
                  background: var(--primary-cyan);
                  border-radius: 50%;
                  box-shadow: 0 0 10px var(--primary-cyan);
                  animation: pulse 1s infinite;
                }
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 0.8; }
                  50% { transform: scale(1.5); opacity: 1; }
                  100% { transform: scale(1); opacity: 0.8; }
                }
              `}</style>
              
              {/* Mock tracking points */}
              <div className="tracking-point" style={{ top: '40%', left: '45%' }} />
              <div className="tracking-point" style={{ top: '40%', right: '45%' }} />
              <div className="tracking-point" style={{ top: '55%', left: '50%', transform: 'translateX(-50%)' }} />
              <div className="tracking-point" style={{ top: '65%', left: '40%' }} />
              <div className="tracking-point" style={{ top: '65%', right: '40%' }} />
              
              {/* Box around face */}
              <div style={{ position: 'absolute', width: '250px', height: '300px', border: '2px solid rgba(0, 184, 212, 0.5)', borderRadius: '20px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', boxShadow: 'inset 0 0 20px rgba(0,184,212,0.2)' }}>
                <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '20px', height: '20px', borderTop: '2px solid var(--primary-cyan)', borderLeft: '2px solid var(--primary-cyan)', borderRadius: '20px 0 0 0' }} />
                <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '20px', height: '20px', borderTop: '2px solid var(--primary-cyan)', borderRight: '2px solid var(--primary-cyan)', borderRadius: '0 20px 0 0' }} />
                <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '20px', height: '20px', borderBottom: '2px solid var(--primary-cyan)', borderLeft: '2px solid var(--primary-cyan)', borderRadius: '0 0 0 20px' }} />
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '20px', height: '20px', borderBottom: '2px solid var(--primary-cyan)', borderRight: '2px solid var(--primary-cyan)', borderRadius: '0 0 20px 0' }} />
              </div>
            </>
          )}

          {!isScanning && !scanComplete && (
            <button className="btn-primary" onClick={handleStartScan} style={{ position: 'absolute', bottom: '40px', boxShadow: '0 8px 25px rgba(112,0,255,0.4)' }}>
              Initiate Diagnostic Scan
            </button>
          )}

          {scanComplete && (
            <div className="glass-card animate-fade-in" style={{ position: 'absolute', padding: '20px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.95)', border: '1px solid var(--accent-emerald)', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
              <Shield size={40} color="var(--accent-emerald)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-main)' }}>Analysis Complete</h3>
              <button className="btn-glass" onClick={() => setScanComplete(false)} style={{ marginTop: '16px', padding: '8px 20px', background: 'rgba(0,0,0,0.05)' }}>Scan Again</button>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
          <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '16px', fontWeight: 600 }}>Real-time Telemetry</h4>
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120" style={{ position: 'absolute', top: 0, left: 0 }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="6" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--primary-royal-purple)" strokeWidth="6" strokeDasharray="339" strokeDashoffset={isScanning ? 339 - (339 * scanProgress) / 100 : (scanComplete ? 0 : 339)} style={{ transition: 'stroke-dashoffset 0.1s linear', transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
              </svg>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{isScanning ? scanProgress : (scanComplete ? 100 : 0)}<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>%</span></span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', flex: 1, overflowY: 'auto', background: 'white' }}>
          <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '24px', fontWeight: 600 }}>Detected Conditions</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>Cystic Inflammation</span>
                <span style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: 600 }}>Low Risk</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                <div style={{ width: scanComplete ? '15%' : '0%', height: '100%', background: 'var(--accent-emerald)', transition: 'width 1s ease-out', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>Surface Pigmentation</span>
                <span style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>Moderate</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                <div style={{ width: scanComplete ? '42%' : '0%', height: '100%', background: 'var(--primary-cyan)', transition: 'width 1s ease-out 0.2s', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>Sebum Levels (T-Zone)</span>
                <span style={{ color: 'var(--accent-orange)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><AlertCircle size={14} /> High</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                <div style={{ width: scanComplete ? '78%' : '0%', height: '100%', background: 'var(--accent-orange)', transition: 'width 1s ease-out 0.4s', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
