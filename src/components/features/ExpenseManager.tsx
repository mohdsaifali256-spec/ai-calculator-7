import { useState, useEffect, useMemo } from "react";
import { Plus, Wallet, TrendingUp, TrendingDown, Trash2, PieChart } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, Tooltip, Cell } from "recharts";
import { Button } from "../ui/Button";
import { EXPENSE_CATEGORIES } from "../../constants";
import { formatCurrency, cn } from "../../lib/utils";
import { useExpenses } from "../../lib/hooks";

export function ExpenseManager() {
  const { getExpenses, addExpense, deleteExpense } = useExpenses();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [type, setType] = useState<"income" | "expense">("expense");

  useEffect(() => {
    setExpenses(getExpenses());
  }, []);

  const totals = useMemo(() => {
    const income = expenses.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
    const expense = expenses.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
    return { income, expense, balance: income - expense };
  }, [expenses]);

  const handleAdd = () => {
    if (!amount) return;
    const newExp = addExpense({
      amount: parseFloat(amount),
      category,
      type,
      date: new Date()
    });
    setExpenses([newExp, ...expenses]);
    setAmount("");
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.slice(0, 10).forEach(e => {
      const date = new Date(e.date).toLocaleDateString([], { day: '2-digit', month: 'short' });
      data[date] = (data[date] || 0) + (e.type === "expense" ? -e.amount : e.amount);
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-bg-card p-5 rounded-[24px] border border-emerald-500/10 relative overflow-hidden">
          <TrendingUp className="w-8 h-8 text-emerald-500 opacity-5 absolute -top-1 -left-1" />
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Total Income</p>
          <p className="text-xl font-mono font-bold text-emerald-500">{formatCurrency(totals.income)}</p>
        </div>
        <div className="bg-bg-card p-5 rounded-[24px] border border-red-500/10 relative overflow-hidden">
          <TrendingDown className="w-8 h-8 text-red-500 opacity-5 absolute -top-1 -left-1" />
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Total Expenses</p>
          <p className="text-xl font-mono font-bold text-red-500">{formatCurrency(totals.expense)}</p>
        </div>
        <div className="bg-primary/5 p-5 rounded-[24px] border border-primary/10 col-span-2 flex justify-between items-center group">
          <div>
            <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-1">Net Balance</p>
            <p className="text-3xl font-mono font-bold text-white group-hover:text-primary transition-colors">{formatCurrency(totals.balance)}</p>
          </div>
          <Wallet className="w-10 h-10 text-primary opacity-20" />
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-bg-card p-6 rounded-[32px] border border-white/5 space-y-4 shadow-xl">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">New transaction</h3>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
              <input
                type="number"
                placeholder="Amount"
                className="w-full bg-zinc-950 border border-white/5 rounded-xl p-3 pl-8 outline-none focus:border-primary font-mono text-white"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <select
              className="bg-zinc-950 border border-white/5 rounded-xl p-3 outline-none text-xs font-bold text-slate-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-white/5 flex-1">
              <button 
                onClick={() => setType("income")} 
                className={cn("flex-1 py-2 rounded-xl text-[10px] uppercase font-bold transition-all", type === "income" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500")}
              >
                In
              </button>
              <button 
                onClick={() => setType("expense")} 
                className={cn("flex-1 py-2 rounded-xl text-[10px] uppercase font-bold transition-all", type === "expense" ? "bg-red-600 text-white shadow-lg" : "text-slate-500")}
              >
                Out
              </button>
            </div>
            <Button onClick={handleAdd} className="h-12 w-12 rounded-2xl neon-blue shrink-0"><Plus className="w-6 h-6" /></Button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-bg-card p-6 rounded-[32px] h-64 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-4 right-4 text-[8px] uppercase font-bold tracking-widest text-slate-600 flex items-center gap-1">
          <PieChart className="w-2.5 h-2.5" /> Trend Chart
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.03)'}}
              contentStyle={{ background: 'var(--color-card)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', borderRadius: '16px', fontSize: '10px' }} 
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#ef4444'} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Recent Activity</h3>
        <div className="space-y-3">
          {expenses.length > 0 ? expenses.map((e) => (
            <div key={e.id} className="bg-bg-card p-4 rounded-2xl flex items-center justify-between border border-white/5 group hover:border-primary/20 transition-all animate-slide-up">
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-white/5", e.type === "income" ? "bg-emerald-500/5" : "bg-red-500/5")}>
                  {e.type === "income" ? <TrendingUp className="text-emerald-500 w-5 h-5" /> : <TrendingDown className="text-red-500 w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-200">{e.category}</p>
                  <p className="text-[9px] text-slate-600 font-mono italic">
                    {new Date(e.date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className={cn("font-mono font-bold text-sm", e.type === "income" ? "text-emerald-500" : "text-red-500")}>
                  {e.type === "income" ? "+" : "-"}{formatCurrency(e.amount)}
                </p>
                <button onClick={() => handleDelete(e.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:text-red-500 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 opacity-30 italic text-xs">No transactions recorded yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
