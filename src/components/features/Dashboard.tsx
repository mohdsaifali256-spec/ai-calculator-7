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
    <div className="space-y-6">
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">Business Suite</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool, index) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(tool.id)}
              className="glass p-6 rounded-2xl flex flex-col items-center gap-4 group transition-all active:scale-95 hover:border-white/20"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", tool.bg)}>
                <tool.icon className={cn("w-6 h-6", tool.color)} />
              </div>
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">{tool.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ReceiptIndianRupee className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-1">Boost Your Productivity</h3>
          <p className="text-zinc-400 text-sm mb-4">Professional tools designed for shopkeepers, students, and businesses.</p>
          <div className="flex gap-2">
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded tracking-tighter uppercase font-bold">Fast</span>
            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded tracking-tighter uppercase font-bold">Secure</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded tracking-tighter uppercase font-bold">Smart</span>
          </div>
        </div>
      </section>
    </div>
  );
}
