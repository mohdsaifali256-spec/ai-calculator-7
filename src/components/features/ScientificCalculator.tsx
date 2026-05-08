import { useState } from "react";
import { Delete } from "lucide-react";
import { Button } from "../ui/Button";
import { useHistory } from "../../lib/hooks";

export function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const { saveCalculation } = useHistory();

  const handleNumber = (n: string) => {
    if (display === "0") setDisplay(n);
    else setDisplay(display + n);
  };

  const handleFunc = (func: string) => {
    try {
      let val = parseFloat(display);
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
      const resStr = result.toFixed(6).replace(/\.?0+$/, "");
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
      const res = eval(display.replace(/pi/g, Math.PI.toString()).replace(/e/g, Math.E.toString())).toString();
      saveCalculation({ expression: display, result: res, type: 'scientific' });
      setDisplay(res);
    } catch (e) {
      setDisplay("Error");
    }
  };

  const scientificBtns = [
    { label: "sin", action: () => handleFunc("sin") },
    { label: "cos", action: () => handleFunc("cos") },
    { label: "tan", action: () => handleFunc("tan") },
    { label: "log", action: () => handleFunc("log") },
    { label: "ln", action: () => handleFunc("ln") },
    { label: "√", action: () => handleFunc("sqrt") },
    { label: "x²", action: () => handleFunc("pow2") },
    { label: "π", action: () => handleFunc("pi") },
    { label: "e", action: () => handleFunc("e") },
    { label: "(", action: () => handleNumber("(") },
    { label: ")", action: () => handleNumber(")") },
    { label: "^", action: () => handleNumber("**") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="glass rounded-3xl p-8 flex flex-col items-end justify-end h-32 overflow-hidden shadow-inner">
        <span className="text-4xl font-mono truncate">{display}</span>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {scientificBtns.map((btn, i) => (
          <Button key={i} size="sm" variant="secondary" onClick={btn.action} className="text-blue-400 font-medium">
            {btn.label}
          </Button>
        ))}
        {[7, 8, 9, "/", 4, 5, 6, "*", 1, 2, 3, "-", 0, ".", "=", "+"].map((label, i) => (
          <Button
            key={`num-${i}`}
            variant={typeof label === 'number' || label === '.' ? "secondary" : label === '=' ? "success" : "primary"}
            onClick={() => label === "=" ? handleEqual() : handleNumber(label.toString())}
          >
            {label}
          </Button>
        ))}
        <Button variant="danger" onClick={() => setDisplay("0")} className="col-span-2">AC</Button>
        <Button variant="secondary" onClick={() => setDisplay(display.slice(0, -1) || "0")} className="col-span-2">
          <Delete className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
