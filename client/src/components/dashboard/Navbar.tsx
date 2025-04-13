import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Avatar, 
  Box, 
  Badge, 
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { GradientText } from './GradientText';
import { ThemeToggle } from './ThemeToggle';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  height: '48px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0'}`,
}));

const StyledToolbar = styled(Toolbar)({
  height: '48px',
  minHeight: '48px',
  padding: '0 16px',
  display: 'flex',
  justifyContent: 'space-between',
});

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#f5f5f5',
  borderRadius: '8px',
  padding: '6px 12px',
  marginLeft: '24px',
  width: '220px',
}));

const SearchInput = styled('input')(({ theme }) => ({
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  marginLeft: '8px',
  fontSize: '0.875rem',
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333333',
  width: '100%',
  '&::placeholder': {
    color: theme.palette.mode === 'dark' ? '#999999' : '#757575',
  }
}));

const IconButtonContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#666666',
}));

export function Navbar() {
  const theme = useTheme();
  
  return (
    <StyledAppBar position="fixed" color="default">
      <StyledToolbar>
        <Box display="flex" alignItems="center">
          <GradientText text="Hi, User" className="text-lg font-medium" />
          <SearchContainer>
            <SearchIcon fontSize="small" color="action" />
            <SearchInput placeholder="Search..." />
          </SearchContainer>
        </Box>
        
        <IconButtonContainer>
          <ThemeToggle />
          
          <StyledIconButton size="small">
            <Badge badgeContent={3} color="error">
              <NotificationsOutlinedIcon fontSize="small" />
            </Badge>
          </StyledIconButton>
          
          <StyledIconButton size="small">
            <SettingsOutlinedIcon fontSize="small" />
          </StyledIconButton>
          
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: theme.palette.mode === 'dark' ? '#666666' : '#e0e0e0',
              fontSize: '0.875rem',
              marginLeft: '4px'
            }}
          >
            U
          </Avatar>
        </IconButtonContainer>
      </StyledToolbar>
    </StyledAppBar>
  );
}