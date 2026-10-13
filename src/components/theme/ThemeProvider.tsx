'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Apply theme class to document.documentElement
  const applyTheme = (targetTheme: Theme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const isDark =
      targetTheme === 'dark' ||
      (targetTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
      setResolvedTheme('dark');
    } else {
      root.classList.remove('dark');
      setResolvedTheme('light');
    }
  };

  useEffect(() => {
    // 1. Read stored theme
    const storedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'system';
    setThemeState(storedTheme);
    applyTheme(storedTheme);

    // 2. Listen to system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const currentStored = (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'system';
      if (currentStored === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);

    // 3. Listen to storage changes across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) {
        const newTheme = (e.newValue as Theme) || 'system';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (newTheme === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
    applyTheme(newTheme);
  };

  const resetTheme = () => {
    setTheme('system');
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

