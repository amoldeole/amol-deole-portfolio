import { useTheme } from '../contexts/ThemeContext';

type Theme = 'light' | 'dark';

interface SafeThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
  isThemeAvailable: boolean;
}

export const useSafeTheme = (): SafeThemeReturn => {
  try {
    const themeData = useTheme();
    return {
      theme: themeData.theme,
      toggleTheme: themeData.toggleTheme,
      isThemeAvailable: true,
    };
  } catch (error) {
    // Fallback when theme context is not available
    return {
      theme: 'light',
      toggleTheme: () => {},
      isThemeAvailable: false,
    };
  }
};