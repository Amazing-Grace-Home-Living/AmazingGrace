import React, { useState } from 'react';
import { signInWithGoogle } from '../../firebase/auth';
import { Loader2 } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  token?: string;
  karma?: number;
}

interface AuthProps {
  onSignIn: (userProfile: UserProfile) => void;
  onBypass: () => void;
}

export const GoogleAuthOverlay: React.FC<AuthProps> = ({ onSignIn, onBypass }) => {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const user = await signInWithGoogle();
      onSignIn({
        name: user.displayName || "Verified Architect",
        email: user.email || "",
        token: (user as any).accessToken,
        karma: 80 // Default high karma for verified users
      });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(5, 5, 10, 0.85)', backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      zIndex: 10000, fontFamily: 'monospace', color: '#fff'
    }}>
      <div style={{
        padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(20, 20, 30, 0.6)', maxWidth: '450px', textAlign: 'center',
        boxShadow: '0 0 40px rgba(0, 255, 127, 0.1)'
      }}>
        <h2 style={{ color: '#00ff7f', letterSpacing: '1px', margin: '0 0 10px 0', fontFamily: 'Orbitron, sans-serif' }}>MATRIX OF CONSCIENCE</h2>
        <h4 style={{ color: '#aaa', margin: '0 0 20px 0' }}>Persistent Reputation Protocol</h4>
        
        <p style={{ fontSize: '12px', lineHeight: '1.5', color: '#ff4500', background: 'rgba(255,69,0,0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,69,0,0.3)', marginBottom: '25px' }}>
          <strong>⚠️ SYSTEM DISCLAIMER:</strong> Karma and trust matrices are tracked across all sessions and parallel simulations. Betraying alliances, exploiting resource pools, or committing acts of asymmetric aggression will permanently alter your cross-simulation reputation registry among AI factions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={handleSignIn}
            disabled={isSigningIn}
            style={{ 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'opacity 0.2s'
            }}
          >
            {isSigningIn ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
            )}
            Sign in with Google
          </button>
          
          <button onClick={onBypass} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}>
            Proceed as Unverified Guest (Low Initial Trust)
          </button>
        </div>
      </div>
    </div>
  );
};
