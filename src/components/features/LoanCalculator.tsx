import { useState, useMemo } from "react";
import { HandCoins, RotateCcw, Share2 } from "lucide-react";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../lib/utils";
import { useTranslation, useInteractions } from "../../lib/hooks";

export function LoanCalculator() {
  const [amount, setAmount] = useState(500000);
  const [interest, setInterest] = useState(10);
  const [months, setMonths] = useState(12);
  const { T } = useTranslation();
  const { playInteraction } = useInteractions();

  const results = useMemo(() => {
    const r = interest / 12 / 100;
    const n = months;
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - amount;
    return { emi, totalInterest, totalAmount };
  }, [amount, interest, months]);

  return (
    <div className="space-y-8">
      <div className="bg-bg-card rounded-[32px] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Monthly Installment (EMI)</p>
          <p className="text-5xl font-mono font-bold text-primary drop-shadow-lg">{formatCurrency(results.emi)}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Interest</p>
              <p className="text-sm font-mono font-bold text-slate-300">{formatCurrency(results.totalInterest)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Payment</p>
              <p className="text-sm font-mono font-bold text-slate-300">{formatCurrency(results.totalAmount)}</p>
            </div>
          </div>
        </div>
        <HandCoins className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 text-primary/5 -rotate-12" />
      </div>

      <div className="bg-bg-card rounded-[32px] p-6 space-y-6 border border-white/5">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Loan Amount</span>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="bg-transparent text-right font-mono font-bold border-b border-white/10 outline-none w-32" />
          </div>
          <input 
            type="range" min="10000" max="10000000" step="10000" value={amount} 
            onChange={e => {
              playInteraction('tap');
              setAmount(Number(e.target.value));
            }} 
            className="w-full accent-primary h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Rate (%)</span>
            <input type="number" step="0.1" value={interest} onChange={e => setInterest(Number(e.target.value))} className="bg-zinc-900 rounded-xl p-3 w-full font-mono font-bold border border-white/5 outline-none" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Months</span>
            <input type="number" value={months} onChange={e => setMonths(Number(e.target.value))} className="bg-zinc-900 rounded-xl p-3 w-full font-mono font-bold border border-white/5 outline-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          variant="secondary" 
          onClick={() => { 
            playInteraction('back');
            setAmount(500000); 
            setInterest(10); 
            setMonths(12); 
          }} 
          className="flex-1 py-4 rounded-2xl bg-zinc-900 border border-white/5"
        >
          <RotateCcw className="w-5 h-5 mr-2" /> {T('reset')}
        </Button>
        <Button 
          variant="primary" 
          onClick={() => playInteraction('tap')}
          className="flex-1 py-4 rounded-2xl neon-blue font-bold"
        >
          <Share2 className="w-5 h-5 mr-2" /> {T('share')} Result
        </Button>
      </div>
    </div>
  );
}
