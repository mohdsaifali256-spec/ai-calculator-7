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
  Activity,
  HandCoins,
  ChevronRight,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { NavTab } from "../../types";
import { useTranslation, useInteractions } from "../../lib/hooks";
import { TRANSLATIONS } from "../../lib/i18n";
import { CreatorTag } from "../ui/CreatorTag";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  onSelect: (tab: NavTab) => void;
}

type TranslationKey = keyof typeof TRANSLATIONS['en'];

const TOOLS: { id: NavTab; nameKey: TranslationKey; descKey: TranslationKey; icon: any; color: string }[] = [
  { id: 'calc', nameKey: 'normal', descKey: 'basic_math', icon: Calculator, color: 'bg-blue-500' },
  { id: 'scientific', nameKey: 'scientific', descKey: 'complex_math', icon: FlaskConical, color: 'bg-emerald-500' },
  { id: 'cash', nameKey: 'cash', descKey: 'money_tally', icon: IndianRupee, color: 'bg-amber-500' },
  { id: 'gst', nameKey: 'gst', descKey: 'tax_calc', icon: ReceiptIndianRupee, color: 'bg-rose-500' },
  { id: 'discount', nameKey: 'discount', descKey: 'save_money', icon: Percent, color: 'bg-purple-500' },
  { id: 'emi', nameKey: 'emi', descKey: 'loan_planner', icon: CreditCard, color: 'bg-indigo-500' },
  { id: 'bmi', nameKey: 'bmi', descKey: 'health_tracker', icon: Activity, color: 'bg-pink-500' },
  { id: 'loan', nameKey: 'loan', descKey: 'interest_calc', icon: HandCoins, color: 'bg-orange-500' },
  { id: 'invoice', nameKey: 'invoice', descKey: 'business_bills', icon: FileText, color: 'bg-slate-500' },
  { id: 'expense', nameKey: 'expenses', descKey: 'daily_tracking', icon: Wallet, color: 'bg-cyan-500' },
  { id: 'converter', nameKey: 'unit', descKey: 'units_scale', icon: ArrowLeftRight, color: 'bg-teal-500' },
  { id: 'age', nameKey: 'age', descKey: 'birthday_math', icon: Calendar, color: 'bg-lime-500' },
];

export function Dashboard({ onSelect }: DashboardProps) {
  const { T } = useTranslation();
  const { playInteraction } = useInteractions();

  const handleSelect = (id: NavTab) => {
    playInteraction('tap');
    onSelect(id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white px-1">{T('toolkit')}</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Neural Linked. Futuristic. Secure.</p>
      </div>

      {/* AI Ask Button */}
      <div 
        className="relative group cursor-pointer overflow-hidden rounded-[32px] border border-pink-500/20 bg-black/40 p-6 transition-all hover:border-pink-500/40 hover:shadow-[0_0_30px_rgba(255,0,127,0.1)]"
        onClick={() => document.getElementById('ai-chat-trigger')?.click()}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl neon-pink flex items-center justify-center shadow-[0_0_20px_rgba(255,0,127,0.4)]">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">NEON AI ASK</h3>
              <div className="px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20 text-[8px] font-black text-pink-500 uppercase tracking-widest">v4.0 PRO</div>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Quantum Powered Intelligence</p>
          </div>
          <div className="ml-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-pink-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleSelect(tool.id)}
            className="group relative bg-bg-card border border-white/5 p-4 sm:p-5 rounded-[24px] sm:rounded-[32px] text-left transition-all hover:border-pink-500/40 hover:shadow-[0_0_20px_rgba(255,0,127,0.15)] active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-pink-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-500 blur-xl" />
            
            <div className={cn(
              "w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-all group-hover:rotate-12 duration-300 shadow-lg",
              "bg-pink-500/10 border border-pink-500/20 text-pink-500 group-hover:bg-pink-500 group-hover:text-white"
            )}>
              <tool.icon className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            
            <div>
              <h3 className="font-bold text-white text-sm sm:text-md leading-tight group-hover:text-pink-400 transition-colors uppercase tracking-tight">{T(tool.nameKey)}</h3>
              <p className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest mt-1 font-bold line-clamp-1">{T(tool.descKey)}</p>
            </div>

            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-300">
              <ChevronRight className="w-4 h-4 text-pink-500" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-pink-500/20 to-transparent p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-pink-500/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,0,127,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10 space-y-1 sm:space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase italic">
            NEON<span className="text-pink-500 not-italic">PRO</span>
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest opacity-80">{T('business_utility')}</p>
          <div className="pt-2 sm:pt-4">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] bg-pink-500/20 text-pink-500 border border-pink-500/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              SYSTEM v3.0
            </span>
          </div>
        </div>
        <img 
          src="https://img.icons8.com/isometric/512/calculator.png" 
          alt="Logo Mascot"
          className="absolute top-1/2 -right-4 sm:right-4 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 opacity-70 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 pointer-events-none drop-shadow-[0_0_30px_rgba(255,0,127,0.3)]" 
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="bg-bg-card rounded-[32px] p-6 border border-pink-500/10 flex items-center justify-between group hover:border-pink-500/40 hover:shadow-[0_0_30px_rgba(255,0,127,0.15)] transition-all cursor-pointer relative overflow-hidden"
        onClick={() => window.open('https://www.profitablecpmratenetwork.com/svysm88h?key=765e44bff64a86610f2cd689d0d942c8', '_blank')}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-pink-500/10 transition-colors" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] transition-all border border-pink-500/20">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm group-hover:text-pink-400 transition-colors uppercase tracking-tight">Access Reward Portal</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black opacity-60">Unlock Exclusive Features</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-pink-500 group-hover:translate-x-1 transition-all relative z-10" />
      </div>

      <div className="flex justify-center pt-8 pb-4">
        <CreatorTag className="!mt-0 !scale-90" />
      </div>
    </div>
  );
}
