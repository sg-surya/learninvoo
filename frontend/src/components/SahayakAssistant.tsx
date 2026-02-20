import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Send,
    X,
    Maximize2,
    Minimize2,
    FileText,
    BarChart3,
    AlertCircle,
    CheckCircle2,
    Bot,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { askSahayak } from '@/lib/api';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    action?: string;
    data?: any;
}

const SahayakAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Namaste! I am Sahayak, your AI Administrative Assistant. I can help you with reports, fee tracking, and student performance. How can I assist you today?",
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await askSahayak(userMsg.content);

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.answer,
                timestamp: Date.now(),
                action: response.action_suggested,
                data: response.data_points
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I apologize, but I'm encountering some network turbulence. Please try again.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans max-w-[100vw] overflow-hidden pointer-events-none">

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            width: isExpanded ? '600px' : '380px',
                            height: isExpanded ? '800px' : '500px'
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-card-bg/95 backdrop-blur-2xl border border-border/60 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col pointer-events-auto origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-lime-500/10 to-transparent border-b border-border/40 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-lime-500/20 rounded-xl flex items-center justify-center border border-lime-500/20">
                                    <Bot size={20} className="text-lime-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-foreground">Sahayak AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-2 hover:bg-muted/50 rounded-lg text-muted-foreground transition-colors"
                                >
                                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg text-muted-foreground transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted/30">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-lime-500/10 flex items-center justify-center shrink-0 border border-lime-500/20">
                                            <Sparkles size={14} className="text-lime-600" />
                                        </div>
                                    )}

                                    <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                                        <div
                                            className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                    ? 'bg-foreground text-background rounded-tr-sm'
                                                    : 'bg-muted/40 border border-border/50 rounded-tl-sm text-foreground'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>

                                        {/* Action / Data Widgets */}
                                        {msg.action && (
                                            <div className="bg-lime-500/5 border border-lime-500/20 rounded-xl p-3 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-lime-700 dark:text-lime-400">
                                                    <AlertCircle size={14} />
                                                    Suggested Action: {msg.action}
                                                </div>
                                                <button className="px-3 py-1.5 bg-lime-500 hover:bg-lime-600 text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors">
                                                    Execute
                                                </button>
                                            </div>
                                        )}

                                        <span className="text-[10px] font-medium text-muted-foreground/60 px-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-lime-500/10 flex items-center justify-center shrink-0 animate-pulse">
                                        <Sparkles size={14} className="text-lime-600" />
                                    </div>
                                    <div className="bg-muted/40 border border-border/50 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                                        <Loader2 size={16} className="text-muted-foreground animate-spin" />
                                        <span className="text-xs font-medium text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-background/50 border-t border-border/40">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about fees, attendance, or reports..."
                                    className="w-full bg-card-bg border border-border focus:border-lime-500/50 rounded-xl pl-4 pr-12 py-4 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 shadow-inner"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-2 p-2 bg-lime-500 hover:bg-lime-600 disabled:opacity-50 disabled:hover:bg-lime-500 text-black rounded-lg transition-all"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <div className="mt-2 flex gap-2 justify-center">
                                {['Pending Fees', 'Today\'s Attendance', 'Create Notice'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => {
                                            setInput(suggestion);
                                            // Optional: Auto-send or just fill
                                        }}
                                        className="text-[10px] px-2 py-1 bg-muted/50 hover:bg-muted text-muted-foreground rounded-md border border-transparent hover:border-border transition-all"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto h-16 w-16 bg-foreground text-background rounded-full shadow-xl shadow-black/20 flex items-center justify-center group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-lime-500 to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
                {isOpen ? (
                    <ChevronRight size={28} className="rotate-90 transition-transform duration-300" />
                ) : (
                    <div className="relative">
                        <Sparkles size={28} className="transition-transform group-hover:rotate-12" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                        </span>
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default SahayakAssistant;
