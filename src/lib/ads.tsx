import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdContextType {
  isPremium: boolean;
  setPremium: (val: boolean) => void;
  actionCount: number;
  incrementActions: () => void;
  showInterstitial: () => void;
  showRewarded: () => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setPremiumState] = useState(() => {
    return localStorage.getItem('smart_calc_session_premium') === 'true';
  });
  const [actionCount, setActionCount] = useState(0);

  const setPremium = (val: boolean) => {
    setPremiumState(val);
    localStorage.setItem('smart_calc_session_premium', val.toString());
  };

  const showInterstitial = useCallback(() => {
    if (isPremium) return;
    window.open('https://www.profitablecpmratenetwork.com/svysm88h?key=765e44bff64a86610f2cd689d0d942c8', '_blank');
  }, [isPremium]);

  const showRewarded = useCallback(() => {
    window.open('https://www.profitablecpmratenetwork.com/svysm88h?key=765e44bff64a86610f2cd689d0d942c8', '_blank');
    setPremium(true);
  }, []);

  const incrementActions = useCallback(() => {
    if (isPremium) return;
    setActionCount(prev => {
      const next = prev + 1;
      if (next >= 6) { // Show ad every 6 actions
        showInterstitial();
        return 0;
      }
      return next;
    });
  }, [isPremium, showInterstitial]);

  return (
    <AdContext.Provider value={{
      isPremium,
      setPremium,
      actionCount,
      incrementActions,
      showInterstitial,
      showRewarded
    }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) throw new Error('useAds must be used within AdProvider');
  return context;
};
