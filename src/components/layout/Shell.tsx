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
    <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 glass-dark z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SmartAdvance</h1>
        </div>
        <button 
          onClick={() => onTabChange('settings')}
          className="p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <Settings className="w-5 h-5 text-zinc-400" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-6 max-w-4xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/5 px-6 py-3 flex justify-between items-center z-30 pb-safe">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeTab === item.id ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <item.icon className={cn("w-6 h-6", activeTab === item.id && "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]")} />
            <span className="text-[10px] font-medium uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
