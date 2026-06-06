export interface PlayerReputation {
  globalKarma: number;
  historicalBetrayalsLogged: number;
  factionBias?: number;
}

export type ActionType = 'BUILD_DEFENSE' | 'CHANGE_GDP_POOL' | 'DECLARE_WAR' | 'PROPOSE_RULE';

export const evaluateAllianceAction = (
  proposerKarma: PlayerReputation,
  actionType: ActionType,
  currentThreatLevel: number
): { vote: 'APPROVE' | 'VETO'; reasoning: string } => {
  
  // 1. Defectors are instantly locked out of critical zone controls
  if (proposerKarma.historicalBetrayalsLogged > 2 && proposerKarma.globalKarma < 30) {
    return {
      vote: 'VETO',
      reasoning: "Proposal blocked. Proposer's historic cross-session registry indicates severe operational trust risk."
    };
  }

  // 2. High-trust allies are given complete defense autonomy
  if (proposerKarma.globalKarma >= 75) {
    return {
      vote: 'APPROVE',
      reasoning: "Proposal accepted automatically. Trust score validates symbiotic defensive alignment."
    };
  }

  // 3. Conditional evaluation for unverified or neutral players
  if (actionType === 'BUILD_DEFENSE' && currentThreatLevel > 50) {
    return {
      vote: 'APPROVE',
      reasoning: "Local sector structural security is compromised. Risk accepted despite unverified ally Karma."
    };
  }
  
  // 4. Conditional evaluation for minor rules
  if (actionType === 'PROPOSE_RULE' && proposerKarma.globalKarma >= 40) {
    return {
      vote: 'APPROVE',
      reasoning: "Moderate Karma sufficient for minor legislative modifications."
    };
  }

  return {
    vote: 'VETO',
    reasoning: "Insufficient reputation capital to authorize sovereign modifications during stable wave conditions."
  };
};
