import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Tooltip } from '@mui/material';
import Icon from '@mui/material/Icon';
import styles from '../../styles/components/Sidebar.module.scss';

interface SidebarItemProps {
  icon: string;
  label: string;
  to: string;
  isActive?: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon, label, to, isActive = false, collapsed }: SidebarItemProps) => {
  return (
    <Link href={to}>
      <Box 
        component="a" 
        className={`${styles.sidebarItem} ${isActive ? styles.active : ''}`}
        sx={{ textDecoration: 'none' }}
      >
        <Box className={styles.icon}>
          <Icon>{icon}</Icon>
        </Box>
        <Typography
          component="span"
          className={`${styles.label} ${collapsed ? styles.hidden : ''}`}
        >
          {label}
        </Typography>
        {collapsed && (
          <Tooltip 
            title={label} 
            placement="right"
            arrow
          >
            <Box className={styles.tooltip}>{label}</Box>
          </Tooltip>
        )}
      </Box>
    </Link>
  );
};

interface SidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

export const Sidebar = ({ onExpandChange }: SidebarProps) => {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
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

  // Notify parent when collapsed state changes
  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(!collapsed);
    }
  }, [collapsed, onExpandChange]);

  return (
    <Box 
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <Box className={styles.sidebarHeader}>
        <Box className={styles.logoIcon}>TL</Box>
        <Typography 
          className={`${styles.logoText} ${collapsed ? styles.hidden : ''}`}
          variant="h6"
        >
          TradyLytics
        </Typography>
      </Box>
      
      <List className={styles.sidebarMenu} component="nav">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.id}
            icon={item.icon}
            label={item.label}
            to={item.path}
            isActive={location === item.path || (location === '/' && item.path === '/dashboard')}
            collapsed={collapsed}
          />
        ))}
      </List>
    </Box>
  );
}; 