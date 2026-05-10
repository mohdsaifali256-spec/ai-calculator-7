import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, 
  History,
  Settings,
  LayoutDashboard,
  ChevronLeft
} from "lucide-react";
import { NavTab } from "../../types";
import { cn } from "../../lib/utils";
import { useInteractions, useTranslation } from "../../lib/hooks";
import { TRANSLATIONS } from "../../lib/i18n";

interface ShellProps {
  children: ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onBack?: () => void;
}

type TranslationKey = keyof typeof TRANSLATIONS['en'];

const NAV_ITEMS: { id: NavTab; labelKey: TranslationKey; icon: any }[] = [
  { id: 'home', labelKey: 'dashboard', icon: LayoutDashboard },
  { id: 'calc', labelKey: 'normal', icon: Calculator },
  { id: 'history', labelKey: 'history', icon: History },
  { id: 'settings', labelKey: 'settings', icon: Settings },
];

export function Shell({ children, activeTab, onTabChange, onBack }: ShellProps) {
  const isHome = activeTab === 'home';
  const { playInteraction } = useInteractions();
  const { T } = useTranslation();

  const handleTabChange = (tab: NavTab) => {
    playInteraction('tap');
    onTabChange(tab);
  };

  const handleBack = () => {
    playInteraction('back');
    if (onBack) onBack();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-main">
      {/* Header */}
      <header className="px-5 h-16 flex items-center justify-between border-b border-white/5 bg-header/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          {!isHome && onBack ? (
            <button 
              onClick={handleBack}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all group"
            >
              <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
            </button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Calculator className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none text-white capitalize">
              {activeTab === 'home' ? 'SmartAdvance' : (T(activeTab as any) || activeTab.replace('-', ' '))}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hidden sm:inline">Offline Mode</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: isHome ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isHome ? 20 : -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="p-4 md:p-8 max-w-2xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-header border-t border-white/5 px-4 sm:px-8 flex justify-around items-center z-50">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all relative group flex-1",
              activeTab === item.id ? "text-primary scale-110" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute -top-3 w-8 h-1 bg-primary rounded-full shadow-[0_0_15px_var(--color-primary)]"
              />
            )}
            <item.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", activeTab === item.id && "drop-shadow-[0_0_8px_var(--color-primary)]")} />
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest">{T(item.labelKey)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
