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

export type InteractionType = 'click' | 'success' | 'error' | 'back' | 'delete' | 'tap';

export interface AppSettings {
  sounds: boolean;
  haptic: boolean;
  language: 'en' | 'hi' | 'bn';
  soundVolume: number;
  hapticIntensity: number;
}

const defaultSettings: AppSettings = {
  sounds: true,
  haptic: true,
  language: 'en',
  soundVolume: 50,
  hapticIntensity: 15
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

  const playInteraction = (type: InteractionType = 'click') => {
    // 1. Haptic Feedback
    if (settings.haptic && navigator.vibrate) {
      let duration = settings.hapticIntensity || 15;
      if (type === 'success') duration = 30;
      if (type === 'error') duration = 50;
      if (type === 'delete') duration = 40;
      navigator.vibrate(duration);
    }
    
    // 2. Sound Synthesis (Zero-latency offline support)
    if (settings.sounds) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const vol = (settings.soundVolume || 50) / 500;

      oscillator.type = 'sine';
      
      let frequency = 800;
      let decay = 0.1;

      switch(type) {
        case 'success':
          frequency = 1200;
          decay = 0.2;
          break;
        case 'error':
          frequency = 200;
          decay = 0.3;
          oscillator.type = 'square';
          break;
        case 'back':
          frequency = 600;
          decay = 0.1;
          break;
        case 'delete':
          frequency = 400;
          decay = 0.15;
          oscillator.type = 'triangle';
          break;
        case 'tap':
          frequency = 900;
          decay = 0.05;
          break;
        default:
          frequency = 800;
          decay = 0.1;
      }

      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + decay);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + decay);
      
      // Secondary note for success "ding"
      if (type === 'success') {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1500, audioCtx.currentTime + 0.1);
        gain2.gain.setValueAtTime(vol, audioCtx.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(audioCtx.currentTime + 0.1);
        osc2.stop(audioCtx.currentTime + 0.3);
      }
    }
  };

  return { playInteraction };
}
