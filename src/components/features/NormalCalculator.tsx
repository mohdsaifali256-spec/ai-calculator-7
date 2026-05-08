import { useState } from "react";
import { motion } from "motion/react";
import { Delete, History as HistoryIcon, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";
import { useHistory } from "../../lib/hooks";

export function NormalCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const { saveCalculation } = useHistory();

  const handleNumber = (n: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(n);
    } else {
      setDisplay(display + n);
    }
  };

  const handleOperator = (op: string) => {
    setExpression(display + " " + op + " ");
    setDisplay("0");
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleEqual = () => {
    try {
      const fullExpression = expression + display;
      // Using local eval for simplicity in a calculator app, with basic validation
      // In a real app we'd use a math library
      const result = eval(fullExpression.replace(/×/g, "*").replace(/÷/g, "/")).toString();
      
      saveCalculation({
        expression: fullExpression,
        result: result,
        type: 'normal'
      });

      setDisplay(result);
      setExpression("");
    } catch (e) {
      setDisplay("Error");
    }
  };

  const buttons = [
    { label: "C", action: handleClear, variant: "danger" as const },
    { label: "÷", action: () => handleOperator("÷"), variant: "primary" as const },
    { label: "×", action: () => handleOperator("×"), variant: "primary" as const },
    { icon: <Delete className="w-5 h-5" />, action: handleBackspace, variant: "secondary" as const },
    { label: "7", action: () => handleNumber("7") },
    { label: "8", action: () => handleNumber("8") },
    { label: "9", action: () => handleNumber("9") },
    { label: "-", action: () => handleOperator("-"), variant: "primary" as const },
    { label: "4", action: () => handleNumber("4") },
    { label: "5", action: () => handleNumber("5") },
    { label: "6", action: () => handleNumber("6") },
    { label: "+", action: () => handleOperator("+"), variant: "primary" as const },
    { label: "1", action: () => handleNumber("1") },
    { label: "2", action: () => handleNumber("2") },
    { label: "3", action: () => handleNumber("3") },
    { label: "=", action: handleEqual, variant: "success" as const, rowSpan: 2 },
    { label: "0", action: () => handleNumber("0"), colSpan: 2 },
    { label: ".", action: () => handleNumber(".") },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto">
      <div className="glass rounded-3xl p-8 flex flex-col items-end justify-end min-h-[160px] gap-2 overflow-hidden">
        <span className="text-zinc-500 font-mono text-sm h-6">{expression}</span>
        <span className="text-4xl font-mono font-bold tracking-tight text-white">{display}</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {buttons.map((btn, i) => (
          <Button
            key={i}
            onClick={btn.action}
            variant={btn.variant || "secondary"}
            className={btn.colSpan ? `col-span-${btn.colSpan}` : btn.rowSpan ? `row-span-${btn.rowSpan}` : ""}
            style={btn.colSpan ? { gridColumn: `span ${btn.colSpan}` } : btn.rowSpan ? { gridRow: `span ${btn.rowSpan}` } : {}}
            size="lg"
          >
            {btn.icon || btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
