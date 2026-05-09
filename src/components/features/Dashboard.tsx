import { motion } from "motion/react";
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
  Calendar 
} from "lucide-react";
import { NavTab } from "../../types";
import { cn } from "../../lib/utils";

interface DashboardProps {
  onSelect: (tab: NavTab) => void;
}

const TOOLS = [
  { id: 'calc', label: 'Calculator', icon: Calculator, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'scientific', label: 'Scientific', icon: FlaskConical, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'cash', label: 'Cash Counter', icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'gst', label: 'GST Calc', icon: ReceiptIndianRupee, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'discount', label: 'Discount', icon: Percent, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'emi', label: 'EMI / Loan', icon: CreditCard, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 'invoice', label: 'Invoice Gen', icon: FileText, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'expense', label: 'Expenses', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'converter', label: 'Converter', icon: ArrowLeftRight, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'age', label: 'Age Calc', icon: Calendar, color: 'text-red-500', bg: 'bg-red-500/10' },
] as const;

export function Dashboard({ onSelect }: DashboardProps) {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Fast. Smart. Professional.</p>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Status</p>
              <p className="text-sm font-mono text-green-400">Cloud Sync Ready</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <button className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 text-xs font-bold uppercase tracking-widest">
              Business Mode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TOOLS.map((tool, index) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onClick={() => onSelect(tool.id)}
              className="bg-bg-card p-6 rounded-[32px] border border-white/5 flex flex-col items-center gap-4 group transition-all active:scale-95 hover:border-white/20 hover:bg-white/[0.03]"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110", 
                tool.bg,
                "group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              )}>
                <tool.icon className={cn("w-6 h-6", tool.color)} />
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white block">{tool.label}</span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">Launch Tool</span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-600/20 to-blue-900/5 rounded-[40px] p-8 border border-blue-500/20 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
          <Calculator className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-md">
          <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest mb-4 inline-block">New Update</span>
          <h3 className="text-2xl font-bold mb-2">Smart Business Engine</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">Experience the fastest business calculations with automated GST splitting and cloud-synced history tracking.</p>
          <div className="flex gap-3">
            <div className="h-2 w-8 bg-blue-500 rounded-full"></div>
            <div className="h-2 w-2 bg-white/20 rounded-full"></div>
            <div className="h-2 w-2 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
