import { useState, useMemo } from "react";
import { ArrowLeftRight } from "lucide-react";
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
      const baseValue = val * (conversionFactors[fromUnit] || 1);
      return baseValue / (conversionFactors[toUnit] || 1);
    }
    // Simple mock for others
    return val * 1.5; 
  }, [value, fromUnit, toUnit, category]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl overflow-x-auto no-scrollbar">
        {Object.keys(UNIT_TYPES).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat as any);
              setFromUnit(UNIT_TYPES[cat as keyof typeof UNIT_TYPES][0]);
              setToUnit(UNIT_TYPES[cat as keyof typeof UNIT_TYPES][1]);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              category === cat ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="glass p-6 rounded-3xl space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <select 
              value={fromUnit} 
              onChange={(e) => setFromUnit(e.target.value)}
              className="bg-zinc-800 border border-white/10 rounded-xl p-3 outline-none text-sm"
            >
              {UNIT_TYPES[category].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-2xl font-mono outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-blue-500 rotate-90" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <select 
              value={toUnit} 
              onChange={(e) => setToUnit(e.target.value)}
              className="bg-zinc-800 border border-white/10 rounded-xl p-3 outline-none text-sm"
            >
              {UNIT_TYPES[category].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 text-2xl font-mono text-blue-400">
              {result.toFixed(4).replace(/\.?0+$/, "")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
