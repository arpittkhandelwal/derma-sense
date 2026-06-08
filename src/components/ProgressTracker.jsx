import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Camera, Check, Clock, Sunrise, Moon, ArrowLeft, RefreshCw, Sparkles, Activity, ShieldAlert, Crosshair } from 'lucide-react';

const ProgressTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [routineState, setRoutineState] = useState({
    am: { cleanser: false, vitaminC: false, moisturizer: false, sunscreen: false },
    pm: { doubleCleanse: false, retinol: false, nightCream: false }
  });
  
  const [photoLog, setPhotoLog] = useState({});
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const savedLog = localStorage.getItem('dermaSense_photoLog');
    if (savedLog) setPhotoLog(JSON.parse(savedLog));

    const savedRoutine = localStorage.getItem(`dermaSense_routine_${currentDate}`);
    if (savedRoutine) {
        setRoutineState(JSON.parse(savedRoutine));
    } else {
        setRoutineState({
            am: { cleanser: false, vitaminC: false, moisturizer: false, sunscreen: false },
            pm: { doubleCleanse: false, retinol: false, nightCream: false }
        });
    }
  }, [currentDate]);

  const toggleRoutine = (time, step) => {
    const newState = {
      ...routineState,
      [time]: {
        ...routineState[time],
        [step]: !routineState[time][step]
      }
    };
    setRoutineState(newState);
    localStorage.setItem(`dermaSense_routine_${currentDate}`, JSON.stringify(newState));
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Camera error:", err);
      alert("Unable to access camera. Please allow permissions.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);

    const newLog = { ...photoLog, [currentDate]: dataUrl };
    setPhotoLog(newLog);
    localStorage.setItem('dermaSense_photoLog', JSON.stringify(newLog));
  };

  const cancelCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const getPastDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getYesterdayStr = () => {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      return d.toISOString().split('T')[0];
  };

  // Progress Calculation
  const totalSteps = Object.keys(routineState.am).length + Object.keys(routineState.pm).length;
  const completedSteps = Object.values(routineState.am).filter(Boolean).length + Object.values(routineState.pm).filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100) || 0;
  const circleOffset = 283 - (283 * progressPercent) / 100;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, sans-serif', padding: '40px', overflowX: 'hidden', position: 'relative' }}>
      
      {/* Background Ambience */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,184,212,0.15) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(112,0,255,0.15) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: 0 }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'white', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 16px rgba(0,0,0,0.03)', marginBottom: '16px' }}>
                <Activity size={14} color="#7000FF" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0F172A' }}>Mission Control</span>
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-1.5px', color: '#0F172A', lineHeight: 1 }}>Clinical Tracker</h1>
            <p style={{ color: '#64748B', fontSize: '1.2rem', margin: 0, fontWeight: 500 }}>Monitor your advanced protocol and log daily metrics.</p>
          </div>
          <button onClick={() => window.close()} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 700, color: '#0F172A', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
            <ArrowLeft size={20} /> Return to Dashboard
          </button>
        </div>

        {/* Dynamic Calendar Strip */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', overflowX: 'auto', padding: '16px', background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
          {getPastDates().map((dateStr) => {
            const dateObj = new Date(dateStr);
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const hasPhoto = !!photoLog[dateStr];
            const isSelected = currentDate === dateStr;

            return (
              <div 
                key={dateStr}
                onClick={() => setCurrentDate(dateStr)}
                style={{
                  flex: '0 0 auto',
                  width: '120px',
                  padding: '20px 16px',
                  borderRadius: '16px',
                  background: isSelected ? 'rgba(255,255,255,0.9)' : 'transparent',
                  color: isSelected ? '#0F172A' : '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s',
                  boxShadow: isSelected ? '0 10px 30px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{dateObj.getDate()}</span>
                {hasPhoto ? (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00B8D4', boxShadow: '0 0 10px #00B8D4' }} />
                ) : (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', border: '1px solid #CBD5E1' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Splilt Screen Mission Control */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>
          
          {/* LEFT: Timetable & Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Massive Progress Ring Widget */}
            <div style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '32px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '40px' }}>
                <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                    <svg width="140" height="140" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
                        <circle 
                            cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" strokeWidth="8" strokeLinecap="round"
                            style={{ strokeDasharray: 283, strokeDashoffset: circleOffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                        />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#00B8D4" />
                                <stop offset="100%" stopColor="#7000FF" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{progressPercent}%</span>
                    </div>
                </div>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0F172A' }}>Daily Adherence</h2>
                    <p style={{ margin: 0, fontSize: '1rem', color: '#64748B', lineHeight: 1.5 }}>
                        {progressPercent === 100 ? "Clinical protocol perfectly executed!" : `${completedSteps} of ${totalSteps} clinical steps completed.`}
                    </p>
                </div>
            </div>

            {/* Routine Timetable Cards */}
            <div style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '32px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              
              {/* AM */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ padding: '12px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 16px rgba(0,184,212,0.1)' }}><Sunrise size={24} color="#00B8D4" /></div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Morning Regimen</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['cleanser', 'vitaminC', 'moisturizer', 'sunscreen'].map((step, idx) => {
                    const labels = { cleanser: 'Gentle Cleanser', vitaminC: 'Vitamin C Serum', moisturizer: 'Light Moisturizer', sunscreen: 'SPF 50+ Sunscreen' };
                    const isChecked = routineState.am[step];
                    return (
                      <div key={step} onClick={() => toggleRoutine('am', step)} style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.6)', border: `1px solid ${isChecked ? '#00B8D4' : 'rgba(0,0,0,0.05)'}`, display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isChecked ? 'inset 0 0 0 1px #00B8D4, 0 8px 16px rgba(0,184,212,0.1)' : 'none' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isChecked ? '#00B8D4' : 'white', border: `2px solid ${isChecked ? '#00B8D4' : '#CBD5E1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isChecked && <Check size={16} color="white" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: isChecked ? '#0F172A' : '#64748B' }}>{labels[step]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* PM */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ padding: '12px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 16px rgba(112,0,255,0.1)' }}><Moon size={24} color="#7000FF" /></div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Evening Protocol</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['doubleCleanse', 'retinol', 'nightCream'].map((step, idx) => {
                    const labels = { doubleCleanse: 'Double Cleanse (Oil + Foam)', retinol: 'Retinol Active Treatment', nightCream: 'Rich Repair Cream' };
                    const isChecked = routineState.pm[step];
                    return (
                      <div key={step} onClick={() => toggleRoutine('pm', step)} style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.6)', border: `1px solid ${isChecked ? '#7000FF' : 'rgba(0,0,0,0.05)'}`, display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isChecked ? 'inset 0 0 0 1px #7000FF, 0 8px 16px rgba(112,0,255,0.1)' : 'none' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isChecked ? '#7000FF' : 'white', border: `2px solid ${isChecked ? '#7000FF' : '#CBD5E1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isChecked && <Check size={16} color="white" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: isChecked ? '#0F172A' : '#64748B' }}>{labels[step]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: Face Capture Hub */}
          <div style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '32px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
             
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                 <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '16px', color: '#0F172A' }}>
                  <Crosshair size={28} color="#FF4081" /> Daily Scan Log
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>
                    <ShieldAlert size={16} color="#00C853" /> Encrypted Local Storage
                </div>
             </div>

            {isCameraActive ? (
              <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative', background: '#0F172A', aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)' }}>
                 <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                 {/* Clinical Scanner Overlay */}
                 <div style={{ position: 'absolute', inset: '40px', border: '1px solid rgba(0,184,212,0.3)', pointerEvents: 'none' }} />
                 <div style={{ position: 'absolute', top: '35px', left: '35px', width: '20px', height: '20px', borderTop: '2px solid #00B8D4', borderLeft: '2px solid #00B8D4' }} />
                 <div style={{ position: 'absolute', top: '35px', right: '35px', width: '20px', height: '20px', borderTop: '2px solid #00B8D4', borderRight: '2px solid #00B8D4' }} />
                 <div style={{ position: 'absolute', bottom: '35px', left: '35px', width: '20px', height: '20px', borderBottom: '2px solid #00B8D4', borderLeft: '2px solid #00B8D4' }} />
                 <div style={{ position: 'absolute', bottom: '35px', right: '35px', width: '20px', height: '20px', borderBottom: '2px solid #00B8D4', borderRight: '2px solid #00B8D4' }} />
                 
                 <div style={{ position: 'absolute', bottom: '32px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <button onClick={cancelCamera} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>Abort</button>
                    <button onClick={capturePhoto} style={{ padding: '16px 40px', background: 'white', color: '#0F172A', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='none'}><Camera size={20} /> Capture Metrics</button>
                 </div>
              </div>
            ) : photoLog[currentDate] ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative', aspectRatio: '16/9', border: '4px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                    <img src={photoLog[currentDate]} alt="Daily Scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '24px', left: '24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: 'white', padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Logged: {currentDate}
                    </div>
                    <div style={{ position: 'absolute', bottom: '24px', right: '24px' }}>
                    <button onClick={startCamera} style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', color: '#0F172A', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                        <RefreshCw size={18} /> Retake
                    </button>
                    </div>
                  </div>

                  {/* Side by side comparison if yesterday exists */}
                  {photoLog[getYesterdayStr()] && (
                      <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '24px', alignItems: 'center' }}>
                         <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '8px', letterSpacing: '1px' }}>Yesterday</div>
                             <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
                                 <img src={photoLog[getYesterdayStr()]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                             </div>
                         </div>
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#94A3B8' }}>
                             VS
                         </div>
                         <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#00B8D4', marginBottom: '8px', letterSpacing: '1px' }}>Today</div>
                             <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
                                 <img src={photoLog[currentDate]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                             </div>
                         </div>
                      </div>
                  )}
              </div>
            ) : (
              <div style={{ width: '100%', borderRadius: '32px', aspectRatio: '4/3', background: 'rgba(255,255,255,0.5)', border: '2px dashed rgba(0,184,212,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', transition: 'all 0.3s' }}>
                 <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(0,184,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 20px rgba(0,184,212,0.1)' }}>
                   <Camera size={40} color="#00B8D4" />
                 </div>
                 <div style={{ textAlign: 'center' }}>
                   <h3 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>Awaiting Scan</h3>
                   <p style={{ margin: 0, color: '#64748B', fontSize: '1rem', fontWeight: 500 }}>No clinical imagery logged for {currentDate}</p>
                 </div>
                 <button onClick={startCamera} style={{ marginTop: '16px', padding: '20px 48px', background: 'linear-gradient(135deg, #00B8D4, #7000FF)', color: 'white', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem', boxShadow: '0 15px 30px rgba(112,0,255,0.2)', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
                   <Sparkles size={20} /> Initialize Camera
                 </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProgressTracker;
