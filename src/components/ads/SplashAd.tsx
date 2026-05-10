import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export function SplashAd({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500); 
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-[#0A0B0E] flex flex-col items-center justify-center p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]" />
          
          <div className="relative mb-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -inset-12 bg-primary/10 blur-3xl rounded-full animate-pulse"
            />
            <motion.img 
              initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              src="https://img.icons8.com/isometric/512/calculator.png" 
              className="w-32 h-32 relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              alt="Logo"
            />
          </div>

          <div className="space-y-6 flex flex-col items-center text-center relative z-10">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                Smart<span className="text-primary not-italic">Calc</span>
              </h1>
              <p className="text-slate-500 font-bold tracking-[0.4em] text-[10px] uppercase">Professional Utility Tool</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-56 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                   className="h-full bg-gradient-to-r from-primary to-blue-400"
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 2.2, ease: "easeInOut" }}
                />
              </div>
              <span className="text-slate-600 font-bold uppercase tracking-[0.2em] text-[8px] animate-pulse">Initializing Optimized Ads...</span>
            </div>
          </div>

          <div className="absolute bottom-12 flex flex-col items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Network Secure</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
