import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import styles from '../../styles/components/AppLayout.module.scss';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleSidebarExpand = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  return (
    <Box className={styles.appLayout}>
      <Navbar sidebarExpanded={sidebarExpanded} />
      <Sidebar onExpandChange={handleSidebarExpand} />
      <Box 
        className={`${styles.mainContent} ${!sidebarExpanded ? styles.sidebarCollapsed : ''}`}
        component="main"
      >
        {children}
      </Box>
    </Box>
  );
}; 