
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
  BarChart,
  BrainCircuit,
  Rocket
} from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-lime-500 selection:text-white overflow-x-hidden w-full">
      <div className="fixed inset-0 pointer-events-none bg-dot-pro z-0 opacity-30"></div>

      {/* Top Banner */}
      <div className="bg-slate-950 text-white py-2 text-center text-[10px] font-bold uppercase tracking-[0.3em] relative z-[60] px-4 w-full">
        India's First AI Platform for the New Era of <span className="text-lime-400">Education (NEP 2020)</span>
      </div>

      {/* Sticky Header - Full Width */}
      <nav className={`fixed left-0 right-0 transition-all duration-500 z-[100] ${scrolled
        ? 'top-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-100 h-16'
        : 'top-10 bg-transparent h-20'
        }`}>
        <div className="w-full px-6 md:px-12 lg:px-20 h-full flex items-center justify-between mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded-lg rotate-[-6deg] shadow-lg group-hover:rotate-0 transition-transform">
              <BookOpen className="text-lime-400" size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-950 font-display uppercase">
              LEARNIVO<span className="text-lime-500">.</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <Link href="/for-teachers" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
              For Teachers <ExternalLink size={10} />
            </Link>
            <Link href="/for-students" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
              For Students <ExternalLink size={10} />
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

      {/* Hero Section - Full Width but Balanced */}
      <main className="relative pt-36 pb-20 px-6 md:px-12 lg:px-20 w-full">
        <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mx-auto">

          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-lime-50 border border-lime-100 text-lime-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-md mx-auto lg:mx-0"
            >
              <Sparkles size={12} className="animate-pulse" />
              The Unified Learning & Teaching OS
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-pro leading-[1.05] text-slate-950 font-display uppercase"
            >
              Transforming <br />
              How <span className="text-lime-600">Bharat</span> <br />
              Teaches & Learns.
            </motion.h1>

            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Empowering <span className="text-slate-950 font-black border-b-2 border-lime-400">10,000+ Smart Classrooms.</span> Save 10+ hours weekly while mastering concepts in 22+ languages—all aligned with NEP 2020.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link href="/for-teachers">
                  <button className="px-8 h-16 bg-slate-950 text-white font-black rounded-2xl text-[12px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-black/20 flex items-center gap-2 group">
                    Teacher Suite <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/for-students">
                  <button className="px-8 h-16 bg-white text-slate-950 border-2 border-slate-100 font-black rounded-2xl text-[12px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-black/5 flex items-center gap-2 group">
                    Student Hub <Rocket size={18} className="group-hover:-translate-y-1 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* User Trust */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">{i}0k</div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bridging the Gap for 1M+ Learners</p>
            </div>
          </div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 bg-slate-900 rounded-[3rem] p-4 shadow-[0_64px_96px_-12px_rgba(0,0,0,0.3)] border border-white/10 group overflow-hidden aspect-[4/3] flex items-center justify-center mx-auto lg:ml-auto max-w-[550px]">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 to-transparent"></div>
              <div className="w-64 h-64 bg-lime-400 rounded-full blur-[100px] opacity-20 animate-pulse-slow"></div>

              <div className="relative z-20 space-y-6 w-full px-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-1.5 w-24 bg-lime-400/50 rounded-full"></div>
                  <div className="h-8 w-8 bg-white/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="text-lime-400" size={14} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center gap-2">
                    <Presentation className="text-lime-400" size={32} />
                    <span className="text-[8px] font-bold text-white uppercase opacity-50">Teacher Mode</span>
                  </div>
                  <div className="h-32 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center gap-2">
                    <GraduationCap className="text-white" size={32} />
                    <span className="text-[8px] font-bold text-white uppercase opacity-50">Student Mode</span>
                  </div>
                </div>
                <div className="h-12 w-full bg-white/5 border border-white/10 rounded-2xl flex items-center px-6">
                  <div className="h-1.5 w-full bg-gradient-to-r from-lime-500 to-transparent rounded-full opacity-50"></div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 h-24 w-24 bg-white rounded-full shadow-xl flex items-center justify-center flex-col text-center border border-slate-50 rotate-12 animate-subtle-bounce z-30">
              <span className="text-[8px] font-black uppercase text-slate-400 leading-tight">Board<br />Ready</span>
              <span className="text-base font-black text-slate-950 tracking-tighter uppercase">NCERT</span>
            </div>

            <div className="absolute -bottom-8 -left-8 p-6 bg-slate-950 text-white rounded-[2.5rem] shadow-2xl z-20 space-y-2 max-w-[220px] border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lime-400 animate-ping"></div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-lime-400">All Platforms</span>
              </div>
              <p className="text-[11px] font-bold leading-tight uppercase tracking-tight">Sync Entire Academic Progress Across All Devices</p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Trust Loop - Full Width Panoramic Marquee */}
      <section className="py-20 border-y border-slate-50 bg-slate-50/30 overflow-hidden relative z-10 w-full">
        <div className="w-full px-6 md:px-12 lg:px-20 space-y-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">Empowering Every Indian Classroom & Learning Space</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 lg:gap-x-20 gap-y-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {['NCERT', 'CBSE', 'ICSE', 'UP BOARD', 'JEE / NEET', 'SAT', 'UPSC', 'IB'].map((board) => (
              <span key={board} className="text-3xl lg:text-5xl font-black text-slate-400 hover:text-slate-950 transition-colors font-display tracking-tighter uppercase">{board}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Unified Toolkit - Balanced Grid */}
      <section className="py-32 px-6 md:px-12 lg:px-20 relative z-10 w-full">
        <div className="w-full space-y-20">
          <div className="max-w-3xl space-y-6">
            <div className="w-12 h-1 bg-lime-500 rounded-full"></div>
            <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tight text-slate-950 leading-tight">
              One Unified <br />
              <span className="text-slate-400 italic">Ecosystem.</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Whether you are architecting a lecture or decoding a complex theorem,
              Learnivo AI provide the ultimate advantage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* For Teachers */}
            <motion.div
              whileHover={{ y: -10 }}
              className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/20 group hover:border-lime-200 transition-all duration-500"
            >
              <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-black/10">
                <Presentation size={28} />
              </div>
              <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-4 text-slate-950">Teacher Suite</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Generate NEP-synced lesson plans, automated assessments, and visual aids in 30 seconds.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950">
                Explore Portal <ArrowRight size={14} />
              </div>
            </motion.div>

            {/* For Students */}
            <motion.div
              whileHover={{ y: -10 }}
              className="p-10 bg-lime-500 text-white rounded-[3rem] shadow-2xl shadow-lime-500/20 group transition-all duration-500"
            >
              <div className="w-14 h-14 bg-white text-lime-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-white/10">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-4 text-white">Student Hub</h3>
              <p className="text-lime-50 font-medium leading-relaxed mb-8">
                24/7 AI Tutor. Master any board exam with mother-tongue explanations and localized mock tests.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                Start Learning <ArrowRight size={14} />
              </div>
            </motion.div>

            {/* Linguistics */}
            <motion.div
              whileHover={{ y: -10 }}
              className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/20 group hover:border-lime-200 transition-all duration-500"
            >
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-4 text-slate-950">Regional AI</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Full AI capabilities in 22+ Indian languages. Breaking barriers for inclusive education across Bharat.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Language First <Check size={14} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Panoramic Footer */}
      <footer className="py-24 border-t border-slate-100 relative z-10 bg-white w-full">
        <div className="w-full px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-10 mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-slate-950 flex items-center justify-center rounded-xl rotate-[-6deg] shadow-lg">
              <BookOpen className="text-lime-400" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-950 font-display uppercase">LEARNIVO<span className="text-lime-500">.</span></span>
          </div>
          <div className="flex flex-col md:text-right items-center md:items-end gap-1">
            <p className="text-[10px] text-slate-950 font-black uppercase tracking-[0.4em]">The Next Era of Bharat's Education</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 Learnivo AI Technologies. Built with Precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
