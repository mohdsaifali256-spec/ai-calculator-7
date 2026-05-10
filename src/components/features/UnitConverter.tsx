import { useState, useMemo } from "react";
import { ArrowLeftRight, RotateCcw } from "lucide-react";
import { UNIT_TYPES } from "../../constants";
import { Button } from "../ui/Button";

export function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof UNIT_TYPES>("length");
  const [fromUnit, setFromUnit] = useState(UNIT_TYPES.length[0]);
  const [toUnit, setToUnit] = useState(UNIT_TYPES.length[1]);
  const [value, setValue] = useState<string>("1");

  const conversionFactors: Record<string, number> = {
    // Length (Base: Meters)
    Meters: 1, Kilometers: 1000, Centimeters: 0.01, Inches: 0.0254, Feet: 0.3048, Miles: 1609.34,
    // Weight (Base: Grams)
    Grams: 1, Kilograms: 1000, Pounds: 453.592, Ounces: 28.3495,
  };

  const result = useMemo(() => {
    const val = parseFloat(value) || 0;
    if (category === 'length' || category === 'weight') {
      const fromFactor = conversionFactors[fromUnit] || 1;
      const toFactor = conversionFactors[toUnit] || 1;
      const baseValue = val * fromFactor;
      return baseValue / toFactor;
    }
    // Simplistic fallback for others if any
    return val; 
  }, [value, fromUnit, toUnit, category]);

  const handleReset = () => {
    setValue("1");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex gap-2 p-1.5 bg-bg-card rounded-[24px] overflow-x-auto no-scrollbar border border-white/5 shadow-inner">
        {Object.keys(UNIT_TYPES).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat as any);
              setFromUnit(UNIT_TYPES[cat as keyof typeof UNIT_TYPES][0]);
              setToUnit(UNIT_TYPES[cat as keyof typeof UNIT_TYPES][1]);
            }}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              category === cat ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-bg-card p-6 rounded-[32px] space-y-6 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <div className="space-y-4 relative z-10">
          <div className="space-y-2">
            <select 
              value={fromUnit} 
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 outline-none text-sm font-bold text-slate-300 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
            >
              {UNIT_TYPES[category].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 text-3xl font-mono outline-none focus:border-primary text-white"
            />
          </div>

          <div className="flex justify-center -my-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg relative z-20">
              <ArrowLeftRight className="w-6 h-6 text-primary rotate-90" />
            </div>
          </div>

          <div className="space-y-2">
            <select 
              value={toUnit} 
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 outline-none text-sm font-bold text-slate-300 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
            >
              {UNIT_TYPES[category].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5 text-3xl font-mono text-primary font-bold shadow-inner">
              {result.toFixed(4).replace(/\.?0+$/, "")}
            </div>
          </div>
        </div>
      </div>

      <Button variant="secondary" onClick={handleReset} className="w-full py-4 h-14 rounded-2xl bg-zinc-900 border-white/5 font-bold uppercase tracking-widest">
        <RotateCcw className="w-4 h-4 mr-2" /> Reset Values
      </Button>
    </div>
  );
}
