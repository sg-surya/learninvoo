'use client';
import React, { useState } from 'react';
import AdminPageWrapper from '@/components/AdminPageWrapper';
import { Settings, Shield, Bell, Moon, Sun, ToggleRight } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);

    const toggleTheme = () => {
        setTheme(theme === 'Dark' ? 'Light' : 'Dark');
    };

    return (
        <AdminPageWrapper
            title="System Settings"
            subtitle="Configure global school parameters and preferences."
            icon={Settings}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-card-bg/60 backdrop-blur-xl p-8 rounded-[2rem] border border-border/60">
                    <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Shield size={16} /> General
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-base font-bold text-foreground">Theme Mode</h4>
                                <p className="text-xs text-muted-foreground">Toggle light/dark appearance.</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${theme === 'Dark' ? 'bg-lime-500 justify-end' : 'bg-muted justify-start'}`}
                            >
                                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-base font-bold text-foreground">School Name</h4>
                                <p className="text-xs text-muted-foreground">Displayed on reports & dashboard.</p>
                            </div>
                            <input type="text" value="Learnivo High" disabled className="bg-transparent border-b border-border text-right text-sm font-mono text-muted-foreground w-32" />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-card-bg/60 backdrop-blur-xl p-8 rounded-[2rem] border border-border/60">
                    <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Bell size={16} /> Notifications
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-base font-bold text-foreground">System Alerts</h4>
                                <p className="text-xs text-muted-foreground">Critical updates & warnings.</p>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${notifications ? 'bg-lime-500 justify-end' : 'bg-muted justify-start'}`}
                            >
                                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-base font-bold text-foreground">Email Digests</h4>
                                <p className="text-xs text-muted-foreground">Weekly performance summaries.</p>
                            </div>
                            <button
                                onClick={() => setEmailAlerts(!emailAlerts)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${emailAlerts ? 'bg-lime-500 justify-end' : 'bg-muted justify-start'}`}
                            >
                                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">Danger Zone</h4>
                    <p className="text-xs text-red-400 mt-1">Irreversible actions reside here.</p>
                </div>
                <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors">
                    Reset Academic Year
                </button>
            </div>
        </AdminPageWrapper>
    );
}
