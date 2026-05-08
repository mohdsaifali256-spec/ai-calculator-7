import { useState, useMemo } from "react";
import { Calendar, PartyPopper } from "lucide-react";
import { intervalToDuration, format, addYears, isAfter } from "date-fns";

export function AgeCalculator() {
  const [dob, setDob] = useState<string>("");

  const results = useMemo(() => {
    if (!dob) return null;
    const start = new Date(dob);
    const end = new Date();
    
    if (isAfter(start, end)) return "Invalid Date";

    const duration = intervalToDuration({ start, end });
    
    // Next Birthday
    let nextBday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    if (isAfter(end, nextBday)) {
      nextBday = addYears(nextBday, 1);
    }
    const nextBdayIn = intervalToDuration({ start: end, end: nextBday });

    return {
      years: duration.years || 0,
      months: duration.months || 0,
      days: duration.days || 0,
      nextBday: nextBdayIn
    };
  }, [dob]);

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Date of Birth</label>
          <div className="relative">
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-red-500 transition-all text-white appearance-none"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {results && results !== "Invalid Date" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="glass p-4 rounded-2xl text-center border-red-500/10">
              <p className="text-2xl font-mono font-bold text-red-500">{results.years}</p>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Years</p>
            </div>
            <div className="glass p-4 rounded-2xl text-center">
              <p className="text-2xl font-mono font-bold">{results.months}</p>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Months</p>
            </div>
            <div className="glass p-4 rounded-2xl text-center">
              <p className="text-2xl font-mono font-bold">{results.days}</p>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Days</p>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl bg-red-500/5 border-red-500/20 relative overflow-hidden">
            <PartyPopper className="absolute -right-4 -bottom-4 w-24 h-24 text-red-500/10 -rotate-12" />
            <div className="relative z-10">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Next Birthday In</h4>
              <div className="flex gap-4 items-center">
                <div className="space-y-1">
                  <p className="text-2xl font-mono font-bold text-white">{results.nextBday?.months || 0}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Months</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="space-y-1">
                  <p className="text-2xl font-mono font-bold text-white">{results.nextBday?.days || 0}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
