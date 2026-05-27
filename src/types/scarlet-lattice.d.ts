export {};

declare global {
  interface Window {
    fateCollapse?: boolean;
    scarletGrowth?: number;
    scarletSpread?: number;
    latticeDistortion?: number;
    weaveStability?: number;

    updateScarletLattice?: (stats: { integrity?: number; community?: number }) => void;
    speakScarlet?: (message: string) => void;
    birthScarletLattice?: () => void;
    spawnGlyphRed?: (message: string, x: number, y: number) => void;

    collapseShockwave?: () => void;
  }
}

