import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import {useColorScheme} from 'react-native';
import {getTheme, setTheme as saveTheme} from '../services/storage';
import {useBrand} from './BrandContext';
import {createLightTheme, createDarkTheme, type Theme} from '../theme/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    secondary?: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  themeObject: Theme | null;
}

const defaultLightColors = {
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#212121',
  textSecondary: '#666666',
  border: '#e0e0e0',
  primary: '#4CAF50',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
};

const defaultDarkColors = {
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  border: '#333333',
  primary: '#4CAF50',
  error: '#EF5350',
  success: '#66BB6A',
  warning: '#FFA726',
  info: '#42A5F5',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const systemColorScheme = useColorScheme();
  const {brand} = useBrand();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);
  const [themeObject, setThemeObject] = useState<Theme | null>(null);

  const updateIsDark = useCallback((themeToCheck: ThemeMode) => {
    if (themeToCheck === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeToCheck === 'dark');
    }
  }, [systemColorScheme]);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    updateIsDark(theme);
  }, [theme, updateIsDark]);

  useEffect(() => {
    if (brand) {
      const newTheme = isDark ? createDarkTheme(brand) : createLightTheme(brand);
      setThemeObject(newTheme);
    }
  }, [brand, isDark]);

  const loadTheme = async () => {
    try {
      const savedTheme = await getTheme();
      if (savedTheme) {
        setThemeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    // Update state first
    setThemeState(newTheme);
    // Immediately update isDark based on the new theme (not the old one)
    updateIsDark(newTheme);
    // Save to storage
    await saveTheme(newTheme);
  };

  // Use brand theme if available, otherwise use defaults
  const colors = themeObject
    ? {
        background: themeObject.colors.background,
        surface: themeObject.colors.surface,
        text: themeObject.colors.text,
        textSecondary: themeObject.colors.textSecondary,
        border: themeObject.colors.border,
        primary: themeObject.colors.primary,
        secondary: themeObject.colors.secondary,
        error: themeObject.colors.error,
        success: themeObject.colors.success,
        warning: themeObject.colors.warning,
        info: themeObject.colors.info,
      }
    : isDark
    ? defaultDarkColors
    : defaultLightColors;

  return (
    <ThemeContext.Provider value={{theme, isDark, setTheme, colors, themeObject}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

