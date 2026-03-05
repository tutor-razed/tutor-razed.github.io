import { useCallback, useMemo, useRef } from "react";

export const useAudioFx = (enabled: boolean): { beep: () => void; keyTick: () => void } => {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, [enabled]);

  const play = useCallback(
    (freq: number, duration: number, gainValue: number) => {
      const ctx = ensure();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.value = gainValue;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    },
    [ensure],
  );

  return useMemo(
    () => ({
      beep: () => play(620, 0.06, 0.015),
      keyTick: () => play(380, 0.02, 0.01),
    }),
    [play],
  );
};
