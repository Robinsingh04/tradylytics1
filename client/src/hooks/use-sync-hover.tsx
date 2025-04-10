import React, { createContext, useContext, useState } from 'react';

interface SyncHoverContextProps {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
}

const SyncHoverContext = createContext<SyncHoverContextProps>({
  activeIndex: null,
  setActiveIndex: () => {},
});

export function useSyncHover() {
  return useContext(SyncHoverContext);
}

interface SyncHoverProviderProps {
  children: React.ReactNode;
}

export function SyncHoverProvider({ children }: SyncHoverProviderProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  return (
    <SyncHoverContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </SyncHoverContext.Provider>
  );
}