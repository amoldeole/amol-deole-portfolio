import { useTheme } from '../contexts/ThemeContext';

interface SafeThemeReturn {
  theme: 'dark' | 'light';
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
    return {
      theme: 'dark',
      toggleTheme: () => console.warn('Theme context not available'),
      isThemeAvailable: false,
    };
  }
};