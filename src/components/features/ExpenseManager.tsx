import { useState, useEffect, useMemo } from "react";
import { Plus, Wallet, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { Button } from "../ui/Button";
import { EXPENSE_CATEGORIES } from "../../constants";
import { formatCurrency, cn } from "../../lib/utils";

export function ExpenseManager() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [type, setType] = useState<"income" | "expense">("expense");

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const totals = useMemo(() => {
    const income = expenses.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
    const expense = expenses.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
    return { income, expense, balance: income - expense };
  }, [expenses]);

  const addExpense = async () => {
    if (!amount || !auth.currentUser) return;
    await addDoc(collection(db, "expenses"), {
      amount: parseFloat(amount),
      category,
      type,
      userId: auth.currentUser.uid,
      date: serverTimestamp()
    });
    setAmount("");
  };

  const deleteExpense = async (id: string) => {
    await deleteDoc(doc(db, "expenses", id));
  };

  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.slice(0, 7).forEach(e => {
      const date = e.date?.toDate?.().toLocaleDateString() || "Today";
      data[date] = (data[date] || 0) + (e.type === "expense" ? -e.amount : e.amount);
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-5 rounded-3xl bg-zinc-900/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest text-wrap">Monthly Income</span>
          </div>
          <p className="text-xl font-mono font-bold text-emerald-500">{formatCurrency(totals.income)}</p>
        </div>
        <div className="glass p-5 rounded-3xl bg-zinc-900/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest text-wrap">Monthly Expenses</span>
          </div>
          <p className="text-xl font-mono font-bold text-red-500">{formatCurrency(totals.expense)}</p>
        </div>
        <div className="glass p-5 rounded-3xl border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest text-wrap">Net Balance</span>
          </div>
          <p className="text-xl font-mono font-bold text-blue-400">{formatCurrency(totals.balance)}</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-zinc-400">Quick Add</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="number"
            placeholder="Amount"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500 font-mono"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            className="bg-zinc-800 border-white/10 rounded-xl p-3 outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex bg-white/5 p-1 rounded-xl">
            <button onClick={() => setType("income")} className={cn("px-4 py-2 rounded-lg text-xs font-bold", type === "income" ? "bg-emerald-600" : "text-zinc-500")}>IN</button>
            <button onClick={() => setType("expense")} className={cn("px-4 py-2 rounded-lg text-xs font-bold", type === "expense" ? "bg-red-600" : "text-zinc-500")}>OUT</button>
          </div>
          <Button onClick={addExpense} className="md:w-12 h-12 flex items-center justify-center"><Plus /></Button>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <Tooltip contentStyle={{ background: '#18181b', border: 'none', color: '#fff' }} />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-zinc-400 px-1">Recent Transactions</h3>
        {expenses.map((e) => (
          <div key={e.id} className="glass p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", e.type === "income" ? "bg-emerald-500/10" : "bg-red-500/10")}>
                {e.type === "income" ? <TrendingUp className="text-emerald-500 w-5 h-5" /> : <TrendingDown className="text-red-500 w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-sm">{e.category}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{e.date?.toDate?.().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className={cn("font-mono font-bold", e.type === "income" ? "text-emerald-500" : "text-red-500")}>
                {e.type === "income" ? "+" : "-"}{formatCurrency(e.amount)}
              </p>
              <Button size="icon" variant="ghost" onClick={() => deleteExpense(e.id)} className="text-zinc-600 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
