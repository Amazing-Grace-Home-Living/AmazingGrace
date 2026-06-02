import React, { createContext, useContext, useState, useCallback } from 'react';
import { DUAL_ASCENT_DATA } from './DualAscentData';

const DualAscentContext = createContext(null);

export function DualAscentProvider({ children }) {
  const [sheilaAct, setSheilaAct] = useState(1);
  const [yiAct, setYiAct] = useState(1);
  const [bossesDefeated, setBossesDefeated] = useState([]);
  const [resonanceLevel, setResonanceLevel] = useState(0);

  const advanceSheila = useCallback(() => {
    setSheilaAct(prev => Math.min(3, prev + 1));
  }, []);

  const advanceYi = useCallback(() => {
    setYiAct(prev => Math.min(3, prev + 1));
  }, []);

  const defeatBoss = useCallback((bossId) => {
    setBossesDefeated(prev => [...new Set([...prev, bossId])]);
  }, []);

  const triggerResonance = useCallback(() => {
    setResonanceLevel(prev => prev + 1);
  }, []);

  const value = {
    sheilaAct,
    yiAct,
    bossesDefeated,
    resonanceLevel,
    advanceSheila,
    advanceYi,
    defeatBoss,
    triggerResonance,
    data: DUAL_ASCENT_DATA
  };

  return (
    <DualAscentContext.Provider value={value}>
      {children}
    </DualAscentContext.Provider>
  );
}

export function useDualAscent() {
  const context = useContext(DualAscentContext);
  if (!context) throw new Error("useDualAscent must be used within DualAscentProvider");
  return context;
}
