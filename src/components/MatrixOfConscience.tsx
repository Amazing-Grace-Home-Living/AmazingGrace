import React from 'react';
import type { FamilyStats } from '../hooks/useFamilyStats';

type Props = {
  stats: FamilyStats;
  chainLevel: number;
  activeUser: string;
};

/**
 * MatrixOfConscience — React wrapper for the stat-driven visualization.
 * Renders a container element whose data attributes reflect the current
 * family-synergy metrics for use by external DOM / canvas FX controllers.
 */
export default function MatrixOfConscience({ stats, chainLevel, activeUser }: Props) {
  return (
    <div
      className="matrix-of-conscience"
      data-karma={stats.karma}
      data-wisdom={stats.wisdom}
      data-integrity={stats.integrity}
      data-community={stats.community}
      data-chain-level={chainLevel}
      data-active-user={activeUser}
      aria-label="Matrix of Conscience visualization"
    />
  );
}
