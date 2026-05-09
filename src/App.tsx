import { useState, useEffect } from "react";
import { Shell } from "./components/layout/Shell";
import { NavTab } from "./types";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

// Components
import { Dashboard } from "./components/features/Dashboard";
import { NormalCalculator } from "./components/features/NormalCalculator";
import { ScientificCalculator } from "./components/features/ScientificCalculator";
import { CashCounter } from "./components/features/CashCounter";
import { GSTCalculator } from "./components/features/GSTCalculator";
import { EMICalculator } from "./components/features/EMICalculator";
import { DiscountProfile } from "./components/features/DiscountProfit";
import { InvoiceGenerator } from "./components/features/InvoiceGenerator";
import { ExpenseManager } from "./components/features/ExpenseManager";
import { UnitConverter } from "./components/features/UnitConverter";
import { AgeCalculator } from "./components/features/AgeCalculator";
import { HistoryView } from "./components/features/HistoryView";
import { SettingsView } from "./components/features/SettingsView";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(37,99,235,0.6)]">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <div className="text-zinc-500 font-medium tracking-widest text-xs uppercase animate-pulse">
            Smart Advance
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard onSelect={setActiveTab} />;
      case 'calc': return <NormalCalculator />;
      case 'scientific': return <ScientificCalculator />;
      case 'cash': return <CashCounter />;
      case 'gst': return <GSTCalculator />;
      case 'emi': return <EMICalculator />;
      case 'discount': return <DiscountProfile />;
      case 'invoice': return <InvoiceGenerator />;
      case 'expense': return <ExpenseManager />;
      case 'converter': return <UnitConverter />;
      case 'age': return <AgeCalculator />;
      case 'history': return <HistoryView />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard onSelect={setActiveTab} />;
    }
  };

  return (
    <Shell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Shell>
  );
}
