import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { 
  Box, 
  Typography, 
  InputBase, 
  Badge, 
  Button, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider, 
  ListItemIcon, 
  Switch,
  Tooltip,
  Paper,
  Popper
} from '@mui/material';
import Icon from '@mui/material/Icon';
import styles from '../../styles/components/Navbar.module.scss';
import { useTheme } from '../../theme/ThemeProvider';

interface NavbarProps {
  sidebarExpanded?: boolean;
}

export const Navbar = ({ sidebarExpanded = false }: NavbarProps) => {
  const { themeMode, themeColor, toggleTheme, setThemeColor } = useTheme();
  const [marketAnchorEl, setMarketAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState<null | HTMLElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorPickerHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isDarkTheme = themeMode === 'dark';
  
  useEffect(() => {
    if (!Boolean(userAnchorEl)) {
      setShowColorPicker(false);
    }
  }, [userAnchorEl]);
  
  const handleMarketClick = (event: React.MouseEvent<HTMLElement>) => {
    setMarketAnchorEl(marketAnchorEl ? null : event.currentTarget);
  };
  
  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(notificationsAnchorEl ? null : event.currentTarget);
  };
  
  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(userAnchorEl ? null : event.currentTarget);
  };
  
  const handleCloseMarketMenu = () => {
    setMarketAnchorEl(null);
  };
  
  const handleCloseNotificationsMenu = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleCloseUserMenu = () => {
    setUserAnchorEl(null);
  };

  const toggleColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    setColorPickerAnchorEl(event.currentTarget);
    setShowColorPicker(!showColorPicker);
  };

  const handleMenuItemMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (!showColorPicker) {
      setColorPickerAnchorEl(event.currentTarget);
      setShowColorPicker(true);
    }
    
    if (colorPickerHoverTimeoutRef.current) {
      clearTimeout(colorPickerHoverTimeoutRef.current);
      colorPickerHoverTimeoutRef.current = null;
    }
  };

  const handleColorChange = (color: string) => {
    setThemeColor(color);
  };

  const handleColorPickerMouseEnter = () => {
    if (colorPickerHoverTimeoutRef.current) {
      clearTimeout(colorPickerHoverTimeoutRef.current);
      colorPickerHoverTimeoutRef.current = null;
    }
  };

  const handleColorPickerMouseLeave = () => {
    colorPickerHoverTimeoutRef.current = setTimeout(() => {
      setShowColorPicker(false);
    }, 300);
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
    <Box 
      className={`${styles.navbar} ${!sidebarExpanded ? styles.sidebarCollapsed : ''}`}
      component="nav"
    >
      <Box className={styles.navbarStart}>
        <Link href="/">
          <Box 
            component="a" 
            className={styles.navbarLogo}
          >
            <Typography 
              component="span" 
              className={styles.greeting}
            >
              Hi, User
            </Typography>
          </Box>
        </Link>
      </Box>
      
      <Box className={styles.navbarCenter}>
        <Box className={styles.searchContainer}>
          <Box className={styles.searchWrapper}>
            <Icon className={styles.searchIcon}>search</Icon>
            <InputBase 
              placeholder="Search..." 
              className={styles.searchInput}
              fullWidth
            />
          </Box>
        </Box>
      </Box>
      
      <Box className={styles.navbarEnd}>
        <Box className={styles.dropdownContainer}>
          <Button 
            className={styles.marketDropdown}
            onClick={handleMarketClick}
            endIcon={<Icon>arrow_drop_down</Icon>}
          >
            Market
          </Button>
          
          <Menu
            anchorEl={marketAnchorEl}
            open={Boolean(marketAnchorEl)}
            onClose={handleCloseMarketMenu}
            elevation={3}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleCloseMarketMenu}>Stocks</MenuItem>
            <MenuItem onClick={handleCloseMarketMenu}>Forex</MenuItem>
            <MenuItem onClick={handleCloseMarketMenu}>Crypto</MenuItem>
            <MenuItem onClick={handleCloseMarketMenu}>Commodities</MenuItem>
          </Menu>
        </Box>

        <Box className={styles.notificationContainer}>
          <IconButton 
            onClick={handleNotificationsClick}
            size="large"
          >
            <Badge badgeContent={3} color="error">
              <Icon>notifications</Icon>
            </Badge>
          </IconButton>
          
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleCloseNotificationsMenu}
            elevation={3}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { width: 320, maxHeight: 400 }
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Notifications</Typography>
              <Button size="small">Mark all as read</Button>
            </Box>
            <Divider />
                {notifications.map(notification => (
              <MenuItem 
                key={notification.id} 
                onClick={handleCloseNotificationsMenu}
                sx={{ 
                  py: 1.5, 
                  borderLeft: notification.read ? 'none' : '3px solid', 
                  borderLeftColor: 'primary.main' 
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: notification.read ? 0 : 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Button size="small" fullWidth>View all notifications</Button>
            </Box>
          </Menu>
        </Box>
        
        <Box className={styles.userContainer}>
          <IconButton 
            onClick={handleUserClick}
            size="small"
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>U</Avatar>
          </IconButton>
          
          <Menu
            anchorEl={userAnchorEl}
            open={Boolean(userAnchorEl)}
            onClose={handleCloseUserMenu}
            elevation={3}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { width: 220 }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>User</Typography>
              <Typography variant="body2" color="text.secondary">user@example.com</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleCloseUserMenu}>
              <ListItemIcon>
                <Icon fontSize="small">account_circle</Icon>
              </ListItemIcon>
                  Profile
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
              <ListItemIcon>
                <Icon fontSize="small">settings</Icon>
              </ListItemIcon>
                  Settings
            </MenuItem>
            <MenuItem>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <Typography>Theme</Typography>
                <Switch 
                      checked={isDarkTheme}
                      onChange={toggleTheme}
                  size="small"
                />
              </Box>
            </MenuItem>
            <MenuItem 
                    onClick={toggleColorPicker}
              onMouseEnter={handleMenuItemMouseEnter}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <Typography>Theme Color</Typography>
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: themeColor, 
                    ml: 1,
                    border: '2px solid',
                    borderColor: 'divider'
                  }} 
                />
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseUserMenu}>
              <ListItemIcon>
                <Icon fontSize="small">logout</Icon>
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          
          <Popper
            open={showColorPicker}
            anchorEl={colorPickerAnchorEl}
            placement="bottom-end"
            sx={{ zIndex: 1300 }}
          >
            <Paper 
              elevation={3} 
              sx={{ p: 2, mt: 1 }}
              ref={colorPickerRef}
              onMouseEnter={handleColorPickerMouseEnter}
              onMouseLeave={handleColorPickerMouseLeave}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Select Color</Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: 1 
              }}>
                        {predefinedColors.map((color, index) => (
                  <Box 
                            key={index}
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: color,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: themeColor === color ? '2px solid' : 'none',
                      borderColor: 'divider'
                    }}
                            onClick={() => handleColorChange(color)}
                  />
                        ))}
              </Box>
              <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="color" 
                          value={themeColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                  style={{ width: 30, height: 30, padding: 0, marginRight: 8 }}
                />
                <Typography variant="caption">Custom</Typography>
              </Box>
            </Paper>
          </Popper>
        </Box>
      </Box>
    </Box>
  );
}; 