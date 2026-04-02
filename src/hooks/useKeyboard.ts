import { useEffect, useRef } from 'react';

interface KeyboardHandlers {
  onMoveLeft:  () => void;
  onMoveRight: () => void;
  onSoftDrop:  () => void;
  onHardDrop:  () => void;
  onRotateCW:  () => void;
  onRotateCCW: () => void;
  onHold:      () => void;
  onPause:     () => void;
}

const DAS_DELAY = 167;
const ARR_DELAY = 33;

export function useKeyboard(handlers: KeyboardHandlers, active: boolean) {
  const handlersRef = useRef(handlers);
  useEffect(() => { handlersRef.current = handlers; }, [handlers]);

  useEffect(() => {
    if (!active) return;

    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    const intervals = new Map<string, ReturnType<typeof setInterval>>();

    const keyMap: Record<string, () => void> = {
      ArrowLeft:  () => handlersRef.current.onMoveLeft(),
      ArrowRight: () => handlersRef.current.onMoveRight(),
      ArrowDown:  () => handlersRef.current.onSoftDrop(),
      ArrowUp:    () => handlersRef.current.onRotateCW(),
      KeyX:       () => handlersRef.current.onRotateCW(),
      KeyZ:       () => handlersRef.current.onRotateCCW(),
      Space:      () => handlersRef.current.onHardDrop(),
      KeyC:       () => handlersRef.current.onHold(),
      ShiftLeft:  () => handlersRef.current.onHold(),
      ShiftRight: () => handlersRef.current.onHold(),
      KeyP:       () => handlersRef.current.onPause(),
      Escape:     () => handlersRef.current.onPause(),
    };

    const repeatableKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown']);

    function stopRepeat(code: string) {
      clearTimeout(timers.get(code));
      timers.delete(code);
      clearInterval(intervals.get(code));
      intervals.delete(code);
    }

    function startRepeat(code: string, action: () => void) {
      action();
      if (!repeatableKeys.has(code)) return;
      const t = setTimeout(() => {
        const iv = setInterval(action, ARR_DELAY);
        intervals.set(code, iv);
      }, DAS_DELAY);
      timers.set(code, t);
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const action = keyMap[e.code];
      if (action) {
        e.preventDefault();
        startRepeat(e.code, action);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      stopRepeat(e.code);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      timers.forEach((t) => clearTimeout(t));
      intervals.forEach((iv) => clearInterval(iv));
    };
  }, [active]);
}
