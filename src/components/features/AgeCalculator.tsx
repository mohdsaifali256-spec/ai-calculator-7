import { useState, useMemo } from "react";
import { Calendar, RotateCcw, Share2, Clock } from "lucide-react";
import { Button } from "../ui/Button";
import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { useTranslation, useInteractions } from "../../lib/hooks";

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const { T } = useTranslation();
  const { playInteraction } = useInteractions();

  const results = useMemo(() => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    
    if (birth > today) return "future";

    const years = differenceInYears(today, birth);
    const months = differenceInMonths(today, birth) % 12;
    const days = differenceInDays(today, birth) % 30; // Approximation

    return { years, months, days };
  }, [birthDate]);

  const handleShare = () => {
    playInteraction('tap');
    if (!results || results === "future") return;
    const text = `🎂 My Age Calculation\nYears: ${results.years}\nMonths: ${results.months}\nDays: ${results.days}\nCalculated with SmartAdvance`;
    if (navigator.share) {
      navigator.share({ title: 'Age Result', text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Age result copied!");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="bg-bg-card rounded-[40px] p-8 border border-white/5 relative overflow-hidden shadow-2xl transition-all hover:bg-white/[0.02]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10">
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">{T('your_age')}</p>
          {results && results !== "future" ? (
            <div className="flex flex-col gap-1">
              <p className="text-5xl font-mono font-bold text-primary drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                {results.years} <span className="text-xl">Years</span>
              </p>
              <div className="flex gap-4 mt-2">
                <p className="text-lg font-mono font-bold text-slate-300">{results.months} <span className="text-[10px] uppercase text-slate-500">Months</span></p>
                <p className="text-lg font-mono font-bold text-slate-300">{results.days} <span className="text-[10px] uppercase text-slate-500">Days</span></p>
              </div>
            </div>
          ) : (
            <p className="text-4xl font-mono font-bold text-slate-700">-- Years</p>
          )}
        </div>
        <Clock className="absolute top-1/2 right-4 -translate-y-1/2 w-40 h-40 text-primary/5 -rotate-12" />
      </div>

      <div className="bg-bg-card rounded-[32px] p-6 space-y-6 border border-white/5 shadow-inner">
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-1">{T('select_dob')}</label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none transition-transform group-focus-within:scale-110" />
            <input 
              type="date" 
              value={birthDate}
              onChange={(e) => {
                playInteraction('click');
                setBirthDate(e.target.value);
              }}
              className="w-full bg-zinc-950 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-primary transition-all text-white font-mono h-14"
            />
          </div>
        </div>
        {results === "future" && (
          <p className="text-red-400 text-[10px] font-bold uppercase text-center tracking-widest bg-red-400/5 py-2 rounded-xl border border-red-500/10">Birth date cannot be in the future</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button 
          variant="secondary" 
          onClick={() => {
            playInteraction('back');
            setBirthDate("");
          }} 
          className="flex-1 py-4 h-14 rounded-2xl bg-zinc-900 border-white/5 font-bold uppercase tracking-widest"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> {T('reset')}
        </Button>
        <Button variant="primary" onClick={handleShare} disabled={!results || results === "future"} className="flex-1 py-4 h-14 rounded-2xl neon-blue font-bold uppercase tracking-widest">
          <Share2 className="w-4 h-4 mr-2" /> {T('share_details')}
        </Button>
      </div>
    </div>
  );
}
