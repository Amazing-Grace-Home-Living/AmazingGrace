import React from 'react';
import { MetaProfile } from './useMatrixReputation';

interface LeaderboardProps {
  profiles: MetaProfile[];
  currentUid: string;
}

export const KarmaLeaderboard: React.FC<LeaderboardProps> = ({ profiles, currentUid }) => {
  return (
    <div style={{
      position: 'absolute', top: '20px', right: '20px',
      width: '320px', maxHeight: '400px', padding: '15px',
      borderRadius: '12px', background: 'rgba(10, 10, 20, 0.65)',
      backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      fontFamily: 'monospace', color: '#fff', zIndex: 999,
      display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto'
    }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '8px' }}>
        <h4 style={{ margin: 0, color: '#00ff7f', letterSpacing: '1px' }}>🌐 GLOBAL KARMA REGISTRY</h4>
        <span style={{ fontSize: '10px', color: '#888' }}>Cross-Session Trust Tracking</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {profiles.map((profile, idx) => {
          const isSelf = profile.uid === currentUid;
          // Color coding based on trust tiers (Claude High-Trust Green vs Grok Low-Trust Red)
          const karmaColor = profile.globalKarma > 70 ? '#00ff7f' : profile.globalKarma > 40 ? '#ffaa00' : '#ff4500';
          
          return (
            <div key={profile.uid} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 8px', borderRadius: '6px',
              background: isSelf ? 'rgba(0, 255, 127, 0.1)' : 'rgba(255,255,255,0.03)',
              border: isSelf ? '1px solid rgba(0, 255, 127, 0.3)' : '1px solid transparent',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#666', width: '15px' }}>#{idx + 1}</span>
                <span style={{ 
                  fontWeight: isSelf ? 'bold' : 'normal',
                  color: profile.isAI ? '#1e90ff' : '#ffffff' 
                }}>
                  {profile.name} {profile.isAI ? '🤖' : '👤'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {profile.betrayals > 0 && (
                  <span style={{ color: '#ff4500', fontSize: '9px', background: 'rgba(255,69,0,0.15)', padding: '1px 4px', borderRadius: '3px' }}>
                    {profile.betrayals}B
                  </span>
                )}
                <span style={{ color: karmaColor, fontWeight: 'bold' }}>
                  {profile.globalKarma}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
