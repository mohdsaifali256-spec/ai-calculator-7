import { useState } from "react";
import { Moon, Languages, Shield, Info, LogOut, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { auth } from "../../lib/firebase";

export function SettingsView() {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState("English");

  const handleClearData = () => {
    if (confirm("Are you sure you want to delete all local history?")) {
      // Logic for local clearing
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium">Dark Mode</span>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? "bg-blue-600" : "bg-zinc-700"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? "right-1" : "left-1"}`} />
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium">App Language</span>
          </div>
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-sm text-blue-400 font-bold outline-none"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Urdu">Urdu</option>
          </select>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium">Data Privacy</span>
          </div>
          <span className="text-xs text-zinc-500">Cloud Sync Active</span>
        </div>
      </div>

      <div className="glass rounded-3xl p-4 space-y-4">
        <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest pl-1">Actions</h4>
        <div className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-3 text-red-400 hover:text-red-300" onClick={handleClearData}>
            <Trash2 className="w-4 h-4" /> Clear Local Cache
          </Button>
          <Button variant="secondary" className="w-full justify-start gap-3" onClick={() => auth.signOut()}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="text-center space-y-2 py-8 opacity-40">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded bg-zinc-700 flex items-center justify-center">
            <CalculatorIcon className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs">SmartAdvance v1.0.4</span>
        </div>
        <p className="text-[10px] uppercase tracking-tighter">Fast. Smart. Professional.</p>
      </div>
    </div>
  );
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}
