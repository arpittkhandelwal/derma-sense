import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Camera, Check, Sunrise, Moon } from 'lucide-react';

const mockHistoricalData = [
  { day: 'Mon', glow: 76, hydration: 68 },
  { day: 'Tue', glow: 78, hydration: 70 },
  { day: 'Wed', glow: 75, hydration: 72 },
  { day: 'Thu', glow: 81, hydration: 75 },
  { day: 'Fri', glow: 80, hydration: 74 },
  { day: 'Sat', glow: 83, hydration: 77 },
  { day: 'Sun', glow: 85, hydration: 80 },
];

const ProgressTracker = () => {
  const [trendData] = useState(mockHistoricalData);
  const [photoLog, setPhotoLog] = useState({});
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [routineState, setRoutineState] = useState(() => {
    try {
      const saved = localStorage.getItem('derma_routine_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.am && parsed?.pm) return parsed;
      }
    } catch {
      // fallback
    }
    return {
      am: { cleanser: true, serum: true, moisturizer: true, spf: false },
      pm: { doubleCleanse: true, retinol: false, nightCream: true },
    };
  });

  useEffect(() => {
    localStorage.setItem('derma_routine_state', JSON.stringify(routineState));
  }, [routineState]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleRoutine = (time, step) => {
    setRoutineState(prev => ({
      ...prev,
      [time]: {
        ...prev[time],
        [step]: !prev[time][step],
      },
    }));
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      alert('Unable to access camera: ' + err.message);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');

      setPhotoLog(prev => ({ ...prev, [currentDate]: dataUrl }));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const amSteps = Object.values(routineState.am);
  const pmSteps = Object.values(routineState.pm);
  const totalSteps = amSteps.length + pmSteps.length;
  const completedSteps = amSteps.filter(Boolean).length + pmSteps.filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-32 pt-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md shrink-0"
            style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
          >
            <Activity size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Skin Progress & Daily Adherence
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              Longitudinal biometric trends and daily skincare compliance log
            </p>
          </div>
        </div>

        {/* 7-Day Trend Chart */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 flex items-center gap-2">
              <Activity size={16} /> 7-Day Skin Metric Evolution
            </h2>
            <span className="text-xs font-bold text-slate-500">Weekly Score: +9.2%</span>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="glowGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="hydGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
              <Area type="monotone" dataKey="glow" stroke="#0d9488" strokeWidth={2.5} fill="url(#glowGradLight)" name="Health Index (CSHI)" dot={{ fill: '#0d9488', r: 3 }} />
              <Area type="monotone" dataKey="hydration" stroke="#059669" strokeWidth={2.5} fill="url(#hydGradLight)" name="Hydration Index" dot={{ fill: '#059669', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-600" />
              <span className="text-xs font-bold text-slate-600">Skin Health Index (CSHI)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold text-slate-600">Stratum Corneum Hydration</span>
            </div>
          </div>
        </div>

        {/* Adherence Ring + Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Adherence Ring Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between shadow-xs">
            <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 self-start">
              Today's Regimen Adherence
            </h2>
            <div className="relative w-40 h-40 flex items-center justify-center my-4">
              <svg width="150" height="150" className="-rotate-90">
                <circle cx="75" cy="75" r="60" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                <circle
                  cx="75" cy="75" r="60" fill="none"
                  stroke="url(#ringGradTeal)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray="377"
                  strokeDashoffset={377 - (377 * progressPercent) / 100}
                  style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
                <defs>
                  <linearGradient id="ringGradTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <p className="text-3xl font-black text-slate-900 tracking-tight">{progressPercent}%</p>
                <p className="text-[10px] font-bold text-teal-700 uppercase">Complete</p>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500">
              {completedSteps} of {totalSteps} clinical skincare steps completed
            </p>
          </div>

          {/* AM / PM Routine Checklist */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
            {/* AM Routine */}
            <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3 flex items-center gap-1.5">
              <Sunrise size={16} /> Morning Clinical Protocol
            </h2>
            <div className="space-y-2 mb-6">
              {Object.entries(routineState.am).map(([step, done]) => (
                <button
                  key={step}
                  onClick={() => toggleRoutine('am', step)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    done ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${done ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                    {done && <Check size={12} className="text-white" />}
                  </div>
                  <span className="capitalize">{step.replace(/([A-Z])/g, ' $1').trim()}</span>
                </button>
              ))}
            </div>

            {/* PM Routine */}
            <h2 className="text-xs font-black uppercase tracking-widest text-teal-800 mb-3 flex items-center gap-1.5">
              <Moon size={16} /> Evening Restoration Protocol
            </h2>
            <div className="space-y-2">
              {Object.entries(routineState.pm).map(([step, done]) => (
                <button
                  key={step}
                  onClick={() => toggleRoutine('pm', step)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    done ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${done ? 'bg-teal-600 border-teal-600' : 'border-slate-300'}`}>
                    {done && <Check size={12} className="text-white" />}
                  </div>
                  <span className="capitalize">{step.replace(/([A-Z])/g, ' $1').trim()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 7-Day Photo Log */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 flex items-center gap-2">
              <Camera size={16} /> 7-Day Photographic Log
            </h2>
            <span className="text-xs text-slate-500 font-semibold">Standardized Angle Captures</span>
          </div>

          <div className="grid grid-cols-7 gap-2.5">
            {getPastDates().map(dateStr => {
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const photo = photoLog[dateStr];
              return (
                <div
                  key={dateStr}
                  onClick={() => setCurrentDate(dateStr)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all flex items-center justify-center ${
                    currentDate === dateStr ? 'border-teal-500 shadow-md' : isToday ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  {photo ? (
                    <img src={photo} className="w-full h-full object-cover" alt={dateStr} />
                  ) : (
                    <Camera size={16} className={isToday ? 'text-emerald-600' : 'text-slate-300'} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-500 font-semibold">Selected Inspection Date: {currentDate}</span>
            <button
              onClick={startCamera}
              className="px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md flex items-center gap-2 cursor-pointer hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
            >
              <Camera size={14} /> Log Today's Capture
            </button>
          </div>
        </div>

      </div>

      {/* Camera Capture Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-5 shadow-2xl w-full max-w-sm border border-slate-200">
            <p className="text-center text-sm font-black text-slate-900 mb-3">Align Face in Clinical Guide</p>
            <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-square rounded-2xl bg-slate-100 object-cover" />
            <div className="flex gap-3 mt-4">
              <button
                onClick={capturePhoto}
                className="flex-1 py-3 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-90 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
              >
                Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="px-5 py-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProgressTracker;
