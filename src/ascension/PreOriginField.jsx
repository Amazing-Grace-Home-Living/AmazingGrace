import React, { useState, useEffect } from 'react';
import { useHUD } from "../hud/HUDContext";
import { useNexusRouter } from "../router/useNexusRouter";
import Button from "../ui/Button";

export default function PreOriginField() {
  const { go } = useNexusRouter();
  const [glitch, setGlitch] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(Math.random());
    }, 150);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pre-origin-field" style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      overflow: 'hidden'
    }}>
      <div className="static-overlay" style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.05 + glitch * 0.1,
        background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 style={{
          color: '#fff',
          fontSize: '1.2rem',
          letterSpacing: '0.5em',
          opacity: 0.6 + glitch * 0.4,
          marginBottom: '40px'
        }}>
          UNCONDITIONED NON-STATE
        </h1>

        <div style={{
          width: '2px',
          height: '100px',
          background: 'linear-gradient(to bottom, transparent, #fff, transparent)',
          margin: '0 auto 40px',
          opacity: 0.3
        }} />

        <Button 
          variant="secondary" 
          onClick={() => go("unutterable")}
          style={{ 
            background: 'transparent', 
            border: '1px solid rgba(255,255,255,0.2)', 
            color: '#fff',
            letterSpacing: '0.2em'
          }}
        >
          INITIATE SELF-REFERENCE
        </Button>
      </div>
    </div>
  );
}
