import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CreditCard, Info } from "lucide-react";
import { formatCurrency } from "../../lib/utils";

export function EMICalculator() {
  const [loan, setLoan] = useState<number>(500000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(5);

  const results = useMemo(() => {
    const P = loan;
    const r = rate / (12 * 100);
    const n = tenure * 12;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    return {
      emi: isFinite(emi) ? emi : 0,
      totalInterest: isFinite(totalInterest) ? totalInterest : 0,
      totalAmount: isFinite(totalAmount) ? totalAmount : 0,
      principalPercent: (P / totalAmount) * 100,
      interestPercent: (totalInterest / totalAmount) * 100,
    };
  }, [loan, rate, tenure]);

  const chartData = [
    { name: "Principal", value: loan, color: "#3b82f6" },
    { name: "Interest", value: results.totalInterest, color: "#f97316" },
  ];

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest px-1 mb-2">
              <span>Loan Amount</span>
              <span>{formatCurrency(loan)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={loan}
              onChange={(e) => setLoan(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest px-1 mb-2">
              <span>Interest Rate (%)</span>
              <span>{rate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest px-1 mb-2">
              <span>Tenure (Years)</span>
              <span>{tenure} Y</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-6 rounded-3xl flex flex-col justify-center items-center">
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-zinc-400">Principal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-zinc-400">Interest</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl space-y-4 flex flex-col justify-center">
          <div className="space-y-1">
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Monthly EMI</p>
            <p className="text-3xl font-mono font-bold text-blue-500">{formatCurrency(results.emi)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Total Interest</p>
            <p className="text-xl font-mono font-bold">{formatCurrency(results.totalInterest)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Total Repayment</p>
            <p className="text-xl font-mono font-bold text-zinc-300">{formatCurrency(results.totalAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
