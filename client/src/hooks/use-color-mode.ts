import { useContext } from 'react';
import { ThemeContext } from '../theme/ThemeProvider';

/**
 * A hook to access and toggle the color mode (light/dark)
 * This hook is used by components that need to switch between light and dark modes
 */
export function useColorMode() {
  const { themeMode, toggleTheme } = useContext(ThemeContext);
  
  return {
    colorMode: themeMode,
    toggleColorMode: toggleTheme
  };
} 