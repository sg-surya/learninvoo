'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Mail,
    AtSign,
    AtSign as AtIcon,
    ShieldCheck,
    MapPin,
    ChevronLeft,
    Save,
    Camera,
    Lock,
    Globe,
    Info,
    School,
    GraduationCap,
    BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const EditProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        bio: '',
        location: '',
        school: '',
        class: '',
        subjects: '',
        profileImage: ''
    });
    const [canChangeUsername, setCanChangeUsername] = useState(true);
    const [daysUntilNextChange, setDaysUntilNextChange] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('learnivo_current_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({
                fullName: parsedUser.fullName || '',
                username: parsedUser.username || '',
                email: parsedUser.email || '',
                bio: parsedUser.bio || '',
                location: parsedUser.location || '',
                school: parsedUser.school || '',
                class: parsedUser.class || '',
                subjects: parsedUser.subjects || '',
                profileImage: parsedUser.profileImage || ''
            });

            // Check username change restriction
            if (parsedUser.lastUsernameChange) {
                const lastChange = new Date(parsedUser.lastUsernameChange).getTime();
                const now = new Date().getTime();
                const diffDays = Math.floor((now - lastChange) / (1000 * 60 * 60 * 24));

                if (diffDays < 30) {
                    setCanChangeUsername(false);
                    setDaysUntilNextChange(30 - diffDays);
                }
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const users = JSON.parse(localStorage.getItem('learnivo_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.email === user.email);

        if (userIndex !== -1) {
            const updatedUser = {
                ...users[userIndex],
                ...formData,
                lastUsernameChange: formData.username !== user.username
                    ? new Date().toISOString()
                    : users[userIndex].lastUsernameChange || new Date().toISOString()
            };
            users[userIndex] = updatedUser;

            localStorage.setItem('learnivo_users', JSON.stringify(users));
            localStorage.setItem('learnivo_current_user', JSON.stringify(updatedUser));

            setIsSaving(false);
            setSaveSuccess(true);

            setTimeout(() => {
                setSaveSuccess(false);
                router.push('/profile');
            }, 1500);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit for localStorage
                alert("File size too large. Please select an image under 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-lime-500 selection:text-white pb-20 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-lime-50 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-sky-50 rounded-full blur-[100px]"></div>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <Link href="/profile" className="flex items-center gap-2 group text-slate-400 hover:text-slate-900 transition-colors">
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Discard Changes</span>
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        form="edit-profile-form"
                        type="submit"
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${isSaving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-lime-600 text-white hover:bg-lime-700'
                            }`}
                    >
                        {isSaving ? 'Synchronizing...' : (
                            <><Save size={14} /> Commit Changes</>
                        )}
                    </button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-12 relative z-10">
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-slate-950 tracking-tighter uppercase italic mb-2">Configure <br /> <span className="text-lime-500">Identity.</span></h1>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Update your digital presence across the Learnivo network.</p>
                </div>

                <form id="edit-profile-form" onSubmit={handleSave} className="space-y-12">
                    {/* Avatar Upload Section */}
                    <section className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden bg-white">
                                {formData.profileImage ? (
                                    <img
                                        src={formData.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.fullName}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[2rem] cursor-pointer">
                                <Camera className="text-white" size={24} />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight">Identity Visual</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Upload a custom identity file or use the autogenerated avatar based on your name.
                            </p>
                            <div className="pt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <ShieldCheck size={12} className="text-lime-500" /> End-to-End Encrypted
                                </span>
                                {formData.profileImage && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, profileImage: '' }))}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-500 border border-red-100 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                                    >
                                        Remove Photo
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Basic Information */}
                    <section className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Core Credentials</h3>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1">Full Identity Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full pl-12 pr-5 h-12 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-lime-500 transition-all font-bold text-sm shadow-sm"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1">Unique Alias (Username)</label>
                                <div className={`relative ${!canChangeUsername ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                    <AtIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => canChangeUsername && setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                                        disabled={!canChangeUsername}
                                        className={`w-full pl-12 pr-5 h-12 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-lime-500 transition-all font-bold text-sm shadow-sm ${!canChangeUsername ? 'cursor-not-allowed' : ''}`}
                                        placeholder="username"
                                        required
                                    />
                                </div>
                                {!canChangeUsername && (
                                    <p className="text-[8px] font-bold text-amber-600 uppercase tracking-widest ml-1 flex items-center gap-1">
                                        <Info size={10} /> Locked for {daysUntilNextChange} more days
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Institutional Presence</h3>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1">School / Institute</label>
                                <div className="relative">
                                    <School size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.school}
                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                        className="w-full pl-12 pr-5 h-12 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-lime-500 transition-all font-bold text-sm shadow-sm"
                                        placeholder="Name of your Institute"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1">Current Class / Grade</label>
                                <div className="relative">
                                    <GraduationCap size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.class}
                                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                        className="w-full pl-12 pr-5 h-12 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-lime-500 transition-all font-bold text-sm shadow-sm"
                                        placeholder="e.g. Grade 10-C"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Location & Subjects</h3>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1">Subjects Portfolio</label>
                                <div className="relative">
                                    <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.subjects}
                                        onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                                        className="w-full pl-12 pr-5 h-12 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-lime-500 transition-all font-bold text-sm shadow-sm"
                                        placeholder="Subjects separated by commas"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1">Geo-Location</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full pl-12 pr-5 h-12 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-lime-500 transition-all font-bold text-sm shadow-sm"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Account Metadata</h3>
                            <div className="space-y-2 opacity-50 cursor-not-allowed">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1">Registered Neural Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full pl-12 pr-5 h-12 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm"
                                        placeholder="email@address.com"
                                    />
                                </div>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary key cannot be modified</p>
                            </div>
                        </div>
                    </section>

                    {/* Bio / About */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Identity Narrative</h3>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1">Professional Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="w-full p-5 bg-white border border-slate-100 rounded-3xl focus:outline-none focus:border-lime-500 transition-all font-bold text-sm shadow-sm resize-none"
                                placeholder="Describe your teaching philosophy..."
                            />
                        </div>
                    </section>

                    {/* Security Info */}
                    <section className="p-6 bg-lime-50/50 border border-lime-100 rounded-3xl flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-lime-100 flex items-center justify-center text-lime-600 shadow-sm shrink-0">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">Privacy Architecture</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Your profile changes will be propagated across the Learnivo AI network. All personal data is handled according to our NEP 2020 compliant data policy.
                            </p>
                        </div>
                    </section>
                </form>

                {/* Success Toast */}
                <AnimatePresence>
                    {saveSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] flex items-center gap-3 border border-white/10"
                        >
                            <div className="w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center">
                                <ShieldCheck size={14} className="text-slate-950" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronization Successful</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default EditProfilePage;
