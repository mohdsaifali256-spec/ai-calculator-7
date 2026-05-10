import { useState, useMemo } from "react";
import { IndianRupee, RotateCcw, Copy, Share2, Banknote, Coins } from "lucide-react";
import { Button } from "../ui/Button";
import { CURRENCY_NOTES, CURRENCY_COINS } from "../../constants";
import { formatCurrency } from "../../lib/utils";
import { useHistory, useTranslation, useInteractions } from "../../lib/hooks";

export function CashCounter() {
  const [counts, setCounts] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    [...CURRENCY_NOTES, ...CURRENCY_COINS].forEach(val => initial[val] = 0);
    return initial;
  });

  const { saveCashRecord } = useHistory();
  const { T } = useTranslation();
  const { playInteraction } = useInteractions();

  const total = useMemo(() => {
    return Object.entries(counts).reduce((sum: number, [val, count]: [string, number]) => {
      return sum + (Number(val) * (Number(count) || 0));
    }, 0);
  }, [counts]);

  const handleReset = () => {
    playInteraction();
    const reset: Record<number, number> = {};
    [...CURRENCY_NOTES, ...CURRENCY_COINS].forEach(val => reset[val] = 0);
    setCounts(reset);
  };

  const generateReport = () => {
    let report = `💰 Cash Calculation Report\n--------------------------\n`;
    [...CURRENCY_NOTES, ...CURRENCY_COINS].forEach(val => {
      if (counts[val] > 0) {
        report += `₹${val} x ${counts[val]} = ${formatCurrency(val * counts[val])}\n`;
      }
    });
    report += `--------------------------\nTotal: ${formatCurrency(total)}`;
    return report;
  };

  const handleCopy = () => {
    playInteraction();
    navigator.clipboard.writeText(generateReport());
    // Use a custom UI alert if possible, or just standard alert for now
    alert("Full report copied to clipboard!");
  };

  const handleShare = async () => {
    playInteraction();
    const data = generateReport();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Cash Record', text: data });
      } catch (e) {
        console.error(e);
      }
    } else {
      handleCopy();
    }
  };

  const handleSave = async () => {
    playInteraction();
    if (total === 0) return;
    try {
      const stringCounts: Record<string, number> = {};
      Object.entries(counts).forEach(([k, v]) => stringCounts[k] = v as number);
      await saveCashRecord({
        notes: stringCounts,
        total
      });
      alert("Record saved to local history!");
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
        <div key={`${title}-${val}`} className="bg-bg-card p-4 rounded-2xl flex items-center justify-between gap-4 border border-white/5 hover:border-primary/20 transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center font-bold text-xs group-hover:text-primary transition-colors">
              ₹{val}
            </div>
            <span className="text-zinc-600 font-mono">×</span>
          </div>
          
          <input
            type="number"
            min="0"
            value={counts[val] || ""}
            onChange={(e) => {
              playInteraction();
              setCounts({ ...counts, [val]: Math.max(0, parseInt(e.target.value) || 0) });
            }}
            className="bg-transparent border-b border-white/5 w-24 text-right focus:border-primary outline-none font-mono text-lg py-1 px-2 text-white"
            placeholder="0"
          />
          
          <div className="w-32 text-right">
            <span className="text-primary font-mono font-bold text-sm">
              {formatCurrency((counts[val] || 0) * val)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-gradient-to-br from-primary/20 to-bg-card rounded-[32px] p-8 border border-primary/20 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Grand total cash</p>
          <p className="text-5xl font-mono font-bold text-primary drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">{formatCurrency(total)}</p>
          <div className="mt-4 flex gap-4">
            <button onClick={handleCopy} className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 hover:text-white transition-colors">
              <Copy className="w-3 h-3" /> {T('copy')}
            </button>
            <button onClick={handleShare} className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 hover:text-white transition-colors">
              <Share2 className="w-3 h-3" /> {T('share')}
            </button>
          </div>
        </div>
        <IndianRupee className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 text-primary/5 -rotate-12" />
      </div>

      <div className="space-y-8">
        <RenderSection title="Notes" icon={Banknote} data={CURRENCY_NOTES} />
        <RenderSection title="Coins" icon={Coins} data={CURRENCY_COINS} />
      </div>

      <div className="flex gap-4 sticky bottom-24 z-10 md:static">
        <Button variant="secondary" onClick={handleReset} className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest bg-zinc-900 border border-white/5">
          <RotateCcw className="w-4 h-4 mr-2" /> {T('reset')}
        </Button>
        <Button variant="primary" onClick={handleSave} className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest neon-blue" neon>
          Save Log
        </Button>
      </div>
    </div>
  );
}
