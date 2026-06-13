import React from 'react';
import { Home, Camera, ActivitySquare, User, LayoutDashboard } from 'lucide-react';

function BottomNav({ currentView, setCurrentView, user }) {
  const navItems = [
    { id: 'landing', icon: Home, label: 'Home' },
    { id: 'facescan', icon: Camera, label: 'Scan' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Results', hidden: !user },
    { id: 'progress', icon: ActivitySquare, label: 'Progress', hidden: !user },
    { id: 'signin', icon: User, label: 'Profile' },
  ];

  // If user is logged in, replace signin with admin/profile based on role
  if (user) {
    const profileIndex = navItems.findIndex(i => i.id === 'signin');
    if (profileIndex !== -1) {
      if (user.role === 'Admin') {
        navItems[profileIndex] = { id: 'admin', icon: User, label: 'Admin' };
      } else {
         // Could go to a profile view, or sign out. Let's make it sign in view which we can adapt or just landing for signout.
         // Wait, we don't have a specific profile view. Let's just point it to 'landing' but handle signout in the app or a modal.
         navItems[profileIndex] = { id: 'landing', icon: User, label: 'Profile', onClick: () => alert('Profile options here') };
      }
    }
  }

  const handleNavClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else {
      setCurrentView(item.id);
    }
  };

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
