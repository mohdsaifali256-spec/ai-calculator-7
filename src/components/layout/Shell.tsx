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
import { CreatorTag } from "../ui/CreatorTag";

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
      <header className="px-4 sm:px-5 h-14 sm:h-16 flex items-center justify-between border-b border-white/5 bg-header/80 backdrop-blur-xl z-50 safe-pt">
        <div className="flex items-center gap-2 sm:gap-3">
          {!isHome && onBack ? (
            <button 
              onClick={handleBack}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all group"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-white" />
            </button>
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center shadow-lg overflow-hidden border border-white/10 group">
              <img 
                src="https://img.icons8.com/isometric/512/calculator.png" 
                alt="Logo" 
                className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight leading-none text-white capitalize">
              {activeTab === 'home' ? T('app_name' as any) : (T(activeTab as any) || activeTab.replace('-', ' '))}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] sm:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Offline</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-28 md:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-8 max-w-full md:max-w-2xl mx-auto w-full overflow-hidden"
          >
            {children}
            
            {activeTab !== 'home' && (
              <div className="flex justify-center mt-12 mb-8 opacity-40 hover:opacity-100 transition-opacity">
                <CreatorTag className="!mt-0 !scale-75" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 sm:h-20 bg-header/90 backdrop-blur-xl border-t border-white/5 px-2 sm:px-8 flex justify-around items-center z-50 safe-pb">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all relative group flex-1 py-2",
              activeTab === item.id ? "text-primary " : "text-slate-500 hover:text-slate-300"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute -top-1 w-6 h-1 bg-primary rounded-full shadow-[0_0_15px_var(--color-primary)]"
              />
            )}
            <item.icon className={cn("w-4.5 h-4.5 sm:w-6 sm:h-6", activeTab === item.id && "drop-shadow-[0_0_8px_var(--color-primary)]")} />
            <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-widest mt-0.5">{T(item.labelKey)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
