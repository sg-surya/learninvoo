'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, ChevronLeft, KeyRound, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [view, setView] = useState<'login' | 'forgot'>('login');
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetStep, setResetStep] = useState(1);

    useEffect(() => {
        if (localStorage.getItem('learnivo_current_user')) {
            router.push('/dashboard');
        }
        const rememberedEmail = localStorage.getItem('learnivo_remembered_email');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);
            const response = await import('@/lib/api').then(mod => mod.login(formData));
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
                const user = await import('@/lib/api').then(mod => mod.getMe());
                localStorage.setItem('learnivo_current_user', JSON.stringify(user));
                if (rememberMe) {
                    localStorage.setItem('learnivo_remembered_email', email);
                } else {
                    localStorage.removeItem('learnivo_remembered_email');
                }
                router.push('/dashboard');
            }
        } catch (error: any) {
            alert(error.message || 'Login failed. Please check your credentials.');
        }
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('learnivo_users') || '[]');
        const userExists = users.find((u: any) => u.email === resetEmail);
        if (userExists) {
            setResetStep(2);
        } else {
            alert('This email is not registered with us.');
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('learnivo_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.email === resetEmail);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('learnivo_users', JSON.stringify(users));
            alert('Password successfully reset! Please login with your new credentials.');
            setView('login');
            setResetStep(1);
            setResetEmail('');
            setNewPassword('');
        }
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
                            {view === 'login' ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="auth-form-container"
                                >
                                    <h1 className="auth-headline">WELCOME BACK<span>.</span></h1>
                                    <p className="auth-subheadline">Empowering the next generation of Indian educators with AI-driven pedagogical tools.</p>

                                    <form onSubmit={handleLogin}>
                                        <div className="auth-input-group">
                                            <div className="auth-label-row">
                                                <span className="auth-label">Work Email</span>
                                            </div>
                                            <div className="auth-input-wrapper">
                                                <Mail className="auth-input-icon" size={18} />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="auth-input"
                                                    placeholder="arjun@school.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="auth-input-group">
                                            <div className="auth-label-row">
                                                <span className="auth-label">Password</span>
                                                <button type="button" onClick={() => setView('forgot')} className="auth-forgot-link">FORGOT?</button>
                                            </div>
                                            <div className="auth-input-wrapper">
                                                <Lock className="auth-input-icon" size={18} />
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="auth-input"
                                                    placeholder="••••••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <label className="auth-checkbox" onClick={() => setRememberMe(!rememberMe)}>
                                            <div className={`auth-checkbox-box ${rememberMe ? 'active' : ''}`}>
                                                {rememberMe && <Check size={14} color="black" />}
                                            </div>
                                            <span className="auth-label">Keep me signed in</span>
                                        </label>

                                        <motion.button
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            type="submit"
                                            className="auth-btn-primary"
                                        >
                                            Sign In Now <ArrowRight size={18} />
                                        </motion.button>
                                    </form>

                                    <p className="auth-footer-link">
                                        New to Learnivo? <Link href="/register">Create Account</Link>
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="forgot"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="auth-form-container"
                                >
                                    <button onClick={() => { setView('login'); setResetStep(1); }} className="auth-back-btn">
                                        <ChevronLeft size={14} /> Back to Login
                                    </button>

                                    <h1 className="auth-headline">RESET ACCESS<span>.</span></h1>
                                    <p className="auth-subheadline">Recover your credentials securely.</p>

                                    {resetStep === 1 ? (
                                        <form onSubmit={handleForgotPassword}>
                                            <div className="auth-input-group">
                                                <span className="auth-label">Registered Email</span>
                                                <div className="auth-input-wrapper" style={{ marginTop: 10 }}>
                                                    <Mail className="auth-input-icon" size={18} />
                                                    <input
                                                        type="email"
                                                        value={resetEmail}
                                                        onChange={(e) => setResetEmail(e.target.value)}
                                                        className="auth-input"
                                                        placeholder="arjun@school.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="auth-btn-primary">
                                                Verify Email <ArrowRight size={14} />
                                            </motion.button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleResetPassword}>
                                            <div className="auth-input-group">
                                                <span className="auth-label">New Password</span>
                                                <div className="auth-input-wrapper" style={{ marginTop: 10 }}>
                                                    <KeyRound className="auth-input-icon" size={18} />
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="auth-input"
                                                        placeholder="••••••••••••"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="auth-btn-lime">
                                                Update Credentials <Check size={14} />
                                            </motion.button>
                                        </form>
                                    )}
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
                            <BookOpen size={28} color="#ccff00" />
                        </div>
                        <h2 className="auth-brand-headline">Mastering the Art of Teaching.</h2>
                        <div className="auth-accent-bar" />
                        <p className="auth-brand-tagline">Everything you need to run a modern AI-powered classroom in Bharat.</p>
                        <div className="auth-feature-chips">
                            <span className="auth-chip">LESSON ARCHITECT</span>
                            <span className="auth-chip">QUIZ GENERATOR</span>
                            <span className="auth-chip">VASU AI</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
