import React from 'react';
import { Home, Camera, ActivitySquare, User, LayoutDashboard } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function BottomNav({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentView = location.pathname;

  const navItems = [
    { id: '/dashboard', icon: LayoutDashboard, label: 'Results', hidden: !user },
    { id: '/facescan', icon: Camera, label: 'Scan', hidden: !user },
    { id: '/progress', icon: ActivitySquare, label: 'Progress', hidden: !user },
    { id: '/profile', icon: User, label: 'Profile', hidden: !user },
  ];

  // If user is admin, allow admin route
  if (user && user.role === 'Admin') {
    const profileIndex = navItems.findIndex(i => i.id === '/profile');
    if (profileIndex !== -1) {
      navItems[profileIndex] = { id: '/adminmehak', icon: User, label: 'Admin', hidden: false };
    }
  }

  const handleNavClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else {
      navigate(item.id);
    }
  };

  // Do not show bottom nav on login page or if not logged in
  if (!user || currentView === '/login' || currentView === '/') {
    return null;
  }

  return (
    <div className="mobile-bottom-nav">
      {navItems.filter(item => !item.hidden).map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <div 
            key={item.id} 
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
          >
            <div className="bottom-nav-icon">
              <Icon size={24} />
            </div>
            <span className="bottom-nav-label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default BottomNav;
