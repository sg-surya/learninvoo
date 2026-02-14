'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    CreditCard,
    Zap,
    CheckCircle2,
    Lock,
    ArrowLeft,
    Smartphone,
    Building2,
    Calendar,
    ArrowRight
} from 'lucide-react';

const CheckoutPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const planId = searchParams.get('plan') || 'pro';
    const cycle = searchParams.get('cycle') || 'monthly';

    const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
    const [isProcessing, setIsProcessing] = useState(false);

    const planDetails = {
        starter: { name: 'Starter', price: 0 },
        pro: { name: 'Educator Pro', price: cycle === 'monthly' ? 499 : 375 },
        premium: { name: 'Institution Pro', price: cycle === 'monthly' ? 1499 : 1249 },
    }[planId] || { name: 'Educator Pro', price: 499 };

    const tax = planDetails.price * 0.18; // 18% GST
    const total = planDetails.price + tax;

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            alert('Payment Successful! Welcome to ' + planDetails.name);
            router.push('/dashboard');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary-custom/30">
            {/* Header */}
            <header className="border-b border-border bg-card-bg/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase text-[12px] tracking-widest">Back to Plans</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-custom flex items-center justify-center">
                            <Zap size={16} className="text-white fill-current" />
                        </div>
                        <span className="font-black italic uppercase tracking-tighter text-lg">Learnivo AI</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure Checkout</span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Column: Payment Info */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Complete Your Upgrade</h1>
                            <p className="text-muted-foreground font-medium uppercase text-[11px] tracking-[0.2em]">India Optimized Payment Gateway</p>
                        </div>

                        {/* Payment Methods */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4">Choose Payment Method</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'upi', name: 'UPI (PhonePe/GPay)', icon: Smartphone },
                                    { id: 'card', name: 'Card (Visa/Master)', icon: CreditCard },
                                    { id: 'netbanking', name: 'Net Banking', icon: Building2 },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id as any)}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-4 ${selectedMethod === method.id
                                                ? 'border-primary-custom bg-primary-custom/5 shadow-xl shadow-primary-custom/10'
                                                : 'border-border bg-card-bg/40 hover:border-border/80'
                                            }`}
                                    >
                                        <method.icon size={24} className={selectedMethod === method.id ? 'text-primary-custom' : 'text-muted-foreground'} />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-center">{method.name}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Payment Details Form Placeholder */}
                        <motion.div
                            layout
                            className="p-8 rounded-3xl border border-border bg-card-bg/40 space-y-6"
                        >
                            {selectedMethod === 'upi' && (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Enter VPA / UPI ID</label>
                                        <input
                                            placeholder="someone@okaxis"
                                            className="w-full h-14 bg-muted/30 border-2 border-border focus:border-primary-custom rounded-xl px-6 outline-none font-bold text-foreground transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium px-1">Example: mobile-no@paytm or name@upi</p>
                                </div>
                            )}

                            {selectedMethod === 'card' && (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Card Number</label>
                                        <input
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full h-14 bg-muted/30 border-2 border-border focus:border-primary-custom rounded-xl px-6 outline-none font-bold text-foreground transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Expiry (MM/YY)</label>
                                            <input
                                                placeholder="MM/YY"
                                                className="w-full h-14 bg-muted/30 border-2 border-border focus:border-primary-custom rounded-xl px-6 outline-none font-bold text-foreground transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">CVV</label>
                                            <input
                                                placeholder="***"
                                                className="w-full h-14 bg-muted/30 border-2 border-border focus:border-primary-custom rounded-xl px-6 outline-none font-bold text-foreground transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'netbanking' && (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Select Your Bank</label>
                                    <select className="w-full h-14 bg-muted/30 border-2 border-border focus:border-primary-custom rounded-xl px-6 outline-none font-bold text-foreground transition-all appearance-none cursor-pointer">
                                        <option>State Bank of India</option>
                                        <option>HDFC Bank</option>
                                        <option>ICICI Bank</option>
                                        <option>Axis Bank</option>
                                        <option>Kotak Mahindra Bank</option>
                                    </select>
                                </div>
                            )}
                        </motion.div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center gap-6 opacity-60">
                            {[
                                { name: 'GST Compliant', icon: CheckCircle2 },
                                { name: 'SSL Encrypted', icon: Lock },
                                { name: '256-bit Secure', icon: ShieldCheck },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <badge.icon size={14} className="text-primary-custom" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.1em]">{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 relative">
                        <div className="p-8 rounded-[2.5rem] border border-border bg-card-bg/40 sticky top-28 space-y-8 shadow-2xl overflow-hidden group hover:border-primary-custom/30 transition-all duration-700">
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-custom/10 blur-[80px] pointer-events-none"></div>

                            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Order Summary</h3>

                            <div className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black uppercase italic tracking-tight">{planDetails.name}</h4>
                                        <p className="text-[10px] font-black text-primary-custom uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} /> Billed {cycle}
                                        </p>
                                    </div>
                                    <span className="text-xl font-black">₹{planDetails.price}</span>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-border/50 text-[12px] font-bold">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span className="uppercase tracking-widest font-black text-[9px]">Subtotal</span>
                                        <span>₹{planDetails.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span className="uppercase tracking-widest font-black text-[9px]">GST (18%)</span>
                                        <span>₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-foreground pt-4 border-t border-border/50 items-center">
                                        <span className="uppercase tracking-widest font-black text-[11px]">Total Amount</span>
                                        <span className="text-3xl font-black tracking-tighter text-primary-custom flex items-center gap-1">
                                            ₹{(planDetails.price + tax).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${isProcessing
                                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                        : 'bg-foreground text-background font-black uppercase tracking-[0.2em] text-[13px] hover:shadow-2xl hover:shadow-primary-custom/20 group'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin rounded-full"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Complete Payment
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
                                Proceeding will take you to your bank's secure page. <br />By upgrading, you agree to our Terms and Conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
