import React, { useState, useEffect } from 'react';
import { Camera, Brain, Sparkles, ChevronRight, ActivitySquare, Droplets, Sun, Wind, Heart, Smile, Flower2, Stethoscope, Mail, Lock, ArrowLeft } from 'lucide-react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import './index.css';
import Dashboard from './components/Dashboard';
import FaceScanCamera from './components/FaceScanCamera';
import ProgressTracker from './components/ProgressTracker';

function HeroSection({ onStartScan }) {
  return (
    <section className="container responsive-hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '120px', position: 'relative' }}>
      
      {/* Background Ambient Glow */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--secondary-soft-pink) 0%, transparent 60%)', opacity: 0.15, filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--primary-electric-blue) 0%, transparent 60%)', opacity: 0.15, filter: 'blur(60px)', zIndex: 0 }} />

      <div className="responsive-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%', alignItems: 'center', zIndex: 2 }}>
        
        {/* Left Text Content */}
        <div className="animate-fade-in" style={{ paddingRight: '20px', position: 'relative' }}>
          
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
            {/* Sticker 1: In front of Next-Gen pill (left side of pill) */}
            <div className="animate-float" style={{ position: 'absolute', top: '-10px', left: '-60px', background: 'white', padding: '12px', borderRadius: '50%', boxShadow: '0 8px 24px rgba(0,200,83,0.15)', animationDelay: '1.2s', zIndex: 10 }}>
               <Flower2 size={24} color="var(--accent-emerald)" />
            </div>
            {/* Sticker 4: Right side of Next-Gen pill */}
            <div className="animate-float" style={{ position: 'absolute', top: '-5px', right: '-65px', background: 'white', padding: '12px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(112,0,255,0.15)', animationDelay: '1.5s', transform: 'rotate(10deg)', zIndex: 10 }}>
               <Stethoscope size={24} color="var(--primary-royal-purple)" />
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '10px 20px', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <Sparkles size={18} color="var(--primary-royal-purple)" />
              <span style={{ fontSize: '0.95rem', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700 }} className="text-gradient-primary">Next-Gen AI Dermatology</span>
            </div>
          </div>
          
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Sticker 2: Left of the heading */}
            <div className="animate-float" style={{ position: 'absolute', top: '40px', left: '-80px', background: 'white', padding: '14px', borderRadius: '24px', boxShadow: '0 12px 30px rgba(255,64,129,0.15)', animationDelay: '0s', transform: 'rotate(-10deg)', zIndex: 10 }}>
               <Heart size={28} color="var(--secondary-soft-pink)" />
            </div>
            {/* Sticker 3: In between space of "Personal" and "Skin Intelligence" */}
            <div className="animate-float" style={{ position: 'absolute', top: '-10px', right: '-80px', background: 'white', padding: '14px', borderRadius: '20px', boxShadow: '0 12px 30px rgba(255,109,0,0.15)', animationDelay: '0.8s', transform: 'rotate(15deg)', zIndex: 10 }}>
               <Smile size={28} color="var(--accent-orange)" />
            </div>

            <h1 style={{ position: 'relative', fontSize: '5rem', lineHeight: '1.05', marginBottom: '32px', fontWeight: 800, letterSpacing: '-0.03em', zIndex: 2 }}>
              Your Personal <br />
              <span className="text-gradient-primary">Skin Intelligence</span>
            </h1>
          </div>
          
          <p style={{ position: 'relative', fontSize: '1.3rem', color: 'var(--text-muted)', marginBottom: '48px', maxWidth: '550px', lineHeight: 1.6, fontWeight: 500, zIndex: 2 }}>
            Experience the future of clinical dermatology. DermaSense AI uses advanced neural networks to map, analyze, and predict your skin health in real-time.
          </p>
          
          <div style={{ position: 'relative', display: 'flex', gap: '24px', zIndex: 2 }}>
            <button className="btn-primary" onClick={onStartScan} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 40px', fontSize: '1.1rem' }}>
              <Camera size={22} />
              Start Live Scan
            </button>
            <button className="btn-glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '18px 40px', fontSize: '1.1rem', color: 'var(--primary-deep-violet)' }}>
              See How it Works <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right High-end Graphic & Stickers */}
        <div className="animate-fade-in responsive-image-reset" style={{ position: 'relative', height: '700px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Main Display Image - Scaled down to restore sharpness */}
          <div className="responsive-image-reset" style={{ position: 'absolute', width: '160%', height: '100%', right: '-50%', top: '0', zIndex: 1, pointerEvents: 'none', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)' }}>
             <div style={{ width: '100%', height: '100%', WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 85%)', maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 85%)' }}>
                 <img src="/ai_scan_2.jpg" alt="AI Skin Mapping" style={{ width: '125%', height: '100%', objectFit: 'contain', objectPosition: 'left center', transform: 'translateX(-20%)', imageRendering: 'high-quality', filter: 'blur(0.6px) contrast(1.08) saturate(1.05)' }} />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'rgba(255, 255, 255, 0.85)', cursor: 'pointer' }}>
      <div className="feature-icon-wrapper" style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '20px', background: `linear-gradient(135deg, rgba(${color}, 0.15), rgba(${color}, 0.05))`, border: `1px solid rgba(${color}, 0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 2px 4px rgba(255,255,255,0.5), 0 8px 16px rgba(${color}, 0.15)`, zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at top left, rgba(255,255,255,0.8), transparent)`, borderRadius: '20px', pointerEvents: 'none' }} />
        <Icon size={32} style={{ color: `rgb(${color})`, filter: `drop-shadow(0 4px 8px rgba(${color},0.4))` }} />
      </div>
      <div style={{ zIndex: 1 }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px', letterSpacing: '-0.01em' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.05rem', fontWeight: 400 }}>{description}</p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="container" style={{ padding: '100px 24px', position: 'relative' }}>
      
      {/* Custom Healthcare Background Pattern */}
      <div style={{ position: 'absolute', top: '0', left: '-20%', right: '-20%', bottom: '0', backgroundImage: 'url("/pattern.png")', backgroundSize: '300px', backgroundRepeat: 'repeat', opacity: 0.5, mixBlendMode: 'multiply', zIndex: 0, pointerEvents: 'none', WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)', maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)' }} />

      {/* Decorative Corner Stickers */}
      <div className="animate-float responsive-sticker-1" style={{ position: 'absolute', top: '40px', left: '40px', background: 'white', padding: '16px', borderRadius: '24px', boxShadow: '0 12px 30px rgba(0,184,212,0.15)', animationDelay: '0.2s', transform: 'rotate(-12deg)', zIndex: 10 }}>
         <Sparkles size={28} color="var(--primary-cyan)" />
      </div>
      <div className="animate-float responsive-sticker-2" style={{ position: 'absolute', top: '80px', right: '60px', background: 'white', padding: '14px', borderRadius: '50%', boxShadow: '0 12px 30px rgba(255,109,0,0.15)', animationDelay: '1.4s', transform: 'rotate(15deg)', zIndex: 10 }}>
         <Sun size={26} color="var(--accent-orange)" />
      </div>
      <div className="animate-float responsive-sticker-3" style={{ position: 'absolute', bottom: '160px', left: '60px', background: 'white', padding: '18px', borderRadius: '20px', boxShadow: '0 12px 30px rgba(0,200,83,0.15)', animationDelay: '0.8s', transform: 'rotate(-5deg)', zIndex: 10 }}>
         <Flower2 size={30} color="var(--accent-emerald)" />
      </div>
      <div className="animate-float responsive-sticker-4" style={{ position: 'absolute', bottom: '80px', right: '40px', background: 'white', padding: '14px', borderRadius: '24px', boxShadow: '0 12px 30px rgba(112,0,255,0.15)', animationDelay: '1.8s', transform: 'rotate(10deg)', zIndex: 10 }}>
         <Brain size={28} color="var(--primary-royal-purple)" />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '80px', position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>Clinical Intelligence <span className="text-gradient-primary">in Your Pocket</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Powered by state-of-the-art CNN models and predictive analytics.
        </p>
      </div>

      {/* Asymmetric / Staggered Grid for modern feel */}
      <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '40px' }}>
          <FeatureCard 
            icon={ActivitySquare} 
            title="Acne AI Scan" 
            description="Real-time detection of blackheads, whiteheads, and cystic acne severity with medical-grade precision."
            color="255, 109, 0"
          />
          <div className="glass-card" style={{ padding: '48px 40px', background: 'linear-gradient(135deg, #0A0F2C 0%, #1A1A24 100%)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            {/* Ambient Background Glows */}
            <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(112,0,255,0.4) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '-50%', left: '-50%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(0,184,212,0.3) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
                <Sparkles size={14} color="var(--primary-cyan)" />
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: 'var(--primary-cyan)' }}>Clinical Grade</span>
              </div>
              <h3 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', color: 'white', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #FFFFFF 0%, #B0B0D0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>99.8%<span style={{ fontSize: '1.5rem', fontWeight: 500, opacity: 0.8, WebkitTextFillColor: 'rgba(255,255,255,0.8)' }}> Confidence</span></h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '1.1rem', fontWeight: 400 }}>Trained on over 2 million clinical dermatology images worldwide for unparalleled precision.</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <FeatureCard 
            icon={Droplets} 
            title="Hydration Tracking" 
            description="Correlate your lifestyle, sleep, and water intake with your skin's moisture barrier performance."
            color="0, 200, 83"
          />
          <FeatureCard 
            icon={Wind} 
            title="Hair & Scalp Analysis" 
            description="Track hair density, detect early signs of thinning, and monitor overall scalp health dynamically."
            color="0, 184, 212"
          />
        </div>
      </div>
    </section>
  );
}

function SignInContent({ onBack, onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleSuccess = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onSignIn({ 
        uid: result.user.uid,
        email: result.user.email, 
        name: result.user.displayName, 
        picture: result.user.photoURL 
      });
    } catch (err) {
      console.error('Google Auth Failed', err);
      setErrorMsg('Google login failed.');
    }
  };

  const handleEmailAuth = async () => {
      try {
          if (isSignUp) {
              const result = await createUserWithEmailAndPassword(auth, email, password);
              onSignIn({ uid: result.user.uid, email: result.user.email });
          } else {
              const result = await signInWithEmailAndPassword(auth, email, password);
              onSignIn({ uid: result.user.uid, email: result.user.email });
          }
      } catch (err) {
          console.error('Auth Error:', err);
          setErrorMsg(err.message);
      }
  };

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', position: 'relative', overflow: 'hidden' }}>
      {/* Background elements */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--primary-electric-blue) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--secondary-soft-pink) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(60px)' }} />

      {/* Custom Healthcare Background Pattern */}
      <div style={{ position: 'absolute', top: '0', left: '-20%', right: '-20%', bottom: '0', backgroundImage: 'url("/pattern.png")', backgroundSize: '300px', backgroundRepeat: 'repeat', opacity: 0.5, mixBlendMode: 'multiply', zIndex: 0, pointerEvents: 'none', WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)', maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)' }} />

      <button onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 10 }}>
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="glass-card responsive-card-width" style={{ width: '100%', maxWidth: '450px', padding: '48px', background: 'rgba(255, 255, 255, 0.9)', zIndex: 1, boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary-electric-blue), var(--primary-royal-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(112,0,255,0.2)' }}>
            <Brain size={24} color="white" />
          </div>
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '8px', color: 'var(--text-main)' }}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: 500 }}>Sign in to continue to DermaSense AI</p>

        {errorMsg && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.85rem' }}>{errorMsg}</p>}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', width: '100%' }}>
          <button onClick={handleGoogleSuccess} style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="20" alt="Google" />
             Continue with Google
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'white', outline: 'none', color: 'var(--text-main)', fontWeight: 500 }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'white', outline: 'none', color: 'var(--text-main)', fontWeight: 500 }} />
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={handleEmailAuth} style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 600, marginBottom: '24px' }}>{isSignUp ? 'Create Account' : 'Sign In'}</button>

        <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => setIsSignUp(!isSignUp)} style={{ color: 'var(--primary-deep-violet)', fontWeight: 700, cursor: 'pointer' }}>{isSignUp ? 'Sign In' : 'Create New Account'}</span>
        </p>

      </div>
    </div>
  );
}

function SignInView({ onBack, onSignIn }) {
  return <SignInContent onBack={onBack} onSignIn={onSignIn} />;
}

function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (window.location.pathname === '/progress') return 'progress';
    return 'landing';
  });
  const [user, setUser] = useState(null);
  const [scanImages, setScanImages] = useState(null);

  // Listen to Firebase Auth state globally
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser({ uid: u.uid, email: u.email, name: u.displayName, picture: u.photoURL });
        if (currentView === 'signin') {
           setCurrentView('facescan');
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [currentView]);

  return (
    <>
      {currentView === 'landing' && (
        <>
          <nav className="responsive-nav" style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '900px', padding: '16px 32px', zIndex: 100, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(24px)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 12px 40px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-electric-blue), var(--primary-royal-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={18} color="white" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-main)' }}>DermaSense<span style={{ color: 'var(--primary-cyan)' }}>AI</span></span>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="#" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='var(--primary-royal-purple)'} onMouseOut={e=>e.target.style.color='var(--text-muted)'}>Clinical Science</a>
              <a href="#" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='var(--primary-royal-purple)'} onMouseOut={e=>e.target.style.color='var(--text-muted)'}>Real Results</a>
              
              {user ? (
                 <>
                   <button onClick={() => { signOut(auth); setCurrentView('landing'); }} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', borderRadius: '100px', cursor: 'pointer', fontWeight: 600 }}>Sign Out</button>
                   <button className="btn-primary" style={{ padding: '10px 28px', fontSize: '0.95rem', borderRadius: '100px' }} onClick={() => setCurrentView('facescan')}>Go to Dashboard</button>
                 </>
              ) : (
                 <button className="btn-primary" style={{ padding: '10px 28px', fontSize: '0.95rem', borderRadius: '100px' }} onClick={() => setCurrentView('signin')}>Access App</button>
              )}
            </div>
          </nav>

          <main style={{ paddingTop: '40px' }}>
            <HeroSection onStartScan={() => setCurrentView('signin')} />
            <FeaturesSection />
            

            {/* Comprehensive Footer */}
            <footer className="responsive-padding" style={{ background: 'var(--footer-bg)', padding: '60px 5%', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="responsive-footer" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
                
                {/* Brand & Copyright */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Brain size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-main)' }}>DermaSense<span style={{ color: 'var(--brand-maroon)' }}>AI</span></span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>Clinical-grade AI for comprehensive skin and hair analysis.</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '40px' }}>© Fontus Health Ltd. 2026. All rights reserved.</p>
                </div>

                {/* Navigation Links */}
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                  <a className="footer-link">Terms and Conditions</a>
                  <a className="footer-link">Privacy Policy</a>
                  <a className="footer-link">Cookies</a>
                  <a className="footer-link">Contact Us</a>
                </div>

                {/* Social & Store Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <a className="social-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a className="social-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                    <a className="social-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <a className="store-btn" style={{ padding: '6px 12px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                         {/* Simplified icon for footer */}
                         <path d="M2 2v20l17-10L2 2z" />
                      </svg>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', opacity: 0.8 }}>Get it on</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1 }}>Google Play</span>
                      </div>
                    </a>
                    <a className="store-btn" style={{ padding: '6px 12px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        {/* Simplified icon for footer */}
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.636 14.182c-1.002 0-2.008-.43-2.656-.43-.655 0-1.637.41-2.583.41-1.326 0-2.553-.787-3.236-2.008-1.428-2.518-1.22-6.28.163-8.71 .66-1.144 1.83-1.88 3.09-1.88 1.293 0 2.296.84 2.943.84.664 0 1.802-.857 3.235-.857 1.353 0 2.428.536 3.12 1.554-2.735 1.633-2.288 5.633.454 6.776-.64 1.614-1.424 2.87-2.53 4.305zm-.848-8.835c-.47 1.15-1.748 1.942-3.003 1.825.263-1.385 1.054-2.656 2.17-3.414.502-.34 1.1-.564 1.706-.628-.158 1.01-.587 1.624-.873 2.217z"/>
                      </svg>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', opacity: 0.8 }}>Download on the</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1 }}>App Store</span>
                      </div>
                    </a>
                  </div>
                </div>

              </div>
            </footer>

          </main>
        </>
      )}
      {currentView === 'signin' && (
        <SignInView onBack={() => setCurrentView('landing')} onSignIn={() => setCurrentView('facescan')} />
      )}
      {currentView === 'facescan' && (
        <FaceScanCamera 
          onComplete={(images) => {
            console.log('Captured Face Images:', images);
            setScanImages(images);
            setCurrentView('dashboard');
          }} 
          onCancel={() => setCurrentView('landing')} 
        />
      )}
      {currentView === 'dashboard' && (
        <Dashboard 
          scanImages={scanImages} 
          onGoHome={() => setCurrentView('landing')} 
          onRetakeScan={() => setCurrentView('facescan')} 
        />
      )}
      {currentView === 'progress' && (
        <ProgressTracker user={user} />
      )}
    </>
  );
}

export default App;
