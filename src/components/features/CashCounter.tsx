import { useState, useMemo } from "react";
import { IndianRupee, RotateCcw, Save } from "lucide-react";
import { Button } from "../ui/Button";
import { CURRENCY_NOTES } from "../../constants";
import { formatCurrency } from "../../lib/utils";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function CashCounter() {
  const [counts, setCounts] = useState<Record<number, number>>(
    CURRENCY_NOTES.reduce((acc, note) => ({ ...acc, [note]: 0 }), {})
  );

  const total = useMemo(() => {
    return Object.entries(counts).reduce((sum: number, [note, count]: [string, number]) => {
      return sum + (Number(note) * (count || 0));
    }, 0);
  }, [counts]);

  const handleReset = () => {
    setCounts(CURRENCY_NOTES.reduce((acc, note) => ({ ...acc, [note]: 0 }), {}));
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'cash_records'), {
        notes: counts,
        total,
        userId: auth.currentUser.uid,
        date: serverTimestamp()
      });
      alert("Record saved!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-8 bg-blue-600/10 border-blue-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">Grand Total</p>
          <p className="text-5xl font-mono font-bold text-blue-500">{formatCurrency(total)}</p>
        </div>
        <IndianRupee className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 text-blue-500/10 -rotate-12" />
      </div>

      <div className="space-y-3">
        {CURRENCY_NOTES.map((note) => (
          <div key={note} className="glass p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded bg-zinc-800 flex items-center justify-center font-bold text-xs">
                ₹{note}
              </div>
              <span className="text-zinc-400 font-mono">×</span>
            </div>
            
            <input
              type="number"
              min="0"
              value={counts[note] || ""}
              onChange={(e) => setCounts({ ...counts, [note]: parseInt(e.target.value) || 0 })}
              className="bg-transparent border-b border-white/10 w-24 text-right focus:border-blue-500 outline-none font-mono text-lg py-1 px-2"
              placeholder="0"
            />
            
            <div className="w-32 text-right">
              <span className="text-zinc-300 font-mono font-medium">
                {formatCurrency((counts[note] || 0) * note)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary" onClick={handleReset} className="w-full gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
        <Button variant="primary" onClick={handleSave} className="w-full gap-2" neon>
          <Save className="w-4 h-4" /> Save Record
        </Button>
      </div>
    </div>
  );
}
