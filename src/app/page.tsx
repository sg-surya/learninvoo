
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Zap,
  Check,
  Plus,
  Minus,
  GraduationCap,
  Presentation,
  ExternalLink,
  BrainCircuit,
  Rocket
} from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-lime-500 selection:text-white w-full">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none bg-dot-pro z-0 opacity-30"></div>

      {/* FIXED HEADER SYSTEM */}
      <header className="fixed top-0 left-0 right-0 z-[999] w-full">
        {/* Top Banner */}
        <div
          className={`bg-slate-950 text-white transition-all duration-500 ease-in-out overflow-hidden flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] px-4 ${scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'
            }`}
        >
          India's First AI Platform for <span className="text-lime-400 ml-1">Education (NEP 2020)</span>
        </div>

        {/* Navbar */}
        <nav
          className={`w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center px-6 md:px-12 lg:px-20 ${scrolled ? 'h-16 shadow-lg' : 'h-20 shadow-sm'
            }`}
        >
          <div className="w-full flex items-center justify-between mx-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded-lg rotate-[-6deg] shadow-lg group-hover:rotate-0 transition-transform">
                <BookOpen className="text-lime-400" size={18} />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-950 font-display uppercase">
                LEARNIVO<span className="text-lime-500">.</span>
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-10">
              <Link href="/for-teachers" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                For Teachers <ExternalLink size={10} />
              </Link>
              <Link href="/for-students" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                For Students <ExternalLink size={10} />
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest px-2">
                Sign In
              </Link>
              <Link href="/register">
                <button className="px-5 py-2.5 bg-slate-950 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-all uppercase tracking-widest shadow-xl shadow-black/10">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative pt-40 md:pt-48 pb-20 px-6 md:px-12 lg:px-20 w-full">
        <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mx-auto">

          {/* Left Column */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-lime-50 border border-lime-100 text-lime-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-md mx-auto lg:mx-0"
            >
              <Sparkles size={12} className="animate-pulse" />
              Unified Learning Ecosystem
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-[5.2rem] font-black tracking-pro leading-[1.05] text-slate-950 font-display uppercase"
            >
              Empowering <br />
              Bharat's Smartest <br />
              <span className="text-lime-600">Classrooms.</span>
            </motion.h1>

            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                The complete AI operating system for <span className="text-slate-950 font-black border-b-2 border-lime-400">10,000+ Educators & Students.</span> Synchronize teaching and learning in 22+ languages.
              </motion.p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/for-teachers">
                  <button className="px-8 h-16 bg-slate-950 text-white font-black rounded-2xl text-[12px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-2 group">
                    Teacher Suite <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/for-students">
                  <button className="px-8 h-16 bg-white text-slate-950 border-2 border-slate-100 font-black rounded-2xl text-[12px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl flex items-center gap-2 group">
                    Student Hub <Rocket size={18} className="group-hover:-translate-y-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 bg-slate-900 rounded-[3rem] p-4 shadow-2xl border border-white/10 aspect-[4/3] flex items-center justify-center mx-auto lg:ml-auto max-w-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 to-transparent"></div>
              <div className="relative z-20 space-y-6 w-full px-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2">
                    <Presentation className="text-lime-400" size={32} />
                    <span className="text-[8px] font-bold text-white uppercase opacity-50">Educator</span>
                  </div>
                  <div className="h-32 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2">
                    <GraduationCap className="text-white" size={32} />
                    <span className="text-[8px] font-bold text-white uppercase opacity-50">Scholar</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 h-24 w-24 bg-white rounded-full shadow-xl flex items-center justify-center flex-col text-center border border-slate-50 rotate-12 animate-subtle-bounce z-30">
              <span className="text-[8px] font-black uppercase text-slate-400 leading-tight">Board<br />Ready</span>
              <span className="text-base font-black text-slate-950 tracking-tighter uppercase">NCERT</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Trust Loop */}
      <section className="py-20 border-y border-slate-50 bg-slate-50/30 overflow-hidden relative z-10 w-full">
        <div className="w-full px-6 md:px-12 lg:px-20 space-y-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">Empowering Bharat's Classrooms & Students</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 lg:gap-x-20 gap-y-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {['NCERT', 'CBSE', 'ICSE', 'UP BOARD', 'JEE / NEET', 'SAT'].map((board) => (
              <span key={board} className="text-3xl lg:text-5xl font-black text-slate-400 hover:text-slate-950 transition-colors font-display tracking-tighter uppercase">{board}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Toolkit */}
      <section className="py-32 px-6 md:px-12 lg:px-20 relative z-10 w-full">
        <div className="w-full space-y-20">
          <div className="max-w-3xl space-y-6">
            <div className="w-12 h-1 bg-lime-500 rounded-full"></div>
            <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tight text-slate-950 leading-tight">
              One Unified <br />
              <span className="text-slate-400 italic">Ecosystem.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl group hover:border-lime-200 transition-all duration-500">
              <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center mb-8">
                <Presentation size={28} />
              </div>
              <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-4 text-slate-950">Teacher Suite</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Generate NEP-synced lesson plans and automated assessments in 30 seconds.
              </p>
            </div>
            <div className="p-10 bg-lime-500 text-white rounded-[3rem] shadow-2xl group transition-all duration-500">
              <div className="w-14 h-14 bg-white text-lime-500 rounded-2xl flex items-center justify-center mb-8">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-4 text-white">Student Hub</h3>
              <p className="text-lime-50 font-medium leading-relaxed mb-8">
                24/7 AI Tutor. Master any board exam with localized mocks and mother-tongue help.
              </p>
            </div>
            <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl group hover:border-lime-200 transition-all duration-500">
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-8">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-4 text-slate-950">Regional AI</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Full AI capabilities in 22+ Indian languages for true inclusivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-100 relative z-10 bg-white w-full">
        <div className="w-full px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-10 mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-slate-950 flex items-center justify-center rounded-xl rotate-[-6deg] shadow-lg">
              <BookOpen className="text-lime-400" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-950 font-display uppercase">LEARNIVO</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 Learnivo AI Technologies.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
