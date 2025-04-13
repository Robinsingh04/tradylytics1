import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useTheme } from '../../hooks/useTheme';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isDarkTheme, toggleTheme, themeColor, setThemeColor } = useTheme();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleSidebarExpand = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  return (
    <div className={`app-layout ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <Navbar 
        toggleTheme={toggleTheme} 
        isDarkTheme={isDarkTheme} 
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        sidebarExpanded={sidebarExpanded}
      />
      <Sidebar onExpandChange={handleSidebarExpand} />
      <div className={`main-content ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
        {children}
      </div>
    </div>
  );
}; 