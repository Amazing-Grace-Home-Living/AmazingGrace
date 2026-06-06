import { useState, useEffect } from 'react';

export interface MetaProfile {
  uid: string;
  name: string;
  globalKarma: number;
  sessionsPlayed: number;
  betrayals: number;
  isAI: boolean;
}

export const useMatrixReputation = (initialUser: string) => {
  const [currentUser, setCurrentUser] = useState<MetaProfile>({
    uid: typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : 'guest_' + Date.now(),
    name: initialUser,
    globalKarma: 50, // Neutral starting capital for guest accounts
    sessionsPlayed: 1,
    betrayals: 0,
    isAI: false
  });

  const [globalLeaderboard, setGlobalLeaderboard] = useState<MetaProfile[]>([
    { uid: 'ai_claude_prime', name: 'AI_CLAUDE_PRIME', globalKarma: 98, sessionsPlayed: 15, betrayals: 0, isAI: true },
    { uid: 'ai_gemini_mira', name: 'AI_GEMINI_MIRA', globalKarma: 45, sessionsPlayed: 15, betrayals: 4, isAI: true },
    { uid: 'ai_grok_alpha', name: 'AI_GROK_ALPHA', globalKarma: 14, sessionsPlayed: 4, betrayals: 12, isAI: true },
    { uid: 'nicholai_madias_legacy', name: 'nicholai_madias', globalKarma: 88, sessionsPlayed: 24, betrayals: 0, isAI: false }
  ]);

  // Ensure current user is in leaderboard
  useEffect(() => {
    setGlobalLeaderboard(prev => {
      if (!prev.some(p => p.uid === currentUser.uid)) {
        return [...prev, currentUser].sort((a, b) => b.globalKarma - a.globalKarma);
      }
      return prev;
    });
  }, []);

  // Handle live updates when Google Auth profile binds
  const handleGoogleSignIn = (profile: { name: string; email: string }) => {
    // In production, sync this node securely with your Firebase database snapshot
    const verifiedProfile: MetaProfile = {
      uid: btoa(profile.email).substring(0, 12),
      name: profile.name,
      globalKarma: 75, // Verified accounts jump to higher default baseline trust
      sessionsPlayed: 1,
      betrayals: 0,
      isAI: false
    };
    setCurrentUser(verifiedProfile);
    
    // Inject or update user inside the live memory leaderboard state array
    setGlobalLeaderboard(prev => {
      // Remove placeholder guest if exists, or previous profile matching name
      let filtered = prev.filter(p => p.name !== initialUser && p.name !== profile.name);
      return [...filtered, verifiedProfile].sort((a, b) => b.globalKarma - a.globalKarma);
    });
  };

  // Adjust live karma dynamically based on gameplay actions
  const adjustKarma = (uid: string, delta: number, isBetrayal: boolean = false) => {
    setGlobalLeaderboard(prev => 
      prev.map(p => {
        if (p.uid === uid) {
          const newKarma = Math.max(0, Math.min(100, p.globalKarma + delta));
          return {
            ...p,
            globalKarma: newKarma,
            betrayals: isBetrayal ? p.betrayals + 1 : p.betrayals
          };
        }
        return p;
      }).sort((a, b) => b.globalKarma - a.globalKarma)
    );

    // If adjusting the current user, update their local state too
    if (uid === currentUser.uid) {
      setCurrentUser(prev => {
        const newKarma = Math.max(0, Math.min(100, prev.globalKarma + delta));
        return {
          ...prev,
          globalKarma: newKarma,
          betrayals: isBetrayal ? prev.betrayals + 1 : prev.betrayals
        };
      });
    }
  };

  return { currentUser, globalLeaderboard, handleGoogleSignIn, adjustKarma };
};
