import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, X, MessageSquare, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Greetings. I am your premium AI assistant. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "I apologize, but I encountered an error. Please ensure the OpenAI API key is configured correctly in the environment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "fixed bottom-24 right-4 z-50 flex flex-col transition-all duration-500 ease-in-out",
      isExpanded ? "w-[calc(100%-32px)] h-[500px] md:w-[400px]" : "w-14 h-14"
    )}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="flex-1 glass rounded-[32px] overflow-hidden flex flex-col border border-pink-500/20 shadow-[0_0_50px_rgba(255,0,127,0.15)] mb-4"
          >
            {/* Header */}
            <div className="p-4 border-b border-pink-500/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                  <Bot className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wider flex items-center gap-2">
                    NEON AI <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-glow-pink"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "flex items-end gap-2",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                    msg.role === 'user' ? "bg-zinc-800 border-white/5" : "bg-pink-500/20 border-pink-500/30"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-pink-500" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-white/10 text-white rounded-br-none border border-white/5" 
                      : "bg-pink-500/5 text-pink-50 text-shadow-glow rounded-bl-none border border-pink-500/10"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                    <Bot className="w-4 h-4 text-pink-500" />
                  </div>
                  <div className="bg-pink-500/5 p-3 rounded-2xl border border-pink-500/10">
                    <Loader2 className="w-4 h-4 text-pink-500 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-black/60 backdrop-blur-xl border-t border-pink-500/10">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl opacity-20 blur group-focus-within:opacity-40 transition-opacity" />
                <div className="relative bg-zinc-950 rounded-2xl flex items-center p-1.5 border border-white/5">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Neon AI anything..."
                    className="flex-1 bg-transparent border-none outline-none text-white px-3 py-2 text-sm placeholder:text-zinc-600"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 rounded-xl neon-pink flex items-center justify-center disabled:opacity-50 disabled:grayscale"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      {!isExpanded && (
        <motion.button
          id="ai-chat-trigger"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 rounded-full neon-pink flex items-center justify-center relative group"
        >
          <div className="absolute -inset-2 bg-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare className="w-6 h-6 text-white relative z-10" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full border-2 border-pink-500 animate-pulse" />
        </motion.button>
      )}
    </div>
  );
}
