import React, { createContext, useContext, useState } from 'react';

const SupportContext = createContext();

export function SupportProvider({ children }) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const openSupport = () => setIsSupportOpen(true);
  const closeSupport = () => setIsSupportOpen(false);

  return (
    <SupportContext.Provider value={{ isSupportOpen, openSupport, closeSupport }}>
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
}
