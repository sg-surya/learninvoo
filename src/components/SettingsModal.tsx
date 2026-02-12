'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Settings, User, Bell, Palette, Globe,
    Lock, ShieldAlert, LogOut, ChevronRight,
    Sparkles, Monitor, Moon, Sun, Languages,
    Volume2, Eye, Database, Info, ChevronDown, Check,
    LayoutDashboard, Wand2, Cpu
} from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

// Custom Styled Components to match the image
const SectionBox = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
        <h4 className="text-[13px] font-bold text-muted-foreground mb-3 ml-1">{title}</h4>
        <div className="bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
            {children}
        </div>
    </div>
);

const SectionRow = ({ label, children, isLast = false }: { label: string, children: React.ReactNode, isLast?: boolean }) => (
    <div className={`flex items-center justify-between p-4 ${!isLast ? 'border-b border-border/50' : ''} bg-card-bg`}>
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-3">
            {children}
        </div>
    </div>
);

const CustomDropdown = ({ options, value, onChange }: { options: string[], value: string, onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-lg hover:border-primary-custom/50 transition-all text-xs font-bold text-foreground min-w-[140px] justify-between outline-none"
            >
                <span>{value}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 top-full mt-1 w-full bg-card-bg rounded-xl shadow-xl border border-border z-[100] p-1"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all outline-none ${value === opt ? 'bg-primary-custom/10 text-primary-custom' : 'text-muted-foreground hover:bg-muted'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SegmentedControl = ({ options, value, onChange }: { options: any[], value: string, onChange: (val: string) => void }) => (
    <div className="flex items-center gap-2 bg-muted p-1 rounded-full border border-border">
        {options.map((opt) => (
            <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all outline-none ${value === opt.id ? 'bg-card-bg shadow-sm border border-border text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
                {opt.icon && <opt.icon size={13} className={value === opt.id ? 'text-primary-custom' : 'text-muted-foreground'} />}
                <span>{opt.label}</span>
            </button>
        ))}
    </div>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);

    const [settings, setSettings] = useState({
        appearance: 'System',
        language: 'English (US)',
        aiVoice: 'Breeze (Default)',
        fullName: '',
        username: '',
        bio: 'Educator & Lifelong Learner',
        accentColor: '#8b5cf6',
        glassmorphism: true,
        aiTone: 'Creative',
        defaultGrade: 'Middle School',
        classAlerts: true,
        aiCompletionNotif: true,
        mfa: false
    });

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem('learnivo_settings');
            if (saved) {
                setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
            } else {
                setSettings(prev => ({
                    ...prev,
                    fullName: user?.fullName || '',
                    username: user?.username || ''
                }));
            }
        }
    }, [isOpen, user]);

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            localStorage.setItem('learnivo_settings', JSON.stringify(settings));
            setIsSaving(false);
            onClose();
            window.dispatchEvent(new Event('learnivo_settings_updated'));
        }, 800);
    };

    const tabs = [
        { id: 'general', label: 'General System', icon: Settings },
        { id: 'profile', label: 'Identity & Bio', icon: User },
        { id: 'personalization', label: 'Visual Layout', icon: Palette, badge: 'New' },
        { id: 'ai-params', label: 'AI Intelligence', icon: Sparkles },
        { id: 'notifications', label: 'Alert Center', icon: Bell },
        { id: 'security', label: 'System Security', icon: Lock },
        { id: 'account', label: 'Data & Access', icon: ShieldAlert },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <SectionBox title="Appearance">
                            <SectionRow label="System Theme">
                                <SegmentedControl
                                    value={settings.appearance}
                                    onChange={(val) => updateSetting('appearance', val)}
                                    options={[
                                        { id: 'System', label: 'Auto', icon: Cpu },
                                        { id: 'Light', label: 'Light', icon: Sun },
                                        { id: 'Dark', label: 'Dark', icon: Moon }
                                    ]}
                                />
                            </SectionRow>
                            <SectionRow label="Poll color (Accent)">
                                <div className="flex items-center gap-2">
                                    {['#8b5cf6', '#ef4444', '#ec4899', '#84cc16', '#3b82f6', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => updateSetting('accentColor', color)}
                                            style={{ backgroundColor: color }}
                                            className={`w-6 h-6 rounded-full cursor-pointer transition-all outline-none ${settings.accentColor === color ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110' : 'hover:scale-105 shadow-sm'}`}
                                        />
                                    ))}
                                </div>
                            </SectionRow>
                            <SectionRow label="Interface scale" isLast={true}>
                                <CustomDropdown
                                    value="Standard Quality"
                                    onChange={() => { }}
                                    options={['Compact', 'Standard Quality', 'Spacious', 'Legacy']}
                                />
                            </SectionRow>
                        </SectionBox>

                        <SectionBox title="Localization">
                            <SectionRow label="Primary Language">
                                <CustomDropdown
                                    value={settings.language}
                                    onChange={(val) => updateSetting('language', val)}
                                    options={['English (US)', 'Hinglish', 'Hindi', 'Spanish']}
                                />
                            </SectionRow>
                            <SectionRow label="AI Vocal Personality" isLast={true}>
                                <CustomDropdown
                                    value={settings.aiVoice}
                                    onChange={(val) => updateSetting('aiVoice', val)}
                                    options={['Breeze (Default)', 'Cove', 'Juniper', 'Sky']}
                                />
                            </SectionRow>
                        </SectionBox>
                    </div>
                );
            case 'profile':
                return (
                    <div className="space-y-6">
                        <SectionBox title="Identity">
                            <SectionRow label="Full Name">
                                <input
                                    type="text"
                                    className="bg-muted border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-foreground outline-none w-64 focus:border-primary-custom transition-all"
                                    value={settings.fullName}
                                    onChange={(e) => updateSetting('fullName', e.target.value)}
                                />
                            </SectionRow>
                            <SectionRow label="User handle" isLast={true}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground font-bold">@</span>
                                    <input
                                        type="text"
                                        className="bg-muted border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-foreground outline-none w-56 focus:border-primary-custom transition-all"
                                        value={settings.username}
                                        onChange={(e) => updateSetting('username', e.target.value)}
                                    />
                                </div>
                            </SectionRow>
                        </SectionBox>
                        <SectionBox title="Story">
                            <div className="p-4 bg-card-bg">
                                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Professional Bio</label>
                                <textarea
                                    className="w-full h-32 bg-muted border border-border rounded-xl p-4 text-xs font-bold text-foreground outline-none focus:border-primary-custom transition-all resize-none"
                                    value={settings.bio}
                                    onChange={(e) => updateSetting('bio', e.target.value)}
                                />
                            </div>
                        </SectionBox>
                    </div>
                );
            case 'ai-params':
                return (
                    <div className="space-y-6">
                        <SectionBox title="Intelligence Model">
                            <SectionRow label="Response Creativity">
                                <SegmentedControl
                                    value={settings.aiTone}
                                    onChange={(val) => updateSetting('aiTone', val)}
                                    options={[
                                        { id: 'Creative', label: 'Dynamic', icon: Sparkles },
                                        { id: 'Concise', label: 'Precise', icon: Wand2 }
                                    ]}
                                />
                            </SectionRow>
                            <SectionRow label="Target Grade Level" isLast={true}>
                                <CustomDropdown
                                    value={settings.defaultGrade}
                                    onChange={(val) => updateSetting('defaultGrade', val)}
                                    options={['Primary', 'Middle School', 'High School', 'University']}
                                />
                            </SectionRow>
                        </SectionBox>
                        <SectionBox title="Generation">
                            <SectionRow label="Auto-save AI Drafts" isLast={true}>
                                <div
                                    onClick={() => updateSetting('glassmorphism', !settings.glassmorphism)}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${settings.glassmorphism ? 'bg-primary-custom' : 'bg-muted'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.glassmorphism ? 'left-6' : 'left-1'}`} />
                                </div>
                            </SectionRow>
                        </SectionBox>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-6">
                        <SectionBox title="Alert Logic">
                            <SectionRow label="Class start reminders">
                                <div
                                    onClick={() => updateSetting('classAlerts', !settings.classAlerts)}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${settings.classAlerts ? 'bg-primary-custom' : 'bg-muted'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.classAlerts ? 'left-6' : 'left-1'}`} />
                                </div>
                            </SectionRow>
                            <SectionRow label="AI task completion" isLast={true}>
                                <div
                                    onClick={() => updateSetting('aiCompletionNotif', !settings.aiCompletionNotif)}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${settings.aiCompletionNotif ? 'bg-primary-custom' : 'bg-muted'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.aiCompletionNotif ? 'left-6' : 'left-1'}`} />
                                </div>
                            </SectionRow>
                        </SectionBox>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6">
                        <SectionBox title="Access Control">
                            <SectionRow label="Two-factor authentication">
                                <div
                                    onClick={() => updateSetting('mfa', !settings.mfa)}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${settings.mfa ? 'bg-primary-custom' : 'bg-muted'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.mfa ? 'left-6' : 'left-1'}`} />
                                </div>
                            </SectionRow>
                            <SectionRow label="Change system password" isLast={true}>
                                <button className="px-4 py-1.5 bg-muted border border-border rounded-lg text-xs font-bold text-foreground hover:bg-muted/80 flex items-center gap-2 outline-none">
                                    Update Key <ChevronRight size={14} />
                                </button>
                            </SectionRow>
                        </SectionBox>
                    </div>
                );
            case 'account':
                return (
                    <div className="space-y-6">
                        <SectionBox title="Data Portability">
                            <SectionRow label="Generate archive bundle" isLast={true}>
                                <button className="px-4 py-1.5 bg-primary-custom/10 text-primary-custom border border-primary-custom/20 rounded-lg text-xs font-bold hover:bg-primary-custom/20 flex items-center gap-2 outline-none">
                                    <Database size={14} /> Export All
                                </button>
                            </SectionRow>
                        </SectionBox>
                        <SectionBox title="Termination">
                            <SectionRow label="Permanently remove access" isLast={true}>
                                <button className="px-4 py-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-xs font-bold hover:bg-rose-500/20 outline-none">
                                    Delete Account
                                </button>
                            </SectionRow>
                        </SectionBox>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="relative w-full max-w-5xl h-[700px] bg-card-bg rounded-[2rem] shadow-2xl border border-border flex overflow-hidden font-inter"
                    >
                        {/* Sidebar - Integrated Background */}
                        <aside className="w-[300px] bg-card-bg p-8 flex flex-col border-r border-border">
                            <div className="mb-10">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="mt-1 shadow-sm p-2 bg-primary-custom rounded-lg text-white">
                                        <Monitor size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-bold text-foreground tracking-tight">System Settings</h2>
                                            <Info size={14} className="text-muted-foreground/30" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">
                                    Customize your workspace, AI assistant personality, and data security to optimize your teacher dashboard experience.
                                </p>
                            </div>

                            <nav className="flex-1 space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all outline-none ${isActive ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                                        >
                                            <Icon size={18} className={isActive ? 'text-primary-custom' : 'text-muted-foreground'} />
                                            <span className="text-[13px] font-bold tracking-tight">{tab.label}</span>
                                            {tab.badge && (
                                                <span className="ml-auto text-[9px] font-black text-primary-custom bg-primary-custom/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary-custom/20">
                                                    {tab.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="mt-auto px-1">
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all font-bold text-[13px] outline-none">
                                    <LogOut size={18} />
                                    <span>Terminate Session</span>
                                </button>
                                <div className="mt-6 flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">Build v2.4.0</span>
                                </div>
                            </div>
                        </aside>

                        {/* Content Area - Floating Card Look */}
                        <main className="flex-1 flex flex-col min-w-0 bg-muted m-3 rounded-[1.5rem] border border-border overflow-hidden">
                            <div className="p-8 pb-4 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-foreground tracking-tight">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground flex items-center justify-center transition-all bg-card-bg border border-border outline-none active:scale-90"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderTabContent()}
                                </motion.div>
                            </div>

                            <div className="p-6 bg-muted border-t border-border/50 flex items-center justify-between">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-3 italic">Changes effect localized machine state</p>
                                <div className="flex gap-3">
                                    <button onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all border border-border rounded-xl bg-card-bg outline-none">Discard</button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-8 py-2.5 bg-foreground text-background text-xs font-bold rounded-xl shadow-lg hover:shadow-primary-custom/20 hover:bg-primary-custom transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 outline-none"
                                    >
                                        {isSaving ? 'Syncing...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </main>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
