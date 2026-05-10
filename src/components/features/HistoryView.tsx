import { useState, useEffect } from "react";
import { History as HistoryIcon, Clock, ArrowUpDown, Banknote, Calculator, Trash2 } from "lucide-react";
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
  const { getHistory, getCashHistory, clearAllData } = useHistory();

  useEffect(() => {
    refreshData();
  }, [activeTab, sortOrder]);

  const refreshData = () => {
    if (activeTab === 'calc') {
      getHistory(sortOrder).then(setCalcHistory);
    } else {
      getCashHistory(sortOrder).then(setCashHistory);
    }
  };

  const toggleSort = () => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');

  const handleClear = () => {
    if (confirm("Clear all history?")) {
      clearAllData();
      refreshData();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-slate-300">Activity Logs</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={toggleSort} className="gap-2 text-[10px] uppercase font-bold tracking-widest px-3 border-white/5 h-9 rounded-xl">
              <ArrowUpDown className="w-3 h-3" />
              {sortOrder === 'desc' ? "Newest" : "Oldest"}
            </Button>
            <button onClick={handleClear} className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-all">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        <div className="flex p-1 bg-zinc-900/50 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'calc' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Calculator className="w-3.5 h-3.5" /> Calculations
          </button>
          <button
            onClick={() => setActiveTab('cash')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'cash' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Banknote className="w-3.5 h-3.5" /> Cash Records
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'calc' ? (
          calcHistory.length > 0 ? calcHistory.map((item) => (
            <div key={item.id} className="bg-bg-card p-5 rounded-[24px] flex flex-col gap-2 relative overflow-hidden group border border-white/5 animate-slide-up">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/30" />
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-primary uppercase font-bold tracking-widest bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                  {item.type}
                </span>
                <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono">
                  <Clock className="w-3 h-3" />
                  {format(new Date(item.timestamp), 'hh:mm a, d MMM yyyy')}
                </div>
              </div>
              <div className="space-y-1 mt-1">
                <p className="text-xs text-slate-500 font-mono text-right truncate opacity-60">{item.expression}</p>
                <p className="text-xl font-mono font-bold text-white text-right break-all">{item.result}</p>
              </div>
            </div>
          )) : (
            <EmptyHistory icon={Calculator} message="No recent calculations found." />
          )
        ) : (
          cashHistory.length > 0 ? cashHistory.map((item) => (
            <div key={item.id} className="bg-bg-card p-5 rounded-[24px] flex flex-col gap-2 relative overflow-hidden group border border-white/5 animate-slide-up">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30" />
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-emerald-500 uppercase font-bold tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                  Cash Count
                </span>
                <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono">
                  <Clock className="w-3 h-3" />
                  {format(new Date(item.date), 'hh:mm a, d MMM yyyy')}
                </div>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div className="flex flex-wrap gap-1 max-w-[60%]">
                  {Object.entries(item.notes || {}).map(([val, count]) => (count as number) > 0 && (
                    <span key={val} className="text-[9px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                      ₹{val}×{count}
                    </span>
                  ))}
                </div>
                <p className="text-2xl font-mono font-bold text-emerald-400">{formatCurrency(item.total)}</p>
              </div>
            </div>
          )) : (
            <EmptyHistory icon={Banknote} message="No cash records recorded." />
          )
        )}
      </div>
    </div>
  );
}

function EmptyHistory({ icon: Icon, message }: { icon: any, message: string }) {
  return (
    <div className="bg-bg-card/50 p-12 rounded-[32px] text-center space-y-4 border border-white/5">
      <div className="w-16 h-16 rounded-3xl bg-zinc-900 flex items-center justify-center mx-auto border border-white/5">
        <Icon className="w-8 h-8 text-zinc-800" />
      </div>
      <p className="text-slate-500 text-sm font-medium">{message}</p>
    </div>
  );
}
