import React, { useEffect } from 'react';

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
  useEffect(() => {
    // Initialize Google Auth client global hook
    if ((window as any).google) {
      (window as any).google.accounts.id.initialize({
        // In a real production app, use the actual Client ID
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: (response: any) => {
          try {
            // Decode the JWT token to extract the user's cross-session identity
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            
            onSignIn({
              name: payload.name || "Verified Architect",
              email: payload.email,
              token: response.credential,
              karma: 80 // Default high karma for verified users
            });
          } catch (e) {
            console.error("Failed to decode JWT:", e);
            onBypass();
          }
        }
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "filled_black", size: "large", text: "signin_with" }
      );
    }
  }, [onSignIn, onBypass]);

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
          <div id="google-signin-btn" style={{ minHeight: '40px' }}>
            {!(window as any).google && (
               <span style={{color: '#888', fontSize: '12px'}}>Google Identity Services loading...</span>
            )}
          </div>
          <button onClick={onBypass} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}>
            Proceed as Unverified Guest (Low Initial Trust)
          </button>
        </div>
      </div>
    </div>
  );
};
