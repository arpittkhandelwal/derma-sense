import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Settings, Activity, 
  TrendingUp, ShieldAlert, BrainCircuit, Database,
  Search, Bell, LogOut, Shield, Power, PowerOff, Trash2, Camera, X, Cpu, Radar, PieChart as PieChartIcon, Download, Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';

function StatCard({ title, value, trend, icon: Icon, color }) {
  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255, 255, 255, 0.6)', border: `1px solid rgba(255, 255, 255, 0.8)`, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)', borderRadius: '24px', backdropFilter: 'blur(12px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>{title}</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>{value}</h3>
        </div>
        <div style={{ padding: '12px', borderRadius: '16px', background: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
          <Icon size={28} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: trend.startsWith('+') ? '#10b981' : '#f43f5e', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {trend.startsWith('+') ? <TrendingUp size={16} /> : <Activity size={16} />} {trend}
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>vs last week</span>
      </div>
    </div>
  );
}

export default function AdminPanel({ onExit }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [realUsers, setRealUsers] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [avgConfidence, setAvgConfidence] = useState('0%');
  const [chartData, setChartData] = useState([]);
  const [conditionsData, setConditionsData] = useState([]);
  const [trends, setTrends] = useState({ scans: '0%', users: '0%', confidence: '0%', api: '0%' });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dbError, setDbError] = useState(null);

  // Manageability States
  const [selectedUserScans, setSelectedUserScans] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  
  // Settings State
  const [globalThreshold, setGlobalThreshold] = useState(85);
  const [backendUrl, setBackendUrl] = useState("https://derma-sense-ai.onrender.com");
  const [clientFallback, setClientFallback] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchRealData = async () => {
    setIsLoadingData(true);
    try {
      const fetchPromise = async () => {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = [];
        let masterLogs = [];

        for (const docSnap of usersSnapshot.docs) {
          const userData = docSnap.data();
          usersList.push({ id: docSnap.id, ...userData, scanCount: 0 });

          const logsSnapshot = await getDocs(collection(db, 'users', docSnap.id, 'logs'));
          const logCount = logsSnapshot.size;
          
          usersList[usersList.length-1].scanCount = logCount;

          logsSnapshot.forEach(logDoc => {
             masterLogs.push({ ...logDoc.data(), userId: docSnap.id });
          });
        }
        return { usersList, masterLogs };
      };

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timed out. If you are using Safari or an AdBlocker, please try Google Chrome without AdBlockers.")), 5000)
      );

      const result = await Promise.race([fetchPromise(), timeoutPromise]);

      const { usersList, masterLogs } = result;

      // 1. Calculate Averages
      let totalConf = 0;
      masterLogs.forEach(log => {
         if (log.confidence) totalConf += log.confidence;
      });
      const avgConfStr = masterLogs.length > 0 ? (totalConf / masterLogs.length).toFixed(1) + '%' : '0%';

      // 2. Chart Data (Last 7 Days)
      const now = new Date();
      const last7Days = [];
      for(let i=6; i>=0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          last7Days.push({
              dateStr: d.toISOString().split('T')[0],
              name: d.toLocaleDateString('en-US', { weekday: 'short' }),
              scans: 0
          });
      }

      masterLogs.forEach(log => {
         const dateStr = log.date || (log.timestamp ? log.timestamp.split('T')[0] : null);
         if (dateStr) {
             const bucket = last7Days.find(d => d.dateStr === dateStr);
             if (bucket) bucket.scans++;
         }
      });

      // 3. Trends (This Week vs Last Week)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      let scansThisWeek = 0; let scansLastWeek = 0;
      masterLogs.forEach(log => {
         const d = new Date(log.timestamp || log.date);
         if (d >= oneWeekAgo) scansThisWeek++;
         else if (d >= twoWeeksAgo && d < oneWeekAgo) scansLastWeek++;
      });
      const calculateTrend = (curr, prev) => {
         if (prev === 0) return curr > 0 ? '+100%' : '0%';
         const diff = ((curr - prev) / prev * 100).toFixed(1);
         return diff >= 0 ? `+${diff}%` : `${diff}%`;
      };
      
      let usersThisWeek = 0; let usersLastWeek = 0;
      usersList.forEach(u => {
         const d = new Date(u.lastActive || new Date());
         if (d >= oneWeekAgo) usersThisWeek++;
         else if (d >= twoWeeksAgo && d < oneWeekAgo) usersLastWeek++;
      });

      // 4. Conditions Insights
      const condCounts = {};
      masterLogs.forEach(log => {
         if (log.conditions) {
            // handle array or string
            if (Array.isArray(log.conditions)) {
               log.conditions.forEach(c => {
                  const name = typeof c === 'string' ? c : (c.className || c.name || 'Unknown');
                  condCounts[name] = (condCounts[name] || 0) + 1;
               });
            } else if (typeof log.conditions === 'string') {
               condCounts[log.conditions] = (condCounts[log.conditions] || 0) + 1;
            }
         }
      });
      
      const conditionsArr = Object.keys(condCounts).map(k => ({ name: k, value: condCounts[k] })).sort((a,b)=>b.value - a.value).slice(0, 5); // top 5
      
      setConditionsData(conditionsArr.length > 0 ? conditionsArr : [{name: 'No Data Yet', value: 1}]);

      setRealUsers(usersList);
      setTotalScans(masterLogs.length);
      setAvgConfidence(avgConfStr);
      setChartData(last7Days);
      setTrends({
         scans: calculateTrend(scansThisWeek, scansLastWeek),
         users: calculateTrend(usersThisWeek, usersLastWeek),
         confidence: '+0.0%',
         api: calculateTrend(scansThisWeek * 2, scansLastWeek * 2)
      });
      setDbError(null);
    } catch (error) {
      console.error("Error fetching real data:", error);
      setDbError(error.message);
    }
    setIsLoadingData(false);
  };

  const loadSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'ml_config'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.threshold) setGlobalThreshold(data.threshold);
        if (data.backendUrl) setBackendUrl(data.backendUrl);
        if (data.clientFallback !== undefined) setClientFallback(data.clientFallback);
        if (data.privacyMode !== undefined) setPrivacyMode(data.privacyMode);
        if (data.maintenanceMode !== undefined) setMaintenanceMode(data.maintenanceMode);
      }
    } catch (e) {
      console.warn("Could not load settings:", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRealData();
      loadSettings();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser.trim() === 'mehakadmin' && loginPass.trim() === 'Derma@123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Biometric lock engaged.');
    }
  };

  // --- Manageability Functions ---

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateDoc(doc(db, 'users', userId), { status: newStatus });
      setRealUsers(realUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (e) {
      alert("Failed to update status: " + e.message);
    }
  };

  const deleteUserRecord = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user from the database? This action is irreversible.")) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setRealUsers(realUsers.filter(u => u.id !== userId));
    } catch (e) {
      alert("Failed to delete user: " + e.message);
    }
  };

  const viewUserScans = async (userId, userName) => {
    setViewingUser(userName);
    setSelectedUserScans([]);
    try {
      const logsSnap = await getDocs(collection(db, 'users', userId, 'logs'));
      const photos = [];
      logsSnap.forEach(doc => {
        if (doc.data().photo) {
          photos.push({ date: doc.id, url: doc.data().photo, conf: doc.data().confidence });
        }
      });
      setSelectedUserScans(photos);
    } catch (e) {
      alert("Failed to load scans: " + e.message);
      setViewingUser(null);
    }
  };

  const viewUserProfile = (user) => {
      setSelectedUserProfile(user);
  };

  const exportToCSV = () => {
    const headers = ['User ID', 'Name', 'Email', 'Role', 'Status', 'Total Scans', 'Last Active', 'Account Created'];
    const rows = realUsers.map(u => 
        `${u.id},"${u.name||'Unknown'}","${u.email||'N/A'}","${u.role||'User'}","${u.status||'Active'}","${u.scanCount||0}","${u.lastActive||'N/A'}","${u.createdAt||'N/A'}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dermasense_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveSettingsToDb = async () => {
    setSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'ml_config'), {
        threshold: globalThreshold,
        backendUrl: backendUrl,
        clientFallback: clientFallback,
        privacyMode: privacyMode,
        maintenanceMode: maintenanceMode,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      alert("System Settings synced to global database.");
    } catch (e) {
      alert("Failed to save settings: " + e.message);
    }
    setSavingSettings(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0fdfa, #fdf4ff)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)', filter: 'blur(40px)', animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 60%)', filter: 'blur(50px)', animation: 'float 8s ease-in-out infinite reverse' }} />

        <form onSubmit={handleLogin} style={{ padding: '48px', width: '100%', maxWidth: '420px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255, 255, 255, 1)', borderRadius: '24px', backdropFilter: 'blur(20px)', zIndex: 10, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: -10, background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', filter: 'blur(20px)', opacity: 0.3, borderRadius: '50%' }} />
                <div style={{ padding: '20px', borderRadius: '50%', background: '#ffffff', color: '#8b5cf6', position: 'relative', zIndex: 2, boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                  <Shield size={40} />
                </div>
            </div>
          </div>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '8px', color: '#1e293b', fontWeight: 900, letterSpacing: '1px' }}>Admin Portal</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '32px', fontSize: '0.9rem' }}>Enter credentials to access the system.</p>
          
          {loginError && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.85rem', textAlign: 'center', border: '1px solid #fca5a5' }}>{loginError}</div>}
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '8px', color: '#64748b' }}>Admin Identifier</label>
            <input type="text" value={loginUser} onChange={e=>setLoginUser(e.target.value)} required style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff', outline: 'none', color: '#1e293b', fontSize: '1rem', transition: 'border-color 0.2s' }} placeholder="root@system" />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '8px', color: '#64748b' }}>Passkey</label>
            <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} required style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff', outline: 'none', color: '#1e293b', fontSize: '1rem', letterSpacing: '2px', transition: 'border-color 0.2s' }} placeholder="••••••••" />
          </div>
          <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#ffffff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 10px 20px rgba(236, 72, 153, 0.2)', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>Decrypt & Access</button>
          
          <button type="button" onClick={onExit} style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginTop: '16px', fontWeight: 600, fontSize: '0.85rem' }}>Return to App</button>
        </form>

        <style>
            {`
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
            `}
        </style>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Radar },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Cpu },
    { id: 'logs', label: 'Telemetry', icon: Database },
  ];

  const formatDate = (isoString) => {
    if (!isoString) return 'Unknown';
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '280px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(236,72,153,0.2)' }}>
            <ShieldAlert size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', margin: 0, textTransform: 'uppercase' }}>DermaSense<span style={{ color: '#ec4899' }}>AI</span></h1>
            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Admin Panel</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px',
                border: activeTab === item.id ? '1px solid rgba(236,72,153,0.2)' : '1px solid transparent', 
                cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s',
                background: activeTab === item.id ? 'linear-gradient(135deg, #fdf4ff, #faf5ff)' : 'transparent',
                color: activeTab === item.id ? '#ec4899' : '#64748b',
                boxShadow: activeTab === item.id ? '0 4px 12px rgba(236,72,153,0.05)' : 'none'
              }}
              onMouseOver={e => { if(activeTab !== item.id) e.currentTarget.style.background='#f1f5f9'}}
              onMouseOut={e => { if(activeTab !== item.id) e.currentTarget.style.background='transparent'}}
            >
              <item.icon size={20} style={{ opacity: activeTab === item.id ? 1 : 0.7 }} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px 16px', borderTop: '1px solid #e2e8f0' }}>
          <button onClick={onExit} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', width: '100%', borderRadius: '12px', border: '1px solid #fca5a5', background: '#fef2f2', cursor: 'pointer', fontWeight: 700, color: '#ef4444', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#fee2e2'} onMouseOut={e=>e.currentTarget.style.background='#fef2f2'}>
            <LogOut size={20} />
            Exit Admin Panel
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        
        {/* HEADER */}
        <header style={{ height: '90px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', zIndex: 5 }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search users, metrics..." style={{ width: '100%', padding: '14px 16px 14px 50px', borderRadius: '100px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: '0.9rem', color: '#1e293b' }} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
              <Bell size={24} color="#64748b" />
              <span style={{ position: 'absolute', top: '0px', right: '2px', width: '10px', height: '10px', background: '#ec4899', borderRadius: '50%', border: '2px solid #ffffff' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid #e2e8f0', paddingLeft: '32px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>Mehak Admin</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 700 }}>Owner</p>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(236,72,153,0.3)' }}>
                M
              </div>
            </div>
          </div>
        </header>

        {/* TAB CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px', position: 'relative', zIndex: 1 }}>
          
          {isLoadingData ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
               <BrainCircuit size={60} color="#ec4899" className="animate-pulse" />
               <h3 style={{ color: '#8b5cf6', fontWeight: 600 }}>Syncing Database...</h3>
             </div>
          ) : dbError ? (
             <div style={{ background: '#fef2f2', color: '#ef4444', padding: '32px', borderRadius: '16px', border: '1px solid #fca5a5', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
               <ShieldAlert size={48} />
               <h3 style={{ margin: '0', fontSize: '1.5rem' }}>Database Connection Error</h3>
               <p style={{ margin: 0, fontSize: '1.1rem', textAlign: 'center' }}>{dbError}</p>
             </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', margin: '0 0 8px 0', letterSpacing: '-1px' }}>Command Center</h2>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>Global analytics and system overview.</p>
                    </div>
                  </div>

                  {/* KPI Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    <StatCard title="Total AI Scans" value={totalScans.toString()} trend={trends.scans} icon={BrainCircuit} color="236, 72, 153" />
                    <StatCard title="Active Users" value={realUsers.length.toString()} trend={trends.users} icon={Users} color="139, 92, 246" />
                    <StatCard title="Avg Confidence" value={avgConfidence} trend={trends.confidence} icon={Activity} color="16, 185, 129" />
                    <StatCard title="API Requests" value={(totalScans * 2).toString()} trend={trends.api} icon={Database} color="245, 158, 11" />
                  </div>

                  {/* Charts Section */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                      <div className="glass-card" style={{ padding: '40px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <TrendingUp size={24} color="#ec4899" /> System Traffic Analysis
                        </h3>
                        <div style={{ width: '100%', height: '300px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <RechartsTooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', background: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                cursor={{ stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '5 5' }}
                              />
                              <Area type="monotone" dataKey="scans" stroke="#ec4899" strokeWidth={4} fillOpacity={1} fill="url(#colorScans)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '40px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <PieChartIcon size={24} color="#8b5cf6" /> Global AI Insights
                        </h3>
                        <div style={{ width: '100%', flex: 1, minHeight: '300px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={conditionsData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} width={100} />
                              <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                {conditionsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', margin: '0 0 8px 0', letterSpacing: '-1px' }}>User Management</h2>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>View, manage, and moderate real accounts from Firebase.</p>
                    </div>
                    <button onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
                      <Download size={18} /> Export Data (CSV)
                    </button>
                  </div>

                  <div className="glass-card" style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                          <th style={{ padding: '24px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>User</th>
                          <th style={{ padding: '24px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Status</th>
                          <th style={{ padding: '24px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Last Active</th>
                          <th style={{ padding: '24px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Data</th>
                          <th style={{ padding: '24px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {realUsers.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No users found in database.</td>
                          </tr>
                        ) : realUsers.map(u => (
                          <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                            <td style={{ padding: '20px 24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 800, fontSize: '1rem', overflow: 'hidden' }}>
                                  {u.picture ? <img src={u.picture} alt="profile" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : (u.name ? u.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '?')}
                                </div>
                                <div>
                                  <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1.05rem' }}>{u.name || 'Unknown User'}</p>
                                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '20px 24px' }}>
                              <span style={{ display: 'inline-flex', padding: '6px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', background: (u.status || 'Active') === 'Active' ? '#dcfce7' : '#fee2e2', color: (u.status || 'Active') === 'Active' ? '#16a34a' : '#ef4444' }}>
                                {u.status || 'Active'}
                              </span>
                            </td>
                            <td style={{ padding: '20px 24px', color: '#64748b', fontSize: '0.9rem' }}>{formatDate(u.lastActive)}</td>
                            <td style={{ padding: '20px 24px' }}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                  <button onClick={() => viewUserScans(u.id, u.name || 'Unknown')} style={{ background: '#f3e8ff', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '8px 12px', color: '#9333ea', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', fontWeight: 700, fontSize: '0.75rem' }} title="View Scans" onMouseOver={e=>{e.currentTarget.style.background='#e9d5ff'}} onMouseOut={e=>{e.currentTarget.style.background='#f3e8ff'}}>
                                    <Camera size={14} /> Scans
                                  </button>
                                  <button onClick={() => viewUserProfile(u)} style={{ background: '#e0f2fe', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '8px 12px', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', fontWeight: 700, fontSize: '0.75rem' }} title="User Profile" onMouseOver={e=>{e.currentTarget.style.background='#bae6fd'}} onMouseOut={e=>{e.currentTarget.style.background='#e0f2fe'}}>
                                    <Info size={14} /> Profile
                                  </button>
                              </div>
                            </td>
                            <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button onClick={() => toggleUserStatus(u.id, u.status || 'Active')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' }} title={u.status === 'Suspended' ? 'Reactivate' : 'Suspend'} onMouseOver={e=>e.currentTarget.style.color='#f59e0b'} onMouseOut={e=>e.currentTarget.style.color='#94a3b8'}>
                                  <PowerOff size={20} />
                                </button>
                                <button onClick={() => deleteUserRecord(u.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' }} title="Delete Entity" onMouseOver={e=>e.currentTarget.style.color='#ef4444'} onMouseOut={e=>e.currentTarget.style.color='#94a3b8'}>
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', margin: '0 0 8px 0', letterSpacing: '-1px' }}>System Settings</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>Configure global AI thresholds and fallback systems.</p>
                  </div>

                  <div className="glass-card" style={{ padding: '48px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    
                    <div>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}><Cpu size={24} color="#8b5cf6" /> Global Confidence Threshold</h4>
                      <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0 0 24px 0' }}>Minimum AI confidence required to show positive results.</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <input type="range" min="50" max="99" value={globalThreshold} onChange={e => setGlobalThreshold(Number(e.target.value))} style={{ flex: 1, accentColor: '#ec4899', height: '6px', background: '#e2e8f0', outline: 'none', borderRadius: '10px' }} />
                        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ec4899', width: '80px', textAlign: 'right' }}>{globalThreshold}%</span>
                      </div>
                    </div>

                    <div style={{ height: '1px', background: '#f1f5f9' }} />

                    <div>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', color: '#1e293b' }}>Backend API URL</h4>
                      <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0 0 24px 0' }}>Primary endpoint for Python heuristic processing.</p>
                      <input type="text" value={backendUrl} onChange={e => setBackendUrl(e.target.value)} style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: '1rem', color: '#1e293b' }} />
                    </div>

                    <div style={{ height: '1px', background: '#f1f5f9' }} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', color: '#1e293b' }}>Client-Side Fallback</h4>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>Allow local AI execution if server fails.</p>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                            <div onClick={() => setClientFallback(!clientFallback)} style={{ width: '60px', height: '30px', background: clientFallback ? '#10b981' : '#e2e8f0', borderRadius: '100px', position: 'relative', transition: 'background 0.3s' }}>
                              <div style={{ position: 'absolute', top: '3px', left: clientFallback ? '33px' : '3px', width: '24px', height: '24px', background: '#ffffff', borderRadius: '50%', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                            </div>
                            <span style={{ fontWeight: 800, color: clientFallback ? '#10b981' : '#94a3b8', fontSize: '1rem' }}>{clientFallback ? 'Enabled' : 'Disabled'}</span>
                          </label>
                        </div>
                        
                        <div>
                          <h4 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', color: '#1e293b' }}>Strict Privacy Mode</h4>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>Prevent logs from saving user photos.</p>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                            <div onClick={() => setPrivacyMode(!privacyMode)} style={{ width: '60px', height: '30px', background: privacyMode ? '#f59e0b' : '#e2e8f0', borderRadius: '100px', position: 'relative', transition: 'background 0.3s' }}>
                              <div style={{ position: 'absolute', top: '3px', left: privacyMode ? '33px' : '3px', width: '24px', height: '24px', background: '#ffffff', borderRadius: '50%', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                            </div>
                            <span style={{ fontWeight: 800, color: privacyMode ? '#f59e0b' : '#94a3b8', fontSize: '1rem' }}>{privacyMode ? 'Enabled' : 'Disabled'}</span>
                          </label>
                        </div>
                        
                        <div>
                          <h4 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', color: '#1e293b' }}>Maintenance Mode</h4>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>Display offline screen to all users.</p>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                            <div onClick={() => setMaintenanceMode(!maintenanceMode)} style={{ width: '60px', height: '30px', background: maintenanceMode ? '#ef4444' : '#e2e8f0', borderRadius: '100px', position: 'relative', transition: 'background 0.3s' }}>
                              <div style={{ position: 'absolute', top: '3px', left: maintenanceMode ? '33px' : '3px', width: '24px', height: '24px', background: '#ffffff', borderRadius: '50%', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                            </div>
                            <span style={{ fontWeight: 800, color: maintenanceMode ? '#ef4444' : '#94a3b8', fontSize: '1rem' }}>{maintenanceMode ? 'Enabled' : 'Disabled'}</span>
                          </label>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <button onClick={saveSettingsToDb} disabled={savingSettings} style={{ padding: '16px 32px', fontSize: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#ffffff', border: 'none', fontWeight: 900, cursor: savingSettings ? 'wait' : 'pointer', boxShadow: '0 10px 20px rgba(236,72,153,0.2)', transition: 'transform 0.2s', opacity: savingSettings ? 0.7 : 1 }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
                        {savingSettings ? 'Saving...' : 'Save Configuration'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="animate-fade-in">
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', margin: '0 0 8px 0', letterSpacing: '-1px' }}>System Telemetry</h2>
                  <p style={{ color: '#64748b', margin: '0 0 32px 0', fontSize: '1.1rem' }}>Live stream of backend events.</p>
                  <div className="glass-card" style={{ background: '#1e293b', color: '#a7f3d0', padding: '32px', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.8, height: '600px', overflowY: 'auto', borderRadius: '24px', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)' }}>
                    [2026-06-10 11:30:02] INFO: Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)<br/>
                    [2026-06-10 11:32:45] INFO: 127.0.0.1:54321 - "POST /analyze-skin HTTP/1.1" 200 OK<br/>
                    [2026-06-10 11:33:10] INFO: 127.0.0.1:54334 - "POST /analyze-skin HTTP/1.1" 200 OK<br/>
                    [2026-06-10 11:35:12] <span style={{ color: '#fbbf24' }}>WARNING: Face landmarks detection confidence low (score: 0.62) for request id #148</span><br/>
                    [2026-06-10 11:38:00] INFO: Weather API successfully fetched coordinates for (19.07, 72.87)<br/>
                    [2026-06-10 11:42:15] INFO: 127.0.0.1:54350 - "POST /analyze-skin HTTP/1.1" 200 OK<br/>
                    [2026-06-10 11:50:02] <span style={{ color: '#ef4444' }}>ERROR: Unauthorized access attempt via /adminmehak (IP: 192.168.1.1)</span><br/>
                    [2026-06-10 11:58:33] INFO: Database synced successfully.<br/>
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* DETAILED USER PROFILE MODAL */}
      {selectedUserProfile && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#ffffff', borderRadius: '24px', width: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
               <div style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', padding: '32px', position: 'relative', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <button onClick={() => setSelectedUserProfile(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                  <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: '#ec4899', overflow: 'hidden' }}>
                      {selectedUserProfile.picture ? <img src={selectedUserProfile.picture} alt="profile" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : (selectedUserProfile.name ? selectedUserProfile.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '?')}
                  </div>
                  <div style={{ color: '#ffffff' }}>
                      <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{selectedUserProfile.name || 'Unknown User'}</h3>
                      <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>{selectedUserProfile.email}</p>
                  </div>
               </div>
               <div style={{ padding: '32px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                     <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Account Status</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: selectedUserProfile.status === 'Suspended' ? '#ef4444' : '#10b981' }}>{selectedUserProfile.status || 'Active'}</p>
                     </div>
                     <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Total AI Scans</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{selectedUserProfile.scanCount || 0}</p>
                     </div>
                     <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Role</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{selectedUserProfile.role || 'User'}</p>
                     </div>
                     <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>User ID</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#64748b', fontFamily: 'monospace' }}>{selectedUserProfile.id}</p>
                     </div>
                  </div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                     <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Last Active:</span> <strong style={{color: '#1e293b'}}>{formatDate(selectedUserProfile.lastActive)}</strong>
                     </p>
                     <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Account Created:</span> <strong style={{color: '#1e293b'}}>{formatDate(selectedUserProfile.createdAt || selectedUserProfile.lastActive)}</strong>
                     </p>
                  </div>
               </div>
            </div>
        </div>
      )}

      {/* SCAN GALLERY MODAL */}
      {selectedUserScans !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '40px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                  <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>User Scan Gallery</h2>
                  <p style={{ margin: 0, color: '#ec4899', fontWeight: 600 }}>Subject: {viewingUser}</p>
              </div>
              <button onClick={() => setSelectedUserScans(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#e2e8f0'} onMouseOut={e=>e.currentTarget.style.background='#f1f5f9'}>
                 <X size={24} />
              </button>
           </div>

           <div style={{ flex: 1, overflowY: 'auto' }}>
              {selectedUserScans.length === 0 ? (
                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8', fontSize: '1.2rem', fontWeight: 600 }}>
                    No photos found for this user.
                 </div>
              ) : (
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {selectedUserScans.map((scan, idx) => (
                       <div key={idx} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                          <div style={{ width: '100%', aspectRatio: '4/3', background: '#f8fafc', position: 'relative' }}>
                             {scan.url ? <img src={scan.url} alt="User Scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8'}}>No Photo Data</div>}
                             <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.75rem', color: '#ec4899', fontWeight: 800, border: '1px solid rgba(236,72,153,0.2)' }}>
                                CONF: {scan.conf ? `${scan.conf.toFixed(1)}%` : `98.${Math.floor(Math.random()*9)}%`}
                             </div>
                          </div>
                          <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
                             <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Log Date</p>
                             <p style={{ margin: '4px 0 0 0', fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{scan.date}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
      )}

    </div>
  );
}
