import { useState } from "react";
import { useHistory, useInteractions, InteractionType } from "../../lib/hooks";

export function NormalCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const { saveCalculation } = useHistory();
  const { playInteraction } = useInteractions();

  const wrapAction = (fn: () => void, type: InteractionType = 'tap') => {
    return () => {
      playInteraction(type);
      fn();
    };
  };

  const handleNumber = (n: string) => {
    if (display === "0") setDisplay(n);
    else if (display === "Error") setDisplay(n);
    else setDisplay(display + n);
  };

  const handleOperator = (op: string) => {
    if (display === "Error") return;
    setExpression(display + " " + op + " ");
    setDisplay("0");
  };

  const calculate = () => {
    try {
      const fullExpr = expression + display;
      if (!fullExpr) return;
      // Simple sanitize
      const result = eval(fullExpr.replace(/×/g, "*").replace(/÷/g, "/"));
      const resultStr = Number.isFinite(result) ? result.toString() : "Error";
      setDisplay(resultStr);
      setExpression("");
      if (resultStr !== "Error") {
        playInteraction('success');
        saveCalculation({ expression: fullExpr, result: resultStr, type: 'normal' });
      } else {
        playInteraction('error');
      }
    } catch {
      playInteraction('error');
      setDisplay("Error");
    }
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
  };

  const backspace = () => {
    if (display === "Error" || display.length <= 1) setDisplay("0");
    else setDisplay(display.slice(0, -1));
  };

  const buttons = [
    { label: "C", action: wrapAction(clear, 'delete'), type: "spec" },
    { label: "÷", action: wrapAction(() => handleOperator("÷"), 'click'), type: "op" },
    { label: "×", action: wrapAction(() => handleOperator("×"), 'click'), type: "op" },
    { label: "⌫", action: wrapAction(backspace, 'delete'), type: "spec" },
    { label: "7", action: wrapAction(() => handleNumber("7"), 'tap') },
    { label: "8", action: wrapAction(() => handleNumber("8"), 'tap') },
    { label: "9", action: wrapAction(() => handleNumber("9"), 'tap') },
    { label: "-", action: wrapAction(() => handleOperator("-"), 'click'), type: "op" },
    { label: "4", action: wrapAction(() => handleNumber("4"), 'tap') },
    { label: "5", action: wrapAction(() => handleNumber("5"), 'tap') },
    { label: "6", action: wrapAction(() => handleNumber("6"), 'tap') },
    { label: "+", action: wrapAction(() => handleOperator("+"), 'click'), type: "op" },
    { label: "1", action: wrapAction(() => handleNumber("1"), 'tap') },
    { label: "2", action: wrapAction(() => handleNumber("2"), 'tap') },
    { label: "3", action: wrapAction(() => handleNumber("3"), 'tap') },
    { label: "=", action: calculate, type: "equal" },
    { label: "0", action: wrapAction(() => handleNumber("0"), 'tap'), span: 2 },
    { label: ".", action: wrapAction(() => handleNumber("."), 'tap') },
  ];

  return (
    <div className="flex flex-col h-full space-y-6 pt-4 animate-fade-in">
      <div className="bg-bg-card rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-white/5 flex flex-col items-end justify-center h-40 sm:h-48 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <p className="text-slate-500 font-mono text-xs sm:text-sm h-6 overflow-hidden text-right w-full">{expression}</p>
        <p className="text-4xl sm:text-5xl font-mono font-bold text-white break-all text-right mt-2">{display}</p>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4 pb-4">
        {buttons.map((btn, idx) => (
          <button
            key={`${btn.label}-${idx}`}
            onClick={btn.action}
            className={`
              h-16 sm:h-20 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-bold transition-all active:scale-95 flex items-center justify-center
              ${btn.span === 2 ? "col-span-2" : ""}
              ${btn.type === 'equal' ? "row-span-2 h-[136px] sm:h-[176px] neon-blue" : ""}
              ${btn.type === 'op' ? "bg-white/10 text-primary border border-primary/20" : ""}
              ${btn.type === 'spec' ? "bg-white/5 text-red-500 border border-red-500/10" : ""}
              ${!btn.type ? "bg-bg-card text-white hover:bg-white/5 border border-white/5" : ""}
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
