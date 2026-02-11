
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

      {/* Modern Glass Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-6xl">
        <nav className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2rem] px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6">
              <BookOpen className="text-lime-400" size={18} />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              LEARNIVO <span className="text-lime-600 italic">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center bg-slate-100/50 rounded-full p-1 border border-slate-200/50">
            {['How it works', 'Features', 'Community'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-white rounded-full transition-all">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 px-2 transition-colors">
              Login
            </Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-black text-white font-black rounded-full text-xs shadow-xl shadow-black/10 hover:shadow-black/20 transition-all uppercase tracking-widest"
              >
                Register Now
              </motion.button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6 max-w-4xl"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-50 border border-lime-100 text-lime-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <Sparkles size={12} className="animate-pulse" />
              Empowering India's Teachers with AI
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tight leading-[1] text-slate-900 font-headline">
              The AI Co-pilot for <br />
              <span className="text-lime-600 italic">Modern Schooling.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
              Save hours of prep time, create hyper-local lesson plans, and get back to what you love—inspiring your students.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/register">
                <button className="group px-10 h-16 bg-lime-500 text-black font-black rounded-3xl text-xl shadow-xl shadow-lime-500/20 hover:bg-lime-400 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                  Start Free Journey
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-10 h-16 bg-white border border-slate-200 text-slate-800 font-black rounded-3xl text-xl hover:bg-slate-50 transition-all active:scale-[0.98]">
                Watch Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Compact Mockup Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-5xl pt-16"
          >
            <div className="bg-white rounded-[3rem] p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 ring-8 ring-slate-50/50 overflow-hidden relative">
              <div className="aspect-[16/9] bg-slate-50 rounded-[2.5rem] overflow-hidden relative flex border border-slate-200/50">
                {/* Sidebar Mockup */}
                <div className="w-20 h-full border-r border-slate-200 bg-white p-6 flex flex-col gap-8 items-center">
                  <div className="w-10 h-10 bg-lime-100 rounded-xl"></div>
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 bg-slate-50 rounded-lg"></div>)}
                </div>
                {/* Content Mockup */}
                <div className="flex-1 p-10 text-left space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="space-y-3">
                      <div className="h-5 w-40 bg-slate-100 rounded-full"></div>
                      <div className="h-10 w-80 bg-slate-900 rounded-xl"></div>
                    </div>
                    <div className="h-12 w-12 bg-slate-100 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm p-4"><div className="w-full h-full bg-lime-50 rounded-lg"></div></div>
                    <div className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm p-4"><div className="w-full h-full bg-blue-50 rounded-lg"></div></div>
                    <div className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm p-4"><div className="w-full h-full bg-orange-50 rounded-lg"></div></div>
                  </div>
                  <div className="h-44 bg-white rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center relative overflow-hidden group">
                    <Zap className="text-lime-400 relative z-10" size={48} />
                    <div className="absolute inset-x-0 h-1 bg-lime-500/20 bottom-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black font-headline text-slate-900 tracking-tight">Simple. <span className="text-lime-600">Powerful.</span> Seamless.</h2>
            <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto">Get your AI-powered classroom ready in under 60 seconds.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-slate-200 border-t border-dashed border-slate-300"></div>

            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-8">
                <div className="w-24 h-24 bg-white rounded-[2rem] border-4 border-slate-50 flex items-center justify-center shadow-2xl shadow-slate-200/50 transform transition-transform hover:scale-110">
                  <span className="text-3xl font-black text-lime-600">{step.num}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{step.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-[280px]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-4">
              <span className="text-lime-600 font-black tracking-[0.2em] text-[11px] uppercase ml-1">AI-First Toolkit</span>
              <h2 className="text-5xl md:text-7xl font-black font-headline text-slate-900 leading-tight">Tools that speak <br /><span className="text-slate-300">Pedagogy.</span></h2>
            </div>
            <Link href="/register" className="mb-2">
              <button className="px-8 py-4 border-2 border-slate-900 text-slate-900 font-black rounded-2xl hover:bg-slate-900 hover:text-white transition-all">Explore All 12+ Tools</button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-lime-200 hover:shadow-2xl hover:shadow-lime-500/10 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-all shadow-sm">
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 32 })}
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-10 flex items-center gap-2 text-lime-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  Learn more <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-32 px-6 bg-slate-900 text-white rounded-[5rem] mx-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
              <Shield size={14} className="text-lime-500" />
              Trusted by 50+ Edu-Partners
            </div>
            <h2 className="text-5xl md:text-7xl font-black font-headline leading-[1] tracking-tight">Built by teachers, <br />Enhanced by <span className="text-lime-400">Intelligence.</span></h2>
            <p className="text-slate-400 text-xl font-medium leading-relaxed">
              We understand that technology should never be a barrier. That's why Learnivo AI is built with an offline-first architecture and regional language support out of the box.
            </p>
            <div className="grid grid-cols-2 gap-10 pt-6 border-t border-white/10">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-lime-400">
                  <Users size={20} />
                  <span className="font-black uppercase tracking-widest text-xs">Community Focused</span>
                </div>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">Collaborate with educators across the country in private secure circles.</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-lime-400">
                  <Wand2 size={20} />
                  <span className="font-black uppercase tracking-widest text-xs">AI Ethics</span>
                </div>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">Safety filters designed specifically for Indian classroom sensitivities.</p>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-[120%] aspect-square bg-lime-500/20 rounded-full blur-[120px] absolute"></div>
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="w-40 h-40 bg-white shadow-2xl rounded-[3rem] flex items-center justify-center animate-float">
                <Globe size={48} className="text-lime-600" />
              </div>
              <div className="w-40 h-40 bg-zinc-800 border border-white/10 rounded-[3rem] shadow-2xl flex items-center justify-center translate-y-12 animate-float delay-500">
                <Zap size={48} className="text-yellow-400 fill-yellow-400" />
              </div>
              <div className="w-40 h-40 bg-zinc-800 border border-white/10 rounded-[3rem] shadow-2xl flex items-center justify-center -translate-y-6 animate-float delay-1000">
                <Sparkles size={48} className="text-blue-400" />
              </div>
              <div className="w-40 h-40 bg-lime-500 rounded-[3rem] shadow-[0_32px_64px_rgba(132,204,22,0.3)] flex items-center justify-center translate-y-6 animate-float delay-200">
                <Shield size={48} className="text-black" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 text-center">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="max-w-4xl mx-auto p-20 bg-lime-50 rounded-[4rem] border-2 border-lime-100 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-200/40 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-7xl font-black font-headline text-slate-900 tracking-tight">Step into the <span className="text-lime-600">New Era</span> <br />of Pedagogy.</h2>
            <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
              Don't let admin work define your teaching career. Join Learnivo AI today and liberate your creativity.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Link href="/register">
                <button className="px-12 h-20 bg-black text-white font-black rounded-3xl text-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98]">
                  Get Started Free
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 bg-slate-50/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="space-y-6 max-w-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
                <BookOpen className="text-lime-400" size={16} />
              </div>
              <span className="font-black tracking-tight text-xl text-slate-900 uppercase">Learnivo AI</span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed">Revolutionizing the way Indian educators interact with technology and curriculum.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Platform</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-900">
                <li><Link href="/register" className="hover:text-lime-600 transition-colors">Register</Link></li>
                <li><Link href="/login" className="hover:text-lime-600 transition-colors">Login</Link></li>
                <li><Link href="/dashboard" className="hover:text-lime-600 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Connect</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-900">
                <li><Link href="#" className="hover:text-lime-600 transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-lime-600 transition-colors">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-lime-600 transition-colors">Email Us</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Legal</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-900">
                <li><Link href="#" className="hover:text-lime-600 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-lime-600 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-10 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">© 2026 Learnivo AI. Made with 🍋 in India</p>
          <p className="text-xs font-bold text-slate-300">Proudly supporting the National Education Policy 2020</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
