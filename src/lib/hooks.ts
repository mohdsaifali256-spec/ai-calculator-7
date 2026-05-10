import { useState, useEffect } from "react";
import { CalculationEntry, CashRecordEntry, ExpenseEntry } from "../types";
import { TRANSLATIONS, LanguageCode, t } from "./i18n";

const HISTORY_KEY = 'smart_calc_history';
const CASH_HISTORY_KEY = 'smart_calc_cash_history';
const EXPENSES_KEY = 'smart_calc_expenses';

export function useHistory() {
  const saveCalculation = async (entry: Omit<CalculationEntry, 'id' | 'timestamp' | 'userId'>) => {
    const newEntry: CalculationEntry = {
      ...entry,
      id: `calc-${Date.now()}`,
      timestamp: new Date(),
      userId: 'local-user'
    };
    
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    localStorage.setItem(HISTORY_KEY, JSON.stringify([newEntry, ...history].slice(0, 50)));
    return newEntry;
  };

  const getHistory = async (sortOrder: 'asc' | 'desc' = 'desc') => {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as CalculationEntry[];
    return history.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  };

  const saveCashRecord = async (entry: Omit<CashRecordEntry, 'id' | 'date' | 'userId'>) => {
    const newEntry: CashRecordEntry = {
      ...entry,
      id: `cash-${Date.now()}`,
      date: new Date(),
      userId: 'local-user'
    };
    const history = JSON.parse(localStorage.getItem(CASH_HISTORY_KEY) || '[]');
    localStorage.setItem(CASH_HISTORY_KEY, JSON.stringify([newEntry, ...history].slice(0, 50)));
    return newEntry;
  };

  const getCashHistory = async (sortOrder: 'asc' | 'desc' = 'desc') => {
    const history = JSON.parse(localStorage.getItem(CASH_HISTORY_KEY) || '[]') as CashRecordEntry[];
    return history.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  };

  const clearAllData = () => {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(CASH_HISTORY_KEY);
    localStorage.removeItem(EXPENSES_KEY);
  };

  return { saveCalculation, getHistory, saveCashRecord, getCashHistory, clearAllData };
}

export function useExpenses() {
  const getExpenses = () => {
    const data = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]') as ExpenseEntry[];
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const addExpense = (entry: Omit<ExpenseEntry, 'id' | 'userId'>) => {
    const newEntry: ExpenseEntry = {
      ...entry,
      id: `exp-${Date.now()}`,
      userId: 'local-user'
    };
    const expenses = getExpenses();
    localStorage.setItem(EXPENSES_KEY, JSON.stringify([newEntry, ...expenses]));
    return newEntry;
  };

  const deleteExpense = (id: string) => {
    const expenses = getExpenses().filter(e => e.id !== id);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  };

  return { getExpenses, addExpense, deleteExpense };
}

const SETTINGS_KEY = 'smart_calc_settings';

export interface AppSettings {
  sounds: boolean;
  haptic: boolean;
  language: 'en' | 'hi' | 'bn';
}

const defaultSettings: AppSettings = {
  sounds: true,
  haptic: true,
  language: 'en'
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return defaultSettings;
    try {
      return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    const handleSettingsChange = (e: any) => {
      setSettings(e.detail);
    };
    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, []);

  const saveSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('settingsChanged', { detail: updated }));
    return updated;
  };

  return { settings, saveSettings };
}

export function useTranslation() {
  const { settings } = useSettings();
  const lang = settings.language;
  
  const T = (key: keyof typeof TRANSLATIONS['en']) => t(key, lang);
  
  return { T, lang };
}

export function useInteractions() {
  const { settings } = useSettings();

  const playInteraction = () => {
    if (settings.haptic && navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    if (settings.sounds) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    }
  };

  return { playInteraction };
}
