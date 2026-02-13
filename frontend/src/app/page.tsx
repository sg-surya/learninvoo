
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
  GraduationCap,
  Presentation,
  ExternalLink,
  BrainCircuit,
  Rocket,
  Plus,
  Minus,
  Languages,
  QrCode,
  MessageCircle,
  BarChart,
  Users,
  ShieldCheck,
  PlayCircle,
  FileText,
  Target,
  Clock,
  Database
} from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [demoTopic, setDemoTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDemoResult, setShowDemoResult] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [pricingTab, setPricingTab] = useState<'teachers' | 'students'>('teachers');
  const [user, setUser] = useState<any>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('learnivo_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrolled(container.scrollTop > 20);
      const totalScroll = container.scrollHeight - container.clientHeight;
      const currentProgress = (container.scrollTop / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const runDemo = () => {
    if (!demoTopic) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowDemoResult(true);
    }, 1500);
  };

  const schoolLogos = [
    "KV Sangathan", "Delhi Public School", "DAV Schools", "Army Public School", "Ryan International", "Amity Global", "The Heritage School"
  ];

  const faqs = [
    { q: "Is Learnivo AI aligned with NEP 2020?", a: "Yes, every lesson plan and assessment generated is strictly aligned with NEP 2020 guidelines, following Bloom's Taxonomy and the latest NCERT curriculum standards for Holistic Progress Cards." },
    { q: "Can it generate content in regional languages?", a: "Absolutely. We support 22+ Indian languages including Hindi, Tamil, Marathi, Bengali, and Gujarati. The AI understands localized concepts and dialect nuances for better student clarity." },
    { q: "How secure is my school's data?", a: "We prioritize security above all. All student and teacher data is encrypted with enterprise-grade standards. We do not use your school's private data to train our public models." },
    { q: "Does it work with existing school LMS?", a: "Learnivo AI is built to be modular. You can export content to common LMS formats or use our API for direct integration with your existing ERP systems." },
    { q: "What boards are supported besides CBSE?", a: "While CBSE is our primary focus, we have deep support for ICSE, State Boards (UP, Bihar, Maharashtra, etc.), and international curricula like IB and Cambridge." },
    { q: "How does 'Vasu' handle complex subjects like Math and Physics?", a: "Vasu uses advanced reasoning models to solve step-by-step math problems and visualize physics concepts, ensuring students don't just get the answer, but understand the logic behind it." }
  ];

  return (
    <div className="h-screen w-full bg-background overflow-hidden selection:bg-lime-500 selection:text-white transition-colors duration-300">
      <div
        ref={scrollContainerRef}
        className="h-full w-full bg-card-bg overflow-y-auto overflow-x-hidden relative text-foreground font-sans shadow-2xl transition-colors duration-300"
      >

        {/* Scroll Progress Bar */}
        <div className="sticky top-0 left-0 right-0 h-1 bg-lime-500 z-[1001] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

        {/* Background Pattern */}
        <div className="sticky inset-0 pointer-events-none z-0 opacity-30 bg-dot-pro h-0 overflow-visible">
          <div className="absolute inset-0 h-screen w-screen bg-dot-pro" />
        </div>

        {/* SHARED HEADER SYSTEM */}
        <header className="sticky top-0 left-0 right-0 z-[999] overflow-hidden">

          {/* Navbar */}
          <nav className={`w-full flex items-center px-6 md:px-12 lg:px-20 border-b transition-all duration-300 ${scrolled ? 'h-16 shadow-lg' : 'h-20'} bg-header-bg backdrop-blur-md border-border`}>
            <div className="w-full flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-foreground flex items-center justify-center rounded rotate-[-6deg] shadow-lg group-hover:rotate-0 transition-transform">
                  <BookOpen className="text-lime-400" size={18} />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase text-foreground">LEARNIVO<span className="text-lime-500">.</span></span>
              </Link>

              <div className="hidden lg:flex items-center gap-10">
                <Link href="/for-teachers" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-lime-500 transition-colors">For Teachers</Link>
                <Link href="/for-students" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-lime-500 transition-colors">For Students</Link>
                <div className="h-4 w-px bg-border"></div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  <Languages size={14} /> EN/HI/MR
                </button>
              </div>

              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[10px] font-bold rounded hover:bg-foreground/90 transition-all uppercase tracking-widest shadow-lg">
                      Go to Dashboard <ArrowRight size={14} />
                    </Link>
                    <div className="w-10 h-10 rounded-full border border-border overflow-hidden shadow-sm">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="hidden sm:block text-[10px] font-bold uppercase tracking-widest px-2 text-muted-foreground hover:text-foreground">Sign In</Link>
                    <Link href="/register">
                      <motion.button whileTap={{ scale: 0.95 }} className="px-5 py-2.5 bg-foreground text-background text-[10px] font-bold rounded uppercase tracking-widest shadow-xl hover:opacity-90 transition-all">Get Started</motion.button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="relative pt-24 md:pt-28 pb-20 px-6 md:px-12 lg:px-20 w-full">
          <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-lime-500/10 border border-lime-500/20 text-lime-600 dark:text-lime-400 text-[10px] font-black uppercase tracking-[0.2em] rounded">
                <ShieldCheck size={14} /> Official NEP 2020 Aligned
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black leading-[0.95] uppercase tracking-tighter text-foreground">
                Bharat <br />
                Teaches <br />
                <span className="text-lime-600">Smarter.</span>
              </h1>

              <div className="space-y-6">
                <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed uppercase tracking-tighter">
                  The complete AI operating system for <span className="text-foreground font-black border-b-2 border-lime-400">50,000+ Classrooms.</span> Align with NEP 2020 and master subjects in 22+ languages.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link href={user ? "/dashboard" : "/register"}>
                    <motion.button whileTap={{ scale: 0.95 }} className="px-8 h-16 bg-foreground text-background font-black rounded text-[12px] uppercase tracking-widest shadow-2xl flex items-center gap-2 group whitespace-nowrap">
                      {user ? "Open My Dashboard" : "Get Started Free"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <div className="flex items-center gap-3 px-6 h-16 bg-card-bg border border-border rounded text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
                    <PlayCircle size={18} /> Watch Platform in Action
                  </div>
                </div>
              </div>

              <div className="pt-10 flex flex-wrap justify-center lg:justify-start gap-10">
                <div className="space-y-1">
                  <div className="text-3xl font-black tracking-tighter text-foreground">1.2M+</div>
                  <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Lessons Created</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black tracking-tighter text-lime-500">50K+</div>
                  <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Active Schools</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-foreground rounded-2xl p-4 shadow-2xl border border-white/10 aspect-[4/3] flex items-center justify-center mx-auto lg:ml-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 to-transparent"></div>
                <div className="relative z-20 space-y-6 w-full px-8 text-background">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-background/5 border border-background/10 rounded-xl flex flex-col items-center justify-center gap-2">
                      <Presentation className="text-lime-400" size={32} />
                      <span className="text-[8px] font-bold uppercase opacity-50 tracking-widest">Teacher Suite</span>
                    </div>
                    <div className="h-32 bg-background/5 border border-background/10 rounded-xl flex flex-col items-center justify-center gap-2">
                      <GraduationCap className="text-background" size={32} />
                      <span className="text-[8px] font-bold uppercase opacity-50 tracking-widest">Student Hub</span>
                    </div>
                  </div>
                  <div className="h-12 w-full bg-background/5 border border-background/10 rounded-xl flex items-center px-6">
                    <div className="h-1.5 w-full bg-gradient-to-r from-lime-500 to-transparent rounded-full opacity-50"></div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 h-28 w-28 bg-card-bg rounded-full shadow-2xl flex items-center justify-center flex-col text-center border border-border rotate-12 animate-subtle-bounce z-30">
                <span className="text-[8px] font-black uppercase text-muted-foreground leading-tight">Board<br />Ready</span>
                <span className="text-xl font-black text-foreground tracking-tighter uppercase">NCERT</span>
              </div>
            </div>
          </div>
        </main>

        {/* Social Proof Carousel */}
        <section className="py-20 border-y border-border bg-muted/30 overflow-hidden w-full relative">
          <div className="flex whitespace-nowrap animate-carousel hover:pause">
            {Array(3).fill([...schoolLogos]).flat().map((logo, i) => (
              <span key={i} className="text-2xl md:text-3xl font-black text-muted-foreground/40 mx-10 uppercase tracking-tighter hover:text-foreground transition-colors transition-opacity duration-300">{logo}</span>
            ))}
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="py-32 px-6 md:px-12 lg:px-20 w-full">
          <div className="bg-foreground rounded-2xl p-12 lg:p-20 text-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 blur-[100px] -mr-48 -mt-48" />
            <div className="grid lg:grid-cols-2 gap-20 relative z-10 w-full">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter">
                  The Magic <br />
                  <span className="text-lime-400 italic">Architect.</span>
                </h2>
                <p className="text-background/70 text-lg font-medium">Type any topic and see Learnivo AI draft a 40-min lesson plan in real-time, complete with pedagogical hooks and board-specific questions.</p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Topic (e.g. Mughal Empire, Geometry, Gravity...)"
                    className="w-full h-16 bg-background/5 border border-background/10 rounded px-8 pr-20 focus:border-lime-500 outline-none transition-all text-background"
                    value={demoTopic}
                    onChange={(e) => setDemoTopic(e.target.value)}
                  />
                  <motion.button
                    onClick={runDemo}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 top-2 h-12 w-12 bg-lime-500 rounded flex items-center justify-center text-slate-950 shadow-xl"
                  >
                    <Zap size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="bg-background/5 border border-background/10 rounded-xl p-8 min-h-[300px] relative">
                {!isGenerating && !showDemoResult && <div className="text-background/30 uppercase tracking-widest text-[10px] font-black text-center mt-20 font-display">Simulated AI Generator</div>}
                {isGenerating && <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-background/10 rounded animate-pulse" />
                  <div className="h-4 w-full bg-background/10 rounded animate-pulse" />
                  <div className="h-4 w-full bg-background/10 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-background/10 rounded animate-pulse" />
                </div>}
                {showDemoResult && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-background/10 pb-4">
                    <h4 className="text-xl font-black uppercase text-lime-400 tracking-tight">{demoTopic}</h4>
                    <span className="text-[8px] font-black px-2 py-1 bg-background/10 rounded">NCERT SYNCED</span>
                  </div>
                  <div className="grid gap-4">
                    <div className="flex gap-3 items-start p-3 bg-background/5 rounded border border-white/5">
                      <Target className="text-lime-500 flex-shrink-0" size={16} />
                      <div>
                        <div className="text-[10px] font-black uppercase text-background mb-1">Learning Outcomes</div>
                        <p className="text-[10px] text-background/70">Students will define and visualize {demoTopic} concepts effectively.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start p-3 bg-background/5 rounded border border-white/5">
                      <Clock className="text-lime-500 flex-shrink-0" size={16} />
                      <div>
                        <div className="text-[10px] font-black uppercase text-background mb-1">Time Block: 40 Mins</div>
                        <p className="text-[10px] text-background/70">10m Intro Hook • 20m Core Logic • 10m Assessment</p>
                      </div>
                    </div>
                  </div>
                </motion.div>}
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="py-32 px-6 md:px-12 lg:px-20 w-full space-y-32">
          <div className="space-y-6 max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-black uppercase text-foreground tracking-tighter leading-none">Built for <br /> <span className="text-muted-foreground/40">Scale.</span></h2>
            <p className="text-xl text-muted-foreground font-medium uppercase tracking-tighter">Infrastructure trusted by India's largest educational chains.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* Rapid Architecture Card */}
            <motion.div whileHover={{ y: -5 }} className="md:col-span-4 lg:col-span-4 bg-muted/50 rounded-xl p-10 border border-border flex flex-col justify-between group">
              <div className="space-y-8">
                <div className="w-16 h-16 bg-card-bg rounded border border-border flex items-center justify-center"><Zap className="text-lime-500" size={32} /></div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black uppercase tracking-tight text-foreground">Rapid Architecture</h3>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-xl">
                    Automate lesson planning based on Bloom's Taxonomy. Input a topic or PDF and get learning outcomes, hook activities, and board-specific assessments instantly. Fully NEP 2020 compliant architecture.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["NCERT", "CBSE", "ICSE", "State Boards"].map(board => <span key={board} className="px-4 py-2 bg-card-bg rounded border border-border text-[10px] font-black uppercase text-muted-foreground">{board}</span>)}
                </div>
              </div>
            </motion.div>

            {/* Vasu AI Card */}
            <motion.div whileHover={{ y: -5 }} className="md:col-span-4 lg:col-span-2 bg-foreground rounded-xl p-10 text-background flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-dot-white opacity-10" />
              <div className="space-y-8 relative z-10">
                <BrainCircuit className="text-lime-400" size={40} />
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold uppercase tracking-tight">Vasu AI 24/7</h3>
                  <p className="text-background/70 text-sm leading-relaxed">
                    A dedicated AI tutor trained on Bharat's curriculum. Vasu handles 24/7 doube clearing in native languages, generates weekly reports for parents, and automates administrative paperwork with 99% accuracy.
                  </p>
                </div>
              </div>
              <div className="mt-10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-background/50">Online & Ready</span>
              </div>
            </motion.div>

            {/* Analytics Card */}
            <motion.div whileHover={{ y: -5 }} className="md:col-span-2 lg:col-span-2 bg-card-bg rounded-xl p-10 border border-border flex flex-col justify-between">
              <div className="space-y-6">
                <BarChart className="text-lime-600" size={40} />
                <h4 className="text-2xl font-black uppercase text-foreground leading-tight">Neural <br /> Analytics</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Identify knowledge gaps across your entire class instantly. Track subject mastery scores, predictive exam performance, and student engagement heatmaps with deep data insights.
                </p>
              </div>
            </motion.div>

            {/* Language Card */}
            <motion.div whileHover={{ y: -5 }} className="md:col-span-2 lg:col-span-2 bg-lime-500 rounded-xl p-10 border border-lime-600 flex flex-col justify-between text-white">
              <div className="space-y-6">
                <Languages size={40} />
                <h4 className="text-2xl font-black uppercase leading-tight">22+ Native <br /> Languages</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Break the English barrier with native language processing. All lesson plans, student chats, and doubt evaluations are supported in Hindi, Tamil, Marathi, Bengali, and 18+ other languages.
                </p>
              </div>
            </motion.div>

            {/* Extra Data Card */}
            <motion.div whileHover={{ y: -5 }} className="md:col-span-4 lg:col-span-2 bg-muted/50 rounded-xl p-10 border border-border flex flex-col justify-between group">
              <div className="space-y-6">
                <Database className="text-foreground" size={40} />
                <h4 className="text-xl font-black uppercase text-foreground leading-tight">Curriculum <br /> Intelligence</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Daily sync with board updates. When NCERT changes a chapter, Learnivo AI updates its entire logic base across all generated content within hours.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Expanded Pricing Section */}
        <section className="py-32 px-6 md:px-12 lg:px-20 w-full space-y-16">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-foreground">Simple <br /> <span className="text-lime-500">Infrastructure.</span></h2>
            <p className="text-xl text-muted-foreground font-medium uppercase tracking-tighter">Choose the plan that fits your classroom or institution.</p>

            {/* Toggles and Tabs */}
            <div className="flex flex-col items-center gap-10 pt-8">
              {/* Type Switcher */}
              <div className="flex p-1.5 bg-muted rounded-2xl w-fit">
                <button
                  onClick={() => setPricingTab('teachers')}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pricingTab === 'teachers' ? 'bg-card-bg shadow-xl text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  For Teachers
                </button>
                <button
                  onClick={() => setPricingTab('students')}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pricingTab === 'students' ? 'bg-card-bg shadow-xl text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  For Students
                </button>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground/30'}`}>Monthly</span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className="w-14 h-7 bg-foreground rounded-full relative p-1 transition-colors"
                >
                  <motion.div
                    animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
                    className="w-5 h-5 bg-lime-500 rounded-full shadow-lg shadow-lime-500/50"
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground/30'}`}>Annual</span>
                  <span className="bg-lime-500/10 text-lime-600 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-wider">Save 20%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 w-full">
            {/* Free Tier */}
            <div className="p-10 bg-card-bg border border-border rounded-xl shadow-sm space-y-10 flex flex-col justify-between hover:border-muted-foreground/30 transition-all">
              <div className="space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Basic Tier</div>
                <div className="text-6xl font-black tracking-tighter text-foreground">₹0<span className="text-xl font-medium text-muted-foreground/30 ml-2 uppercase italic">FREE</span></div>
                <div className="space-y-4 pt-6 border-t border-border/50">
                  {(pricingTab === 'teachers' ? [
                    "5 Lesson Plans / Mo",
                    "Basic AI Tutor Support",
                    "NCERT Content Access",
                    "English & Hindi support",
                    "Standard PDF Exports"
                  ] : [
                    "3 AI Doubt Solves / Day",
                    "Public Study Groups",
                    "Standard Note Templates",
                    "English & Hindi support",
                    "Mobile App Access"
                  ]).map(item => <div key={item} className="flex gap-3 text-xs font-semibold uppercase tracking-tight text-muted-foreground"><Check size={14} className="text-muted-foreground/20" /> {item}</div>)}
                </div>
              </div>
              <button className="w-full h-14 bg-muted text-muted-foreground/60 font-bold uppercase text-[10px] tracking-widest rounded hover:bg-muted/80 transition-colors">Initialize Personal</button>
            </div>

            {/* Pro Tier */}
            <div className="p-10 bg-foreground text-background rounded-xl shadow-2xl space-y-10 border-t-8 border-lime-500 flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 bg-lime-500 text-slate-950 text-[8px] font-black px-2 py-1 rounded">MOST POPULAR</div>
              <div className="space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400">{pricingTab === 'teachers' ? 'Pro Educator' : 'Premium Student'}</div>
                <div className="relative">
                  <div className="text-6xl font-black tracking-tighter text-background">
                    ₹{pricingTab === 'teachers' ? (billingCycle === 'monthly' ? '499' : '399') : (billingCycle === 'monthly' ? '199' : '159')}
                    <span className="text-xl font-medium text-background/30 ml-2">/MO</span>
                  </div>
                  {billingCycle === 'annual' && <div className="text-[9px] font-black text-lime-400 uppercase tracking-widest mt-1">Billed Yearly</div>}
                </div>
                <div className="space-y-4 pt-6 border-t border-background/10">
                  {(pricingTab === 'teachers' ? [
                    "Unlimited Lesson Plans",
                    "Priority Vasu AI Assistant",
                    "All 22+ Indian Languages",
                    "Board-ready Mock Exams",
                    "Neural Performance Analytics",
                    "Custom Rubrics & Grading"
                  ] : [
                    "Unlimited Doubts with Vasu",
                    "Personalized Learning Path",
                    "Exam Simulation Hub",
                    "Regional Language Tutor",
                    "Ad-Free Clean Interface",
                    "Study Analytics Tracker"
                  ]).map(item => <div key={item} className="flex gap-3 text-xs font-semibold uppercase tracking-tight text-background/70"><Check size={14} className="text-lime-500" /> {item}</div>)}
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} className="w-full h-14 bg-lime-500 text-slate-950 font-black uppercase text-[10px] tracking-widest rounded shadow-xl">Go Pro Experience</motion.button>
            </div>

            {/* Institutional Tier */}
            <div className="p-10 bg-card-bg border border-border rounded-xl shadow-sm space-y-10 flex flex-col justify-between hover:border-muted-foreground/30 transition-all">
              <div className="space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">{pricingTab === 'teachers' ? 'School Hub' : 'District/Group'}</div>
                <div className="text-6xl font-black tracking-tighter text-foreground">Custom</div>
                <div className="space-y-4 pt-6 border-t border-border/50">
                  {(pricingTab === 'teachers' ? [
                    "Unlimited Teacher Seats",
                    "Central School Analytics",
                    "API & ERP Integration",
                    "Custom AI Model Fine-tuning",
                    "Dedicated Account Manager",
                    "On-site Teacher Training"
                  ] : [
                    "School-wide Deployment",
                    "Admin Monitoring Desk",
                    "Custom Curriculum Lock",
                    "White-labeled Student App",
                    "Bulk License Savings",
                    "SLA Performance Guarantee"
                  ]).map(item => <div key={item} className="flex gap-3 text-xs font-semibold uppercase tracking-tight text-muted-foreground"><Check size={14} className="text-muted-foreground/20" /> {item}</div>)}
                </div>
              </div>
              <button className="w-full h-14 bg-foreground text-background font-bold uppercase text-[10px] tracking-widest rounded hover:opacity-90 transition-colors">{pricingTab === 'teachers' ? 'Request Quote' : 'Contact Sales'}</button>
            </div>
          </div>
        </section>

        {/* Expanded FAQ */}
        <section className="py-32 px-6 md:px-12 lg:px-20 w-full max-w-5xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-foreground">Knowledge <span className="text-muted-foreground/40">Base</span></h2>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Everything you need to know about the platform.</p>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full py-10 flex items-center justify-between text-left group"
                >
                  <span className="font-bold text-foreground uppercase tracking-tight text-base group-hover:text-lime-600 transition-colors">{faq.q}</span>
                  {activeFaq === i ? <Minus size={20} className="text-foreground" /> : <Plus size={20} className="text-muted-foreground/30" />}
                </button>
                <div className={`transition-all duration-500 ${activeFaq === i ? 'pb-10 max-h-[300px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl font-medium">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-32 border-t border-border bg-card-bg w-full px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-4 gap-16">
            <div className="lg:col-span-2 space-y-10">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-foreground flex items-center justify-center rounded rotate-[-6deg]">
                  <BookOpen className="text-lime-400" size={24} />
                </div>
                <span className="text-4xl font-black tracking-tighter text-foreground uppercase">LEARNIVO</span>
              </Link>
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Stay updated on India's AI Education Revolution.</p>
                <div className="flex gap-2 max-w-md">
                  <input type="email" placeholder="principal@school.com" className="flex-1 h-14 bg-muted border border-border rounded px-6 text-xs outline-none focus:border-lime-500 transition-all font-bold text-foreground" />
                  <button className="px-8 h-14 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded shadow-lg hover:opacity-90 transition-all">Join Insider Hub</button>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">Resources</h4>
              <div className="flex flex-col gap-6">
                {['NEP 2020 Whitepaper', 'Data Privacy Protocol', 'Teacher Community', 'Knowledge Base Search'].map(item => <Link key={item} href="#" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-l-2 border-transparent hover:border-lime-500 pl-4">{item}</Link>)}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-10">
              <div className="p-6 bg-muted border border-border rounded-xl hover:bg-card-bg hover:shadow-xl transition-all cursor-pointer group">
                <QrCode size={100} className="text-foreground group-hover:scale-110 transition-transform" />
                <div className="text-center mt-4 text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest">Get Mobile App</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-[0.4em] leading-relaxed">© 2026 LEARNIVO AI TECHNOLOGIES. <br /> MADE WITH HEART FOR BHARAT.</span>
              </div>
            </div>
          </div>
        </footer>


      </div>
    </div>
  );
};

export default LandingPage;
