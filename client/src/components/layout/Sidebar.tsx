import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';

interface SidebarItemProps {
  icon: string;
  label: string;
  to: string;
  isActive?: boolean;
  expanded: boolean;
}

const SidebarItem = ({ icon, label, to, isActive = false, expanded }: SidebarItemProps) => {
  return (
    <Link href={to}>
      <a className={`sidebar-item ${isActive ? 'active' : ''}`}>
        <div className="icon">
          <span className="material-icons">{icon}</span>
        </div>
        <span className={`label ${expanded ? 'expanded' : ''}`}>{label}</span>
        {!expanded && <div className="sidebar-tooltip">{label}</div>}
      </a>
    </Link>
  );
};

interface SidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

export const Sidebar = ({ onExpandChange }: SidebarProps) => {
  const [location] = useLocation();
  const [expanded, setExpanded] = useState(false);
  
  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'calendar', icon: 'calendar_today', label: 'Journaling Calendar', path: '/calendar' },
    { id: 'history', icon: 'history', label: 'Trade History', path: '/history' },
    { id: 'reports', icon: 'assessment', label: 'Reports Page', path: '/reports' },
    { id: 'strategies', icon: 'psychology', label: 'Strategies Page', path: '/strategies' },
    { id: 'simulator', icon: 'trending_up', label: 'Trading Simulator', path: '/simulator' },
    { id: 'education', icon: 'school', label: 'Education Section', path: '/education' },
    { id: 'support', icon: 'support_agent', label: 'Support Center', path: '/support' },
  ];

  // Notify parent when expanded state changes
  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(expanded);
    }
  }, [expanded, onExpandChange]);

  return (
    <div 
      className={`sidebar ${expanded ? 'expanded' : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="sidebar-header">
        <div className="logo-icon">TL</div>
        <span className={`logo-text ${expanded ? 'expanded' : ''}`}>TradyLytics</span>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.id}
            icon={item.icon}
            label={item.label}
            to={item.path}
            isActive={location === item.path || (location === '/' && item.path === '/dashboard')}
            expanded={expanded}
          />
        ))}
      </div>
    </div>
  );
}; 