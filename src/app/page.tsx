
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Wand2,
  BookOpen,
  Zap,
  Globe,
  BarChart,
  ChevronRight,
  Shield,
  Layers,
  MessageSquare,
  Users,
  Check,
  Plus,
  Minus,
  GraduationCap,
  Presentation,
  Languages,
  Layout,
  Target
} from 'lucide-react';

// Pricing Data
const pricingPlans = [
  {
    name: "Guru Free",
    price: "₹0",
    desc: "Perfect for individual teachers and students.",
    features: ["5 AI Lesson Plans / month", "Basic Student Insights", "2 Languages Support", "Standard Templates"],
    cta: "Start Free",
    highlight: false
  },
  {
    name: "Educator Pro",
    price: "₹499",
    period: "/mo",
    desc: "Advanced toolkit for professional educators.",
    features: ["Unlimited Lesson Plans", "NCERT & CBSE Aligned Tools", "22+ Languages Support", "Priority AI Support", "Visual Aid Generator"],
    cta: "Get Pro",
    highlight: true
  },
  {
    name: "Institution",
    price: "Custom",
    desc: "For schools and coaching centers scaling up.",
    features: ["Dedicated School Dashboard", "Batch Management", "School-wide Analytics", "API Access", "Training & Support"],
    cta: "Contact Sales",
    highlight: false
  }
];

// FAQ Data
const faqs = [
  { q: "Is Learnivo AI aligned with the Indian curriculum?", a: "Yes, our AI is trained specifically on NCERT guidelines and covers CBSE, ICSE, and various State Boards." },
  { q: "Can I use it in my regional language?", a: "Absolutely! We support 22+ Indian languages including Hindi, Bengali, Tamil, Telugu, and Marathi." },
  { q: "How does it help students specifically?", a: "Students get personalized learning paths, AI-generated practice papers, and simplified explanations for complex topics." },
  { q: "Is my data secure?", a: "We prioritize security with enterprise-grade encryption and strictly follow data privacy laws relevant to educational institutions." }
];

// Feature Carousel Data
const trustLoop = ["CBSE", "ICSE", "STERN BOARD", "NCERT", "K-12", "IGCSE", "STATE BOARDS", "NIOS"];

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-lime-500 selection:text-white overflow-x-hidden">
      {/* Texture Layer */}
      <div className="fixed inset-0 pointer-events-none bg-dot-pro z-0 opacity-30"></div>

      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.3em] relative z-50 px-4">
        India's First AI Platform for the New Era of <span className="text-lime-400">Education (NEP 2020)</span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded-md rotate-[-6deg] shadow-lg">
                <BookOpen className="text-lime-400" size={18} />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-slate-950 font-display">
                LEARNIVO<span className="text-lime-500">.</span>
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'For Educators', 'For Students', 'Pricing'].map(item => (
                <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-bold text-slate-500 hover:text-slate-950 transition-colors uppercase tracking-widest text-[11px]">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest px-2">
              Sign In
            </Link>
            <Link href="/register">
              <button className="px-5 py-2.5 bg-slate-950 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-all uppercase tracking-widest shadow-xl shadow-slate-900/10">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - The Hook */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative pt-24 pb-32 px-6"
      >
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-50 border border-lime-100 text-lime-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-md shadow-sm mx-auto">
            <Sparkles size={12} />
            Democratizing Intelligence in Bharat
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl lg:text-8xl font-black tracking-pro leading-[0.95] text-slate-950 font-display text-balance max-w-5xl mx-auto">
            Ab Har Class Hogi <br />
            <span className="text-lime-600 italic">Extraordinary.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Empowering teachers to teach better and students to learn faster. India's localized AI toolkit for the modern classroom.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
            <Link href="/register">
              <button className="px-10 h-16 bg-slate-950 text-white font-black rounded-xl text-xl hover:bg-slate-800 transition-pro shadow-2xl shadow-slate-950/20 flex items-center justify-center gap-3">
                Join the Revolution
                <ArrowRight size={24} />
              </button>
            </Link>
            <button className="px-10 h-16 bg-white border border-slate-200 text-slate-950 font-black rounded-xl text-xl hover:bg-slate-50 transition-pro">
              Watch Demo
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8">Trusted by educators from top boards</p>
            <div className="flex flex-wrap justify-center gap-10 lg:gap-20 opacity-30 grayscale saturate-0 group">
              {trustLoop.map((brand, i) => (
                <span key={i} className="text-2xl font-black font-display tracking-tighter hover:opacity-100 transition-opacity cursor-default">{brand}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Dual Path Section */}
      <section className="py-24 border-t border-slate-100 bg-slate-50/40 relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          {/* For Teachers */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-10 lg:p-14 bg-white border border-slate-200 rounded-2xl shadow-pro relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 text-lime-600/5 group-hover:text-lime-600/10 transition-colors">
              <Presentation size={180} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 bg-lime-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <Presentation size={24} />
              </div>
              <h2 className="text-4xl font-black tracking-tight font-display uppercase">For Educators<span className="text-lime-600">.</span></h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">Save 15+ hours weekly on preparation. Generate lesson plans, automated work-sheets, and localize content in 22+ languages.</p>
              <ul className="space-y-3 pt-4">
                {["AI Lesson Engineering", "NCERT Aligned Materials", "Multi-lingual Parent Comms"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Check size={16} className="text-lime-600" /> {f}
                  </li>
                ))}
              </ul>
              <button className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-lime-600 hover:gap-4 transition-all pt-4">
                Teacher Dashboard <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          {/* For Students */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-10 lg:p-14 bg-white border border-slate-200 rounded-2xl shadow-pro relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 text-slate-900/5 group-hover:text-slate-900/10 transition-colors">
              <GraduationCap size={180} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
                <GraduationCap size={24} />
              </div>
              <h2 className="text-4xl font-black tracking-tight font-display uppercase">For Students<span className="text-slate-950">.</span></h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">Your personal AI tutor is here. Simplify complex topics, get homework help, and practice with papers tailored to your weakness.</p>
              <ul className="space-y-3 pt-4">
                {["24/7 AI Concept Buddy", "Personalized Practice Pods", "Concept Simplifier (GIF/Visuals)"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Check size={16} className="text-slate-950" /> {f}
                  </li>
                ))}
              </ul>
              <button className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-950 hover:gap-4 transition-all pt-4">
                Student Learning Hub <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none font-display uppercase">
              Kyunki Bharat Ka <br />
              <span className="text-lime-600">Education Alag Hai.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Generic global AI doesn't understand NCERT flow, local ethnic stories, or the specific requirements of the NEP 2020. We do.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                { icon: <Languages />, title: "22+ Languages", d: "Content in Hindi, Marathi, Tamil, and more." },
                { icon: <Shield />, title: "Data Swaraj", d: "Your data stays in India. 100% Secure." },
                { icon: <Layout />, title: "NCERT/CBSE Ready", d: "Trained on Indian Curriculum standards." },
                { icon: <Target />, title: "NEP Aligned", d: "Supporting value-based & holistic learning." }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-lime-600">{item.icon}</div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tighter">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-slate-50 border border-slate-200 rounded-3xl p-1 relative overflow-hidden group">
              <div className="absolute inset-0 bg-dot-pro opacity-50"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-9xl font-black text-slate-100 tracking-tighter group-hover:text-lime-50 transition-colors">AI</div>
                  <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-300">Bharat Centric Engine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tight">Simple. Transparent. <span className="text-lime-600">Honest.</span></h2>
            <p className="text-slate-500 font-medium text-lg">Choose a plan that fits your classroom size.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`p-10 rounded-2xl border flex flex-col transition-pro ${plan.highlight
                    ? 'bg-slate-950 text-white border-slate-950 shadow-2xl scale-105 relative z-10'
                    : 'bg-white text-slate-900 border-slate-200'
                  }`}
              >
                {plan.highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-lime-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</div>}
                <div className="space-y-2 mb-8">
                  <h3 className="text-xl font-black uppercase tracking-widest">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                    <span className="text-sm font-bold opacity-50">{plan.period}</span>
                  </div>
                  <p className={`text-sm font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
                </div>
                <div className="space-y-4 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm font-bold">
                      <Check size={16} className={plan.highlight ? 'text-lime-400' : 'text-lime-600'} />
                      <span className={plan.highlight ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                    </div>
                  ))}
                </div>
                <button className={`mt-10 w-full py-4 font-black rounded-xl transition-pro ${plan.highlight
                    ? 'bg-lime-500 text-slate-950 hover:bg-lime-400 shadow-xl shadow-lime-500/10'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black font-display uppercase">Common Queries</h2>
            <p className="text-slate-500 font-medium">Everything you need to know about Learnivo AI.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
                >
                  <span className="font-bold text-slate-900 group-hover:text-lime-600 transition-colors">{faq.q}</span>
                  {activeFaq === i ? <Minus size={18} className="text-lime-600" /> : <Plus size={18} className="text-slate-400" />}
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-950 rounded-2xl p-10 lg:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-pro opacity-10"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tight font-display text-balance uppercase leading-none">Modernize Bharat's <br /> Classroom Today.</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium lead-relaxed">Join 5,000+ educators and students who are already shaping the future.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/register">
                  <button className="px-12 h-16 bg-lime-500 text-slate-950 font-black rounded-xl text-xl hover:bg-lime-400 transition-all shadow-2xl shadow-lime-500/20 active:scale-95">Create Account</button>
                </Link>
                <button className="px-12 h-16 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-xl text-xl hover:bg-white/20 transition-all">Get in Touch</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="py-20 bg-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16">
          <div className="col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-slate-950 flex items-center justify-center rounded-xl shadow-lg transition-transform group-hover:rotate-6">
                <BookOpen className="text-lime-400" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-950 font-display uppercase">LEARNIVO</span>
            </Link>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed text-sm">Empowering educators and inspiring students with locally-tuned artificial intelligence. Building for Bharat's unique educational landscape.</p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map(s => <Link key={s} href="#" className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-lime-600 hover:border-lime-100 hover:bg-lime-50 transition-all"><span className="sr-only">{s}</span><span className="text-[10px] font-black uppercase tracking-tighter">{s[0]}</span></Link>)}
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Products</h4>
            <ul className="space-y-4 text-[13px] font-bold text-slate-700">
              <li><Link href="#" className="hover:text-lime-600">Educator Portal</Link></li>
              <li><Link href="#" className="hover:text-lime-600">Student Hub</Link></li>
              <li><Link href="#" className="hover:text-lime-600">Parent AI</Link></li>
              <li><Link href="#" className="hover:text-lime-600">Curriculum Sync</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Company</h4>
            <ul className="space-y-4 text-[13px] font-bold text-slate-700">
              <li><Link href="#" className="hover:text-lime-600">Why Learnivo?</Link></li>
              <li><Link href="#" className="hover:text-lime-600">Impact Stories</Link></li>
              <li><Link href="#" className="hover:text-lime-600">Privacy Swaraj</Link></li>
              <li><Link href="#" className="hover:text-lime-600">Join Team</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Support</h4>
            <ul className="space-y-4 text-[13px] font-bold text-slate-700">
              <li><Link href="#" className="hover:text-lime-600">Safe AI Policy</Link></li>
              <li><Link href="#" className="hover:text-lime-600">Contact Help</Link></li>
              <li><Link href="#" className="hover:text-lime-600">Community Hub</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-300 tracking-[0.4em] uppercase">© 2026 Learnivo AI Technologies. Built in Bharat for the World.</p>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
