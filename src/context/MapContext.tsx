import React, { createContext, useContext, useState, useCallback } from 'react';

type MapContextType = {
  refreshMap: () => void;
};

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const refreshMap = useCallback(() => {
    // Implementation for refreshing the map
    console.log('Map refreshed');
  }, []);

  return (
    <MapContext.Provider value={{ refreshMap }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
