import { useEffect } from 'react';

const DEFAULT_DELAY_MS = 3000;

export function useAutoHideCursor(
  active: boolean,
  delayMs: number = DEFAULT_DELAY_MS
): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    let timer: number | null = null;

    const hide = (): void => {
      document.body.style.cursor = 'none';
    };
    const show = (): void => {
      document.body.style.cursor = '';
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(hide, delayMs);
    };

    show();
    document.addEventListener('mousemove', show);
    document.addEventListener('keydown', show);

    return () => {
      document.removeEventListener('mousemove', show);
      document.removeEventListener('keydown', show);
      if (timer !== null) window.clearTimeout(timer);
      document.body.style.cursor = '';
    };
  }, [active, delayMs]);
}
