import { useState, useMemo } from "react";
import { CreditCard, RotateCcw, Share2, Info } from "lucide-react";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../lib/utils";
import { useTranslation, useInteractions } from "../../lib/hooks";

export function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(12);
  const { T } = useTranslation();
  const { playInteraction } = useInteractions();

  const results = useMemo(() => {
    const r = interestRate / 12 / 100;
    const n = tenure;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;
    return { emi, totalInterest, totalPayment };
  }, [loanAmount, interestRate, tenure]);

  const handleShare = async () => {
    playInteraction('tap');
    const text = `📊 Loan EMI Summary\n------------------\nLoan: ${formatCurrency(loanAmount)}\nInterest: ${interestRate}%\nTenure: ${tenure} Months\n------------------\nEMI: ${formatCurrency(results.emi)}\nTotal Interest: ${formatCurrency(results.totalInterest)}\nTotal Payment: ${formatCurrency(results.totalPayment)}`;
    if (navigator.share) {
      await navigator.share({ title: 'EMI Calculation', text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Summary copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="bg-bg-card rounded-[32px] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Monthly Installment</p>
          <p className="text-5xl font-mono font-bold text-primary drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">{formatCurrency(results.emi)}</p>
          
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/5 pt-6">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Interest</p>
              <p className="text-lg font-mono font-bold text-slate-200">{formatCurrency(results.totalInterest)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Payable</p>
              <p className="text-lg font-mono font-bold text-primary">{formatCurrency(results.totalPayment)}</p>
            </div>
          </div>
        </div>
        <CreditCard className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 text-primary/5 -rotate-12" />
      </div>

      <div className="bg-bg-card rounded-[32px] p-6 space-y-8 border border-white/5 shadow-inner">
        <SliderInput 
          label="Loan Amount (₹)" 
          value={loanAmount} 
          min={10000} 
          max={10000000} 
          step={10000} 
          onChange={setLoanAmount}
          onInteract={() => playInteraction('tap')}
        />
        <SliderInput 
          label="Interest Rate (%)" 
          value={interestRate} 
          min={1} 
          max={30} 
          step={0.1} 
          onChange={setInterestRate} 
          onInteract={() => playInteraction('tap')}
        />
        <SliderInput 
          label="Tenure (Months)" 
          value={tenure} 
          min={1} 
          max={360} 
          step={1} 
          onChange={setTenure} 
          onInteract={() => playInteraction('tap')}
        />
      </div>

      <div className="flex gap-4">
        <Button 
          variant="secondary" 
          onClick={() => { 
            playInteraction('back');
            setLoanAmount(100000); 
            setInterestRate(10.5); 
            setTenure(12); 
          }} 
          className="flex-1 py-4 rounded-2xl bg-zinc-900 border border-white/5 font-bold uppercase tracking-widest h-14"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> {T('reset')}
        </Button>
        <Button variant="primary" onClick={handleShare} className="flex-1 py-4 rounded-2xl neon-blue font-bold uppercase tracking-widest h-14">
          <Share2 className="w-4 h-4 mr-2" /> {T('share')} Result
        </Button>
      </div>

      <div className="bg-primary/5 rounded-2xl p-4 flex gap-3 border border-primary/10">
        <Info className="w-5 h-5 text-primary shrink-0" />
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Equated Monthly Installment (EMI) is the amount payable every month to the bank until the loan is fully paid off.
        </p>
      </div>
    </div>
  );
}

function SliderInput({ label, value, min, max, step, onChange, onInteract }: { 
  label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void, onInteract?: () => void 
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</span>
        <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-white/5 min-w-[100px] text-right">
          <span className="font-mono font-bold text-white text-sm">{value.toLocaleString()}</span>
        </div>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => {
          if (onInteract) onInteract();
          onChange(parseFloat(e.target.value));
        }}
        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}
