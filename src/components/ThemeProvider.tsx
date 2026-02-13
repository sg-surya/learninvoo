'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'Light' | 'Dark' | 'System';

interface ThemeContextType {
    theme: Theme;
    accentColor: string;
    interfaceScale: string;
    language: string;
    aiVoice: string;
    setTheme: (theme: Theme) => void;
    setAccentColor: (color: string) => void;
    setInterfaceScale: (scale: string) => void;
    setLanguage: (lang: string) => void;
    setAiVoice: (voice: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('System');
    const [accentColor, setAccentColor] = useState('#84cc16');
    const [interfaceScale, setInterfaceScale] = useState('Standard Quality');
    const [language, setLanguage] = useState('English (US)');
    const [aiVoice, setAiVoice] = useState('Breeze (Default)');

    useEffect(() => {
        const savedSettings = localStorage.getItem('learnivo_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            if (settings.appearance) setTheme(settings.appearance);
            if (settings.accentColor) setAccentColor(settings.accentColor);
            if (settings.interfaceScale) setInterfaceScale(settings.interfaceScale);
            if (settings.language) setLanguage(settings.language);
            if (settings.aiVoice) setAiVoice(settings.aiVoice);
        }

        const handleSettingsUpdate = () => {
            const updatedSettings = JSON.parse(localStorage.getItem('learnivo_settings') || '{}');
            if (updatedSettings.appearance) setTheme(updatedSettings.appearance);
            if (updatedSettings.accentColor) setAccentColor(updatedSettings.accentColor);
            if (updatedSettings.interfaceScale) setInterfaceScale(updatedSettings.interfaceScale);
            if (updatedSettings.language) setLanguage(updatedSettings.language);
            if (updatedSettings.aiVoice) setAiVoice(updatedSettings.aiVoice);
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
        root.style.setProperty('--color-primary-custom', accentColor);
    }, [accentColor]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('scale-compact', 'scale-standard', 'scale-spacious', 'scale-legacy');
        const scaleClass = `scale-${interfaceScale.toLowerCase().split(' ')[0]}`;
        root.classList.add(scaleClass);
    }, [interfaceScale]);

    useEffect(() => {
        const root = window.document.documentElement;
        const langCode = language === 'English (US)' ? 'en' :
            language === 'Hindi' ? 'hi' :
                language === 'Spanish' ? 'es' : 'hi-IN'; // Hinglish defaults to hi-IN
        root.setAttribute('lang', langCode);
    }, [language]);

    return (
        <ThemeContext.Provider value={{
            theme,
            accentColor,
            interfaceScale,
            language,
            aiVoice,
            setTheme,
            setAccentColor,
            setInterfaceScale,
            setLanguage,
            setAiVoice
        }}>
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
