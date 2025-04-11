import React, { createContext, useState, useContext, useEffect } from 'react';

type ThemeContextType = {
  isDarkTheme: boolean;
  toggleTheme: () => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper functions to generate lighter and darker variants of colors
const lightenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 + 
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
};

const darkenColor = (color: string, percent: number): string => {
  return lightenColor(color, -percent);
};

// Add function to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if user has a preference stored in localStorage
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true; // Default to dark theme
  });

  // Added theme color state
  const [themeColor, setThemeColor] = useState(() => {
    const savedColor = localStorage.getItem('themeColor');
    return savedColor || '#9370DB'; // Default purple theme color
  });

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  // When theme changes, update localStorage and apply theme CSS variables
  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('themeColor', themeColor);
    applyTheme(isDarkTheme, themeColor);
  }, [isDarkTheme, themeColor]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Function to apply theme by setting CSS variables
const applyTheme = (isDarkTheme: boolean, themeColor: string) => {
  const root = document.documentElement;
  
  // Convert hex color to RGB for rgba() usage
  const themeColorRgb = hexToRgb(themeColor);
  const themeColorRgbString = `${themeColorRgb.r}, ${themeColorRgb.g}, ${themeColorRgb.b}`;
  
  // Apply theme color and its variants
  root.style.setProperty('--theme-color', themeColor);
  root.style.setProperty('--theme-color-light', lightenColor(themeColor, 20));
  root.style.setProperty('--theme-color-dark', darkenColor(themeColor, 20));
  root.style.setProperty('--theme-color-rgb', themeColorRgbString);
  
  // Apply theme mode (dark or light)
  if (isDarkTheme) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }
}; 