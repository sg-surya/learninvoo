'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'Light' | 'Dark' | 'System';

interface ThemeContextType {
    theme: Theme;
    accentColor: string;
    setTheme: (theme: Theme) => void;
    setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('System');
    const [accentColor, setAccentColor] = useState('#84cc16'); // Default Learnivo Green

    useEffect(() => {
        const savedSettings = localStorage.getItem('learnivo_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            if (settings.appearance) setTheme(settings.appearance);
            if (settings.accentColor) setAccentColor(settings.accentColor);
        }

        const handleSettingsUpdate = () => {
            const updatedSettings = JSON.parse(localStorage.getItem('learnivo_settings') || '{}');
            if (updatedSettings.appearance) setTheme(updatedSettings.appearance);
            if (updatedSettings.accentColor) setAccentColor(updatedSettings.accentColor);
        };

        window.addEventListener('learnivo_settings_updated', handleSettingsUpdate);
        return () => window.removeEventListener('learnivo_settings_updated', handleSettingsUpdate);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;

        // Handle Dark Mode
        const applyTheme = (currentTheme: Theme) => {
            root.classList.remove('light', 'dark');

            if (currentTheme === 'System') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
            } else {
                root.classList.add(currentTheme.toLowerCase());
            }
        };

        applyTheme(theme);

        // Handle System Theme Changes
        if (theme === 'System') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('System');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.style.setProperty('--primary', accentColor);
        // Also update the tailwind variable if using v4 or specific logic
        root.style.setProperty('--color-primary-custom', accentColor);
    }, [accentColor]);

    return (
        <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
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
