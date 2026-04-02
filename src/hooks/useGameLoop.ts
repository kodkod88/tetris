import { useEffect, useRef } from 'react';

export function useGameLoop(callback: (deltaMs: number) => void, active: boolean) {
  const lastTimeRef = useRef<number | null>(null);
  const rafRef      = useRef<number>(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      return;
    }

    function frame(timestamp: number) {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const delta = Math.min(timestamp - lastTimeRef.current, 100);
      lastTimeRef.current = timestamp;
      callbackRef.current(delta);
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);
}
