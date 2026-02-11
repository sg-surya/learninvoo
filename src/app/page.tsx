
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Wand2,
  BookOpen,
  Zap,
  Globe,
  BarChart,
  ChevronRight,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  MessageSquare,
  Users
} from 'lucide-react';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const features = [
    {
      icon: <Layers className="text-lime-600" />,
      title: "Smart Resource Hub",
      description: "Access millions of curriculum-aligned resources, and let AI curate the best ones for your specific class needs."
    },
    {
      icon: <MessageSquare className="text-blue-600" />,
      title: "AI Parent Assistant",
      description: "Generate professional progress reports and meeting notes in 22+ Indian languages instantly."
    },
    {
      icon: <Clock className="text-orange-600" />,
      title: "Time-Saving Workflows",
      description: "Automate attendance, grading and scheduling, giving you back 15+ hours every single week."
    }
  ];

  const steps = [
    { num: "01", title: "Select Board & Grade", desc: "Choose from CBSE, ICSE or State boards for any grade level." },
    { num: "02", title: "AI Customization", desc: "AI generates personalized plans based on your teaching style." },
    { num: "03", title: "Launch & Engage", desc: "Present your lesson with interactive aids and hyper-local stories." }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-lime-200 selection:text-lime-900 overflow-x-hidden">
      {/* Soft Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-lime-50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px] opacity-40"></div>
      </div>

      {/* Navbar (Compact) */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <BookOpen className="text-lime-400" size={18} />
            </div>
            <span className="text-lg font-black tracking-tight">
              LEARNIVO <span className="text-lime-600 italic">AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <Link href="#how-it-works" className="hover:text-black transition-colors">How it works</Link>
            <Link href="#features" className="hover:text-black transition-colors">Tools</Link>
            <Link href="#impact" className="hover:text-black transition-colors">Impact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-[11px] font-bold text-slate-500 hover:text-black uppercase tracking-widest px-2">Login</Link>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-black text-white font-bold rounded-full text-xs transition-shadow hover:shadow-lg hover:shadow-black/10"
              >
                Go to Dashboard
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Compact) */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6 max-w-3xl"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-100 text-lime-700 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} />
              India's Leading AI for Educators
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-slate-900 font-headline">
              Teach smarter, <br />
              <span className="text-lime-600 italic">not harder.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Empower your classroom with India's most advanced AI platform. Specialized tools for lesson planning, local content, and admin tasks.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/dashboard">
                <button className="group px-8 h-14 bg-lime-500 text-black font-black rounded-2xl text-lg shadow-xl shadow-lime-500/20 hover:bg-lime-400 transition-all flex items-center justify-center gap-2">
                  Start Free Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-8 h-14 bg-white border border-slate-200 text-slate-800 font-bold rounded-2xl text-lg hover:bg-slate-50 transition-all">
                See Live Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Compact Mockup Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-5xl pt-10"
          >
            <div className="bg-white rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 ring-4 ring-slate-50 overflow-hidden relative group">
              <div className="aspect-[16/9] bg-slate-50 rounded-2xl overflow-hidden relative flex">
                {/* Sidebar Mockup */}
                <div className="w-16 h-full border-r border-slate-200 bg-white p-4 flex flex-col gap-6 items-center">
                  <div className="w-8 h-8 bg-lime-100 rounded-lg"></div>
                  <div className="w-6 h-6 bg-slate-100 rounded-md"></div>
                  <div className="w-6 h-6 bg-slate-100 rounded-md"></div>
                  <div className="w-6 h-6 bg-slate-100 rounded-md"></div>
                </div>
                {/* Content Mockup */}
                <div className="flex-1 p-8 text-left space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
                      <div className="h-8 w-64 bg-slate-900 rounded-lg"></div>
                    </div>
                    <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-white rounded-xl border border-slate-100 shadow-sm"></div>
                    <div className="h-24 bg-white rounded-xl border border-slate-100 shadow-sm"></div>
                    <div className="h-24 bg-white rounded-xl border border-slate-100 shadow-sm"></div>
                  </div>
                  <div className="h-40 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center">
                    <Zap className="text-lime-400 animate-pulse" size={32} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works (New Section) */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-black font-headline text-slate-900">Get started in <span className="text-lime-600">3 simple steps.</span></h2>
            <p className="text-slate-500 font-medium text-lg">Intuitive design that fits right into your existing schedule.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-slate-200 z-0"></div>

            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-white rounded-3xl border border-slate-200 flex items-center justify-center shadow-lg shadow-slate-200/50">
                  <span className="text-2xl font-black text-lime-600">{step.num}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid (Refined) */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div className="space-y-4">
              <span className="text-lime-600 font-black tracking-widest text-[11px] uppercase">Powerful AI Toolkit</span>
              <h2 className="text-4xl md:text-6xl font-black font-headline text-slate-900 leading-tight">Beyond Simple <br /><span className="text-slate-400 font-light">Question-Answering.</span></h2>
            </div>
            <p className="text-slate-500 text-lg font-medium lg:pb-2">
              Our tools are deep-integrated with Indian curriculum standards and pedagogical best practices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="group p-8 bg-white border border-slate-100 rounded-3xl hover:border-lime-200 hover:shadow-2xl hover:shadow-lime-500/5 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 28 })}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration/Methodology (New Section) */}
      <section className="py-24 px-6 bg-slate-900 text-white rounded-[4rem] mx-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white/60 text-[10px] font-bold uppercase tracking-widest">
              <Shield size={12} />
              Trust & Safety First
            </div>
            <h2 className="text-4xl md:text-6xl font-black font-headline leading-[1.05]">Built for the <br />Modern AI-Teacher <br /><span className="text-lime-400">Collaborator.</span></h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              We believe AI shouldn't replace teachers, but should act as a force-multiplier. Our platform is designed to keep the human in the loop while handling the repetitive tasks.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-lime-400">
                  <Users size={18} />
                  <span className="font-bold">Student Privacy</span>
                </div>
                <p className="text-xs text-slate-500">Zero data sharing with 3rd parties. GDPR & DPIA compliant.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-lime-400">
                  <Wand2 size={18} />
                  <span className="font-bold">Pedagogical AI</span>
                </div>
                <p className="text-xs text-slate-500">Engineered to follow Bloom's Taxonomy standards.</p>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-[400px] aspect-square bg-gradient-to-tr from-lime-500/20 to-blue-500/10 rounded-full blur-3xl absolute"></div>
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md animate-float">
                <Globe size={40} className="text-lime-400" />
              </div>
              <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md translate-y-8 animate-float delay-700">
                <Zap size={40} className="text-yellow-400" />
              </div>
              <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md -translate-y-4 animate-float delay-300">
                <Sparkles size={40} className="text-blue-400" />
              </div>
              <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md translate-y-4 animate-float delay-1000">
                <Shield size={40} className="text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section (Refined & Smaller) */}
      <section id="impact" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <h2 className="text-3xl font-black font-headline uppercase tracking-widest text-slate-400">Real Impact for Real Schools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">15hr+</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time Saved Weekly</p>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">220k</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resources Created</p>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">4.9/5</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teacher Satisfaction</p>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">5.2k</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified Schools</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Compact) */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto p-12 bg-lime-50 rounded-[3rem] border border-lime-100 shadow-2xl shadow-lime-500/5 space-y-8">
          <h2 className="text-4xl md:text-5xl font-black font-headline text-slate-900">Join the <span className="text-lime-600">future</span> of Indian education.</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Start your free trial today and experience the power of the Learnivo AI toolkit. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/dashboard">
              <button className="px-10 h-16 bg-black text-white font-black rounded-2xl text-xl hover:bg-slate-800 transition-all shadow-xl shadow-black/10">
                Go to Dashboard
              </button>
            </Link>
            <button className="px-10 h-16 bg-white border border-slate-200 text-slate-800 font-bold rounded-2xl text-xl hover:bg-slate-50 transition-all">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer (Compact) */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
              <BookOpen className="text-lime-400" size={14} />
            </div>
            <span className="font-black tracking-tight text-slate-900 uppercase">Learnivo AI</span>
          </div>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400">
            <Link href="#" className="hover:text-black transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-black transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms</Link>
            <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
          </div>
          <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">
            © 2026 Learnivo AI. Made with 🍋 in India
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
