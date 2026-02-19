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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    const [aiMode, setAiMode] = useState<'standard' | 'advanced'>('standard');
    const [webSearch, setWebSearch] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const suggestActions = [
        { title: 'Summarize Text', desc: 'Turn long articles into easy summaries.', icon: FileText, prompt: 'Help me summarize a long text or article into a clear, concise summary suitable for my students.' },
        { title: 'Creative Writing', desc: 'Generate stories, blog posts, or fresh content ideas.', icon: Sparkles, prompt: 'Help me create an engaging creative writing piece or story that I can use in my classroom.' },
        { title: 'Answer Questions', desc: 'Ask me anything—from facts to advice—and get instant answers.', icon: BrainCircuit, prompt: 'Hello! I have a question. Can you help me with teaching strategies and educational advice?' },
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

    const handleSessionSelect = (id: string) => {
        setActiveSessionId(id);
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

        try {
            // Get current session messages for history context
            const currentSession = sessions.find(s => s.id === targetId);
            const historyMessages = currentSession?.messages
                ?.filter(m => m.id !== userMsg.id) // exclude the message we just added
                ?.slice(-10) // last 10 messages for context
                ?.map(m => ({ role: m.role, content: m.content })) || [];

            const response = await fetch('http://127.0.0.1:8000/api/v1/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    history: historyMessages,
                    deeper_research: isDeeperResearch
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();

            const aiMsg: Message = {
                id: generateUUID(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date()
            };

            setSessions(prev => prev.map(s =>
                s.id === targetId ? { ...s, messages: [...s.messages, aiMsg] } : s
            ));
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg: Message = {
                id: generateUUID(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error processing your request. Please try again.",
                timestamp: new Date()
            };
            setSessions(prev => prev.map(s =>
                s.id === targetId ? { ...s, messages: [...s.messages, errorMsg] } : s
            ));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full bg-background font-sans overflow-hidden">
            {/* Sidebar - Integrated Style */}
            <AnimatePresence initial={false}>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 300, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="h-full bg-card-bg/50 backdrop-blur-xl flex flex-col overflow-hidden border-r border-border"
                    >
                        <div className="p-6 flex flex-col h-full">
                            {/* Logo Row */}
                            <div className="flex items-center justify-between mb-8 px-1">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 bg-lime-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-lime-500/20">
                                        <Bot size={24} />
                                    </div>
                                    <span className="text-xl font-display font-bold text-foreground tracking-tight text-nowrap">Vasu AI</span>
                                </div>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 hover:bg-muted/80 rounded-xl transition-all border border-transparent hover:border-border text-muted-foreground"
                                >
                                    <PanelLeftClose size={18} />
                                </button>
                            </div>

                            {/* New Chat Button */}
                            <button
                                onClick={handleNewChat}
                                className="w-full flex items-center justify-between px-4 py-3.5 bg-lime-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-lime-500/20 transition-all hover:bg-lime-700 active:scale-95 mb-10 group"
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
                                ].map((item, i) => (
                                    <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-muted-foreground hover:bg-muted/50 hover:text-lime-500 rounded-xl transition-all group">
                                        <item.icon size={18} className="text-muted-foreground/60 group-hover:text-lime-500 transition-colors" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {/* History Section */}
                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                                {['TODAY', 'YESTERDAY', 'AUGUST']
                                    .filter(cat => sessions.some(s => s.category === cat))
                                    .map((cat) => (
                                        <div key={cat}>
                                            <h3 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-4 px-3">{cat}</h3>
                                            <div className="space-y-1">
                                                {sessions.filter(s => s.category === cat).map((session) => (
                                                    <button
                                                        key={session.id}
                                                        onClick={() => handleSessionSelect(session.id)}
                                                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-nowrap ${activeSessionId === session.id ? 'bg-muted shadow-sm font-bold text-lime-500 border border-border' : 'text-muted-foreground hover:bg-muted/30'}`}
                                                    >
                                                        <p className="text-[13px] truncate">{session.title}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Footer Nav */}
                            <button className="w-full flex items-center gap-3 px-3 py-3 text-[13px] font-bold text-muted-foreground hover:bg-muted rounded-xl transition-all group border border-transparent hover:border-border shadow-sm hover:shadow-md">
                                <Settings size={18} className="text-muted-foreground/60 group-hover:text-lime-500" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area - Full Screen Integration */}
            <div className="flex-1 flex flex-col bg-background overflow-hidden relative">
                {/* Header */}
                <div className="px-8 py-5 flex items-center justify-between border-b border-border bg-header-bg backdrop-blur-xl z-20">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2.5 hover:bg-muted rounded-xl transition-all text-muted-foreground border border-border mr-2"
                            >
                                <PanelLeft size={20} />
                            </button>
                        )}
                        <button className="flex items-center gap-2 group px-3 py-1.5 hover:bg-muted rounded-xl transition-all border border-transparent hover:border-border">
                            <span className="text-[15px] font-bold text-foreground">Assistant Core v1.2</span>
                            <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground" />
                        </button>

                        {/* Active Modes Badges */}
                        <div className="flex items-center gap-2">
                            {aiMode === 'advanced' && (
                                <div className="px-3 py-1 bg-lime-500/10 border border-lime-500/30 rounded-lg flex items-center gap-1.5">
                                    <Cpu size={12} className="text-lime-500" />
                                    <span className="text-[11px] font-bold text-lime-500 uppercase tracking-wider">Advanced AI</span>
                                </div>
                            )}
                            {webSearch && (
                                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-1.5">
                                    <Globe size={12} className="text-blue-500" />
                                    <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Web Search</span>
                                </div>
                            )}
                            {isDeeperResearch && (
                                <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center gap-1.5">
                                    <BookOpen size={12} className="text-purple-500" />
                                    <span className="text-[11px] font-bold text-purple-500 uppercase tracking-wider">Deep Research</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
                >
                    <div className="max-w-[1400px] mx-auto p-8 lg:p-12 min-h-full flex flex-col relative w-full">
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                                {/* Theme Consistent Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-12 px-6 py-2.5 bg-lime-500/10 border border-lime-500/20 rounded-full flex items-center gap-2 text-[13px] font-bold text-lime-500 shadow-sm shadow-lime-500/5"
                                >
                                    <div className="w-5 h-5 bg-lime-500 rounded-lg flex items-center justify-center text-white scale-75">
                                        <Sparkles size={10} strokeWidth={4} />
                                    </div>
                                    Assistant Ready <span className="text-muted-foreground/60">to assist your journey</span>
                                </motion.div>

                                {/* Center Logo & Title */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-8 w-16 h-16 bg-lime-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-lime-500/20"
                                >
                                    <Bot size={40} className="animate-pulse" />
                                </motion.div>
                                <h1 className="text-4xl font-display font-medium text-foreground mb-12 tracking-tight">Let's start a smart conversation</h1>

                                {/* Input Container - Centered for Empty State */}
                                <div className="w-full max-w-5xl space-y-4">
                                    <div className="relative bg-card-bg border border-border rounded-[2.5rem] p-4 flex flex-col gap-4 shadow-2xl focus-within:border-lime-500/50 transition-all group ring-8 ring-muted/20">
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
                                            className="w-full bg-transparent border-none focus:ring-0 text-[18px] font-medium text-foreground placeholder:text-muted-foreground/30 py-3 px-4 resize-none outline-none leading-relaxed min-h-[60px]"
                                        />

                                        <div className="flex items-center justify-between pb-1 px-2">
                                            <button
                                                onClick={() => setIsDeeperResearch(!isDeeperResearch)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[13px] border ${isDeeperResearch ? 'bg-lime-500/10 border-lime-500/30 text-lime-500' : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isDeeperResearch ? 'border-lime-500 bg-lime-500' : 'border-muted-foreground/30'}`}>
                                                    {isDeeperResearch && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                </div>
                                                Deeper Research
                                                <div className="flex gap-0.5 ml-1 opacity-50">
                                                    <BookOpen size={12} />
                                                    <Sparkles size={12} />
                                                </div>
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 pr-4 mr-2 border-r border-border">
                                                    {/* AI Mode Toggle */}
                                                    <button
                                                        onClick={() => setAiMode(aiMode === 'standard' ? 'advanced' : 'standard')}
                                                        className={`p-2.5 hover:bg-muted rounded-xl transition-all group relative ${aiMode === 'advanced' ? 'text-lime-500 bg-lime-500/10' : 'text-muted-foreground/60 hover:text-lime-500'}`}
                                                        title={aiMode === 'standard' ? 'Switch to Advanced AI' : 'Switch to Standard AI'}
                                                    >
                                                        <Cpu size={18} />
                                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            {aiMode === 'standard' ? 'Advanced AI' : 'Standard AI'}
                                                        </span>
                                                    </button>

                                                    {/* Web Search Toggle */}
                                                    <button
                                                        onClick={() => setWebSearch(!webSearch)}
                                                        className={`p-2.5 hover:bg-muted rounded-xl transition-all group relative ${webSearch ? 'text-lime-500 bg-lime-500/10' : 'text-muted-foreground/60 hover:text-lime-500'}`}
                                                        title={webSearch ? 'Web Search: ON' : 'Web Search: OFF'}
                                                    >
                                                        <Globe size={18} />
                                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            Web Search
                                                        </span>
                                                    </button>

                                                    {/* File Upload */}
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="p-2.5 hover:bg-muted text-muted-foreground/60 hover:text-lime-500 rounded-xl transition-all group relative"
                                                        title="Attach File"
                                                    >
                                                        <Paperclip size={18} />
                                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            Attach File
                                                        </span>
                                                    </button>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                alert(`File "${file.name}" selected. File upload feature coming soon!`);
                                                            }
                                                        }}
                                                    />

                                                    {/* Voice Input */}
                                                    <button
                                                        onClick={() => alert('Voice input feature coming soon! 🎤')}
                                                        className="p-2.5 hover:bg-muted text-muted-foreground/60 hover:text-lime-500 rounded-xl transition-all group relative"
                                                        title="Voice Input"
                                                    >
                                                        <Mic size={18} />
                                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            Voice Input
                                                        </span>
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleSend()}
                                                    disabled={!input.trim() || isLoading}
                                                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${input.trim() && !isLoading ? 'bg-lime-600 text-white shadow-xl shadow-lime-500/30 hover:scale-110 active:scale-95' : 'bg-muted text-muted-foreground/30 cursor-not-allowed'}`}
                                                >
                                                    <Send size={20} strokeWidth={2.5} className={input.trim() && !isLoading ? 'animate-pulse' : ''} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Suggestion Cards Section */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl mt-16 px-4">
                                    {suggestActions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(action.prompt)}
                                            className="p-6 bg-card-bg border border-border hover:border-lime-500/30 shadow-sm hover:shadow-2xl hover:shadow-lime-500/10 rounded-[2rem] text-left transition-all duration-300 group flex flex-col h-full"
                                        >
                                            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground/60 group-hover:bg-lime-500/10 group-hover:text-lime-500 mb-5 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                                                <action.icon size={24} />
                                            </div>
                                            <h4 className="text-[16px] font-bold text-foreground mb-2 truncate">{action.title}</h4>
                                            <p className="text-[13px] font-medium text-muted-foreground/70 leading-relaxed transition-colors line-clamp-2">
                                                {action.desc}
                                            </p>
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
                                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md transform transition-all ${msg.role === 'user' ? 'bg-foreground text-background' : 'bg-lime-600 text-white shadow-lime-500/20'}`}>
                                            {msg.role === 'user' ? <User size={18} /> : <Bot size={22} />}
                                        </div>
                                        <div className={`flex flex-col max-w-[85%] group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`relative p-5 px-6 rounded-[2.2rem] transition-all duration-300 ${msg.role === 'user'
                                                ? 'bg-muted text-foreground rounded-tr-none border border-border'
                                                : 'bg-card-bg border border-border text-foreground rounded-tl-none shadow-xl shadow-lime-500/5 border-l-[4px] border-l-lime-500'
                                                }`}>
                                                <div className="text-[15px] font-medium leading-relaxed markdown-container">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>

                                                {msg.role === 'assistant' && (
                                                    <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 hover:bg-muted text-muted-foreground hover:text-lime-500 rounded-xl transition-all active:scale-90 flex items-center gap-1.5 text-[11px] font-bold" title="Copy">
                                                            <Copy size={13} /> Copy
                                                        </button>
                                                        <button className="p-2 hover:bg-muted text-muted-foreground hover:text-lime-500 rounded-xl transition-all active:scale-90 flex items-center gap-1.5 text-[11px] font-bold" title="Regenerate">
                                                            <RefreshCw size={13} /> Retry
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 mt-1.5 px-2">
                                                <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-6">
                                        <div className="w-10 h-10 bg-lime-600 text-white rounded-xl flex items-center justify-center shadow-md animate-pulse">
                                            <Bot size={22} />
                                        </div>
                                        <div className="bg-card-bg p-6 rounded-[2rem] border border-border flex items-center gap-2.5 shadow-sm">
                                            <span className="w-2 h-2 bg-lime-500/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-lime-500/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-lime-500/40 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Input - Only visible when not in empty state */}
                {messages.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/95 to-transparent flex justify-center z-10 pointer-events-none">
                        <div className="w-full max-w-[1100px] relative mt-10 pointer-events-auto">
                            <div className="relative bg-card-bg border border-border rounded-[2.5rem] p-3 shadow-2xl group focus-within:border-lime-500/50 transition-all flex items-end gap-2 ring-8 ring-muted/20">
                                <button className="p-3 text-muted-foreground/60 hover:text-lime-500 hover:bg-muted rounded-[1.2rem] transition-all"><Paperclip size={20} /></button>
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
                                    className="flex-1 max-h-[150px] overflow-y-auto no-scrollbar bg-transparent border-none focus:ring-0 text-[15px] font-bold text-foreground placeholder:text-muted-foreground/30 py-3.5 px-2 resize-none outline-none leading-relaxed"
                                />
                                <div className="flex items-center gap-2 pb-1 pr-1">
                                    <button className="p-3 text-muted-foreground/60 hover:text-lime-500 hover:bg-muted rounded-[1.2rem] transition-all"><Mic size={20} /></button>
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || isLoading}
                                        className={`w-12 h-12 flex items-center justify-center rounded-[1.1rem] transition-all ${input.trim() && !isLoading ? 'bg-lime-600 text-white shadow-xl shadow-lime-100 hover:scale-105 active:scale-95' : 'bg-muted text-muted-foreground/20 cursor-not-allowed'}`}
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Global Footer Meta */}
                <div className="p-2 text-center bg-background border-t border-border">
                    <p className="text-[11px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">
                        Assistant can make mistakes. Check important info. See <span className="underline cursor-pointer">Cookie Preferences</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
