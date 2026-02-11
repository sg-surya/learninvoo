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
        <h4 className="text-[13px] font-bold text-slate-500 mb-3 ml-1">{title}</h4>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {children}
        </div>
    </div>
);

const SectionRow = ({ label, children, isLast = false }: { label: string, children: React.ReactNode, isLast?: boolean }) => (
    <div className={`flex items-center justify-between p-4 ${!isLast ? 'border-b border-slate-100' : ''} bg-white`}>
        <span className="text-sm font-medium text-slate-700">{label}</span>
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
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-all text-xs font-bold text-slate-700 min-w-[140px] justify-between outline-none"
            >
                <span>{value}</span>
                <ChevronDown size={14} className="text-slate-400" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-200 z-[100] p-1"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all outline-none ${value === opt ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
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
    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
        {options.map((opt) => (
            <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all outline-none ${value === opt.id ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
                {opt.icon && <opt.icon size={13} className={value === opt.id ? 'text-indigo-500' : 'text-slate-400'} />}
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
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none w-64 focus:border-indigo-500 transition-all"
                                    value={settings.fullName}
                                    onChange={(e) => updateSetting('fullName', e.target.value)}
                                />
                            </SectionRow>
                            <SectionRow label="User handle" isLast={true}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 font-bold">@</span>
                                    <input
                                        type="text"
                                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none w-56 focus:border-indigo-500 transition-all"
                                        value={settings.username}
                                        onChange={(e) => updateSetting('username', e.target.value)}
                                    />
                                </div>
                            </SectionRow>
                        </SectionBox>
                        <SectionBox title="Story">
                            <div className="p-4 bg-white">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Professional Bio</label>
                                <textarea
                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all resize-none"
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
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${settings.glassmorphism ? 'bg-indigo-500' : 'bg-slate-200'}`}
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
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${settings.classAlerts ? 'bg-indigo-500' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.classAlerts ? 'left-6' : 'left-1'}`} />
                                </div>
                            </SectionRow>
                            <SectionRow label="AI task completion" isLast={true}>
                                <div
                                    onClick={() => updateSetting('aiCompletionNotif', !settings.aiCompletionNotif)}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${settings.aiCompletionNotif ? 'bg-indigo-500' : 'bg-slate-200'}`}
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
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${settings.mfa ? 'bg-indigo-500' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.mfa ? 'left-6' : 'left-1'}`} />
                                </div>
                            </SectionRow>
                            <SectionRow label="Change system password" isLast={true}>
                                <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 outline-none">
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
                                <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-xs font-bold hover:bg-indigo-100 flex items-center gap-2 outline-none">
                                    <Database size={14} /> Export All
                                </button>
                            </SectionRow>
                        </SectionBox>
                        <SectionBox title="Termination">
                            <SectionRow label="Permanently remove access" isLast={true}>
                                <button className="px-4 py-1.5 bg-rose-50 text-rose-500 border border-rose-100 rounded-lg text-xs font-bold hover:bg-rose-100 outline-none">
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
                        className="relative w-full max-w-5xl h-[700px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white flex overflow-hidden font-inter"
                    >
                        {/* Sidebar - Integrated Background */}
                        <aside className="w-[300px] bg-white p-8 flex flex-col">
                            <div className="mb-10">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="mt-1 shadow-sm p-2 bg-indigo-500 rounded-lg text-white">
                                        <Monitor size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">System Settings</h2>
                                            <Info size={14} className="text-slate-300" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
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
                                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all outline-none ${isActive ? 'bg-slate-50 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'}`}
                                        >
                                            <Icon size={18} className={isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-600'} />
                                            <span className="text-[13px] font-bold tracking-tight">{tab.label}</span>
                                            {tab.badge && (
                                                <span className="ml-auto text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-100">
                                                    {tab.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="mt-auto px-1">
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-bold text-[13px] outline-none">
                                    <LogOut size={18} />
                                    <span>Terminate Session</span>
                                </button>
                                <div className="mt-6 flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Build v2.4.0</span>
                                </div>
                            </div>
                        </aside>

                        {/* Content Area - Floating Card Look */}
                        <main className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] m-3 rounded-[1.5rem] border border-slate-200 overflow-hidden">
                            <div className="p-8 pb-4 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 flex items-center justify-center transition-all bg-white border border-slate-100 outline-none active:scale-90"
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

                            <div className="p-6 bg-[#f8f9fa] border-t border-slate-200/50 flex items-center justify-between">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 italic">Changes effect localized machine state</p>
                                <div className="flex gap-3">
                                    <button onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all border border-slate-200 rounded-xl bg-white outline-none">Discard</button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-8 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:bg-indigo-600 hover:shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 outline-none"
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
