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
  ChevronRight
} from "lucide-react";
import { NavTab } from "../../types";
import { useTranslation, useInteractions } from "../../lib/hooks";
import { TRANSLATIONS } from "../../lib/i18n";
import { CreatorTag } from "../ui/CreatorTag";

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
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Fast. Reliable. Offline.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleSelect(tool.id)}
            className="group relative bg-bg-card border border-white/5 p-4 sm:p-5 rounded-[24px] sm:rounded-[32px] text-left transition-all hover:border-primary/20 active:scale-[0.98] shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-500" />
            
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${tool.color} flex items-center justify-center mb-3 sm:mb-4 transition-transform group-hover:rotate-12 duration-300 shadow-lg`}>
              <tool.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            
            <div>
              <h3 className="font-bold text-white text-sm sm:text-md leading-tight group-hover:text-primary transition-colors">{T(tool.nameKey)}</h3>
              <p className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest mt-1 font-bold line-clamp-1">{T(tool.descKey)}</p>
            </div>

            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
              <ChevronRight className="w-4 h-4 text-primary" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-primary/20 relative overflow-hidden group">
        <div className="relative z-10 space-y-1 sm:space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-white max-w-[140px] sm:max-w-none">{T('app_name' as any)} Pro</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-[140px] sm:max-w-[200px]">{T('business_utility')}</p>
          <div className="pt-2 sm:pt-4">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] bg-primary/20 text-primary px-3 py-1 rounded-full">
              {T('stable')} v2.0
            </span>
          </div>
        </div>
        <img 
          src="https://img.icons8.com/isometric/512/calculator.png" 
          alt="Logo Mascot"
          className="absolute top-1/2 -right-4 sm:right-4 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 opacity-70 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none" 
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="bg-bg-card rounded-[32px] p-6 border border-white/5 flex items-center justify-between group hover:border-primary/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all cursor-pointer relative overflow-hidden"
        onClick={() => window.open('https://www.profitablecpmratenetwork.com/svysm88h?key=765e44bff64a86610f2cd689d0d942c8', '_blank')}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm group-hover:text-primary transition-colors">Daily Bonus Reward</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Tap to unlock special gifts</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all relative z-10" />
      </div>

      <div className="flex justify-center pt-8 pb-4">
        <CreatorTag className="!mt-0 !scale-90" />
      </div>
    </div>
  );
}
