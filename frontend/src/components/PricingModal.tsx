'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    Command,
    ArrowLeft,
    Smartphone,
    CreditCard,
    Building2,
    ShieldCheck,
    Lock,
    CheckCircle2,
    ArrowRight,
    Trophy
} from 'lucide-react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPlan: string;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, currentPlan }) => {
    const router = useRouter();
    const [step, setStep] = useState<'pricing' | 'checkout' | 'success'>('pricing');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
    const [isProcessing, setIsProcessing] = useState(false);

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            price: 0,
            displayPrice: '₹0',
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
            price: billingCycle === 'monthly' ? 499 : 375,
            displayPrice: billingCycle === 'monthly' ? '₹499' : '₹375',
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
            price: billingCycle === 'monthly' ? 1499 : 1249,
            displayPrice: billingCycle === 'monthly' ? '₹1,499' : '₹1,249',
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

    const handleUpgradeClick = (plan: any) => {
        if (plan.id === 'starter' || plan.isCurrent) return;
        setSelectedPlan(plan);
        setStep('checkout');
    };

    const handleBack = () => {
        setStep('pricing');
        setSelectedPlan(null);
    };

    const handlePayment = () => {
        setIsProcessing(true);
        // Working Logic: Simulate backend update & storage sync
        setTimeout(() => {
            const storedUser = localStorage.getItem('learnivo_current_user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.plan = selectedPlan.name; // Update to Educator Pro or Institution Pro
                localStorage.setItem('learnivo_current_user', JSON.stringify(userData));
            }
            setIsProcessing(false);
            setStep('success');
        }, 2000);
    };

    const handleFinalDone = () => {
        onClose();
        window.location.reload(); // Refresh to sync plan across Header, Profile etc.
    };

    if (!isOpen) return null;

    const taxAmount = selectedPlan ? (selectedPlan.price * 0.18) : 0;
    const totalAmount = selectedPlan ? (selectedPlan.price + taxAmount) : 0;

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-md dark:bg-black/80"
                />

                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-[calc(100vw-20px)] h-[calc(100vh-20px)] bg-card-bg/90 backdrop-blur-3xl rounded-[10px] shadow-2xl flex flex-col overflow-hidden text-foreground border border-border"
                >
                    {step === 'pricing' && (
                        <>
                            {/* Pricing View */}
                            <div className="flex flex-col items-center pt-8 pb-4 relative z-10 px-6">
                                <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight italic uppercase">Select your path</h2>
                                <div className="flex items-center bg-muted/50 p-1 rounded-full mb-4 border border-border">
                                    <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-1.5 rounded-full text-[12px] font-bold transition-all ${billingCycle === 'monthly' ? 'bg-primary-custom text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>Monthly</button>
                                    <button onClick={() => setBillingCycle('annual')} className={`px-6 py-1.5 rounded-full text-[12px] font-bold transition-all relative ${billingCycle === 'annual' ? 'bg-primary-custom text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>Yearly <span className="absolute -top-3 -right-6 px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded-full shadow-lg">SAVE 25%</span></button>
                                </div>
                                <button onClick={onClose} className="absolute top-6 right-8 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground border border-border"><X size={18} /></button>
                            </div>
                            <div className="flex-1 px-10 pb-10 overflow-y-auto no-scrollbar flex items-center justify-center">
                                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-5 py-4 h-fit items-stretch">
                                    {plans.map((plan) => (
                                        <div key={plan.id} className={`flex flex-col p-8 rounded-[2rem] bg-card-bg/40 border transition-all duration-500 relative group h-full ${plan.highlight ? 'border-primary-custom shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]' : 'border-border'}`}>
                                            <div className="space-y-1 mb-2">
                                                <h3 className="text-2xl font-semibold text-foreground tracking-tight">{plan.name}</h3>
                                                <div className="flex items-baseline mb-4"><span className="text-3xl font-semibold text-foreground">{plan.displayPrice}</span>{plan.period && <span className="text-muted-foreground text-sm font-medium">{plan.period}</span>}</div>
                                                <p className="text-[14px] text-muted-foreground font-medium mb-6 min-h-[40px] uppercase tracking-wider">{plan.description}</p>
                                            </div>
                                            <button onClick={() => handleUpgradeClick(plan)} disabled={plan.isCurrent} className={`w-full py-2.5 rounded-lg text-[14px] font-medium transition-all active:scale-95 mb-8 ${plan.isCurrent ? 'bg-transparent border border-border text-muted-foreground cursor-default' : plan.highlight ? 'bg-foreground text-background hover:opacity-90' : 'bg-muted text-foreground hover:bg-muted/80 border border-border'}`}>{plan.buttonText}</button>
                                            <div className="flex-1 space-y-4">{plan.features.map((feature, i) => (<div key={i} className="flex items-start gap-3.5 group/item"><div className={`mt-0.5 transition-colors ${plan.highlight ? 'text-primary-custom' : 'text-muted-foreground'}`}><feature.icon size={16} strokeWidth={1.5} /></div><span className="text-[13px] font-medium text-muted-foreground leading-tight group-hover/item:text-foreground transition-colors">{feature.text}</span></div>))}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {step === 'checkout' && (
                        <div className="flex-1 flex flex-col">
                            {/* Checkout Header */}
                            <div className="flex items-center justify-between px-10 h-20 border-b border-border bg-card-bg/20 backdrop-blur-xl sticky top-0 z-[100]">
                                <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group font-bold uppercase text-[12px] tracking-widest"><ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Plans</button>
                                <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 font-black uppercase text-[10px] tracking-widest"><ShieldCheck size={16} /> Secure Checkout</div>
                                <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"><X size={18} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar p-10 flex items-center justify-center">
                                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                                    {/* Left: Simplified Payment Design */}
                                    <div className="space-y-6 flex flex-col">
                                        <div className="p-8 rounded-[2.5rem] bg-card-bg/40 border border-border flex-1 space-y-8">
                                            <div className="space-y-2">
                                                <h1 className="text-3xl font-black tracking-tight uppercase italic drop-shadow-sm">Upgrade Account</h1>
                                                <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">India-Optimized Payment</p>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { id: 'upi', name: 'UPI', icon: Smartphone },
                                                    { id: 'card', name: 'Card', icon: CreditCard },
                                                    { id: 'nb', name: 'NetBank', icon: Building2 },
                                                ].map((mod) => (
                                                    <button key={mod.id} onClick={() => setSelectedMethod(mod.id as any)} className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all gap-3 ${selectedMethod === mod.id ? 'border-primary-custom bg-primary-custom/5 shadow-lg' : 'border-border bg-muted/20 hover:border-border/80'}`}>
                                                        <mod.icon size={20} className={selectedMethod === mod.id ? 'text-primary-custom' : 'text-muted-foreground'} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{mod.name}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Payment Details</label>
                                                    <div className="relative group">
                                                        <input
                                                            placeholder={selectedMethod === 'upi' ? "Enter UPI ID (e.g. name@upi)" : "Validating secure input..."}
                                                            className="w-full h-14 bg-muted/40 border-2 border-border focus:border-primary-custom rounded-xl px-6 outline-none font-bold text-foreground transition-all placeholder:text-muted-foreground/30 focus:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                                                        />
                                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary-custom transition-colors" size={16} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 pt-4 border-t border-border/40 opacity-50">
                                                <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary-custom" /> <span className="text-[9px] font-bold uppercase tracking-widest">Instant Activation</span></div>
                                                <div className="flex items-center gap-2"><Shield size={12} className="text-primary-custom" /> <span className="text-[9px] font-bold uppercase tracking-widest">RBI Verified</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Premium Order Confirmation Card */}
                                    <div className="flex flex-col">
                                        <div className={`p-8 md:p-10 rounded-[2.5rem] flex flex-col bg-[#141414] border-2 border-primary-custom shadow-[0_0_60px_rgba(var(--primary-rgb),0.1)] relative overflow-hidden flex-1 group`}>
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-custom/5 blur-[80px] pointer-events-none group-hover:bg-primary-custom/10 transition-all duration-700"></div>

                                            <div className="mb-auto space-y-8 relative z-10">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <h3 className="text-sm font-black text-primary-custom uppercase tracking-[0.3em]">Selected Plan</h3>
                                                        <h4 className="text-3xl font-black uppercase italic tracking-tight">{selectedPlan?.name}</h4>
                                                    </div>
                                                    <div className="bg-primary-custom/10 text-primary-custom px-3 py-1.5 rounded-lg border border-primary-custom/20 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> {billingCycle}ly</div>
                                                </div>

                                                <div className="space-y-4 pt-8 border-t border-border/50">
                                                    <div className="flex justify-between text-muted-foreground font-bold uppercase text-[11px] tracking-widest">
                                                        <span>Subtotal</span>
                                                        <span className="text-foreground">₹{selectedPlan?.price.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-muted-foreground font-bold uppercase text-[11px] tracking-widest">
                                                        <span>GST (18%)</span>
                                                        <span className="text-foreground">₹{taxAmount.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-6 border-t border-border/50">
                                                        <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Total Payable</span>
                                                        <span className="text-4xl font-black text-primary-custom tracking-tighter">₹{totalAmount.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handlePayment}
                                                disabled={isProcessing}
                                                className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] mt-10 relative z-10 ${isProcessing
                                                    ? 'bg-muted text-muted-foreground cursor-wait'
                                                    : 'bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[13px] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] group'
                                                    }`}
                                            >
                                                {isProcessing ? (
                                                    <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full"></div> AUTHENTICATING...</div>
                                                ) : (
                                                    <>COMPLETE UPGRADE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8 bg-black/40">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-24 h-24 bg-primary-custom rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)]"
                            >
                                <Check size={48} strokeWidth={3} className="text-white" />
                            </motion.div>
                            <div className="space-y-4 max-w-lg">
                                <h1 className="text-4xl font-black uppercase italic tracking-tight">Upgrade Successful!</h1>
                                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                    Congratulations! Your account is now upgraded to <span className="text-primary-custom font-black uppercase underline decoration-primary-custom/40 decoration-2 underline-offset-4">{selectedPlan?.name}</span>.
                                    All premium features are now unlocked for your dashboard.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-6 w-full max-w-2xl pt-6 border-t border-border/20">
                                {[
                                    { text: 'Unlimited AI', icon: Sparkles },
                                    { text: 'PDF Export', icon: FileText },
                                    { text: 'Priority Speed', icon: Zap },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="p-3 bg-primary-custom/10 text-primary-custom rounded-xl"><item.icon size={20} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleFinalDone}
                                className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all active:scale-95"
                            >
                                Take me back
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PricingModal;
