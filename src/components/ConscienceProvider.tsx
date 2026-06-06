import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Shared default metrics
export const M_CONSCIENCE_DEFAULT = {
  integrity: 0.75,
  community: 0.40,
  karma: 0.60,
  wisdom: 0.55
};

type ConscienceState = {
  metrics: typeof M_CONSCIENCE_DEFAULT;
  updateMetrics: (deltas: Partial<typeof M_CONSCIENCE_DEFAULT>) => void;
  globalCollapseRisk: number;
  increaseCollapseRisk: (delta: number) => void;
};

export const ConscienceContext = createContext<ConscienceState>(null!);

export function ConscienceProvider({ 
  children, 
  initialMetrics = M_CONSCIENCE_DEFAULT 
}: { 
  children: React.ReactNode, 
  initialMetrics?: typeof M_CONSCIENCE_DEFAULT 
}) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const prevMetricsRef = useRef(initialMetrics);

  // Sync metrics changes
  useEffect(() => {
    const changed = (Object.keys(initialMetrics) as Array<keyof typeof M_CONSCIENCE_DEFAULT>).some(
      (key) => initialMetrics[key] !== prevMetricsRef.current[key]
    );
    if (changed) {
      setMetrics(initialMetrics);
      prevMetricsRef.current = initialMetrics;
    }
  }, [initialMetrics]);

  const updateMetrics = useCallback((deltas: Partial<typeof M_CONSCIENCE_DEFAULT>) => {
    setMetrics((prev) => {
      const updated = { ...prev };
      Object.keys(deltas).forEach((key) => {
        const k = key as keyof typeof M_CONSCIENCE_DEFAULT;
        updated[k] = Math.max(0, Math.min(1, prev[k] + (deltas[k] || 0)));
      });
      return updated;
    });
  }, []);

  // Collapse Risk logic with cross-window syncing
  const [globalCollapseRisk, setGlobalCollapseRisk] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aghl_collapseRisk');
      if (stored) return parseFloat(stored);
    }
    return 0.15; // baseline
  });

  const increaseCollapseRisk = useCallback((delta: number) => {
    setGlobalCollapseRisk(prev => {
      const next = Math.min(0.99, prev + delta);
      if (typeof window !== 'undefined') {
        localStorage.setItem('aghl_collapseRisk', next.toString());
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'aghl_collapseRisk' && e.newValue) {
        setGlobalCollapseRisk(parseFloat(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo(() => ({ 
    metrics, 
    updateMetrics,
    globalCollapseRisk,
    increaseCollapseRisk
  }), [metrics, updateMetrics, globalCollapseRisk, increaseCollapseRisk]);

  return <ConscienceContext.Provider value={value}>{children}</ConscienceContext.Provider>;
}

export function useConscience() {
  const ctx = useContext(ConscienceContext);
  if (!ctx) throw new Error("useConscience must be used inside ConscienceProvider");
  return ctx;
}
