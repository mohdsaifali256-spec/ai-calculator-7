import { useState, useEffect } from "react";
import { NavTab } from "./types";
import { Shell } from "./components/layout/Shell";
import { Dashboard } from "./components/features/Dashboard";
import { NormalCalculator } from "./components/features/NormalCalculator";
import { ScientificCalculator } from "./components/features/ScientificCalculator";
import { CashCounter } from "./components/features/CashCounter";
import { GSTCalculator } from "./components/features/GSTCalculator";
import { EMICalculator } from "./components/features/EMICalculator";
import { DiscountProfit } from "./components/features/DiscountProfit";
import { InvoiceGenerator } from "./components/features/InvoiceGenerator";
import { ExpenseManager } from "./components/features/ExpenseManager";
import { UnitConverter } from "./components/features/UnitConverter";
import { AgeCalculator } from "./components/features/AgeCalculator";
import { HistoryView } from "./components/features/HistoryView";
import { SettingsView } from "./components/features/SettingsView";
import { BMICalculator } from "./components/features/BMICalculator";
import { LoanCalculator } from "./components/features/LoanCalculator";
import { getSavedTheme, applyTheme, THEMES } from "./lib/theme";
import { CreatorTag } from "./components/ui/CreatorTag";
import { AdProvider, useAds } from "./lib/ads";
import { SplashAd } from "./components/ads/SplashAd";

export default function App() {
  return (
    <AdProvider>
      <AppContent />
    </AdProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [navStack, setNavStack] = useState<NavTab[]>(["home"]);
  const [loading, setLoading] = useState(true);
  const [splashFinished, setSplashFinished] = useState(false);
  const { incrementActions } = useAds();

  useEffect(() => {
    // Initial Theme Load
    const { name, custom } = getSavedTheme();
    if (name === 'custom' && custom) {
      applyTheme(custom);
    } else {
      applyTheme(THEMES[name as keyof typeof THEMES]);
    }
    
    // Fast loading splash
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (tab: NavTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setNavStack(prev => [...prev, tab]);
    incrementActions(); // Show interstitial occasionally
  };

  const goBack = () => {
    if (navStack.length > 1) {
      const newStack = [...navStack];
      newStack.pop();
      const prev = newStack[newStack.length - 1];
      setActiveTab(prev);
      setNavStack(newStack);
    } else {
      setActiveTab("home");
      setNavStack(["home"]);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0A0B0E] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full animate-pulse" />
          <img 
            src="https://img.icons8.com/isometric/512/calculator.png" 
            alt="Logo" 
            className="w-20 h-20 sm:w-24 sm:h-24 relative z-10 animate-bounce transition-transform"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="w-10 h-10 border-[3px] border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-6" />
        <p className="text-blue-500 font-bold tracking-[0.3em] text-[8px] sm:text-[10px] uppercase animate-pulse">All Tool Calculator</p>
        <p className="text-slate-600 text-[7px] mt-2 uppercase tracking-widest font-medium">Powering your daily calculations</p>
        
        <CreatorTag />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <Dashboard onSelect={navigateTo} />;
      case "calc": return <NormalCalculator />;
      case "scientific": return <ScientificCalculator />;
      case "cash": return <CashCounter />;
      case "gst": return <GSTCalculator />;
      case "emi": return <EMICalculator />;
      case "discount": return <DiscountProfit />;
      case "invoice": return <InvoiceGenerator />;
      case "expense": return <ExpenseManager />;
      case "converter": return <UnitConverter />;
      case "age": return <AgeCalculator />;
      case "bmi": return <BMICalculator />;
      case "loan": return <LoanCalculator />;
      case "history": return <HistoryView />;
      case "settings": return <SettingsView />;
      default: return <Dashboard onSelect={navigateTo} />;
    }
  };

  return (
    <>
      {!splashFinished && <SplashAd onComplete={() => setSplashFinished(true)} />}
      <Shell activeTab={activeTab} onTabChange={navigateTo} onBack={goBack}>
        {renderContent()}
      </Shell>
    </>
  );
}
