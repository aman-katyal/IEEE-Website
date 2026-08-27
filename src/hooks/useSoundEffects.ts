import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Synthesized Web Audio API Micro-Interactions Hook.
 * Produces subtle feedback chimes without external audio asset downloads.
 */
export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>(
    "ieee-sound-effects-enabled",
    false
  );

  const playTone = useCallback(
    (frequency: number, durationMs: number, type: OscillatorType = "sine") => {
      if (!soundEnabled || typeof window === "undefined") return;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + durationMs / 1000);
      } catch (e) {}
    },
    [soundEnabled]
  );

  const playClick = useCallback(() => {
    playTone(800, 30, "triangle");
  }, [playTone]);

  const playSuccess = useCallback(() => {
    playTone(1200, 80, "sine");
  }, [playTone]);

  const playToggle = useCallback(() => {
    playTone(600, 40, "sine");
  }, [playTone]);

  return {
    soundEnabled,
    setSoundEnabled,
    playClick,
    playSuccess,
    playToggle,
  };
}
