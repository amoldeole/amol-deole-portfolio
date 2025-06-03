import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';

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
  // First check if theme was set by our blocking script
  if (typeof window !== 'undefined' && window.__theme) {
    console.log('Using theme from blocking script:', window.__theme);
    return window.__theme;
  }
  
  // Fallback to localStorage (shouldn't happen if script worked)
  if (typeof window !== 'undefined') {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        console.log('Using theme from localStorage fallback:', savedTheme);
        return savedTheme;
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    
    // Check system preference as final fallback
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('Using system preference fallback: dark');
      return 'dark';
    }
  }
  
  console.log('Using default theme: light');
  return 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  // Use useLayoutEffect to apply theme before paint
  useLayoutEffect(() => {
    const root = window.document.documentElement;
    
    // Wait for blocking script to finish if it hasn't already
    const applyTheme = () => {
      const finalTheme = window.__theme || getInitialTheme();
      
      console.log('Applying theme in React:', finalTheme);
      
      // Remove both classes first
      root.classList.remove('light', 'dark');
      
      // Add the current theme class
      root.classList.add(finalTheme);
      
      // Update state if different
      if (finalTheme !== theme) {
        setThemeState(finalTheme);
      }
      
      setIsLoading(false);
    };

    if (window.__themeReady) {
      applyTheme();
    } else {
      // Wait a bit for the blocking script to finish
      const timeout = setTimeout(applyTheme, 0);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Handle theme changes after initial load
  useEffect(() => {
    if (isLoading) return;
    
    const root = window.document.documentElement;
    
    console.log('Theme changed to:', theme);
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    try {
      localStorage.setItem('theme', theme);
      console.log('Theme saved to localStorage:', theme);
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
    
    // Update the global variable
    window.__theme = theme;
  }, [theme, isLoading]);

  const setTheme = (newTheme: Theme) => {
    console.log('Setting theme to:', newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Toggling theme from', theme, 'to', newTheme);
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
