'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    X,
    Zap,
    Users,
    Sparkles,
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
            buttonText: 'Your current plan',
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
            description: 'Perfect for individual teachers and tutors.',
            buttonText: 'Upgrade to Pro',
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
            description: 'The ultimate power for schools & heavy users.',
            buttonText: 'Go Premium',
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
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-md dark:bg-black/60"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="relative w-[calc(100vw-20px)] h-[calc(100vh-20px)] bg-card-bg/80 backdrop-blur-2xl rounded-[10px] shadow-2xl flex flex-col overflow-hidden text-foreground border border-border"
                >
                    {/* Header Section */}
                    <div className="flex flex-col items-center pt-8 pb-4 relative z-10 px-6">
                        <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight">Upgrade your plan</h2>

                        {/* Toggle - Price Switch */}
                        <div className="flex items-center bg-muted/50 p-1 rounded-full mb-4 border border-border">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-1.5 rounded-full text-[12px] font-bold transition-all ${billingCycle === 'monthly'
                                        ? 'bg-primary-custom text-white shadow-lg shadow-primary-custom/20'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-6 py-1.5 rounded-full text-[12px] font-bold transition-all relative ${billingCycle === 'annual'
                                        ? 'bg-primary-custom text-white shadow-lg shadow-primary-custom/20'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Yearly
                                <span className="absolute -top-3 -right-6 px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded-full shadow-lg">
                                    SAVE 25%
                                </span>
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-8 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border border-border"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Centered Pricing Cards Grid */}
                    <div className="flex-1 px-10 pb-10 overflow-y-auto no-scrollbar flex items-center justify-center">
                        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-5 py-4 h-fit items-stretch">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`flex flex-col p-8 rounded-[2rem] bg-card-bg/40 border transition-all duration-500 relative group h-full ${plan.highlight
                                            ? 'border-primary-custom shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]'
                                            : 'border-border'
                                        }`}
                                >
                                    <div className="space-y-1 mb-2">
                                        <h3 className="text-2xl font-semibold text-foreground tracking-tight">{plan.name}</h3>
                                        <div className="flex items-baseline mb-4">
                                            <span className="text-3xl font-semibold text-foreground">{plan.price}</span>
                                            {plan.period && <span className="text-muted-foreground text-sm font-medium">{plan.period}</span>}
                                        </div>
                                        <p className="text-[14px] text-muted-foreground font-medium mb-6 min-h-[40px]">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <button
                                        disabled={plan.isCurrent}
                                        className={`w-full py-2.5 rounded-lg text-[14px] font-medium transition-all active:scale-95 mb-8 ${plan.isCurrent
                                                ? 'bg-transparent border border-border text-muted-foreground cursor-default'
                                                : plan.highlight
                                                    ? 'bg-foreground text-background hover:opacity-90'
                                                    : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
                                            }`}
                                    >
                                        {plan.buttonText}
                                    </button>

                                    <div className="flex-1 space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3.5 group/item">
                                                <div className={`mt-0.5 transition-colors ${plan.highlight ? 'text-primary-custom' : 'text-muted-foreground'}`}>
                                                    <feature.icon size={16} strokeWidth={1.5} />
                                                </div>
                                                <span className="text-[13px] font-medium text-muted-foreground leading-tight group-hover/item:text-foreground transition-colors">
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-border">
                                        <p className="text-[11px] text-muted-foreground font-medium italic">
                                            {plan.id === 'starter' ? '*Trial usage limits apply.' : '*Fair usage policy applies.'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PricingModal;
