import { useState, useEffect } from "react";
import { History as HistoryIcon, Clock, ArrowUpDown, Banknote, Calculator } from "lucide-react";
import { format } from "date-fns";
import { useHistory } from "../../lib/hooks";
import { CalculationEntry, CashRecordEntry } from "../../types";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../lib/utils";

export function HistoryView() {
  const [activeTab, setActiveTab] = useState<'calc' | 'cash'>('calc');
  const [calcHistory, setCalcHistory] = useState<CalculationEntry[]>([]);
  const [cashHistory, setCashHistory] = useState<CashRecordEntry[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { getHistory, getCashHistory } = useHistory();

  useEffect(() => {
    if (activeTab === 'calc') {
      getHistory(sortOrder).then(setCalcHistory);
    } else {
      getCashHistory(sortOrder).then(setCashHistory);
    }
  }, [activeTab, sortOrder]);

  const toggleSort = () => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-zinc-300">History Log</h3>
          </div>
          <Button variant="secondary" size="sm" onClick={toggleSort} className="gap-2 text-[10px] uppercase font-bold tracking-widest px-3 border-white/5">
            <ArrowUpDown className="w-3 h-3" />
            {sortOrder === 'desc' ? "Newest First" : "Oldest First"}
          </Button>
        </div>

        <div className="flex p-1 bg-zinc-900/50 rounded-2xl border border-white/5 mx-1">
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'calc' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Calculator className="w-3.5 h-3.5" /> Calculations
          </button>
          <button
            onClick={() => setActiveTab('cash')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'cash' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Banknote className="w-3.5 h-3.5" /> Cash Records
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {activeTab === 'calc' ? (
          calcHistory.length > 0 ? calcHistory.map((item) => (
            <div key={item.id} className="bg-bg-card p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/30" />
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest bg-zinc-900/80 px-2 py-0.5 rounded border border-white/5">
                  {item.type}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                  <Clock className="w-3 h-3" />
                  {item.timestamp ? format(new Date(item.timestamp), 'hh:mm a, d MMM yyyy') : "Now"}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400 font-mono text-right truncate opacity-60">{item.expression}</p>
                <p className="text-xl font-mono font-bold text-white text-right">{item.result}</p>
              </div>
            </div>
          )) : (
            <EmptyHistory icon={Calculator} message="No calculations found." />
          )
        ) : (
          cashHistory.length > 0 ? cashHistory.map((item) => (
            <div key={item.id} className="bg-bg-card p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30" />
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Cash Count
                </span>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                  <Clock className="w-3 h-3" />
                  {item.date ? format(new Date(item.date), 'hh:mm a, d MMM yyyy') : "Now"}
                </div>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div className="flex flex-wrap gap-1 max-w-[60%]">
                  {Object.entries(item.notes || {}).map(([val, count]) => count > 0 && (
                    <span key={val} className="text-[9px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                      ₹{val}×{count}
                    </span>
                  ))}
                </div>
                <p className="text-2xl font-mono font-bold text-emerald-400">{formatCurrency(item.total)}</p>
              </div>
            </div>
          )) : (
            <EmptyHistory icon={Banknote} message="No cash records found." />
          )
        )}
      </div>
    </div>
  );
}

function EmptyHistory({ icon: Icon, message }: { icon: any, message: string }) {
  return (
    <div className="bg-bg-card/50 p-12 rounded-3xl text-center space-y-4 border border-white/5">
      <Icon className="w-12 h-12 text-zinc-800 mx-auto" />
      <p className="text-zinc-500 text-sm font-medium">{message}</p>
    </div>
  );
}
