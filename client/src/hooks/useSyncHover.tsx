import React, { createContext, useContext, useState } from 'react';

interface SyncHoverContextType {
  hoveredIndices: Record<string, number | null>;
  setHoveredIndex: (syncId: string, index: number | null) => void;
}

const SyncHoverContext = createContext<SyncHoverContextType>({
  hoveredIndices: {},
  setHoveredIndex: () => {},
});

export const SyncHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredIndices, setHoveredIndices] = useState<Record<string, number | null>>({});

  const setHoveredIndex = (syncId: string, index: number | null) => {
    setHoveredIndices(prev => ({
      ...prev,
      [syncId]: index,
    }));
  };

  return (
    <SyncHoverContext.Provider value={{ hoveredIndices, setHoveredIndex }}>
      {children}
    </SyncHoverContext.Provider>
  );
};

export const useSyncHover = (syncId: string = 'default') => {
  const { hoveredIndices, setHoveredIndex } = useContext(SyncHoverContext);

  return {
    hoveredIndex: syncId ? hoveredIndices[syncId] : null,
    setHoveredIndex: (index: number | null) => setHoveredIndex(syncId, index),
  };
}; 