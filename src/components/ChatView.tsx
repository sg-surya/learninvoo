'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    User,
    Sparkles,
    BrainCircuit,
    Plus,
    History,
    Bot,
    Paperclip,
    Mic,
    Copy,
    RefreshCw,
    Download,
    Share2,
    FileText,
    Zap,
    ArrowUp,
    Settings,
    MoreHorizontal,
    Link as LinkIcon,
    Search,
    BookOpen,
    Layout,
    Globe,
    Cpu,
    ChevronDown,
    X,
    PanelLeftClose,
    PanelLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatSession {
    id: string;
    title: string;
    lastMessage: string;
    messages: Message[];
    category: 'TODAY' | 'YESTERDAY' | 'AUGUST';
}

const ChatView = () => {
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDeeperResearch, setIsDeeperResearch] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const suggestActions = [
        { title: 'Summarize Text', desc: 'Turn long articles into easy summaries.', icon: FileText },
        { title: 'Creative Writing', desc: 'Generate stories, blog posts, or fresh content ideas.', icon: Sparkles },
        { title: 'Answer Questions', desc: 'Ask me anything—from facts to advice—and get instant answers.', icon: BrainCircuit },
    ];

    const currentSession = sessions.find(s => s.id === activeSessionId);
    const messages = currentSession?.messages || [];

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleNewChat = () => {
        setActiveSessionId(null);
        setInput('');
    };

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        const userMsg: Message = {
            id: generateUUID(),
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };

        let targetId = activeSessionId;

        if (!targetId) {
            const newId = generateUUID();
            const newSession: ChatSession = {
                id: newId,
                title: messageText.slice(0, 45) + (messageText.length > 45 ? '...' : ''),
                lastMessage: messageText,
                messages: [userMsg],
                category: 'TODAY'
            };
            setSessions(prev => [newSession, ...prev]);
            setActiveSessionId(newId);
            targetId = newId;
        } else {
            setSessions(prev => prev.map(s =>
                s.id === targetId ? { ...s, messages: [...s.messages, userMsg], lastMessage: messageText } : s
            ));
        }

        setInput('');
        setIsLoading(true);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        setTimeout(() => {
            const aiMsg: Message = {
                id: generateUUID(),
                role: 'assistant',
                content: "I've processed your request. Let's start a smart conversation about that. How would you like me to proceed with the information provided?",
                timestamp: new Date()
            };
            setSessions(prev => prev.map(s =>
                s.id === targetId ? { ...s, messages: [...s.messages, aiMsg] } : s
            ));
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex h-full w-full bg-white font-sans overflow-hidden">
            {/* Sidebar - Integrated Style */}
            <AnimatePresence initial={false}>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 300, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="h-full bg-gray-50/50 flex flex-col overflow-hidden border-r border-gray-100"
                    >
                        <div className="p-6 flex flex-col h-full">
                            {/* Logo Row */}
                            <div className="flex items-center justify-between mb-8 px-1">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 bg-lime-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-lime-100">
                                        <Bot size={24} />
                                    </div>
                                    <span className="text-xl font-display font-bold text-gray-800 tracking-tight text-nowrap">Vasu AI</span>
                                </div>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200 text-gray-400"
                                >
                                    <PanelLeftClose size={18} />
                                </button>
                            </div>

                            {/* New Chat Button */}
                            <button
                                onClick={handleNewChat}
                                className="w-full flex items-center justify-between px-4 py-3.5 bg-lime-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-lime-100 transition-all hover:bg-lime-700 active:scale-95 mb-10 group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Plus size={18} strokeWidth={3} />
                                    <span>New Chat</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-40 text-[10px] font-black tracking-widest px-2 py-0.5 bg-black/10 rounded-lg">
                                    <ArrowUp size={10} strokeWidth={3} /> N
                                </div>
                            </button>

                            {/* Nav Items */}
                            <div className="space-y-1 mb-10 text-nowrap">
                                {[
                                    { icon: Globe, label: 'Explore Assistant' },
                                    { icon: BookOpen, label: 'Knowledge Base' },
                                    { icon: Layout, label: 'Templates' },
                                ].map((item, i) => (
                                    <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-white hover:text-lime-600 rounded-xl transition-all group">
                                        <item.icon size={18} className="text-gray-400 group-hover:text-lime-600 transition-colors" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {/* History Section */}
                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                                {['TODAY', 'YESTERDAY', 'AUGUST'].map((cat) => (
                                    <div key={cat}>
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-3">{cat}</h3>
                                        <div className="space-y-1">
                                            {sessions.filter(s => s.category === cat).map((session) => (
                                                <button
                                                    key={session.id}
                                                    onClick={() => handleSessionSelect(session.id)}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-nowrap ${activeSessionId === session.id ? 'bg-white shadow-sm font-bold text-lime-600 border border-gray-100' : 'text-gray-500 hover:bg-white/50'}`}
                                                >
                                                    <p className="text-[13px] truncate">{session.title}</p>
                                                </button>
                                            ))}
                                            {sessions.filter(s => s.category === cat).length === 0 && (
                                                <p className="px-3 text-[12px] text-gray-300 italic font-medium">No activity yet</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Nav */}
                            <div className="mt-auto space-y-1 pt-6 text-nowrap">
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-white rounded-xl transition-all group">
                                    <Settings size={18} className="text-gray-400" />
                                    Settings
                                </button>
                                <div className="p-2.5 bg-white rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-100 overflow-hidden flex-shrink-0">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" alt="pfp" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-gray-800 leading-none mb-1">Educator Space</p>
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Online</p>
                                    </div>
                                    <ChevronDown size={14} className="text-gray-300 group-hover:text-lime-600" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area - Full Screen Integration */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                {/* Header */}
                <div className="px-8 py-5 flex items-center justify-between border-b border-gray-50 bg-white/50 backdrop-blur-xl z-20">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2.5 hover:bg-gray-50 rounded-xl transition-all text-gray-400 border border-gray-100 mr-2"
                            >
                                <PanelLeft size={20} />
                            </button>
                        )}
                        <button className="flex items-center gap-2 group px-3 py-1.5 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
                            <span className="text-[15px] font-bold text-gray-800">Assistant Core v1.2</span>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                        </button>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"><MoreHorizontal size={20} /></button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"><LinkIcon size={20} /></button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 transition-all font-bold text-sm ml-2">
                            <Share2 size={16} />
                            Share
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-gray-50/10"
                >
                    <div className="max-w-4xl mx-auto p-8 lg:p-12 min-h-full flex flex-col relative">
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                                {/* Theme Consistent Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-12 px-6 py-2.5 bg-lime-50 border border-lime-100 rounded-full flex items-center gap-2 text-[13px] font-bold text-lime-600 shadow-sm shadow-lime-50"
                                >
                                    <div className="w-5 h-5 bg-lime-500 rounded-lg flex items-center justify-center text-white scale-75">
                                        <Sparkles size={10} strokeWidth={4} />
                                    </div>
                                    Assistant Ready <span className="text-gray-400">to assist your journey</span>
                                </motion.div>

                                {/* Center Logo & Title */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-8 w-16 h-16 bg-lime-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-lime-100"
                                >
                                    <Bot size={40} className="animate-pulse" />
                                </motion.div>
                                <h1 className="text-4xl font-display font-medium text-gray-900 mb-12 tracking-tight">Let's start a smart conversation</h1>

                                {/* Input Container - Centered for Empty State */}
                                <div className="w-full max-w-3xl space-y-4">
                                    <div className="relative bg-white border border-gray-100 rounded-[2.5rem] p-4 flex flex-col gap-4 shadow-[0_20px_80px_rgba(0,0,0,0.06)] focus-within:border-lime-200 transition-all group ring-8 ring-gray-50/50">
                                        <textarea
                                            ref={textareaRef}
                                            rows={1}
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = e.target.scrollHeight + 'px';
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            placeholder="Ask me anything..."
                                            className="w-full bg-transparent border-none focus:ring-0 text-[18px] font-medium text-gray-800 placeholder:text-gray-300 py-3 px-4 resize-none outline-none leading-relaxed min-h-[60px]"
                                        />

                                        <div className="flex items-center justify-between pb-1 px-2">
                                            <button
                                                onClick={() => setIsDeeperResearch(!isDeeperResearch)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[13px] border ${isDeeperResearch ? 'bg-lime-50 border-lime-200 text-lime-600' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isDeeperResearch ? 'border-lime-500 bg-lime-500' : 'border-gray-300'}`}>
                                                    {isDeeperResearch && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                </div>
                                                Deeper Research
                                                <div className="flex gap-0.5 ml-1 opacity-50">
                                                    <BookOpen size={12} />
                                                    <Sparkles size={12} />
                                                </div>
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 pr-4 mr-2 border-r border-gray-100">
                                                    <button className="p-2.5 hover:bg-gray-50 text-gray-400 hover:text-lime-600 rounded-xl transition-all"><Cpu size={18} /></button>
                                                    <button className="p-2.5 hover:bg-gray-50 text-gray-400 hover:text-lime-600 rounded-xl transition-all"><Globe size={18} /></button>
                                                    <button className="p-2.5 hover:bg-gray-50 text-gray-400 hover:text-lime-600 rounded-xl transition-all"><Paperclip size={18} /></button>
                                                    <button className="p-2.5 hover:bg-gray-50 text-gray-400 hover:text-lime-600 rounded-xl transition-all"><Mic size={18} /></button>
                                                </div>
                                                <button
                                                    onClick={() => handleSend()}
                                                    disabled={!input.trim() || isLoading}
                                                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${input.trim() && !isLoading ? 'bg-lime-600 text-white shadow-xl shadow-lime-100 hover:scale-110 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                                >
                                                    <Send size={20} strokeWidth={2.5} className={input.trim() && !isLoading ? 'animate-pulse' : ''} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Suggestion Cards Section */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16 scale-95">
                                    {suggestActions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(action.title)}
                                            className="p-8 bg-white border border-gray-50 hover:border-lime-200 shadow-sm hover:shadow-xl hover:shadow-lime-100/20 rounded-[2rem] text-left transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-lime-50 group-hover:text-lime-600 mb-6 transition-all duration-300">
                                                <action.icon size={20} />
                                            </div>
                                            <h4 className="text-[15px] font-bold text-gray-800 mb-2 truncate">{action.title}</h4>
                                            <p className="text-[12px] font-medium text-gray-400 leading-relaxed group-hover:text-gray-500 transition-colors uppercase tracking-tight">{action.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Message History View */
                            <div className="space-y-12 py-10 pb-40">
                                {messages.map((msg) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg.id}
                                        className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md transform transition-all ${msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-lime-600 text-white shadow-lime-100'}`}>
                                            {msg.role === 'user' ? <User size={18} /> : <Bot size={22} />}
                                        </div>
                                        <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-6 rounded-[1.8rem] shadow-sm border ${msg.role === 'user' ? 'bg-white border-gray-100 text-gray-800' : 'bg-lime-600 text-white border-lime-500 shadow-sm'}`}>
                                                <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                {msg.role === 'assistant' && (
                                                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4">
                                                        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Copy"><Copy size={12} /></button>
                                                        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Regenerate"><RefreshCw size={12} /></button>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="mt-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest px-2">
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-6">
                                        <div className="w-10 h-10 bg-lime-600 text-white rounded-xl flex items-center justify-center shadow-md animate-pulse">
                                            <Bot size={22} />
                                        </div>
                                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-2.5 shadow-sm">
                                            <span className="w-2 h-2 bg-lime-200 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-lime-200 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-lime-200 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Input - Only visible when not in empty state */}
                {messages.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center z-10 pointer-events-none">
                        <div className="w-full max-w-[850px] relative mt-10 pointer-events-auto">
                            <div className="relative bg-white border border-gray-100 rounded-[2.5rem] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.06)] group focus-within:border-lime-200 transition-all flex items-end gap-2 ring-8 ring-gray-50/50">
                                <button className="p-3 text-gray-400 hover:text-lime-600 hover:bg-lime-50 rounded-[1.2rem] transition-all"><Paperclip size={20} /></button>
                                <textarea
                                    ref={textareaRef}
                                    rows={1}
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Message Assistant..."
                                    className="flex-1 max-h-[150px] overflow-y-auto no-scrollbar bg-transparent border-none focus:ring-0 text-[15px] font-bold text-gray-800 placeholder:text-gray-300 py-3.5 px-2 resize-none outline-none leading-relaxed"
                                />
                                <div className="flex items-center gap-2 pb-1 pr-1">
                                    <button className="p-3 text-gray-400 hover:text-lime-600 hover:bg-lime-50 rounded-[1.2rem] transition-all"><Mic size={20} /></button>
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || isLoading}
                                        className={`w-12 h-12 flex items-center justify-center rounded-[1.1rem] transition-all ${input.trim() && !isLoading ? 'bg-lime-600 text-white shadow-xl shadow-lime-100 hover:scale-105 active:scale-95' : 'bg-gray-200 text-gray-300 cursor-not-allowed'}`}
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Global Footer Meta */}
                <div className="p-2 text-center bg-white border-t border-gray-50">
                    <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest leading-none">
                        Assistant can make mistakes. Check important info. See <span className="underline cursor-pointer">Cookie Preferences</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
