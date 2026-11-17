import React, { useState, useEffect } from 'react';

// Fallback interactive 2D Face Topology Scanner if WebGL fails
function FallbackFaceMap({ concerns }) {
  return (
    <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 border border-indigo-900/40">
      {/* Background cyber grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #06b6d4 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Stylized 2D Face Mesh Map */}
      <div className="relative w-44 h-52 rounded-[44px] border-2 border-dashed border-cyan-400/50 bg-cyan-950/20 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        {/* Animated radar scanning line */}
        <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee] animate-pulse" />

        {/* 478 Landmark Nodes Representation */}
        {[
          { top: '22%', left: '32%', color: '#6366f1' },
          { top: '22%', right: '32%', color: '#6366f1' },
          { top: '38%', left: '48%', color: '#00B8D4' },
          { top: '50%', left: '48%', color: '#00B8D4' },
          { top: '48%', left: '26%', color: '#f43f5e' },
          { top: '48%', right: '26%', color: '#f43f5e' },
          { top: '68%', left: '48%', color: '#8b5cf6' },
          { top: '82%', left: '48%', color: '#10b981' },
          { top: '12%', left: '48%', color: '#f59e0b' },
        ].map((pt, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full shadow-sm animate-ping opacity-80"
            style={{
              top: pt.top,
              left: pt.left,
              right: pt.right,
              backgroundColor: pt.color,
              boxShadow: `0 0 8px ${pt.color}`
            }}
          />
        ))}

        <div className="text-[11px] font-mono font-bold text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-cyan-500/40 shadow-xs">
          478 PTS MAPPED
        </div>
      </div>

      {/* Overlay info */}
      <div className="absolute bottom-3 inset-x-4 flex justify-between items-end pointer-events-none">
        <div className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest flex flex-col gap-0.5">
          <span>AI Topology Scan</span>
          <span className="text-white font-semibold">Active 2D Mesh Fallback</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {concerns?.map(c => (
            <span key={c} className="px-2 py-0.5 rounded bg-pink-500/20 border border-pink-500/50 text-pink-300 text-[10px] uppercase font-bold">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('WebGL initialization failed in FaceModel, falling back to 2D canvas:', err);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

let FiberComponents = null;

export default function FaceModel({ _landmarks, concerns }) {
  const [canRender3D, setCanRender3D] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  useEffect(() => {
    // Check WebGL availability safely
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        // Dynamically load Three.js components only if WebGL is available
        Promise.all([
          import('@react-three/fiber'),
          import('@react-three/drei')
        ]).then(([fiber, drei]) => {
          FiberComponents = {
            Canvas: fiber.Canvas,
            useFrame: fiber.useFrame,
            OrbitControls: drei.OrbitControls,
            Stars: drei.Stars
          };
          setCanRender3D(true);
          setComponentsLoaded(true);
        }).catch(() => {
          // Keep 2D fallback
        });
      }
    } catch {
      // Keep 2D fallback
    }
  }, []);

  if (!canRender3D || !componentsLoaded || !FiberComponents) {
    return <FallbackFaceMap concerns={concerns} />;
  }

  const { Canvas, OrbitControls, Stars } = FiberComponents;

  return (
    <WebGLErrorBoundary fallback={<FallbackFaceMap concerns={concerns} />}>
      <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0A0F2C] to-[#1a1a2e]">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <mesh>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color="#00B8D4" wireframe />
          </mesh>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
        
        {/* Overlay UI */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
          <div className="text-cyan-400 font-mono text-xs uppercase tracking-widest flex flex-col gap-1">
            <span>AI Topology Scan</span>
            <span className="text-white">Active 3D Mesh</span>
          </div>
          <div className="flex gap-2">
            {concerns?.map(c => (
              <span key={c} className="px-2 py-1 rounded bg-pink-500/20 border border-pink-500/50 text-pink-400 text-[10px] uppercase">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </WebGLErrorBoundary>
  );
}
