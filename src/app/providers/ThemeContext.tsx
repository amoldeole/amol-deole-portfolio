import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import { showToast } from '../../shared/utils/toastEvent';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Extend Window interface
declare global {
  interface Window {
    __theme?: Theme;
    __themeReady?: boolean;
  }
}

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined' && window.__theme) {
    return window.__theme;
  }
  
  if (typeof window !== 'undefined') {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch (e) {
      showToast({ type: 'error', message: 'Error reading localStorage:' });
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      const finalTheme = window.__theme || getInitialTheme();
      root.classList.remove('light', 'dark');
      root.classList.add(finalTheme);
      if (finalTheme !== theme) {
        setThemeState(finalTheme);
      }
      setIsLoading(false);
    };

    if (window.__themeReady) {
      applyTheme();
    } else {
      const timeout = setTimeout(applyTheme, 0);
      return () => clearTimeout(timeout);
    }
  }, []); // <-- Only run once on mount

  useEffect(() => {
    if (isLoading) return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
    }
    window.__theme = theme;
  }, [theme, isLoading]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
    isLoading,
  };
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
