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
    playInteraction();
    onSelect(id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white px-1">{T('toolkit')}</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Fast. Reliable. Offline.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleSelect(tool.id)}
            className="group relative bg-bg-card border border-white/5 p-5 rounded-[32px] text-left transition-all hover:border-primary/20 hover:scale-[1.02] active:scale-[0.98] shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-500" />
            
            <div className={`w-10 h-10 rounded-2xl ${tool.color} flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-300 shadow-lg`}>
              <tool.icon className="w-5 h-5 text-white" />
            </div>
            
            <div>
              <h3 className="font-bold text-white text-md leading-tight group-hover:text-primary transition-colors">{T(tool.nameKey)}</h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1 font-bold">{T(tool.descKey)}</p>
            </div>

            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
              <ChevronRight className="w-4 h-4 text-primary" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-[40px] border border-primary/20 relative overflow-hidden group">
        <div className="relative z-10 space-y-2">
          <h3 className="text-xl font-bold text-white">SmartAdvance Pro</h3>
          <p className="text-slate-400 text-sm max-w-[200px]">{T('business_utility')}</p>
          <div className="pt-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-primary/20 text-primary px-3 py-1 rounded-full">
              {T('stable')} v2.0
            </span>
          </div>
        </div>
        <Calculator className="absolute top-1/2 right-4 -translate-y-1/2 w-40 h-40 text-primary/5 -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-700" />
      </div>
    </div>
  );
}
