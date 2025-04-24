import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { createDynamicTheme } from './theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  themeMode: ThemeMode;
  themeColor: string;
  toggleTheme: () => void;
  setThemeColor: (color: string) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  themeMode: 'dark',
  themeColor: '#1E88E5',
  toggleTheme: () => {},
  setThemeColor: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

// Constants for local storage keys
const THEME_MODE_KEY = 'tradylytics-theme-mode';
const THEME_COLOR_KEY = 'tradylytics-theme-color';

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Get user's preferred color scheme for initial value, defaulting to user's system preference
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Get saved preferences from localStorage or use defaults
  const savedThemeMode = localStorage.getItem(THEME_MODE_KEY) as ThemeMode | null;
  const savedThemeColor = localStorage.getItem(THEME_COLOR_KEY);
  
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    savedThemeMode || (prefersDarkMode ? 'dark' : 'light')
  );
  const [themeColor, setThemeColor] = useState<string>(
    savedThemeColor || '#1E88E5'
  );

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem(THEME_MODE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem(THEME_COLOR_KEY, themeColor);
    
    // Update CSS variables for global use
    document.documentElement.style.setProperty('--primary-color', themeColor);
    
    // Calculate light and dark variants (simple calculation for demo purposes)
    // In a production app, you might want to use a color library for better calculations
    const lightVariant = calculateLightVariant(themeColor);
    const darkVariant = calculateDarkVariant(themeColor);
    
    // Set the light and dark variants as CSS variables
    document.documentElement.style.setProperty('--primary-light', lightVariant);
    document.documentElement.style.setProperty('--primary-dark', darkVariant);
  }, [themeColor]);

  // Helper functions to calculate color variants
  const calculateLightVariant = (color: string): string => {
    try {
      // Convert hex to RGB
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      
      // Lighten by 15%
      const lightenBy = 38;
      const newR = Math.min(255, r + lightenBy);
      const newG = Math.min(255, g + lightenBy);
      const newB = Math.min(255, b + lightenBy);
      
      // Convert back to hex
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    } catch (error) {
      console.error('Error calculating light variant:', error);
      return '#42A5F5'; // Fallback light blue
    }
  };
  
  const calculateDarkVariant = (color: string): string => {
    try {
      // Convert hex to RGB
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      
      // Darken by 15%
      const darkenBy = 38;
      const newR = Math.max(0, r - darkenBy);
      const newG = Math.max(0, g - darkenBy);
      const newB = Math.max(0, b - darkenBy);
      
      // Convert back to hex
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    } catch (error) {
      console.error('Error calculating dark variant:', error);
      return '#1565C0'; // Fallback dark blue
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Get current theme based on mode and color
  const theme = useMemo(() => {
    return createDynamicTheme(themeColor, themeMode);
  }, [themeMode, themeColor]);

  // Create context value
  const contextValue = useMemo(() => ({
    themeMode,
    themeColor,
    toggleTheme,
    setThemeColor,
  }), [themeMode, themeColor]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext); 