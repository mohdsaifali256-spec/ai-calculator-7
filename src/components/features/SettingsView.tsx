import { useState, useEffect } from "react";
import { Moon, Languages, Shield, LogOut, Trash2, LogIn, User } from "lucide-react";
import { Button } from "../ui/Button";
import { auth, googleProvider } from "../../lib/firebase";
import { signInWithPopup, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export function SettingsView() {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState("English");
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to delete all local history? This cannot be undone.")) {
      localStorage.removeItem('local_history');
      localStorage.removeItem('local_cash_history');
      alert("Local data cleared.");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-gradient-to-br from-bg-card to-bg-main p-8 rounded-[40px] border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center">
          {user ? (
            <>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-3xl border-4 border-blue-600/30 mb-4" />
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-blue-600/20 flex items-center justify-center mb-4 border border-blue-500/30">
                  <User className="w-10 h-10 text-blue-500" />
                </div>
              )}
              <h3 className="text-xl font-bold text-white">{user.displayName || "User"}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">{user.email}</p>
              <Button variant="secondary" size="sm" className="mt-6 gap-2 opacity-50 hover:opacity-100" onClick={() => auth.signOut()}>
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center mb-4 border border-white/5">
                <User className="w-10 h-10 text-zinc-700" />
              </div>
              <h3 className="text-xl font-bold text-white">Guest Account</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px] text-center">Sign in to sync your calculations and business data across devices.</p>
              <Button variant="primary" className="mt-6 gap-3 w-full max-w-[240px] neon-blue" onClick={handleSignIn}>
                <LogIn className="w-5 h-5" /> Sign in with Google
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-bg-card rounded-[32px] overflow-hidden divide-y divide-white/5 border border-white/5">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-300">Dark Mode</span>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${darkMode ? "bg-blue-600" : "bg-slate-700"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${darkMode ? "left-7" : "left-1"}`} />
          </button>
        </div>

        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-300">App Language</span>
          </div>
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-sm text-blue-400 font-bold outline-none cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Urdu">Urdu</option>
          </select>
        </div>

        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-300">Data Connectivity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${user ? "bg-green-500 animate-pulse" : "bg-orange-500"}`} />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {user ? "Cloud Sync" : "Offline Only"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-[32px] p-6 space-y-4 border border-white/5">
        <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-2">Dangerous Area</h4>
        <div className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-4 text-red-400 hover:text-red-300 hover:bg-red-500/5 group" onClick={handleClearData}>
            <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" /> 
            <div className="text-left">
              <p className="font-bold text-sm">Clear Local Data</p>
              <p className="text-[10px] opacity-70">Remove history from this device</p>
            </div>
          </Button>
        </div>
      </div>

      <div className="text-center py-12 opacity-30">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center">
            <CalculatorIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xs tracking-widest">SMARTADVANCE v1.0.5</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.5em] font-medium">Fast. Smart. Professional.</p>
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
