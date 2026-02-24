'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Mail, Lock, User, ArrowRight, Presentation,
    GraduationCap, ChevronLeft, LayoutGrid, Activity,
    Sparkles, AtSign, Building2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Role = 'teacher' | 'student' | 'school_admin' | null;

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        school: '',
    });
    const [isUsernameManuallyEdited, setIsUsernameManuallyEdited] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('learnivo_current_user')) {
            router.push('/dashboard');
        }
    }, [router]);

    const generateUsername = (name: string) => {
        const base = name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
        if (!base) return '';
        const users = JSON.parse(localStorage.getItem('learnivo_users') || '[]');
        let username = base;
        let counter = 1;
        while (users.some((u: any) => u.username === username)) {
            username = `${base}${counter}`;
            counter++;
        }
        return username;
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => {
            const newUsername = !isUsernameManuallyEdited ? generateUsername(name) : prev.username;
            return { ...prev, fullName: name, username: newUsername };
        });
    };

    const validateUsername = (username: string) => /^[a-zA-Z0-9.]+$/.test(username);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.password || !formData.username || !role) {
            alert('Please fill all fields');
            return;
        }
        if (!validateUsername(formData.username)) {
            alert('Username can only contain letters, numbers, and dots (.)');
            return;
        }
        try {
            const api = await import('@/lib/api');
            const newUser = {
                email: formData.email,
                password: formData.password,
                full_name: formData.fullName,
                role: role
            };
            await api.signup(newUser);
            const loginData = new FormData();
            loginData.append('username', formData.email);
            loginData.append('password', formData.password);
            const loginResponse = await api.login(loginData);
            if (loginResponse.access_token) {
                localStorage.setItem('access_token', loginResponse.access_token);
                const user = await api.getMe();
                localStorage.setItem('learnivo_current_user', JSON.stringify(user));
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Registration failed:', error);
            alert(error.message || 'Registration failed. Please try again.');
        }
    };

    // Brand panel content changes per step
    const brandContent = step === 1 ? {
        icon: <LayoutGrid size={28} color="#ccff00" />,
        headline: "Built for Bharat's Educators.",
        tagline: "Join 50,000+ teachers transforming education with one single account.",
        chips: ['TEACHER OS', 'STUDENT PORTAL', 'ADMIN PANEL']
    } : {
        icon: <Activity size={28} color="#ccff00" />,
        headline: "Your AI Copilot Awaits.",
        tagline: "One account. Unlimited intelligence. Experience the future of pedagogy.",
        chips: ['LESSON ARCHITECT', 'QUIZ GENERATOR', 'VISION GRADING', 'VASU AI']
    };

    return (
        <div className="auth-page">
            {/* Background Orbs */}
            <div className="auth-orb auth-orb-lime" />
            <div className="auth-orb auth-orb-blue" />

            <div className="auth-wrapper">
                {/* Left Panel - Form */}
                <section className="auth-form-panel">
                    <header className="auth-header">
                        <Link href="/" className="auth-logo">LEARNIVO<span className="auth-dot">.</span></Link>
                    </header>

                    <div className="auth-form-center">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="auth-form-container" style={{ maxWidth: 480 }}
                                >
                                    <h1 className="auth-headline">YOUR IDENTITY<span>.</span></h1>
                                    <p className="auth-subheadline">Select your primary role to customize your workspace experience.</p>

                                    <div className="auth-role-grid">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setRole('teacher')}
                                            className={`auth-role-card ${role === 'teacher' ? 'active' : ''}`}
                                        >
                                            <div className="auth-role-icon"><Presentation size={24} /></div>
                                            <div className="auth-role-title">Teacher</div>
                                            <p className="auth-role-desc">Manage classrooms, generate lessons, and grade with AI.</p>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setRole('student')}
                                            className={`auth-role-card ${role === 'student' ? 'active' : ''}`}
                                        >
                                            <div className="auth-role-icon"><GraduationCap size={24} /></div>
                                            <div className="auth-role-title">Student</div>
                                            <p className="auth-role-desc">Personalized learning paths and AI tutoring assistance.</p>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setRole('school_admin')}
                                            className={`auth-role-card auth-role-card-wide ${role === 'school_admin' ? 'active' : ''}`}
                                        >
                                            <div className="auth-role-icon"><Building2 size={24} /></div>
                                            <div className="auth-role-title">School Admin</div>
                                            <p className="auth-role-desc">Centralized command for fees, attendance, and parent communication.</p>
                                        </motion.button>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        disabled={!role}
                                        onClick={() => setStep(2)}
                                        className="auth-btn-primary"
                                        style={{ opacity: role ? 1 : 0.5 }}
                                    >
                                        Continue <ArrowRight size={18} />
                                    </motion.button>

                                    <p className="auth-footer-link">
                                        Already have an account? <Link href="/login">Sign In</Link>
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="auth-form-container" style={{ maxWidth: 520 }}
                                >
                                    <button onClick={() => setStep(1)} className="auth-back-btn">
                                        <ChevronLeft size={14} /> Back to Role
                                    </button>

                                    <h1 className="auth-headline">JOIN BHARAT<span>.</span></h1>
                                    <p className="auth-subheadline">Setting up your professional profile for India&apos;s largest AI teacher network.</p>

                                    <form onSubmit={handleRegister}>
                                        <div className="auth-grid-2">
                                            {/* Row 1: Name + Username */}
                                            <div className="auth-input-group">
                                                <span className="auth-label">Full Name</span>
                                                <div className="auth-input-wrapper" style={{ marginTop: 10 }}>
                                                    <User className="auth-input-icon" size={18} />
                                                    <input
                                                        type="text"
                                                        value={formData.fullName}
                                                        onChange={(e) => handleNameChange(e.target.value)}
                                                        className="auth-input"
                                                        placeholder="Arjun Sharma"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="auth-input-group">
                                                <span className="auth-label">Username</span>
                                                <div className="auth-input-wrapper" style={{ marginTop: 10 }}>
                                                    <AtSign className="auth-input-icon" size={18} />
                                                    <input
                                                        type="text"
                                                        value={formData.username}
                                                        onChange={(e) => {
                                                            setFormData({ ...formData, username: e.target.value });
                                                            setIsUsernameManuallyEdited(true);
                                                        }}
                                                        className="auth-input"
                                                        placeholder="arjun.sharma"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Row 2: Email + Password */}
                                            <div className="auth-input-group">
                                                <span className="auth-label">Work Email</span>
                                                <div className="auth-input-wrapper" style={{ marginTop: 10 }}>
                                                    <Mail className="auth-input-icon" size={18} />
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="auth-input"
                                                        placeholder="arjun@institution.edu"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="auth-input-group">
                                                <span className="auth-label">Password</span>
                                                <div className="auth-input-wrapper" style={{ marginTop: 10 }}>
                                                    <Lock className="auth-input-icon" size={18} />
                                                    <input
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        className="auth-input"
                                                        placeholder="••••••••••••"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Row 3: Institution (full width) */}
                                            <div className="auth-input-group auth-grid-full">
                                                <span className="auth-label">{role === 'teacher' ? 'School / Institution' : role === 'student' ? 'Current School / Class' : 'School Name'}</span>
                                                <div className="auth-input-wrapper" style={{ marginTop: 10 }}>
                                                    <Building2 className="auth-input-icon" size={18} />
                                                    <input
                                                        type="text"
                                                        value={formData.school}
                                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                                        className="auth-input"
                                                        placeholder={role === 'teacher' ? 'IIT Delhi / Global Public School' : role === 'student' ? '10th Grade, VPS' : 'Delhi Public School, R.K. Puram'}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            type="submit"
                                            className="auth-btn-primary"
                                        >
                                            Launch Dashboard <Sparkles size={18} />
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <footer className="auth-copyright">© 2026 LEARNIVO AI TECHNOLOGIES PVT LTD.</footer>
                </section>

                {/* Right Panel - Brand */}
                <section className="auth-brand-panel">
                    <div className="auth-brand-content">
                        <div className="auth-brand-icon-box">
                            {brandContent.icon}
                        </div>
                        <h2 className="auth-brand-headline">{brandContent.headline}</h2>
                        <div className="auth-accent-bar" />
                        <p className="auth-brand-tagline">{brandContent.tagline}</p>
                        <div className="auth-feature-chips">
                            {brandContent.chips.map(chip => (
                                <span key={chip} className="auth-chip">{chip}</span>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
