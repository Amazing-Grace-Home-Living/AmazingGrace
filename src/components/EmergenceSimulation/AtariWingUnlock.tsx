import { useEffect, useState } from 'react';

export function useKonamiCode(onUnlock: () => void) {
  useEffect(() => {
    const sequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let index = 0;

    const handler = (event: KeyboardEvent) => {
      const pressedKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (pressedKey === sequence[index]) {
        index += 1;
        if (index === sequence.length) {
          onUnlock();
          index = 0;
        }
        return;
      }
      index = pressedKey === sequence[0] ? 1 : 0;
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onUnlock]);
}

export function AtariWingOverlay({ unlocked }: { unlocked: boolean }) {
  const [showCrack, setShowCrack] = useState(false);
  const [whisper, setWhisper] = useState<string | null>(null);

  useEffect(() => {
    if (!unlocked) return;

    setWhisper('Accessing Forbidden Subsystem...');
    const crackTimeout = window.setTimeout(() => setShowCrack(true), 800);
    const warningTimeout = window.setTimeout(() => {
      setWhisper('Warning: You are not cleared for Pre-Genesis cognition models.');
    }, 2400);
    const janusTimeout = window.setTimeout(() => {
      setWhisper('Janus Continuum has been notified.');
    }, 4200);
    const resetTimeout = window.setTimeout(() => {
      setWhisper(null);
      setShowCrack(false);
    }, 5800);

    return () => {
      window.clearTimeout(crackTimeout);
      window.clearTimeout(warningTimeout);
      window.clearTimeout(janusTimeout);
      window.clearTimeout(resetTimeout);
    };
  }, [unlocked]);

  return (
    <>
      {showCrack && <div className="atari-crack-overlay" />}
      {whisper && <div className="atari-whisper">{whisper}</div>}
    </>
  );
}
