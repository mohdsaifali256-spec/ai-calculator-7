import { useState } from "react";
import { useHistory, useInteractions } from "../../lib/hooks";
import { FlaskConical } from "lucide-react";

export function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const { saveCalculation } = useHistory();
  const { playInteraction } = useInteractions();

  const handleNumber = (n: string) => {
    playInteraction('tap');
    if (display === "0" || display === "Error") setDisplay(n);
    else setDisplay(display + n);
  };

  const handleFunc = (func: string) => {
    playInteraction('click');
    try {
      let val = parseFloat(display);
      let res = 0;
      switch(func) {
        case 'sin': res = Math.sin(val); break;
        case 'cos': res = Math.cos(val); break;
        case 'tan': res = Math.tan(val); break;
        case 'log': res = Math.log10(val); break;
        case 'ln': res = Math.log(val); break;
        case 'pow': res = Math.pow(val, 2); break;
        case 'sqrt': res = Math.sqrt(val); break;
      }
      const resStr = res.toFixed(4).replace(/\.?0+$/, "");
      saveCalculation({ expression: `${func}(${display})`, result: resStr, type: 'scientific' });
      setDisplay(resStr);
    } catch {
      playInteraction('error');
      setDisplay("Error");
    }
  };

  const handleOperator = (op: string) => {
    playInteraction('click');
    setExpression(display + " " + op + " ");
    setDisplay("0");
  };

  const calculate = () => {
    playInteraction('success');
    try {
      const fullExpr = expression + display;
      const result = eval(fullExpr.replace(/×/g, "*").replace(/÷/g, "/"));
      const resStr = result.toString();
      saveCalculation({ expression: fullExpr, result: resStr, type: 'scientific' });
      setDisplay(resStr);
      setExpression("");
    } catch {
      playInteraction('error');
      setDisplay("Error");
    }
  };

  const buttons = [
    { label: "sin", action: () => handleFunc("sin"), type: "func" },
    { label: "cos", action: () => handleFunc("cos"), type: "func" },
    { label: "tan", action: () => handleFunc("tan"), type: "func" },
    { label: "log", action: () => handleFunc("log"), type: "func" },
    { label: "7", action: () => handleNumber("7") },
    { label: "8", action: () => handleNumber("8") },
    { label: "9", action: () => handleNumber("9") },
    { label: "÷", action: () => handleOperator("÷"), type: "op" },
    { label: "4", action: () => handleNumber("4") },
    { label: "5", action: () => handleNumber("5") },
    { label: "6", action: () => handleNumber("6") },
    { label: "×", action: () => handleOperator("×"), type: "op" },
    { label: "1", action: () => handleNumber("1") },
    { label: "2", action: () => handleNumber("2") },
    { label: "3", action: () => handleNumber("3") },
    { label: "-", action: () => handleOperator("-"), type: "op" },
    { label: "0", action: () => handleNumber("0") },
    { label: ".", action: () => handleNumber(".") },
    { label: "C", action: () => { playInteraction('delete'); setDisplay("0"); setExpression(""); }, type: "spec" },
    { label: "+", action: () => handleOperator("+"), type: "op" },
    { label: "√", action: () => handleFunc("sqrt"), type: "func" },
    { label: "π", action: () => setDisplay(Math.PI.toFixed(6)), type: "func" },
    { label: "^2", action: () => handleFunc("pow"), type: "func" },
    { label: "=", action: calculate, type: "equal", span: 1 },
  ];

  return (
    <div className="flex flex-col h-full space-y-4 animate-fade-in pt-4">
      <div className="bg-bg-card rounded-[32px] p-6 border border-white/5 flex flex-col items-end justify-center min-h-[120px] relative overflow-hidden shadow-xl">
        <FlaskConical className="absolute top-2 left-2 w-8 h-8 opacity-5 text-primary" />
        <p className="text-slate-500 font-mono text-xs h-4 overflow-hidden text-right w-full">{expression}</p>
        <p className="text-4xl font-mono font-bold text-white break-all text-right mt-1">{display}</p>
      </div>

      <div className="grid grid-cols-4 gap-2 pb-10">
        {buttons.map((btn, idx) => (
          <button
            key={`${btn.label}-${idx}`}
            onClick={btn.action}
            className={`
              h-14 rounded-2xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center
              ${btn.span === 2 ? "col-span-2" : ""}
              ${btn.type === 'equal' ? "bg-primary text-white neon-blue" : ""}
              ${btn.type === 'op' ? "bg-white/10 text-primary" : ""}
              ${btn.type === 'func' ? "bg-white/5 text-slate-400 font-mono italic" : ""}
              ${btn.type === 'spec' ? "bg-red-500/10 text-red-400" : ""}
              ${!btn.type ? "bg-bg-card text-white border border-white/5" : ""}
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
