'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    X,
    Zap,
    Users,
    Sparkles,
    ArrowRight,
    MessageSquare,
    Brain,
    Clock,
    Globe,
    Shield,
    TrendingUp,
    FileText,
    Dna,
    BarChart3,
    Command
} from 'lucide-react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPlan: string;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, currentPlan }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            price: '₹0',
            description: 'Trial focus to build your AI teaching habit.',
            buttonText: 'Current Plan',
            badge: 'FREEMIUM',
            features: [
                { text: '5 Lesson Plans / month', icon: FileText },
                { text: '10 Quiz generations / month', icon: MessageSquare },
                { text: '3 Story generations', icon: Brain },
                { text: 'Max 3 generations per day', icon: Clock },
                { text: 'Standard AI Speed', icon: Zap },
                { text: 'Generic Content (No Local)', icon: Globe }
            ],
            isCurrent: currentPlan === 'Free plan' || currentPlan === 'Starter'
        },
        {
            id: 'pro',
            name: 'Educator Pro',
            price: billingCycle === 'monthly' ? '₹499' : '₹375',
            period: '/mo',
            yearlyTotal: '₹4,499 billed annually',
            description: 'Perfect for individual teachers and tutors.',
            buttonText: 'Upgrade to Pro',
            badge: 'EARLY BIRD',
            features: [
                { text: '60 Lesson Plans / mo', icon: FileText },
                { text: '150 Quiz generations', icon: MessageSquare },
                { text: '20 Stories & 10 Visuals', icon: Brain },
                { text: 'PDF Export + Library Mode', icon: Shield },
                { text: 'Basic Hyperlocal Engine', icon: Globe },
                { text: '5 AI Simulations / mo', icon: Dna },
                { text: 'Priority Generation Speed', icon: Zap },
                { text: 'No Watermarks', icon: Check }
            ],
            highlight: true,
            isCurrent: currentPlan === 'Plus' || currentPlan === 'Educator Pro' || currentPlan === 'PRO+'
        },
        {
            id: 'premium',
            name: 'Institution Pro',
            price: billingCycle === 'monthly' ? '₹1,499' : '₹1,249',
            period: '/mo',
            yearlyTotal: '₹14,999 billed annually',
            description: 'The ultimate power for schools & heavy users.',
            buttonText: 'Go Premium',
            badge: 'ENTERPRISE',
            features: [
                { text: 'Unlimited Everything*', icon: TrendingUp },
                { text: 'Full Hyperlocal Engine', icon: Globe },
                { text: 'Unlimited AI Simulations', icon: Dna },
                { text: 'OCR & Image Processing', icon: Brain },
                { text: 'Team Members (Up to 5)', icon: Users },
                { text: 'Usage Analytics Dashboard', icon: BarChart3 },
                { text: 'School Branding & Logo', icon: Command },
                { text: 'Dedicated 24/7 Support', icon: Shield }
            ],
            isCurrent: currentPlan === 'Institution Pro' || currentPlan === 'Premium'
        }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 md:p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-md dark:bg-black/60"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    className="relative w-full max-w-6xl bg-card-bg/80 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden text-foreground border border-border transition-colors duration-300 max-h-[95vh]"
                >
                    {/* Header Section - Compact */}
                    <div className="flex flex-col items-center pt-6 pb-2 relative z-10 px-6">
                        <h2 className="text-xl md:text-2xl font-black text-foreground mb-4 tracking-tight italic uppercase">AI Assistant for Indian Educators 🇮🇳</h2>

                        {/* Toggle - Price Switch - Smaller */}
                        <div className="flex items-center bg-muted/50 p-1 rounded-full mb-1 border border-border">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly'
                                        ? 'bg-primary-custom text-white shadow-lg'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all relative ${billingCycle === 'annual'
                                        ? 'bg-primary-custom text-white shadow-lg'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Yearly
                                <span className="absolute -top-2.5 -right-4 px-1.5 py-0.5 bg-rose-500 text-white text-[7px] font-black rounded-full shadow-lg">
                                    -25%
                                </span>
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border border-border"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Pricing Cards Grid - Non-scrollable content focus */}
                    <div className="flex-1 overflow-hidden px-4 md:px-8 pb-6">
                        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 py-4">
                            {plans.map((plan) => (
                                <motion.div
                                    key={plan.id}
                                    whileHover={{ y: -3 }}
                                    className={`flex flex-col p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-card-bg/40 border transition-all duration-500 relative group h-full ${plan.highlight
                                            ? 'border-primary-custom shadow-xl shadow-primary-custom/5 bg-card-bg/60'
                                            : 'border-border'
                                        }`}
                                >
                                    <div className="absolute inset-0 rounded-[1.5rem] md:rounded-[2rem] border border-primary-custom opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none scale-[1.01]"></div>

                                    {plan.badge && (
                                        <div className={`absolute top-4 right-5 px-2 py-0.5 rounded text-[7px] font-black tracking-widest uppercase ${plan.highlight ? 'bg-primary-custom text-white' : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {plan.badge}
                                        </div>
                                    )}

                                    <div className="space-y-0.5 mb-1 text-center md:text-left">
                                        <h3 className="text-sm font-black text-foreground tracking-tight flex items-center justify-center md:justify-start gap-2 uppercase italic">
                                            {plan.name}
                                        </h3>
                                        <div className="flex flex-col pt-2 pb-3 border-b border-border/50 mb-4 items-center md:items-start">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-foreground tracking-tighter">{plan.price}</span>
                                                {plan.period && <span className="text-muted-foreground text-[10px] font-bold uppercase">{plan.period}</span>}
                                            </div>
                                            {billingCycle === 'annual' && plan.yearlyTotal && (
                                                <p className="text-[8px] text-primary-custom font-black uppercase tracking-widest mt-1 bg-primary-custom/10 w-fit px-1.5 py-0.5 rounded">
                                                    {plan.yearlyTotal}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-muted-foreground font-bold leading-tight min-h-[28px] mb-4">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <button
                                        disabled={plan.isCurrent}
                                        className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all active:scale-95 mb-4 ${plan.isCurrent
                                                ? 'bg-muted/50 border border-border text-muted-foreground/50 cursor-default'
                                                : plan.highlight
                                                    ? 'bg-primary-custom text-white hover:brightness-110 shadow-md shadow-primary-custom/20'
                                                    : 'bg-foreground text-background hover:opacity-90 shadow-sm'
                                            }`}
                                    >
                                        {plan.isCurrent ? 'Active Plan' : plan.buttonText}
                                    </button>

                                    {/* Features list - minimized spacing */}
                                    <div className="flex-1 space-y-2.5 overflow-hidden">
                                        <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-2">Inclusions</p>
                                        <div className="space-y-2 overflow-y-auto no-scrollbar scroll-smooth pr-1 max-h-[140px] md:max-h-none">
                                            {plan.features.map((feature, i) => (
                                                <div key={i} className="flex items-start gap-3 group/item">
                                                    <div className={`mt-0.5 p-1 rounded-lg transition-all duration-300 shrink-0 ${plan.highlight
                                                            ? 'bg-primary-custom/10 text-primary-custom group-hover/item:scale-105'
                                                            : 'bg-muted text-muted-foreground/70 group-hover/item:text-primary-custom'
                                                        }`}>
                                                        <feature.icon size={11} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-muted-foreground leading-tight group-hover/item:text-foreground transition-colors">
                                                        {feature.text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-border/50 text-center md:text-left">
                                        <p className="text-[8px] text-muted-foreground/30 font-black uppercase italic leading-none tracking-tighter">
                                            *Fair usage policy applies.
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PricingModal;
