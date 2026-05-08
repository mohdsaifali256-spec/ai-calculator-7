import { useState, useMemo } from "react";
import { Copy, Receipt } from "lucide-react";
import { Button } from "../ui/Button";
import { GST_RATES } from "../../constants";
import { formatCurrency, cn } from "../../lib/utils";

export function GSTCalculator() {
  const [amount, setAmount] = useState<string>("");
  const [gstRate, setGstRate] = useState<number>(18);
  const [type, setType] = useState<"add" | "remove">("add");

  const results = useMemo(() => {
    const base = parseFloat(amount) || 0;
    let net, gstAmount, total;

    if (type === "add") {
      gstAmount = (base * gstRate) / 100;
      total = base + gstAmount;
      net = base;
    } else {
      total = base;
      net = (base * 100) / (100 + gstRate);
      gstAmount = base - net;
    }

    return {
      net,
      gst: gstAmount,
      total,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
    };
  }, [amount, gstRate, type]);

  const copyToClipboard = () => {
    const text = `Amount: ${formatCurrency(results.net)}\nGST (${gstRate}%): ${formatCurrency(results.gst)}\nTotal: ${formatCurrency(results.total)}`;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Base Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-2xl font-mono outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">GST Rate</label>
          <div className="grid grid-cols-4 gap-2">
            {GST_RATES.map((rate) => (
              <Button
                key={rate}
                variant={gstRate === rate ? "primary" : "secondary"}
                onClick={() => setGstRate(rate)}
                className="font-mono"
              >
                {rate}%
              </Button>
            ))}
          </div>
        </div>

        <div className="flex bg-white/5 rounded-2xl p-1">
          <button
            onClick={() => setType("add")}
            className={cn(
              "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
              type === "add" ? "bg-blue-600 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Add GST
          </button>
          <button
            onClick={() => setType("remove")}
            className={cn(
              "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
              type === "remove" ? "bg-blue-600 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Remove GST
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden border-zinc-100/5">
        <div className="bg-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-500" />
            <span className="font-bold">GST Summary</span>
          </div>
          <Button variant="ghost" size="icon" onClick={copyToClipboard}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">Net Amount</span>
            <span className="font-mono">{formatCurrency(results.net)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">CGST ({gstRate / 2}%)</span>
            <span className="font-mono">{formatCurrency(results.cgst)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">SGST ({gstRate / 2}%)</span>
            <span className="font-mono">{formatCurrency(results.sgst)}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-4 border-t border-white/10">
            <span className="text-zinc-400">Total GST</span>
            <span className="font-mono text-blue-400">{formatCurrency(results.gst)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-lg">Total Amount</span>
            <span className="font-mono text-2xl font-bold text-green-500 tracking-tight">
              {formatCurrency(results.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
