import { createContext, useContext, type ReactNode } from 'react';
import { useFamilyStats } from '../hooks/useFamilyStats';

type FamilyStatsContextValue = ReturnType<typeof useFamilyStats>;

const FamilyStatsContext = createContext<FamilyStatsContextValue | null>(null);

export function FamilyStatsProvider({ children }: { children: ReactNode }) {
  const statsData = useFamilyStats();
  return <FamilyStatsContext.Provider value={statsData}>{children}</FamilyStatsContext.Provider>;
}

export function useFamilyStatsContext() {
  const context = useContext(FamilyStatsContext);
  if (!context) {
    throw new Error('useFamilyStatsContext must be used within FamilyStatsProvider');
  }
  return context;
}

