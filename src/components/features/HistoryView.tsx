import { useState, useEffect } from "react";
import { History as HistoryIcon, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import { useHistory } from "../../lib/hooks";
import { CalculationEntry } from "../../types";
import { Button } from "../ui/Button";

export function HistoryView() {
  const [history, setHistory] = useState<CalculationEntry[]>([]);
  const { getHistory } = useHistory();

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-zinc-300">Recent Calculations</h3>
        </div>
      </div>

      <div className="space-y-3">
        {history.length > 0 ? history.map((item) => (
          <div key={item.id} className="glass p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/30" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest bg-zinc-800 px-2 py-0.5 rounded">
                {item.type}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                <Clock className="w-3 h-3" />
                {item.timestamp ? format(item.timestamp, 'hh:mm a, d MMM') : "Now"}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-zinc-400 font-mono text-right truncate">{item.expression}</p>
              <p className="text-xl font-mono font-bold text-white text-right">{item.result}</p>
            </div>
          </div>
        )) : (
          <div className="glass p-12 rounded-3xl text-center space-y-4">
            <HistoryIcon className="w-12 h-12 text-zinc-800 mx-auto" />
            <p className="text-zinc-500 text-sm">No calculations found in your history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
