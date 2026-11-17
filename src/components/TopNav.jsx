import React from 'react';
import { Home, Camera, LayoutDashboard, Activity, Brain, Printer, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',          icon: Home,            label: 'Home'     },
  { path: '/facescan',  icon: Camera,          label: 'Scan'     },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Results'  },
  { path: '/progress',  icon: Activity,        label: 'Progress' },
];

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
        >
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
          >
            <Brain size={18} className="text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-base text-slate-900 tracking-tight">
              DermaSense<span className="text-teal-600">AI</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black bg-teal-50 text-teal-700 border border-teal-200 rounded-md uppercase tracking-wider">
              Clinical
            </span>
          </div>
        </div>

        {/* Center Navigation Bar Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active 
                    ? 'bg-white text-teal-800 shadow-xs border border-slate-200 font-extrabold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon size={15} className={active ? 'text-teal-600' : 'text-slate-400'} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {isDashboard ? (
            <>
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
                title="Print Clinical Report"
              >
                <Printer size={14} /> Print Report
              </button>
              <button
                onClick={() => navigate('/facescan')}
                className="px-3.5 py-1.5 text-xs font-bold text-white rounded-xl shadow-xs transition-opacity hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
              >
                <RotateCcw size={14} /> Retake Scan
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/facescan')}
              className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-opacity hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
            >
              <Camera size={14} /> Start Scan
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
