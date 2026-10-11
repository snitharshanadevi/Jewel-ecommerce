import React, { createContext, useContext, useState } from 'react';

export interface SupportContextOptions {
  initialTab?: 'concierge' | 'video' | 'bookings';
  orderReference?: string;
  topic?: string;
  prefilledQuery?: string;
}

interface SupportContextType {
  isSupportOpen: boolean;
  activeTab: 'concierge' | 'video' | 'bookings';
  supportOptions: SupportContextOptions;
  openSupport: (options?: SupportContextOptions) => void;
  closeSupport: () => void;
  setActiveTab: (tab: 'concierge' | 'video' | 'bookings') => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'concierge' | 'video' | 'bookings'>('concierge');
  const [supportOptions, setSupportOptions] = useState<SupportContextOptions>({});

  const openSupport = (options?: SupportContextOptions) => {
    if (options) {
      setSupportOptions(options);
      if (options.initialTab) {
        setActiveTab(options.initialTab);
      }
    } else {
      setSupportOptions({});
      setActiveTab('concierge');
    }
    setIsSupportOpen(true);
  };

  const closeSupport = () => {
    setIsSupportOpen(false);
  };

  return (
    <SupportContext.Provider
      value={{
        isSupportOpen,
        activeTab,
        supportOptions,
        openSupport,
        closeSupport,
        setActiveTab,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};
