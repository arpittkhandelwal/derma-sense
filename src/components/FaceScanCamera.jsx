import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, CheckCircle2, X, Shield, Loader2, Check } from 'lucide-react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'framer-motion';

const SCAN_STEPS = [
  { id: 'front',    label: 'Frontal Aspect',   instruction: 'Center face in alignment oval, neutral gaze' },
  { id: 'left',     label: 'Left Oblique (45°)', instruction: 'Rotate head slightly to patient right' },
  { id: 'right',    label: 'Right Oblique (45°)', instruction: 'Rotate head slightly to patient left' },
  { id: 'forehead', label: 'Superior Aspect', instruction: 'Tilt chin slightly down for frontal plane' },
];

// Web Audio API — clinical acoustic shutter feedback
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
  } catch {
    // AudioContext might be blocked until user gesture
  }
}

export default function FaceScanCamera({ onComplete, onCancel }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const [stream,          setStream]          = useState(null);
  const [capturedImages,  setCapturedImages]  = useState({});
  const [isProcessing,    setIsProcessing]    = useState(false);
  const [modelsLoaded,    setModelsLoaded]    = useState(false);
  const [loadError,       setLoadError]       = useState(null);
  const [livePose,        setLivePose]        = useState('front');
  const [flashActive,     setFlashActive]     = useState(false);

  const landmarkerRef        = useRef(null);
  const animationFrameRef    = useRef(null);
  const lastVideoTimeRef     = useRef(-1);
  const stableFramesRef      = useRef(0);
  const capturedIdsRef       = useRef(new Set());
  const streamRef            = useRef(null);

  // ── Init MediaPipe + Camera ────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        landmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          outputFaceBlendshapes: false,
          runningMode: 'VIDEO',
          numFaces: 1,
        });
        if (!mounted) return;
        setModelsLoaded(true);

        const ms = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (!mounted) { ms.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = ms;
        setStream(ms);
        if (videoRef.current) {
          videoRef.current.srcObject = ms;
          videoRef.current.onloadedmetadata = () => videoRef.current.play();
        }
      } catch (err) {
        console.error('Init error:', err);
        if (mounted) setLoadError(err.message || 'Camera or model failed to load.');
      }
    }

    init();
    return () => {
      mounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ── Capture ────────────────────────────────────────────────────────────────
  const doCapture = useCallback((poseId, videoNode) => {
    if (capturedIdsRef.current.has(poseId)) return;
    capturedIdsRef.current.add(poseId);
    playBeep();

    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const tmp = document.createElement('canvas');
    tmp.width = videoNode.videoWidth || 640;
    tmp.height = videoNode.videoHeight || 480;
    const ctx = tmp.getContext('2d');
    ctx.drawImage(videoNode, 0, 0);
    const dataUrl = tmp.toDataURL('image/jpeg', 0.85);

    setCapturedImages(prev => {
      const next = { ...prev, [poseId]: dataUrl };
      if (Object.keys(next).length === SCAN_STEPS.length) {
        setIsProcessing(true);
        streamRef.current?.getTracks().forEach(t => t.stop());
        setTimeout(() => onComplete(next), 800);
      }
      return next;
    });
  }, [onComplete]);

  // ── Clinical Landmark Render Loop ──────────────────────────────────────────
  useEffect(() => {
    if (!modelsLoaded || !stream || isProcessing) return;

    const loop = async () => {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !landmarkerRef.current) { animationFrameRef.current = requestAnimationFrame(loop); return; }

      if (video.currentTime !== lastVideoTimeRef.current && video.readyState >= 2) {
        lastVideoTimeRef.current = video.currentTime;
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx          = canvas.getContext('2d');
        const drawingUtils = new DrawingUtils(ctx);
        const results      = landmarkerRef.current.detectForVideo(video, performance.now());

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.faceLandmarks?.length > 0) {
          const lm = results.faceLandmarks[0];

          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);

          // Subtle clinical anatomical facial boundary (clean medical styling)
          drawingUtils.drawConnectors(lm, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, {
            color: 'rgba(20, 184, 166, 0.7)', lineWidth: 1.5,
          });
          // Subtle eye contour alignment
          drawingUtils.drawConnectors(lm, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, {
            color: 'rgba(255, 255, 255, 0.5)', lineWidth: 1,
          });
          drawingUtils.drawConnectors(lm, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, {
            color: 'rgba(255, 255, 255, 0.5)', lineWidth: 1,
          });
          // Subtle landmark points
          drawingUtils.drawLandmarks(lm, { color: 'rgba(255, 255, 255, 0.4)', radius: 1 });
          ctx.restore();

          // ── Pose estimation ──────────────────────────────────────────────
          const nose       = lm[1];
          const leftEdge   = lm[234];
          const rightEdge  = lm[454];
          const chin       = lm[152];
          const midEyes    = lm[168];

          const distL    = Math.abs(nose.x - leftEdge.x);
          const distR    = Math.abs(rightEdge.x - nose.x);
          const yawRatio = distL / (distL + distR + 0.001);

          const distEN      = Math.abs(nose.y - midEyes.y);
          const distNC      = Math.abs(chin.y - nose.y);
          const pitchRatio  = distEN / (distEN + distNC + 0.001);

          let detectedPose;
          if (yawRatio < 0.38) detectedPose = 'right';
          else if (yawRatio > 0.62) detectedPose = 'left';
          else if (pitchRatio > 0.62) detectedPose = 'forehead';
          else detectedPose = 'front';

          const pending = SCAN_STEPS.map(s => s.id).filter(id => !capturedIdsRef.current.has(id));
          const currentTarget = pending[0];

          setLivePose(detectedPose);

          if (currentTarget && detectedPose === currentTarget) {
            stableFramesRef.current += 1;
            if (stableFramesRef.current > 24) {
              stableFramesRef.current = 0;
              doCapture(currentTarget, video);
            }
          } else {
            stableFramesRef.current = 0;
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [modelsLoaded, stream, isProcessing, doCapture]);

  const pendingSteps = SCAN_STEPS.filter(s => !capturedImages[s.id]);
  const currentTargetStep = pendingSteps[0];
  const currentTargetId = currentTargetStep?.id;

  const handleManualCapture = () => {
    const video = videoRef.current;
    if (!video || !currentTargetId) return;
    doCapture(currentTargetId, video);
  };

  const handleUseDemo = () => {
    setIsProcessing(true);
    streamRef.current?.getTracks().forEach(t => t.stop());
    const demoCaptures = {
      front: 'mock-image-data',
      left: 'mock-image-data',
      right: 'mock-image-data',
      forehead: 'mock-image-data'
    };
    setTimeout(() => onComplete(demoCaptures), 600);
  };

  // ── Processing screen ──────────────────────────────────────────────────────
  if (isProcessing) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-6 shadow-sm">
        <Loader2 size={28} className="text-teal-700 animate-spin" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Transmitting Calibrated Captures…</h2>
      <p className="text-sm text-slate-600 font-medium mt-1">Executing standardized clinical bio-marker extraction</p>
    </div>
  );

  // ── Error screen ───────────────────────────────────────────────────────────
  if (loadError) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 p-8">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
        <Shield size={28} className="text-rose-600" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">Camera Feed Inactive</h2>
      <p className="text-slate-600 text-center max-w-sm text-sm">{loadError}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={handleUseDemo}
          className="px-6 py-3 text-white font-bold text-sm rounded-xl shadow-md transition-opacity hover:opacity-95 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
        >
          Proceed with Calibrated Demo Scan
        </button>
        <button onClick={onCancel} className="px-6 py-3 bg-white text-slate-700 font-bold text-sm rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer">
          Return
        </button>
      </div>
    </div>
  );

  // ── Main View ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center z-10 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
            <Camera size={14} className="text-teal-700" />
          </div>
          <div>
            <span className="font-black text-xs tracking-wider uppercase text-slate-900">
              Clinical Photographic Acquisition
            </span>
            <span className="text-[10px] text-slate-500 font-medium block">
              Standardized Multi-Angle Examination Protocol
            </span>
          </div>
          {!modelsLoaded && (
            <div className="flex items-center gap-1.5 text-teal-700 ml-3 text-[11px] font-bold">
              <Loader2 size={13} className="animate-spin" />
              <span>Calibrating Optical Alignment…</span>
            </div>
          )}
          {modelsLoaded && (
            <div className="flex items-center gap-1.5 text-emerald-700 ml-3 text-[11px] font-bold">
              <Check size={13} className="stroke-[3]" />
              <span>Optical Guidance Calibrated</span>
            </div>
          )}
        </div>
        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer"
          title="Exit Acquisition"
        >
          <X size={16} className="text-slate-600" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-4 lg:p-8 max-w-6xl mx-auto w-full">

        {/* ── Step Checklist ──────────────────────────────────── */}
        <div className="w-full lg:w-80 flex flex-row lg:flex-col gap-3">
          {SCAN_STEPS.map((step) => {
            const done        = !!capturedImages[step.id];
            const isTarget    = currentTargetId === step.id;
            const isMatching  = isTarget && livePose === step.id;
            return (
              <div
                key={step.id}
                className={`flex-1 lg:flex-none p-4 rounded-2xl border transition-all ${
                  done
                    ? 'bg-slate-100 border-slate-200 opacity-60'
                    : isTarget
                    ? 'bg-teal-50 border-teal-300 shadow-md ring-2 ring-teal-200'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold truncate ${done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {step.label}
                      </p>
                      {isMatching && !done && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Aligned
                        </span>
                      )}
                    </div>
                    {!done && (
                      <p className="text-[11px] text-teal-800 font-medium mt-0.5 hidden lg:block">{step.instruction}</p>
                    )}
                  </div>
                  {done ? (
                    <CheckCircle2 size={22} className="text-emerald-600 shrink-0 ml-2" />
                  ) : isMatching ? (
                    <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin shrink-0 ml-2" style={{ borderColor: '#0d9488', borderTopColor: 'transparent' }} />
                  ) : isTarget ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse shrink-0 ml-2" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 ml-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Camera Box ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center max-w-3xl w-full">
          <div className="relative w-full aspect-video bg-slate-950 rounded-3xl overflow-hidden border border-slate-300 shadow-xl">

            {/* Shutter flash */}
            <AnimatePresence>
              {flashActive && (
                <motion.div
                  key="flash"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 bg-white z-30 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Standard Clinical Telemetry Card */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-2.5 rounded-xl z-20 border border-white/10 space-y-0.5 text-white">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                <p className="text-[10px] font-mono uppercase font-bold text-teal-300">
                  STANDARDIZED PROTOCOL
                </p>
              </div>
              <p className="text-xs font-mono font-medium text-slate-200">
                Target: <strong>{currentTargetStep?.label || 'Complete'}</strong>
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                Live Alignment: {livePose.toUpperCase()}
              </p>
            </div>

            {/* Captured thumbnails row */}
            <div className="absolute top-4 right-4 flex gap-1.5 z-20">
              {SCAN_STEPS.map(s => (
                <div key={s.id} className={`w-9 h-9 rounded-lg overflow-hidden border transition-all ${capturedImages[s.id] ? 'border-emerald-400' : 'border-slate-700 bg-slate-900/80'}`}>
                  {capturedImages[s.id]
                    ? <img src={capturedImages[s.id]} className="w-full h-full object-cover" alt={s.label} />
                    : <div className="w-full h-full flex items-center justify-center">
                        <Camera size={11} className="text-slate-500" />
                      </div>
                  }
                </div>
              ))}
            </div>

            {/* Video Feed */}
            <video ref={videoRef} autoPlay playsInline muted
              className="absolute inset-0 w-full h-full object-cover -scale-x-100" />

            {/* Clinical Mesh / Overlay Canvas */}
            <canvas ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10" />

            {/* Subtle Oval Framing Guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-15">
              <div className="w-48 sm:w-60 h-64 sm:h-80 rounded-[50%] border border-white/30 border-dashed" />
            </div>

            {/* Progress bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 z-20">
              <div
                className="h-full transition-all duration-300 bg-teal-500"
                style={{
                  width: `${(Object.keys(capturedImages).length / SCAN_STEPS.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Quick Manual Actions */}
          <div className="flex items-center justify-between w-full mt-4 px-2">
            <button
              onClick={handleUseDemo}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Use Calibrated Demo Data →
            </button>
            <button
              onClick={handleManualCapture}
              className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
            >
              <Camera size={14} />
              <span>Capture {currentTargetStep?.label || 'Angle'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
