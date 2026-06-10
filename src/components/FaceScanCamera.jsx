import React, { useState, useEffect, useRef } from 'react';
import { Camera, CheckCircle2, ChevronRight, AlertCircle, X, ShieldAlert, Loader2, Brain } from 'lucide-react';
import * as faceapi from 'face-api.js';

const SCAN_STEPS = [
  { id: 'front', label: 'Front Angle', instruction: 'Look directly into the camera' },
  { id: 'left', label: 'Left Cheek', instruction: 'Turn your head slightly to the right' },
  { id: 'right', label: 'Right Cheek', instruction: 'Turn your head slightly to the left' },
  { id: 'forehead', label: 'Forehead', instruction: 'Tilt your chin slightly down' },
  { id: 'chin', label: 'Chin & Jawline', instruction: 'Tilt your head slightly up' },
  { id: 'lips', label: 'Lips & Perioral', instruction: 'Bring your face closer to the camera' }
];

export default function FaceScanCamera({ onComplete, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImages, setCapturedImages] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [livePose, setLivePose] = useState('front');
  const stableFramesRef = useRef(0);
  const animationFrameRef = useRef(null);
  const capturedIdsRef = useRef(new Set());
  const lastDetectedPoseRef = useRef('unknown');

  // Initialize models and camera on mount
  useEffect(() => {
    async function loadModelsAndCamera() {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        setModelsLoaded(true);

        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn('Camera or Model error:', err);
        setError('Camera access required, or ML models failed to load.');
        setMockMode(true);
      }
    }

    loadModelsAndCamera();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Cleanup stream when unmounting
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // AI Facial Geometry Scan Loop
  useEffect(() => {
    if (!modelsLoaded || !stream || mockMode || isProcessing) return;

    const scanFace = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        
        if (detection) {
          const landmarks = detection.landmarks;
          const noseTip = landmarks.getNose()[3]; // Pt 30
          const jaw = landmarks.getJawOutline();
          const leftJaw = jaw[0]; // Pt 0
          const rightJaw = jaw[16]; // Pt 16
          const chin = jaw[8]; // Pt 8
          const eyesCenter = landmarks.getNose()[0]; // Pt 27

          // 1. Yaw (Left/Right Head Rotation)
          const distLeft = Math.abs(noseTip.x - leftJaw.x);
          const distRight = Math.abs(rightJaw.x - noseTip.x);
          const yawRatio = distLeft / (distLeft + distRight); // ~0.5 is front

          // 2. Pitch (Up/Down Head Rotation)
          const distEyesNose = Math.abs(noseTip.y - eyesCenter.y);
          const distNoseChin = Math.abs(chin.y - noseTip.y);
          const pitchRatio = distEyesNose / (distEyesNose + distNoseChin); // ~0.45 is front

          // 3. Proximity (Zoom)
          const boxWidth = detection.detection.box.width;
          const videoWidth = videoRef.current.videoWidth;
          const zoomRatio = boxWidth / videoWidth;

          // Determine current geometric pose candidates
          const candidates = [];
          if (zoomRatio > 0.32) candidates.push('lips');
          if (yawRatio < 0.45) candidates.push('right');
          if (yawRatio > 0.55) candidates.push('left');
          if (pitchRatio < 0.44) candidates.push('chin');
          if (pitchRatio > 0.46) candidates.push('forehead');
          
          let detectedPose = 'front';
          
          // Prioritize candidates that haven't been captured yet
          for (const pose of candidates) {
            if (!capturedIdsRef.current.has(pose)) {
              detectedPose = pose;
              break;
            }
          }
          
          // Fallback to front if not captured, or if candidates list is empty
          if (!capturedIdsRef.current.has('front') && !candidates.some(c => !capturedIdsRef.current.has(c))) {
             detectedPose = 'front';
          }
          
          setLivePose(detectedPose);

          if (detectedPose !== 'unknown' && !capturedIdsRef.current.has(detectedPose)) {
            if (lastDetectedPoseRef.current === detectedPose) {
              stableFramesRef.current += 1;
              if (stableFramesRef.current > 3) { // Blazingly fast capture
                stableFramesRef.current = 0;
                handleCapture(detectedPose);
              }
            } else {
              lastDetectedPoseRef.current = detectedPose;
              stableFramesRef.current = 0;
            }
          } else {
            stableFramesRef.current = 0; // Reset if already captured
            lastDetectedPoseRef.current = detectedPose;
          }
        } else {
          stableFramesRef.current = 0; // Reset if face lost
        }
      }
      
      // Loop
      if (!isProcessing) {
        animationFrameRef.current = requestAnimationFrame(scanFace);
      }
    };

    scanFace();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [modelsLoaded, stream, mockMode, isProcessing]);

  const handleCapture = (poseId) => {
    capturedIdsRef.current.add(poseId);
    let imageDataUrl = null;

    if (!mockMode && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    } else {
      // Mock captured image
      imageDataUrl = 'mock-image-data';
    }

    setCapturedImages(prev => {
      const next = { ...prev, [poseId]: imageDataUrl };
      
      // Flash effect
      const flash = document.getElementById('camera-flash');
      if (flash) {
        flash.style.opacity = '1';
        setTimeout(() => { flash.style.opacity = '0'; }, 150);
      }

      // Check if all steps are completed
      if (Object.keys(next).length === SCAN_STEPS.length) {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        onComplete(next);
      }
      
      return next;
    });
  };

  if (isProcessing) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1E293B' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '40px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '4px solid rgba(0,184,212,0.2)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '4px solid var(--primary-cyan)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <Brain size={48} color="var(--primary-cyan)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: 300 }}>Analyzing Dermatological Data...</h2>
        <p style={{ color: '#64748B', fontSize: '1.1rem' }}>Extracting features via Clinical AI models</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Image with Low Opacity */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/camera-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.20,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Main Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
        
        {/* Top Header */}
      <div style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, background: 'linear-gradient(to bottom, rgba(249,250,251,0.9) 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1E293B' }}>
          <ShieldAlert size={20} color="var(--accent-emerald)" />
          <span style={{ fontWeight: 600, letterSpacing: '1px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Clinical Scan Mode Active</span>
          {!modelsLoaded && !mockMode && (
             <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-orange)' }}>
               <Loader2 size={16} className="animate-spin" />
               <span style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>LOADING ML MODELS...</span>
             </div>
          )}
        </div>
        <button onClick={onCancel} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E293B', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(0,0,0,0.1)'} onMouseOut={e=>e.currentTarget.style.background='rgba(0,0,0,0.05)'}>
          <X size={20} />
        </button>
      </div>

      {/* Main Camera Area */}
      <div className="responsive-camera-stack" style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '40px', position: 'relative', padding: '0 40px 40px 40px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Left Checklist (Steps 0-2) */}
        <div className="mobile-order-2" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
          {SCAN_STEPS.slice(0, 3).map((step) => {
            const isCompleted = !!capturedImages[step.id];
            return (
              <div key={step.id} className="responsive-checklist-item" style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderRadius: '16px',
                background: !isCompleted ? 'rgba(0,184,212,0.1)' : 'white',
                border: `1px solid ${!isCompleted ? 'var(--primary-cyan)' : 'transparent'}`,
                boxShadow: !isCompleted ? 'none' : '0 4px 10px rgba(0,0,0,0.03)',
                transition: 'all 0.3s'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="responsive-checklist-item-title" style={{ 
                    color: isCompleted ? '#94A3B8' : '#1E293B',
                    fontWeight: !isCompleted ? 600 : 500,
                    fontSize: '1.3rem',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {step.label}
                  </span>
                  <div className="responsive-checklist-item-subtitle" style={{ opacity: isCompleted ? 0 : 1, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
                    <span style={{ fontSize: '1rem', color: 'var(--primary-cyan)', marginTop: '6px', display: 'block' }}>{step.instruction}</span>
                  </div>
                </div>
                
                {isCompleted ? (
                  <CheckCircle2 size={40} color="var(--accent-emerald)" />
                ) : livePose === step.id ? (
                  <div style={{ fontSize: '1rem', color: 'var(--primary-cyan)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Scanning...</div>
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.1)' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Center Camera Container (Horizontal Video Feed Box */}
        <div className="responsive-camera-box mobile-order-1" style={{ position: 'relative', width: '650px', height: '450px', flexShrink: 0, background: '#000', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
          
          {/* Live Telemetry HUD */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '8px 12px', borderRadius: '8px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Telemetry</span>
             <span style={{ fontSize: '0.85rem', color: 'white', fontFamily: 'monospace' }}>Pending: {SCAN_STEPS.filter(s => !capturedImages[s.id]).length}</span>
             <span style={{ fontSize: '0.85rem', color: capturedImages[livePose] ? 'var(--accent-orange)' : 'var(--accent-emerald)', fontFamily: 'monospace' }}>Reading: {livePose}</span>
          </div>

          {/* Flash Element */}
          <div id="camera-flash" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'white', opacity: 0, transition: 'opacity 0.15s ease-out', zIndex: 50, pointerEvents: 'none' }} />

          {/* Video Feed */}
          {mockMode ? (
             <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1A1A24', color: 'white' }}>
               <AlertCircle size={48} color="var(--accent-orange)" style={{ marginBottom: '16px' }} />
               <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Camera Disabled</h3>
               <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: '300px' }}>Running in Mock Mode because camera permissions were denied or no webcam is available.</p>
             </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
            />
          )}

          {/* Face Overlay Guide */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40%', height: '70%', border: '2px dashed rgba(255,255,255,0.4)', borderRadius: '40% 40% 50% 50%', zIndex: 10, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ width: '8px', height: '8px', background: 'var(--primary-cyan)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary-cyan)' }} />
          </div>

          {/* Corner Framing Marks */}
          <div style={{ position: 'absolute', top: '40px', left: '40px', width: '40px', height: '40px', borderTop: '4px solid var(--primary-cyan)', borderLeft: '4px solid var(--primary-cyan)', borderRadius: '8px 0 0 0', zIndex: 10 }} />
          <div style={{ position: 'absolute', top: '40px', right: '40px', width: '40px', height: '40px', borderTop: '4px solid var(--primary-cyan)', borderRight: '4px solid var(--primary-cyan)', borderRadius: '0 8px 0 0', zIndex: 10 }} />
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', width: '40px', height: '40px', borderBottom: '4px solid var(--primary-cyan)', borderLeft: '4px solid var(--primary-cyan)', borderRadius: '0 0 0 8px', zIndex: 10 }} />
          <div style={{ position: 'absolute', bottom: '40px', right: '40px', width: '40px', height: '40px', borderBottom: '4px solid var(--primary-cyan)', borderRight: '4px solid var(--primary-cyan)', borderRadius: '0 0 8px 0', zIndex: 10 }} />

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Right Checklist (Steps 3-5) */}
        <div className="mobile-order-3" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
          {SCAN_STEPS.slice(3, 6).map((step) => {
            const isCompleted = !!capturedImages[step.id];
            return (
              <div key={step.id} className="responsive-checklist-item" style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderRadius: '16px',
                background: !isCompleted ? 'rgba(0,184,212,0.1)' : 'white',
                border: `1px solid ${!isCompleted ? 'var(--primary-cyan)' : 'transparent'}`,
                boxShadow: !isCompleted ? 'none' : '0 4px 10px rgba(0,0,0,0.03)',
                transition: 'all 0.3s'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="responsive-checklist-item-title" style={{ 
                    color: isCompleted ? '#94A3B8' : '#1E293B',
                    fontWeight: !isCompleted ? 600 : 500,
                    fontSize: '1.3rem',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {step.label}
                  </span>
                  <div className="responsive-checklist-item-subtitle" style={{ opacity: isCompleted ? 0 : 1, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
                    <span style={{ fontSize: '1rem', color: 'var(--primary-cyan)', marginTop: '6px', display: 'block' }}>{step.instruction}</span>
                  </div>
                </div>
                
                {isCompleted ? (
                  <CheckCircle2 size={40} color="var(--accent-emerald)" />
                ) : livePose === step.id ? (
                  <div style={{ fontSize: '1rem', color: 'var(--primary-cyan)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Scanning...</div>
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.1)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      </div> {/* End Main Content Wrapper */}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
