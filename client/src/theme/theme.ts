import { createTheme, ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

/**
 * Generates a complete theme with all color variations based on a main color
 * @param mainColor - The primary color to use as the base
 * @param mode - 'light' or 'dark' theme mode
 * @returns ThemeOptions object with complete palette
 */
export const generateThemeColors = (mainColor: string, mode: 'light' | 'dark'): ThemeOptions => {
  // Calculate light and dark variants of the main color (could use a color library for more precise calculations)
  const lightVariant = alpha(mainColor, 0.8);
  const darkVariant = alpha(mainColor, 1.2);
  
  // Base theme options that apply to both light and dark themes
  const baseThemeOptions: ThemeOptions = {
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.1rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
      },
      body2: {
        fontSize: '0.875rem',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  };

  if (mode === 'light') {
    return {
      ...baseThemeOptions,
      palette: {
        mode: 'light',
        primary: {
          main: mainColor,
          light: lightVariant,
          dark: darkVariant,
        },
        secondary: {
          main: '#9C27B0', // Default secondary color
          light: '#BA68C8',
          dark: '#7B1FA2',
        },
        background: {
          default: '#F5F5F7',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#212121',
          secondary: '#555555',
        },
        success: {
          main: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        error: {
          main: '#F44336',
          light: '#E57373',
          dark: '#D32F2F',
        },
        warning: {
          main: '#FF9800',
          light: '#FFB74D',
          dark: '#F57C00',
        },
        info: {
          main: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2',
        },
      },
    };
  } else {
    return {
      ...baseThemeOptions,
      palette: {
        mode: 'dark',
        primary: {
          main: mainColor,
          light: lightVariant,
          dark: darkVariant,
        },
        secondary: {
          main: '#9C27B0', // Default secondary color
          light: '#BA68C8',
          dark: '#7B1FA2',
        },
        background: {
          default: '#101014',
          paper: '#18181D',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B3B9',
        },
        success: {
          main: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        error: {
          main: '#F44336',
          light: '#E57373',
          dark: '#D32F2F',
        },
        warning: {
          main: '#FF9800',
          light: '#FFB74D',
          dark: '#F57C00',
        },
        info: {
          main: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2',
        },
      },
    };
  }
};

// Create a theme with the default primary color
export const createDynamicTheme = (primaryColor: string, mode: 'light' | 'dark') => {
  return createTheme(generateThemeColors(primaryColor, mode));
};

// Default themes using the default primary color
const defaultPrimaryColor = '#1E88E5';
export const lightTheme = createDynamicTheme(defaultPrimaryColor, 'light');
export const darkTheme = createDynamicTheme(defaultPrimaryColor, 'dark'); 