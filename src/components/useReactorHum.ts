import { useEffect, useRef } from "react";

export function useReactorHum(active: boolean, baseFreq = 60) {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!active) {
      oscRef.current?.stop();
      ctxRef.current?.close();
      ctxRef.current = null;
      return;
    }

    // Lazy init on user gesture to avoid autoplay block
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = baseFreq;
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // slow wobble

    lfoGain.gain.value = 2; // ±2Hz drift
    gain.gain.value = 0.04; // very quiet

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    lfo.start();

    ctxRef.current = ctx;
    oscRef.current = osc;
    gainRef.current = gain;

    return () => {
      try {
        osc.stop();
        lfo.stop();
        ctx.close();
      } catch (e) {}
    };
  }, [active, baseFreq]);
}
