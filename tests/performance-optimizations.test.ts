import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('performance optimization fixes', () => {
  const homepage = fs.readFileSync('index.html', 'utf8');
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  const lensBoard = fs.readFileSync('arcade/matrix-of-conscience/LensBoard.jsx', 'utf8');
  const matrixConscience = fs.readFileSync('src/components/MatrixOfConscience.tsx', 'utf8');
  const arcadeMain = fs.readFileSync('src/arcade-main.tsx', 'utf8');
  const familyStatsContext = fs.readFileSync('src/context/FamilyStatsContext.tsx', 'utf8');

  it('adds listing search UI and debounced filtering script', () => {
    expect(homepage).toContain('id="property-search"');
    expect(homepage).toContain('id="search-clear"');
    expect(homepage).toContain("setTimeout(() => applyFilter(searchInput.value), 150)");
    expect(homepage).toContain("const index = cards.map((card) =>");
  });

  it('lazy loads listing images with async decoding', () => {
    expect(homepage).toContain('loading="lazy"');
    expect(homepage).toContain('decoding="async"');
  });

  it('splits firebase and framer-motion chunks with lower warning limit', () => {
    expect(viteConfig).toContain('chunkSizeWarningLimit: 500');
    expect(viteConfig).toContain("if (id.includes('firebase/firestore')) return 'firebase-firestore';");
    expect(viteConfig).toContain("if (id.includes('firebase/auth')) return 'firebase-auth';");
    expect(viteConfig).toContain("if (id.includes('firebase/app')) return 'firebase-core';");
    expect(viteConfig).toContain("if (id.includes('framer-motion')) return 'framer-motion';");
  });

  it('uses memoization and lower mutation frequency in LensBoard', () => {
    expect(lensBoard).toContain('const alignedSegments = useMemo(');
    expect(lensBoard).toContain('Math.random() < nextDisturbance * 0.1');
    expect(lensBoard).toContain('}, 200);');
  });

  it('stabilizes ConscienceProvider metrics updates', () => {
    expect(matrixConscience).toContain('const prevMetricsRef = useRef(initialMetrics);');
    expect(matrixConscience).toContain('const updateMetrics = useCallback(');
    expect(matrixConscience).toContain('const value = useMemo(() => ({ metrics, updateMetrics }), [metrics, updateMetrics]);');
  });

  it('shares family stats via context provider in arcade app', () => {
    expect(familyStatsContext).toContain('export function FamilyStatsProvider');
    expect(familyStatsContext).toContain('export function useFamilyStatsContext()');
    expect(arcadeMain).toContain('const { stats, chainLevel, activeUser, syncStatus, syncError, isLoading } = useFamilyStatsContext();');
    expect(arcadeMain).toContain('<FamilyStatsProvider>');
  });
});
