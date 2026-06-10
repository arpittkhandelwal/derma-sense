import React, { useState, useEffect } from 'react';
import { Camera, Brain, ActivitySquare, Droplets, Wind, Mail, Lock, ArrowLeft } from 'lucide-react';
import { auth, db } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './index.css';
import Dashboard from './components/Dashboard';
import FaceScanCamera from './components/FaceScanCamera';
import ProgressTracker from './components/ProgressTracker';
import AdminPanel from './components/AdminPanel';
import BottomNav from './components/BottomNav';

function SignInView({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleSuccess = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userObj = { 
        uid: result.user.uid,
        email: result.user.email, 
        name: result.user.displayName, 
        picture: result.user.photoURL,
        role: 'User',
        status: 'Active',
        lastActive: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', result.user.uid), userObj, { merge: true });
      onSignIn(userObj);
    } catch (err) {
      console.error('Google Auth Failed', err);
      setErrorMsg('Google login failed.');
    }
  };

  const handleEmailAuth = async () => {
      try {
          if (isSignUp) {
              const result = await createUserWithEmailAndPassword(auth, email, password);
              const userObj = { uid: result.user.uid, email: result.user.email, name: email.split('@')[0], role: 'User', status: 'Active', lastActive: new Date().toISOString() };
              await setDoc(doc(db, 'users', result.user.uid), userObj, { merge: true });
              onSignIn(userObj);
          } else {
              const result = await signInWithEmailAndPassword(auth, email, password);
              const userObj = { uid: result.user.uid, email: result.user.email, name: email.split('@')[0], role: 'User', status: 'Active', lastActive: new Date().toISOString() };
              await setDoc(doc(db, 'users', result.user.uid), userObj, { merge: true });
              onSignIn(userObj);
          }
      } catch (err) {
          console.error('Auth Error:', err);
          setErrorMsg(err.message);
      }
  };

  return (
    <div className="animate-fade-in mobile-signin-container">
      {/* Background elements */}
      <div className="ambient-glow glow-top-right" />
      <div className="ambient-glow glow-bottom-left" />
      <div className="medical-pattern-bg" />

      <div className="glass-card mobile-signin-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div className="app-logo-box">
            <Brain size={24} color="white" />
          </div>
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '8px', color: 'var(--text-main)' }}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: 500 }}>Sign in to continue to DermaSense AI</p>

        {errorMsg && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.85rem' }}>{errorMsg}</p>}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', width: '100%' }}>
          <button onClick={handleGoogleSuccess} className="google-auth-btn">
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
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="auth-input" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="auth-input" />
            </div>
          </div>
        </div>

        <button className="btn-primary auth-submit-btn" onClick={handleEmailAuth}>{isSignUp ? 'Create Account' : 'Sign In'}</button>

        <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => setIsSignUp(!isSignUp)} style={{ color: 'var(--primary-deep-violet)', fontWeight: 700, cursor: 'pointer' }}>{isSignUp ? 'Sign In' : 'Create New Account'}</span>
        </p>

      </div>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (window.location.pathname === '/adminmehak') return 'admin';
    if (window.location.pathname === '/progress') return 'progress';
    return 'signin';
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
        setCurrentView('signin');
      }
    });
    return () => unsubscribe();
  }, [currentView]);

  return (
    <div className="mobile-app-wrapper">
      {currentView === 'signin' && (
        <SignInView onSignIn={() => setCurrentView('facescan')} />
      )}
      {currentView === 'facescan' && (
        <FaceScanCamera 
          onComplete={(images) => {
            console.log('Captured Face Images:', images);
            setScanImages(images);
            setCurrentView('dashboard');
          }} 
          onCancel={() => setCurrentView('dashboard')} 
        />
      )}
      {currentView === 'dashboard' && (
        <Dashboard 
          scanImages={scanImages} 
          onGoHome={() => setCurrentView('dashboard')} 
          onRetakeScan={() => setCurrentView('facescan')} 
        />
      )}
      {currentView === 'progress' && (
        <ProgressTracker user={user} />
      )}
      {currentView === 'admin' && (
        <AdminPanel onExit={() => {
          window.history.pushState({}, '', '/');
          setCurrentView('dashboard');
        }} />
      )}
      
      {/* Only show Bottom Navigation if user is signed in */}
      {user && currentView !== 'signin' && (
        <BottomNav currentView={currentView} setCurrentView={setCurrentView} user={user} />
      )}
    </div>
  );
}

export default App;
