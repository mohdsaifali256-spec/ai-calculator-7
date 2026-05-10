import { useState, useMemo } from "react";
import { ReceiptIndianRupee, RotateCcw, Share2, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../lib/utils";

export function GSTCalculator() {
  const [amount, setAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);

  const results = useMemo(() => {
    let gstAmount = 0;
    let netAmount = 0;
    let totalAmount = 0;

    if (isInclusive) {
      totalAmount = amount;
      gstAmount = amount - (amount * (100 / (100 + gstRate)));
      netAmount = amount - gstAmount;
    } else {
      netAmount = amount;
      gstAmount = (amount * gstRate) / 100;
      totalAmount = amount + gstAmount;
    }

    return {
      netAmount,
      gstAmount,
      totalAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2
    };
  }, [amount, gstRate, isInclusive]);

  const handleShare = async () => {
    const type = isInclusive ? "GST Inclusive" : "GST Exclusive";
    const text = `🧾 GST Tax Invoice Summary\n--------------------------\nBase Amount: ${formatCurrency(amount)}\nRate: ${gstRate}%\nType: ${type}\n--------------------------\nNet Amount: ${formatCurrency(results.netAmount)}\nCGST (9%): ${formatCurrency(results.cgst)}\nSGST (9%): ${formatCurrency(results.sgst)}\n--------------------------\nTotal Amount: ${formatCurrency(results.totalAmount)}`;
    if (navigator.share) {
      await navigator.share({ title: 'GST Calculation', text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Summary copied!");
    }
  };

  const rates = [5, 12, 18, 28];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="bg-bg-card rounded-[32px] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Total Bill Amount</p>
          <p className="text-5xl font-mono font-bold text-primary drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">{formatCurrency(results.totalAmount)}</p>
          
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Net Amount</p>
              <p className="text-md font-mono font-bold text-slate-200">{formatCurrency(results.netAmount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">GST Tax ({gstRate}%)</p>
              <p className="text-md font-mono font-bold text-primary">{formatCurrency(results.gstAmount)}</p>
            </div>
          </div>
        </div>
        <ReceiptIndianRupee className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 text-primary/5 -rotate-12" />
      </div>

      <div className="bg-bg-card rounded-[32px] p-6 space-y-8 border border-white/5">
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Amount to Calculate</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">₹</div>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-white/5 p-4 pl-10 rounded-2xl outline-none focus:border-primary transition-all font-mono text-xl text-white"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">GST Rate (%)</label>
            <span className="text-primary font-mono font-bold">{gstRate}%</span>
          </div>
          <div className="flex gap-2">
            {rates.map(r => (
              <button 
                key={r}
                onClick={() => setGstRate(r)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all border ${gstRate === r ? 'bg-primary text-white border-primary' : 'bg-zinc-950 text-slate-500 border-white/5 hover:border-primary/20'}`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>

        <div className="flex p-1 bg-zinc-950 rounded-2xl border border-white/5">
          <button 
            onClick={() => setIsInclusive(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${!isInclusive ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500'}`}
          >
            Exclusive
          </button>
          <button 
            onClick={() => setIsInclusive(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${isInclusive ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500'}`}
          >
            Inclusive
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => { setAmount(1000); setGstRate(18); setIsInclusive(false); }} className="flex-1 py-4 rounded-2xl bg-zinc-900 border border-white/5 font-bold uppercase tracking-widest h-14">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
        <Button variant="primary" onClick={handleShare} className="flex-1 py-4 rounded-2xl neon-blue font-bold uppercase tracking-widest h-14">
          <Share2 className="w-4 h-4 mr-2" /> Share Details
        </Button>
      </div>
    </div>
  );
}
