import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkTheme: boolean;
  themeColor: string;
  setThemeColor: (color: string) => void;
  sidebarExpanded?: boolean;
}

export const Navbar = ({ 
  toggleTheme, 
  isDarkTheme, 
  themeColor,
  setThemeColor,
  sidebarExpanded = false 
}: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const handleMouseEnter = (menuType: 'dropdown' | 'user' | 'notifications') => {
    if (menuType === 'dropdown') {
      setIsDropdownOpen(true);
    } else if (menuType === 'user') {
      setIsUserMenuOpen(true);
    } else if (menuType === 'notifications') {
      setIsNotificationsOpen(true);
    }
  };
  
  const handleMouseLeave = (menuType: 'dropdown' | 'user' | 'notifications') => {
    if (menuType === 'dropdown') {
      setIsDropdownOpen(false);
    } else if (menuType === 'user') {
      setIsUserMenuOpen(false);
    } else if (menuType === 'notifications') {
      setIsNotificationsOpen(false);
    }
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const predefinedColors = [
    '#3f51b5', // Indigo
    '#2196f3', // Blue
    '#009688', // Teal
    '#4caf50', // Green
    '#8bc34a', // Light Green
    '#cddc39', // Lime
    '#ffc107', // Amber
    '#ff9800', // Orange
    '#ff5722', // Deep Orange
    '#f44336', // Red
    '#e91e63', // Pink
    '#9c27b0', // Purple
    '#673ab7'  // Deep Purple
  ];

  const handleColorChange = (color: string) => {
    setThemeColor(color);
    setShowColorPicker(false);
  };

  // Sample notification data
  const notifications = [
    {
      id: 1,
      title: 'Trade Completed',
      message: 'Your AAPL trade has been successfully completed.',
      time: '2 mins ago',
      read: false
    },
    {
      id: 2,
      title: 'Market Alert',
      message: 'Unusual volume detected in TSLA stock.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Account Update',
      message: 'Your account has been credited with $500.',
      time: '3 hours ago',
      read: true
    }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-start">
        <Link href="/">
          <a className="navbar-logo">
            <span className="greeting">
              Hi, User
            </span>
          </a>
        </Link>
      </div>
      
      <div className="navbar-center">
        <div className="search-container">
          <div className="search-wrapper">
            <span className="material-icons search-icon">search</span>
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input" 
            />
          </div>
        </div>
      </div>
      
      <div className="navbar-end">
        <div 
          className="dropdown-container"
          onMouseEnter={() => handleMouseEnter('dropdown')}
          onMouseLeave={() => handleMouseLeave('dropdown')}
        >
          <button className="market-dropdown">
            Market
            <span className="material-icons dropdown-icon">arrow_drop_down</span>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <a href="#" className="dropdown-item">Stocks</a>
              <a href="#" className="dropdown-item">Forex</a>
              <a href="#" className="dropdown-item">Crypto</a>
              <a href="#" className="dropdown-item">Commodities</a>
            </div>
          )}
        </div>

        <div 
          className="notification-container"
          onMouseEnter={() => handleMouseEnter('notifications')}
          onMouseLeave={() => handleMouseLeave('notifications')}
        >
          <span className="material-icons notification-icon">notifications</span>
          <span className="notification-badge">3</span>
          
          {isNotificationsOpen && (
            <div className="notification-menu">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button className="mark-all-read">Mark all as read</button>
              </div>
              <div className="notification-list">
                {notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                    {!notification.read && <div className="unread-indicator"></div>}
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <a href="#" className="view-all">View all notifications</a>
              </div>
            </div>
          )}
        </div>
        
        <div 
          className="user-container"
          onMouseEnter={() => handleMouseEnter('user')}
          onMouseLeave={() => handleMouseLeave('user')}
        >
          <div className="user-avatar">
            <span>U</span>
          </div>
          
          {isUserMenuOpen && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-info">
                  <span className="user-name">User</span>
                  <span className="user-email">user@example.com</span>
                </div>
              </div>
              <div className="user-menu-items">
                <a href="#" className="user-menu-item">
                  <span className="material-icons">account_circle</span>
                  Profile
                </a>
                <a href="#" className="user-menu-item">
                  <span className="material-icons">settings</span>
                  Settings
                </a>
                <div className="theme-toggle-container">
                  <span className="theme-label">Theme:</span>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={isDarkTheme}
                      onChange={toggleTheme}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="theme-value">{isDarkTheme ? 'Dark' : 'Light'}</span>
                </div>
                
                {/* Theme Color Selector */}
                <div className="theme-color-container">
                  <span className="theme-label">Theme Color:</span>
                  <div 
                    className="selected-color"
                    style={{ backgroundColor: themeColor }}
                    onClick={toggleColorPicker}
                  ></div>
                  
                  {showColorPicker && (
                    <div className="color-picker-menu">
                      <div className="color-options">
                        {predefinedColors.map((color, index) => (
                          <div 
                            key={index}
                            className="color-option"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                          ></div>
                        ))}
                      </div>
                      <div className="custom-color">
                        <input 
                          type="color" 
                          value={themeColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                        />
                        <span>Custom</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <a href="#" className="user-menu-item">
                  <span className="material-icons">logout</span>
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}; 