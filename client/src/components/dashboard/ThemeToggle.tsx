import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../../hooks/use-color-mode';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();
  
  return (
    <IconButton 
      onClick={toggleColorMode} 
      className={className}
      size="small"
      color="inherit"
      aria-label="toggle theme"
    >
      {theme.palette.mode === 'dark' ? (
        <Brightness7Icon fontSize="small" />
      ) : (
        <Brightness4Icon fontSize="small" />
      )}
    </IconButton>
  );
}