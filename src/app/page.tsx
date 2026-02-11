
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  LayoutGrid,
  BarChart
} from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-lime-500 selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none bg-dot-pro z-0 opacity-30"></div>

      {/* Top Banner */}
      <div className="bg-slate-950 text-white py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.3em] relative z-[60] px-4">
        India's First AI Platform for the New Era of <span className="text-lime-400">Education (NEP 2020)</span>
      </div>

      {/* Sticky Header */}
      <nav className={`fixed left-0 right-0 transition-all duration-500 z-[100] ${scrolled
        ? 'top-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-100 h-16'
        : 'top-10 bg-transparent h-24'
        }`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-slate-950 flex items-center justify-center rounded-lg rotate-[-6deg] shadow-lg group-hover:rotate-0 transition-transform">
              <BookOpen className="text-lime-400" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-950 font-display uppercase">
              LEARNIVO<span className="text-lime-500">.</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/for-teachers" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest flex items-center gap-1.5">
              Teachers <ExternalLink size={10} />
            </Link>
            <Link href="/for-students" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest flex items-center gap-1.5">
              Students <ExternalLink size={10} />
            </Link>
          </div>

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

      {/* Hero Section */}
      <main className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Column - Content */}
          <div className="space-y-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-lime-50 border border-lime-100 text-lime-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-md mx-auto lg:mx-0"
            >
              <Sparkles size={12} className="animate-pulse" />
              Redefining Bharat's Education
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-7xl font-black tracking-pro leading-[1.05] text-slate-950 font-display uppercase"
            >
              Empowering <br />
              Bharat's Smartest <br />
              <span className="text-lime-600">Classrooms.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              <span className="text-slate-950 font-bold border-b-2 border-lime-400">Teach Smarter. Inspire Better.</span> Build comprehensive lesson plans, visual aids, and exam prep in 22+ languages—all aligned with NEP 2020.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link href="/register">
                <button className="px-10 h-16 bg-slate-950 text-white font-black rounded-2xl text-[13px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-black/20 flex items-center gap-2 group">
                  EXPLORE SUITE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/for-students">
                <button className="px-10 h-16 bg-white text-slate-950 border-2 border-slate-100 font-black rounded-2xl text-[13px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-black/5">
                  For Students
                </button>
              </Link>
            </motion.div>

            {/* User Trust */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">U{i}</div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Empowering 10,000+ Educators</p>
            </div>
          </div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 bg-slate-900 rounded-[3rem] p-4 shadow-[0_64px_96px_-12px_rgba(0,0,0,0.3)] border border-white/10 group overflow-hidden aspect-[4/3] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 to-transparent"></div>
              <div className="w-48 h-48 bg-lime-400 rounded-full blur-[100px] opacity-20 animate-pulse"></div>

              <div className="relative z-20 space-y-4 w-full px-10">
                <div className="h-2 w-32 bg-lime-400/50 rounded-full"></div>
                <div className="h-8 w-full bg-white/5 border border-white/10 rounded-xl"></div>
                <div className="h-32 w-full bg-white/10 border border-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center">
                  <Zap className="text-lime-400" size={64} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-white/5 rounded-2xl"></div>
                  <div className="h-24 bg-white/5 rounded-2xl"></div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 h-24 w-24 bg-white rounded-full shadow-2xl flex items-center justify-center flex-col text-center border border-slate-50 rotate-12 animate-subtle-bounce">
              <span className="text-[8px] font-black uppercase text-slate-400 leading-tight">Board<br />Aligned</span>
              <span className="text-base font-black text-slate-950 tracking-tighter uppercase">NCERT</span>
            </div>

            <div className="absolute -bottom-10 -left-10 p-6 bg-slate-950 text-white rounded-[2rem] shadow-2xl z-20 space-y-2 max-w-[200px] border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lime-400 animate-ping"></div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-lime-400">Live in Bharat</span>
              </div>
              <p className="text-[11px] font-bold leading-tight uppercase tracking-tight">22+ Indian Regional Languages</p>
            </div>
          </motion.div>

        </div>
      </main>

    </div>
  );
};

export default LandingPage;
