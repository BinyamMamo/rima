'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeColor } from '@/types';

interface UIContextType {
  darkMode: boolean;
  themeAccent: ThemeColor;
  toggleDarkMode: () => void;
  setThemeAccent: (color: ThemeColor) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DARK_MODE: 'rima_dark_mode',
  THEME_ACCENT: 'rima_theme_accent',
} as const;

const THEME_COLORS: Record<ThemeColor, { primary: string; accent: string }> = {
  violet: { primary: '#6C30FF', accent: '#A875FF' },
  teal: { primary: '#10B981', accent: '#34D399' },
  emerald: { primary: '#10B981', accent: '#34D399' },
  gold: { primary: '#F59E0B', accent: '#FBBF24' },
  rust: { primary: '#EA580C', accent: '#FB923C' },
  indigo: { primary: '#6366F1', accent: '#818CF8' },
  rose: { primary: '#F43F5E', accent: '#FB7185' },
  sky: { primary: '#0EA5E9', accent: '#38BDF8' },
  obsidian: { primary: '#3F3F46', accent: '#71717A' },
  slate: { primary: '#64748B', accent: '#94A3B8' },
};

export function UIProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [themeAccent, setThemeAccentState] = useState<ThemeColor>('violet');

  // Initialize theme from localStorage
  useEffect(() => {
    const storedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    const storedThemeAccent = localStorage.getItem(STORAGE_KEYS.THEME_ACCENT);

    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === 'true');
    }

    if (storedThemeAccent) {
      setThemeAccentState(storedThemeAccent as ThemeColor);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Apply theme accent colors to CSS variables
  useEffect(() => {
    const colors = THEME_COLORS[themeAccent];
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--primary-accent', colors.accent);
  }, [themeAccent]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(newMode));
  };

  const setThemeAccent = (color: ThemeColor) => {
    setThemeAccentState(color);
    localStorage.setItem(STORAGE_KEYS.THEME_ACCENT, color);
  };

  const value: UIContextType = {
    darkMode,
    themeAccent,
    toggleDarkMode,
    setThemeAccent,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
