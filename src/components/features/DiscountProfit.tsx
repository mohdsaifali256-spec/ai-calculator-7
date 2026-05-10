import { useState } from "react";
import { Percent, TrendingUp, RotateCcw, Share2 } from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { useTranslation, useInteractions } from "../../lib/hooks";

export function DiscountProfit() {
  const [price, setPrice] = useState<string>("1000");
  const [discountPercent, setDiscountPercent] = useState<string>("10");
  const [costPrice, setCostPrice] = useState<string>("800");
  const [sellingPrice, setSellingPrice] = useState<string>("1200");
  const { T } = useTranslation();
  const { playInteraction } = useInteractions();

  const discountAmount = (parseFloat(price) || 0) * (parseFloat(discountPercent) || 0) / 100;
  const finalPrice = (parseFloat(price) || 0) - discountAmount;

  const profit = (parseFloat(sellingPrice) || 0) - (parseFloat(costPrice) || 0);
  const profitMargin = (parseFloat(costPrice) || 0) > 0 ? (profit / parseFloat(costPrice)) * 100 : 0;

  const handleShare = (type: 'discount' | 'profit') => {
    playInteraction('tap');
    let msg = "";
    if (type === 'discount') {
      msg = `🏷️ Discount Calculation\nOriginal: ${formatCurrency(parseFloat(price))}\nOff: ${discountPercent}%\nSavings: ${formatCurrency(discountAmount)}\nFinal Price: ${formatCurrency(finalPrice)}`;
    } else {
      msg = `📈 Business Margin\nCost: ${formatCurrency(parseFloat(costPrice))}\nSale: ${formatCurrency(parseFloat(sellingPrice))}\nResult: ${profit >= 0 ? 'Profit' : 'Loss'} of ${formatCurrency(Math.abs(profit))}\nMargin: ${profitMargin.toFixed(2)}%`;
    }
    if (navigator.share) {
      navigator.share({ title: 'Calculation Result', text: msg });
    } else {
      navigator.clipboard.writeText(msg);
      alert("Result copied!");
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      {/* Discount Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-slate-300">Discount Calculator</h3>
          </div>
          <button onClick={() => handleShare('discount')} className="p-2 rounded-xl bg-white/5">
            <Share2 className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        
        <div className="bg-bg-card p-6 rounded-[32px] grid grid-cols-1 gap-6 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">List Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      playInteraction('click');
                      setPrice(e.target.value);
                    }}
                    className="w-full bg-zinc-950 border border-white/5 rounded-xl p-2.5 pl-7 outline-none focus:border-primary transition-all font-mono text-white text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Discount %</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/5 rounded-xl p-2.5 outline-none focus:border-primary transition-all font-mono text-white text-sm"
                />
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col justify-center text-center">
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">Savings: {formatCurrency(discountAmount)}</p>
              <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-widest">Final Price</p>
              <p className="text-3xl font-mono font-bold text-white shadow-primary/20 shadow-xl">{formatCurrency(finalPrice)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profit Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-300">Profit & Margin</h3>
          </div>
          <button onClick={() => handleShare('profit')} className="p-2 rounded-xl bg-white/5">
            <Share2 className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="bg-bg-card p-6 rounded-[32px] grid grid-cols-1 gap-6 border border-white/5 shadow-2xl">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Cost Price</label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/5 rounded-xl p-2.5 outline-none focus:border-emerald-500 transition-all font-mono text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Selling Price</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/5 rounded-xl p-2.5 outline-none focus:border-emerald-500 transition-all font-mono text-white text-sm"
                />
              </div>
            </div>

            <div className={cn(
              "rounded-2xl p-6 flex flex-col justify-center text-center border transition-all",
              profit >= 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"
            )}>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest mb-1",
                profit >= 0 ? "text-emerald-500" : "text-red-500"
              )}>
                {profit >= 0 ? `Profit: ${formatCurrency(profit)}` : `Loss: ${formatCurrency(Math.abs(profit))}`}
              </p>
              <p className="text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-widest">Margin Percentage</p>
              <p className={cn(
                "text-3xl font-mono font-bold",
                profit >= 0 ? "text-white" : "text-red-400"
              )}>
                {profitMargin.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-4">
        <Button 
          variant="secondary" 
          onClick={() => { 
            playInteraction('back');
            setPrice("1000"); 
            setDiscountPercent("10"); 
            setCostPrice("800"); 
            setSellingPrice("1200"); 
          }} 
          className="w-full py-4 h-14 rounded-2xl bg-zinc-900 border-white/5 font-bold uppercase tracking-widest"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> {T('reset')} All
        </Button>
      </div>
    </div>
  );
}
