import React from 'react';
import { Camera, Brain, Sparkles, ChevronRight, ActivitySquare, Droplets, Sun, Wind, Heart, Smile, Flower2, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function HeroSection({ onStartScan }) {
  return (
    <section className="container responsive-hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '120px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Ambient Glow */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: 'min(500px, 100vw)', height: '500px', background: 'radial-gradient(circle, var(--secondary-soft-pink) 0%, transparent 60%)', opacity: 0.15, filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 'min(400px, 100vw)', height: '400px', background: 'radial-gradient(circle, var(--primary-electric-blue) 0%, transparent 60%)', opacity: 0.15, filter: 'blur(60px)', zIndex: 0 }} />

      <div className="responsive-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%', alignItems: 'center', zIndex: 2 }}>
        
        {/* Left Text Content */}
        <div className="animate-fade-in" style={{ paddingRight: '20px', position: 'relative' }}>
          
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
            <div className="animate-float" style={{ position: 'absolute', top: '-10px', left: '-60px', background: 'white', padding: '12px', borderRadius: '50%', boxShadow: '0 8px 24px rgba(0,200,83,0.15)', animationDelay: '1.2s', zIndex: 10 }}>
               <Flower2 size={24} color="var(--accent-emerald)" />
            </div>
            <div className="animate-float" style={{ position: 'absolute', top: '-5px', right: '-65px', background: 'white', padding: '12px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(112,0,255,0.15)', animationDelay: '1.5s', transform: 'rotate(10deg)', zIndex: 10 }}>
               <Stethoscope size={24} color="var(--primary-royal-purple)" />
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '10px 20px', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <Sparkles size={18} color="var(--primary-royal-purple)" />
              <span style={{ fontSize: '0.95rem', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700 }} className="text-gradient-primary">Next-Gen AI Dermatology</span>
            </div>
          </div>
          
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div className="animate-float" style={{ position: 'absolute', top: '40px', left: '-80px', background: 'white', padding: '14px', borderRadius: '24px', boxShadow: '0 12px 30px rgba(255,64,129,0.15)', animationDelay: '0s', transform: 'rotate(-10deg)', zIndex: 10 }}>
               <Heart size={28} color="var(--secondary-soft-pink)" />
            </div>
            <div className="animate-float" style={{ position: 'absolute', top: '-10px', right: '-80px', background: 'white', padding: '14px', borderRadius: '20px', boxShadow: '0 12px 30px rgba(255,109,0,0.15)', animationDelay: '0.8s', transform: 'rotate(15deg)', zIndex: 10 }}>
               <Smile size={28} color="var(--accent-orange)" />
            </div>

            <h1 style={{ position: 'relative', fontSize: 'clamp(3rem, 8vw, 5rem)', lineHeight: '1.05', marginBottom: '32px', fontWeight: 800, letterSpacing: '-0.03em', zIndex: 2 }}>
              Your Personal <br />
              <span className="text-gradient-primary">Skin Intelligence</span>
            </h1>
          </div>
          
          <p style={{ position: 'relative', fontSize: 'clamp(1rem, 3vw, 1.3rem)', color: 'var(--text-muted)', marginBottom: '48px', maxWidth: '550px', lineHeight: 1.6, fontWeight: 500, zIndex: 2 }}>
            Experience the future of clinical dermatology. DermaSense AI uses advanced neural networks to map, analyze, and predict your skin health in real-time.
          </p>
          
          <div className="responsive-hero-buttons" style={{ position: 'relative', display: 'flex', gap: '24px', zIndex: 2 }}>
            <button className="btn-primary" onClick={onStartScan} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '18px 40px', fontSize: '1.1rem' }}>
              <Camera size={22} />
              Start Live Scan
            </button>
            <button className="btn-glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'white', padding: '18px 40px', fontSize: '1.1rem', color: 'var(--primary-deep-violet)' }}>
              See How it Works <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right High-end Graphic & Stickers */}
        <div className="animate-fade-in responsive-image-reset" style={{ position: 'relative', height: '700px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
    <section className="container" style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      
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
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '16px' }}>Clinical Intelligence <span className="text-gradient-primary">in Your Pocket</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(1rem, 3vw, 1.2rem)', maxWidth: '600px', margin: '0 auto' }}>
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
            <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(112,0,255,0.4) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '-50%', left: '-50%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(0,184,212,0.3) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
                <Sparkles size={14} color="var(--primary-cyan)" />
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: 'var(--primary-cyan)' }}>Clinical Grade</span>
              </div>
              <h3 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '16px', color: 'white', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #FFFFFF 0%, #B0B0D0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>99.8%<span style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 500, opacity: 0.8, WebkitTextFillColor: 'rgba(255,255,255,0.8)' }}> Confidence</span></h3>
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

function LandingPage({ user }) {
  const navigate = useNavigate();
  return (
    <div style={{ overflowX: 'hidden' }}>
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
                <button onClick={() => { signOut(auth); navigate('/login'); }} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', borderRadius: '100px', cursor: 'pointer', fontWeight: 600 }}>Sign Out</button>
                <button className="btn-primary" style={{ padding: '10px 28px', fontSize: '0.95rem', borderRadius: '100px' }} onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
              </>
          ) : (
              <button className="btn-primary" style={{ padding: '10px 28px', fontSize: '0.95rem', borderRadius: '100px' }} onClick={() => navigate('/login')}>Access App</button>
          )}
        </div>
      </nav>

      <main style={{ paddingTop: '40px' }}>
        <HeroSection onStartScan={() => navigate('/login')} />
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

          </div>
        </footer>

      </main>
    </div>
  );
}

export default LandingPage;
