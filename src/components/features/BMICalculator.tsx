import { useState } from "react";
import { Activity, RotateCcw, Save } from "lucide-react";
import { Button } from "../ui/Button";

export function BMICalculator() {
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [result, setResult] = useState<{ bmi: number, status: string } | null>(null);

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    let status = "";
    if (bmi < 18.5) status = "Underweight";
    else if (bmi < 25) status = "Normal";
    else if (bmi < 30) status = "Overweight";
    else status = "Obese";
    
    setResult({ bmi: parseFloat(bmi.toFixed(1)), status });
  };

  return (
    <div className="space-y-8">
      <div className="bg-bg-card rounded-[32px] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">Your BMI Score</p>
          <p className="text-5xl font-mono font-bold text-primary drop-shadow-lg">{result ? result.bmi : "0.0"}</p>
          {result && (
            <p className="mt-2 text-xl font-bold bg-white/10 px-4 py-1 rounded-full w-fit">
              {result.status}
            </p>
          )}
        </div>
        <Activity className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 text-primary/5 -rotate-12" />
      </div>

      <div className="bg-bg-card rounded-[32px] p-6 space-y-6 border border-white/5">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Weight (kg)</span>
            <span className="font-mono font-bold">{weight}</span>
          </div>
          <input 
            type="range" min="30" max="150" value={weight} 
            onChange={e => setWeight(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Height (cm)</span>
            <span className="font-mono font-bold">{height}</span>
          </div>
          <input 
            type="range" min="100" max="220" value={height} 
            onChange={e => setHeight(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => { setWeight(70); setHeight(170); setResult(null); }} className="flex-1 py-4 rounded-2xl">
          <RotateCcw className="w-5 h-5 mr-2" /> Reset
        </Button>
        <Button variant="primary" onClick={calculateBMI} className="flex-1 py-4 rounded-2xl neon-blue font-bold">
          Calculate
        </Button>
      </div>
    </div>
  );
}
