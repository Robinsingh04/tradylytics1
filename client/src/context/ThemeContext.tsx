import React, { createContext, useState, useEffect, useContext } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeColor: string;
  themeMode: ThemeMode;
  setThemeColor: (color: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const defaultThemeColor = '#3f51b5'; // Default blue theme color

const ThemeContext = createContext<ThemeContextType>({
  themeColor: defaultThemeColor,
  themeMode: 'light',
  setThemeColor: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColor] = useState<string>(
    localStorage.getItem('themeColor') || defaultThemeColor
  );
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    (localStorage.getItem('themeMode') as ThemeMode) || 'light'
  );

  // Helper functions to generate lighter and darker variants
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

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('themeColor', themeColor);
    localStorage.setItem('themeMode', themeMode);

    // Apply theme color to CSS variables
    document.documentElement.style.setProperty('--theme-color', themeColor);
    document.documentElement.style.setProperty('--theme-color-light', lightenColor(themeColor, 20));
    document.documentElement.style.setProperty('--theme-color-dark', darkenColor(themeColor, 20));

    // Apply theme mode
    if (themeMode === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [themeColor, themeMode]);

  return (
    <ThemeContext.Provider value={{ themeColor, themeMode, setThemeColor, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 