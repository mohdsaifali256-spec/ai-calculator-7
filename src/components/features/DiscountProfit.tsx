import { useState } from "react";
import { Percent, TrendingUp } from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";

export function DiscountProfile() {
  // Discount States
  const [price, setPrice] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");

  // Profit/Loss States
  const [costPrice, setCostPrice] = useState<string>("");
  const [sellingPrice, setSellingPrice] = useState<string>("");

  const discountAmount = (parseFloat(price) || 0) * (parseFloat(discountPercent) || 0) / 100;
  const finalPrice = (parseFloat(price) || 0) - discountAmount;

  const profit = (parseFloat(sellingPrice) || 0) - (parseFloat(costPrice) || 0);
  const profitMargin = (parseFloat(costPrice) || 0) > 0 ? (profit / parseFloat(costPrice)) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Discount Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Percent className="w-5 h-5 text-pink-500" />
          <h3 className="font-bold text-zinc-300">Discount Calculator</h3>
        </div>
        
        <div className="glass p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Original Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-pink-500 transition-colors font-mono"
                placeholder="₹ 0.00"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Discount (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-pink-500 transition-colors font-mono"
                placeholder="0%"
              />
            </div>
          </div>

          <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-6 flex flex-col justify-center text-center">
            <p className="text-pink-500 text-[10px] font-bold uppercase tracking-widest mb-1">Savings: {formatCurrency(discountAmount)}</p>
            <p className="text-sm text-zinc-400 mb-2 font-medium">Final Amount</p>
            <p className="text-3xl font-mono font-bold text-white">{formatCurrency(finalPrice)}</p>
          </div>
        </div>
      </section>

      {/* Profit Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-zinc-300">Profit & Margin</h3>
        </div>

        <div className="glass p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Cost Price (CP)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors font-mono"
                placeholder="₹ 0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Selling Price (SP)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors font-mono"
                placeholder="₹ 0"
              />
            </div>
          </div>

          <div className={cn(
            "rounded-2xl p-6 flex flex-col justify-center text-center border transition-colors",
            profit >= 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"
          )}>
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-widest mb-1",
              profit >= 0 ? "text-emerald-500" : "text-red-500"
            )}>
              {profit >= 0 ? `Profit: ${formatCurrency(profit)}` : `Loss: ${formatCurrency(Math.abs(profit))}`}
            </p>
            <p className="text-sm text-zinc-400 mb-2 font-medium">Margin</p>
            <p className={cn(
              "text-3xl font-mono font-bold",
              profit >= 0 ? "text-white" : "text-red-400"
            )}>
              {profitMargin.toFixed(2)}%
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
