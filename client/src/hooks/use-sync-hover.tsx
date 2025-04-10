import React, { createContext, useContext, useState, useEffect } from 'react';

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
  
  // Reset active index when mouse leaves the container
  useEffect(() => {
    const handleMouseLeave = () => {
      // Small delay to prevent flickering when moving between cards
      setTimeout(() => {
        setActiveIndex(null);
      }, 100);
    };
    
    // Find all card elements and add mouse leave handlers
    const cards = document.querySelectorAll('[class*="MetricCard"]');
    cards.forEach(card => {
      card.addEventListener('mouseleave', handleMouseLeave);
    });
    
    return () => {
      cards.forEach(card => {
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);
  
  return (
    <SyncHoverContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div style={{ display: 'contents' }}>
        {children}
      </div>
    </SyncHoverContext.Provider>
  );
}