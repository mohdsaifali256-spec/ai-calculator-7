import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, 
  FlaskConical, 
  IndianRupee, 
  ReceiptIndianRupee, 
  Percent, 
  CreditCard, 
  FileText, 
  Wallet, 
  ArrowLeftRight, 
  Calendar,
  History,
  Settings,
  LayoutDashboard
} from "lucide-react";
import { NavTab } from "../../types";
import { cn } from "../../lib/utils";

interface ShellProps {
  children: ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: any }[] = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'calc', label: 'Calc', icon: Calculator },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'More', icon: Settings },
];

export function Shell({ children, activeTab, onTabChange }: ShellProps) {
  return (
    <div className="flex flex-col h-screen bg-bg-main overflow-hidden">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-white/5 bg-bg-sidebar/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">SmartAdvance</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold mt-1">Professional Suite</p>
          </div>
        </div>
        <button 
          onClick={() => onTabChange('settings')}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
        >
          <Settings className="w-5 h-5 text-zinc-400" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-4 md:p-8 max-w-5xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-sidebar/95 backdrop-blur-xl border-t border-white/5 px-8 pt-4 pb-8 flex justify-between items-center z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all relative",
              activeTab === item.id ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute -top-4 w-8 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              />
            )}
            <item.icon className={cn("w-6 h-6", activeTab === item.id && "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]")} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
