import React from 'react';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../../hooks/use-color-mode';
import { useTheme } from '../../theme/ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { toggleColorMode } = useColorMode();
  const { themeMode } = useTheme();
  
  return (
    <IconButton 
      onClick={toggleColorMode} 
      className={className}
      size="small"
      color="inherit"
      aria-label="toggle theme"
    >
      {themeMode === 'dark' ? (
        <Brightness7Icon fontSize="small" />
      ) : (
        <Brightness4Icon fontSize="small" />
      )}
    </IconButton>
  );
}