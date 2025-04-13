import { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export type ColorMode = 'light' | 'dark';

interface ColorModeContextType {
  mode: ColorMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'dark',
  toggleColorMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

interface ColorModeProviderProps {
  children: React.ReactNode;
}

export function ColorModeProvider({ children }: ColorModeProviderProps) {
  // Initialize from localStorage or default to dark
  const [mode, setMode] = useState<ColorMode>(() => {
    const savedMode = localStorage.getItem('colorMode') as ColorMode;
    return savedMode || 'dark';
  });
  
  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('colorMode', newMode);
          return newMode;
        });
      },
    }),
    [mode],
  );

  // Apply theme class to body
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark' 
            ? {
                primary: {
                  main: '#3b71de',
                },
                background: {
                  default: '#000000', // Match our dark theme
                  paper: '#0D0D0D',
                },
                text: {
                  primary: '#FFFFFF',
                  secondary: 'rgba(255, 255, 255, 0.85)',
                },
              } 
            : {
                primary: {
                  main: '#3b71de',
                },
              }),
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                ...(mode === 'dark' && {
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
                  },
                }),
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                ...(mode === 'dark' && {
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  backdropFilter: 'blur(12px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                }),
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}