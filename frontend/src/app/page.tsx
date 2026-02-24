'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, Layers, GraduationCap, User, BarChart3,
  CheckCircle2, Check, ShieldCheck, Server, Lock, PlayCircle,
  FileText, Twitter, Linkedin, Instagram, Sun, Moon
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('learnivo_current_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains('dark'));
    const obs = new MutationObserver(() => setIsDark(root.classList.contains('dark')));
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, [theme]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('lp-visible');
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.lp-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => setTheme(isDark ? 'Light' : 'Dark');

  return (
    <div className="lp-root" data-theme={isDark ? 'dark' : 'light'}>
      {/* Bioluminescent Background */}
      <div className="lp-bio-bg">
        <div className="lp-orb lp-orb-blue" />
        <div className="lp-orb lp-orb-lime" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50">
        <div className="lp-glass px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#007BFF] to-[#a3e635] rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-extrabold tracking-tighter">LEARNIVO</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-70">
            <a href="#ecosystem" className="lp-nav-link">Product</a>
            <a href="#features" className="lp-nav-link">Ecosystem</a>
            <a href="#trust" className="lp-nav-link">Security</a>
            <a href="#pricing" className="lp-nav-link">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-full flex items-center justify-center lp-glass hover:opacity-80 transition" aria-label="Toggle theme">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <Link href="/dashboard" className="lp-btn-primary px-6 py-2.5 rounded-full text-xs uppercase tracking-widest">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold hover:opacity-100 transition hidden sm:block">Login</Link>
                <Link href="/register" className="lp-btn-primary px-6 py-2.5 rounded-full text-xs uppercase tracking-widest">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="lp-reveal relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ccff00]/20 bg-[#ccff00]/5 text-xs font-mono text-[#ccff00] mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#ccff00] animate-ping" />
            V2.0 NOW LIVE: THE FULL SCALE LAUNCH
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold leading-[1.1] mb-8">
            <span className="lp-text-gradient">The Institutional OS</span>
            <br /><span>for the Modern Classroom</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl opacity-50 max-w-3xl mx-auto mb-12 leading-relaxed">
            Learnivo combines Sahayak AI, Administrative Intelligence, and Socratic Learning into one seamless platform. Built for Indian schools, designed for the future.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link href={user ? "/dashboard" : "/register"}>
              <button className="lp-btn-primary px-10 py-5 rounded-2xl text-lg flex items-center gap-3">
                Start Free Trial <ArrowRight />
              </button>
            </Link>
            <button className="lp-glass px-10 py-5 rounded-2xl text-lg flex items-center gap-3">
              Watch Keynote <PlayCircle />
            </button>
          </motion.div>

          {/* Dashboard Reveal */}
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
            className="lp-dashboard-ui relative max-w-5xl mx-auto">
            <div className="lp-dashboard-frame lp-glass p-4 aspect-[16/9] bg-gradient-to-tr from-white/5 to-white/10 overflow-hidden">
              <div className="w-full h-full bg-[#050608] rounded-xl border border-white/5 p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-lg" />
                    <div className="w-32 h-4 bg-white/5 rounded-full mt-4" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#007BFF]/20" />
                    <div className="w-8 h-8 rounded-full bg-[#ccff00]/20" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 flex-grow">
                  <div className="col-span-2 bg-white/5 rounded-3xl p-4 relative overflow-hidden border-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#007BFF]/10 to-transparent" />
                    <div className="h-4 w-1/2 bg-white/20 rounded-full mb-4" />
                    <div className="h-2 w-3/4 bg-white/10 rounded-full mb-2" />
                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                    <div className="mt-8 flex gap-4">
                      {[1, 2, 3].map(i => <div key={i} className="h-20 w-1/3 bg-white/5 rounded-lg border border-white/5" />)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-3xl p-4 flex flex-col gap-3 border-none">
                    <div className="h-32 rounded-lg bg-[#ccff00]/10 flex items-center justify-center">
                      <Sparkles className="text-[#ccff00] w-8 h-8 animate-pulse" />
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Triple Threat Ecosystem */}
      <section id="ecosystem" className="lp-reveal py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">One Platform. Three Universes.</h2>
            <p className="opacity-50">Seamless orchestration for every stakeholder.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Teachers */}
            <div className="flex-1 lp-glass p-10 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#007BFF]/10 blur-[50px] group-hover:bg-[#007BFF]/20 transition" />
              <GraduationCap className="w-12 h-12 text-[#007BFF] mb-6" />
              <h3 className="text-2xl font-bold mb-4">For Teachers</h3>
              <p className="opacity-60 mb-8 leading-relaxed">Sahayak AI automates lesson planning and grading, giving back 20 hours a week to focus on teaching.</p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-sm font-mono opacity-80"><CheckCircle2 className="w-4 h-4 text-[#ccff00]" /> AI Co-pilots</li>
                <li className="flex items-center gap-3 text-sm font-mono opacity-80"><CheckCircle2 className="w-4 h-4 text-[#ccff00]" /> Auto-Grading</li>
              </ul>
              <Link href="/for-teachers" className="text-[#007BFF] font-bold flex items-center gap-2">
                Explore Teacher OS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>
            {/* Students */}
            <div className="flex-1 lp-glass p-10 relative overflow-hidden group" style={{ borderColor: 'rgba(204,255,0,0.2)' }}>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#ccff00]/10 blur-[50px] group-hover:bg-[#ccff00]/20 transition" />
              <User className="w-12 h-12 text-[#ccff00] mb-6" />
              <h3 className="text-2xl font-bold mb-4">For Students</h3>
              <p className="opacity-60 mb-8 leading-relaxed">Vasu, the Socratic AI Tutor, guides students through roadblocks without giving away the answers.</p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-sm font-mono opacity-80"><CheckCircle2 className="w-4 h-4 text-[#007BFF]" /> 24/7 Mentorship</li>
                <li className="flex items-center gap-3 text-sm font-mono opacity-80"><CheckCircle2 className="w-4 h-4 text-[#007BFF]" /> Adaptive Paths</li>
              </ul>
              <Link href="/for-students" className="text-[#ccff00] font-bold flex items-center gap-2">
                Enter Student Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>
            {/* Admins */}
            <div className="flex-1 lp-glass p-10 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-[50px] group-hover:bg-white/15 transition" />
              <BarChart3 className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">For Admins</h3>
              <p className="opacity-60 mb-8 leading-relaxed">Centralized command for fee management, attendance tracking, and parent communication.</p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-sm font-mono opacity-80"><CheckCircle2 className="w-4 h-4 text-[#ccff00]" /> Data Residency</li>
                <li className="flex items-center gap-3 text-sm font-mono opacity-80"><CheckCircle2 className="w-4 h-4 text-[#ccff00]" /> Fee Collection</li>
              </ul>
              <a href="#" className="font-bold flex items-center gap-2">
                Admin Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section id="features" className="lp-reveal py-32 px-6 lp-feature-bg">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Sahayak AI */}
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1">
              <div className="text-[#007BFF] font-mono text-sm tracking-widest mb-4">SAHAYAK ENGINE</div>
              <h2 className="text-5xl font-bold mb-6">Convert any PDF into a structured lesson plan.</h2>
              <p className="text-lg opacity-50 leading-relaxed mb-8">Upload your curriculum and Sahayak AI generates quizzes, interactive modules, and multimedia recommendations in seconds.</p>
              <div className="lp-glass p-6" style={{ borderColor: 'rgba(0,123,255,0.3)' }}>
                <div className="flex gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#007BFF] flex items-center justify-center text-xs font-bold text-white shrink-0">V</div>
                  <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none text-sm">&quot;Vasu, convert this Chapter 4 Physics PDF into a 45-minute active learning session.&quot;</div>
                </div>
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-[#ccff00] flex items-center justify-center text-xs font-bold text-black shrink-0">AI</div>
                  <div className="bg-[#ccff00]/10 p-4 rounded-2xl rounded-tr-none text-sm border border-[#ccff00]/20">&quot;Done! I&apos;ve structured 3 learning objectives, a live quiz, and mapped it to the NCERT framework.&quot;</div>
                </div>
              </div>
            </div>
            <div className="flex-1 lp-glass aspect-square bg-gradient-to-br from-[#007BFF]/20 to-transparent flex items-center justify-center p-12">
              <div className="relative w-full h-full border border-white/10 rounded-xl bg-[#010205] shadow-2xl flex flex-col p-4 overflow-hidden">
                <div className="h-4 w-2/3 bg-white/10 rounded mb-4" />
                <div className="h-4 w-1/3 bg-white/10 rounded mb-8" />
                <div className="space-y-4">
                  <div className="h-32 w-full bg-[#007BFF]/10 rounded-lg border border-[#007BFF]/20 flex items-center justify-center">
                    <FileText className="text-[#007BFF] w-12 h-12" />
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded" />
                  <div className="h-4 w-full bg-white/5 rounded" />
                  <div className="h-4 w-1/2 bg-white/5 rounded" />
                </div>
                <div className="absolute bottom-4 right-4 animate-bounce">
                  <div className="bg-[#ccff00] text-black px-4 py-2 rounded-full text-xs font-bold">Processing...</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Digitization */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-20">
            <div className="flex-1">
              <div className="text-[#ccff00] font-mono text-sm tracking-widest mb-4">VISION DIGITIZATION</div>
              <h2 className="text-5xl font-bold mb-6">Scan handwriting. <br />Grade instantly.</h2>
              <p className="text-lg opacity-50 leading-relaxed mb-8">Point your camera at student papers. Our computer vision identifies handwriting, checks against rubrics, and offers personalized feedback.</p>
              <div className="flex gap-10">
                <div><div className="text-3xl font-bold mb-1">99.8%</div><div className="text-sm opacity-40">OCR Accuracy</div></div>
                <div><div className="text-3xl font-bold mb-1">&lt; 2s</div><div className="text-sm opacity-40">Grading Time</div></div>
              </div>
            </div>
            <div className="flex-1 lp-glass aspect-video bg-gradient-to-bl from-[#ccff00]/20 to-transparent relative group overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-80 bg-white rounded shadow-2xl transform -rotate-6 transition-transform group-hover:rotate-0 p-6 space-y-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-2 w-full bg-black/10" />)}
                  <div className="h-32 w-full border-2 border-dashed border-black/10 flex items-center justify-center">
                    <span className="text-[8px] text-black/20">STUDENT DIAGRAM</span>
                  </div>
                </div>
              </div>
              <div className="lp-scan-beam" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="lp-reveal py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-4">Transparent Pricing.</h2>
            <p className="opacity-50">Scale from one classroom to a thousand schools.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="lp-glass p-10 flex flex-col">
              <div className="text-sm font-mono opacity-50 mb-4">FOR INDIVIDUALS</div>
              <h3 className="text-2xl font-bold mb-2">Free Starter</h3>
              <div className="text-4xl font-bold mb-8">₹0 <span className="text-sm opacity-40 font-normal">/month</span></div>
              <ul className="space-y-4 mb-10 flex-grow">
                {["5 AI Lesson Plans /mo", "Basic Quiz Generation", "Manual Grading Tools"].map(f =>
                  <li key={f} className="flex items-center gap-3 text-sm opacity-70"><Check className="w-4 h-4 text-[#007BFF]" /> {f}</li>
                )}
              </ul>
              <Link href="/register"><button className="w-full py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition">Join Waitlist</button></Link>
            </div>
            {/* Pro */}
            <div className="lp-glass p-10 flex flex-col relative" style={{ borderColor: '#ccff00', boxShadow: '0 0 40px rgba(204,255,0,0.1)' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ccff00] text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
              <div className="text-sm font-mono text-[#ccff00] mb-4">FOR SUPER-TEACHERS</div>
              <h3 className="text-2xl font-bold mb-2">Pro Copilot</h3>
              <div className="text-4xl font-bold mb-8">₹899 <span className="text-sm opacity-40 font-normal">/month</span></div>
              <ul className="space-y-4 mb-10 flex-grow">
                {["Unlimited Sahayak AI", "Vision Handwriting Grading", "Multimedia Library Access", "WhatsApp Bot Integration"].map(f =>
                  <li key={f} className="flex items-center gap-3 text-sm opacity-70"><Check className="w-4 h-4 text-[#ccff00]" /> {f}</li>
                )}
              </ul>
              <Link href="/register"><button className="w-full py-4 rounded-xl lp-btn-primary">Start 14-Day Trial</button></Link>
            </div>
            {/* Institutional */}
            <div className="lp-glass p-10 flex flex-col">
              <div className="text-sm font-mono opacity-50 mb-4">FOR SCHOOLS</div>
              <h3 className="text-2xl font-bold mb-2">Institutional</h3>
              <div className="text-4xl font-bold mb-8 italic opacity-80">Custom</div>
              <ul className="space-y-4 mb-10 flex-grow">
                {["Admin Power Dashboard", "Automated Fee Management", "White-labeled Parent App", "24/7 Dedicated Support"].map(f =>
                  <li key={f} className="flex items-center gap-3 text-sm opacity-70"><Check className="w-4 h-4 text-[#007BFF]" /> {f}</li>
                )}
              </ul>
              <button className="w-full py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition">Talk to Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="lp-reveal py-20 px-6 border-y border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <h3 className="text-3xl font-bold mb-4">Enterprise Grade. Privacy First.</h3>
            <p className="opacity-50">Your student data stays in India, protected by multi-layered encryption.</p>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            {[{ icon: <ShieldCheck className="w-6 h-6" />, t: "GDPR COMPLIANT" }, { icon: <Server className="w-6 h-6" />, t: "LOCAL HOSTING" }, { icon: <Lock className="w-6 h-6" />, t: "ISO 27001" }].map((b, i) =>
              <div key={i} className="flex items-center gap-3 opacity-50 grayscale">{b.icon}<span className="font-bold tracking-widest">{b.t}</span></div>
            )}
          </div>
        </div>
      </section>

      {/* Final Hook */}
      <section className="lp-reveal py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#007BFF]/5 animate-pulse" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">Ready to reclaim 20 hours of your week?</h2>
          <p className="text-xl opacity-60 mb-12">Join 500+ forward-thinking schools transforming the Indian education landscape.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href={user ? "/dashboard" : "/register"}><button className="lp-btn-primary px-12 py-5 rounded-2xl text-xl">Get Started for Free</button></Link>
            <button className="lp-glass px-12 py-5 rounded-2xl text-xl">Contact Support</button>
          </div>
          <p className="mt-8 opacity-30 text-sm">No Credit Card Required • Setup in 10 Minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#007BFF] to-[#a3e635] rounded-lg" />
              <span className="text-xl font-extrabold tracking-tighter">LEARNIVO</span>
            </div>
            <p className="opacity-40 max-w-xs">Building the intelligent infrastructure for the next billion students.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm opacity-50">
              <li><Link href="/for-teachers" className="hover:text-[#ccff00] transition">Teacher OS</Link></li>
              <li><Link href="/for-students" className="hover:text-[#ccff00] transition">Student Portal</Link></li>
              <li><a href="#" className="hover:text-[#ccff00] transition">Admin Panel</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm opacity-50">
              <li><a href="#" className="hover:text-[#ccff00] transition">About Us</a></li>
              <li><a href="#" className="hover:text-[#ccff00] transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#ccff00] transition">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm opacity-50">
              <li><a href="#" className="hover:text-[#ccff00] transition">Documentation</a></li>
              <li><a href="#" className="hover:text-[#ccff00] transition">Help Center</a></li>
              <li><a href="#" className="hover:text-[#ccff00] transition">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm opacity-30">
          <p>© 2026 Learnivo AI Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-100 transition"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:opacity-100 transition"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="hover:opacity-100 transition"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
