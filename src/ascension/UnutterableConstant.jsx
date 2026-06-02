import React, { useEffect, useState } from 'react';

export default function UnutterableConstant() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="unutterable-constant" style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3000,
      cursor: 'none'
    }}>
      <div style={{
        width: '4px',
        height: '4px',
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 0 20px #fff, 0 0 40px #fff',
        opacity: revealed ? 1 : 0,
        transition: 'opacity 10s ease-in'
      }} />
      
      {revealed && (
        <div style={{
          position: 'absolute',
          bottom: '10%',
          color: 'rgba(255,255,255,0.1)',
          fontSize: '0.7rem',
          letterSpacing: '1em',
          textTransform: 'uppercase'
        }}>
          The Constant
        </div>
      )}
    </div>
  );
}
