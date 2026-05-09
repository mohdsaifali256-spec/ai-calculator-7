import { useState } from "react";
import { Delete, RotateCcw, FunctionSquare } from "lucide-react";
import { Button } from "../ui/Button";
import { useHistory } from "../../lib/hooks";

export function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const { saveCalculation } = useHistory();

  const handleNumber = (n: string) => {
    if (n === "." && display.includes(".")) return;
    if (display === "0" || display === "Error") setDisplay(n);
    else setDisplay(display + n);
  };

  const handleFunc = (func: string) => {
    try {
      let val = parseFloat(display);
      if (isNaN(val)) return;
      
      let result;
      switch (func) {
        case 'sin': result = Math.sin(val); break;
        case 'cos': result = Math.cos(val); break;
        case 'tan': result = Math.tan(val); break;
        case 'log': result = Math.log10(val); break;
        case 'ln': result = Math.log(val); break;
        case 'sqrt': result = Math.sqrt(val); break;
        case 'pow2': result = Math.pow(val, 2); break;
        case 'pi': result = Math.PI; break;
        case 'e': result = Math.E; break;
        default: return;
      }
      const resStr = result.toFixed(8).replace(/\.?0+$/, "");
      saveCalculation({
        expression: `${func}(${display})`,
        result: resStr,
        type: 'scientific'
      });
      setDisplay(resStr);
    } catch (e) {
      setDisplay("Error");
    }
  };

  const handleEqual = () => {
    try {
      // Basic sanitized eval
      const sanitized = display
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/×/g, "*")
        .replace(/÷/g, "/");
      
      const evalResult = eval(sanitized);
      const resStr = evalResult.toString();
      
      saveCalculation({ expression: display, result: resStr, type: 'scientific' });
      setDisplay(resStr);
    } catch (e) {
      setDisplay("Error");
    }
  };

  const FunctionBtn = ({ label, func, color = "text-blue-400" }: { label: string, func: string, color?: string }) => (
    <Button variant="secondary" size="sm" onClick={() => handleFunc(func)} className={`${color} font-bold text-[10px] uppercase tracking-tighter h-12 rounded-xl border-white/5`}>
      {label}
    </Button>
  );

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto">
      <div className="bg-bg-card rounded-[40px] p-8 flex flex-col items-end justify-end h-40 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <FunctionSquare className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end gap-1 relative z-10 w-full overflow-hidden">
          <span className="text-slate-500 font-mono text-xs truncate max-w-full">{expression}</span>
          <span className="text-4xl font-mono font-bold text-white tracking-tight break-all text-right">{display}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <FunctionBtn label="sin" func="sin" />
        <FunctionBtn label="cos" func="cos" />
        <FunctionBtn label="tan" func="tan" />
        <FunctionBtn label="log" func="log" />
        <FunctionBtn label="ln" func="ln" />
        
        <FunctionBtn label="√x" func="sqrt" />
        <FunctionBtn label="x²" func="pow2" />
        <FunctionBtn label="π" func="pi" color="text-emerald-400" />
        <FunctionBtn label="e" func="e" color="text-emerald-400" />
        <Button variant="danger" size="sm" onClick={() => setDisplay("0")} className="rounded-xl h-12 uppercase font-bold text-[10px]">AC</Button>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-2">
        {[7, 8, 9, "÷", 4, 5, 6, "×", 1, 2, 3, "-", 0, ".", "=", "+"].map((label, i) => (
          <Button
            key={`num-${i}`}
            size="lg"
            variant={typeof label === 'number' || label === '.' ? "secondary" : label === '=' ? "success" : "primary"}
            className={`rounded-2xl h-16 text-xl font-mono ${label === '=' ? 'neon-green' : ''}`}
            onClick={() => {
              if (label === "=") handleEqual();
              else if (["÷", "×", "-", "+"].includes(label.toString())) setDisplay(display + " " + label + " ");
              else handleNumber(label.toString());
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setDisplay(display.slice(0, -1) || "0")} className="flex-1 h-14 rounded-2xl">
          <Delete className="w-5 h-5 mr-2" /> Backspace
        </Button>
        <Button variant="secondary" onClick={() => { setDisplay("0"); setExpression(""); }} className="flex-1 h-14 rounded-2xl">
          <RotateCcw className="w-5 h-5 mr-2" /> Reset
        </Button>
      </div>
    </div>
  );
}
