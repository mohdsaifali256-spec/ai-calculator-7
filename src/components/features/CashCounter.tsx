import { useState, useMemo } from "react";
import { IndianRupee, RotateCcw, Save, Banknote, Coins } from "lucide-react";
import { Button } from "../ui/Button";
import { CURRENCY_NOTES, CURRENCY_COINS } from "../../constants";
import { formatCurrency } from "../../lib/utils";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function CashCounter() {
  const [counts, setCounts] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    [...CURRENCY_NOTES, ...CURRENCY_COINS].forEach(val => initial[val] = 0);
    return initial;
  });

  const { saveCashRecord } = useHistory();

  const total = useMemo(() => {
    // ... rest of useMemo
  }, [counts]);

  const handleReset = () => {
    const reset: Record<number, number> = {};
    [...CURRENCY_NOTES, ...CURRENCY_COINS].forEach(val => reset[val] = 0);
    setCounts(reset);
  };

  const handleSave = async () => {
    try {
      await saveCashRecord({
        notes: counts,
        total
      });
      alert("Record saved!");
    } catch (e) {
      console.error(e);
    }
  };

  const RenderSection = ({ title, icon: Icon, data }: { title: string, icon: any, data: number[] }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Icon className="w-4 h-4 text-slate-500" />
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
      </div>
      {data.map((val) => (
        <div key={`${title}-${val}`} className="glass p-4 rounded-2xl flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded bg-zinc-800 flex items-center justify-center font-bold text-xs">
              ₹{val}
            </div>
            <span className="text-zinc-500 font-mono">×</span>
          </div>
          
          <input
            type="number"
            min="0"
            value={counts[val] || ""}
            onChange={(e) => setCounts({ ...counts, [val]: parseInt(e.target.value) || 0 })}
            className="bg-transparent border-b border-white/10 w-24 text-right focus:border-blue-500 outline-none font-mono text-lg py-1 px-2"
            placeholder="0"
          />
          
          <div className="w-32 text-right">
            <span className="text-zinc-300 font-mono font-medium">
              {formatCurrency((counts[val] || 0) * val)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 rounded-[32px] p-8 border border-blue-500/20 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Grand total cash</p>
          <p className="text-5xl font-mono font-bold text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">{formatCurrency(total)}</p>
        </div>
        <IndianRupee className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 text-blue-500/5 -rotate-12" />
      </div>

      <div className="space-y-6">
        <RenderSection title="Notes" icon={Banknote} data={CURRENCY_NOTES} />
        <RenderSection title="Coins" icon={Coins} data={CURRENCY_COINS} />
      </div>

      <div className="flex gap-4 sticky bottom-24 z-10 md:static">
        <Button variant="secondary" onClick={handleReset} className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest bg-slate-800/50 backdrop-blur-md">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
        <Button variant="primary" onClick={handleSave} className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest neon-blue" neon>
          <Save className="w-4 h-4 mr-2" /> Save Record
        </Button>
      </div>
    </div>
  );
}
