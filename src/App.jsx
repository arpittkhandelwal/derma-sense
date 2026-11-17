import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './index.css';
import LandingPage from './components/LandingPage';
import FaceScanCamera from './components/FaceScanCamera';
import Dashboard from './components/Dashboard';
import ProgressTracker from './components/ProgressTracker';
import BottomNav from './components/BottomNav';

function AppContent() {
  const [scanImages, setScanImages] = useState(null);
  const navigate   = useNavigate();
  const location   = useLocation();

  const hiddenNav = ['/', '/facescan'];
  const showNav   = !hiddenNav.includes(location.pathname);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800">
      {showNav && <BottomNav />}
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/facescan"  element={
          <FaceScanCamera
            onComplete={(images) => { setScanImages(images); navigate('/dashboard'); }}
            onCancel={() => navigate('/')}
          />
        } />
        <Route path="/dashboard" element={
          <Dashboard
            scanImages={scanImages}
            onGoHome={() => navigate('/')}
            onRetakeScan={() => navigate('/facescan')}
          />
        } />
        <Route path="/progress"  element={<ProgressTracker />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
