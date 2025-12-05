import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { AppSettings } from '../types';
import { Colors, getFontSizeMultiplier } from './theme';

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: typeof Colors.dark | typeof Colors.light;
  toggleTheme: () => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  fontMultiplier: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    fontSize: 'medium',
    dailyWordGoal: 1000,
    notifications: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loadedSettings = await storageService.loadSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    await updateSettings({ theme: newTheme });
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      await storageService.saveSettings(updated);
      setSettings(updated);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const colors = settings.theme === 'dark' ? Colors.dark : Colors.light;
  const fontMultiplier = getFontSizeMultiplier(settings.fontSize);

  return (
    <ThemeContext.Provider
      value={{
        theme: settings.theme,
        colors,
        toggleTheme,
        settings,
        updateSettings,
        fontMultiplier,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
