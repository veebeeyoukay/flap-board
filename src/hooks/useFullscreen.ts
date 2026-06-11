import { useCallback, useEffect, useState } from 'react';

export interface FullscreenAPI {
  isFullscreen: boolean;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
  toggle: () => Promise<void>;
}

function isSupported(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof document.documentElement.requestFullscreen === 'function'
  );
}

export function useFullscreen(): FullscreenAPI {
  const [isFullscreen, setIsFullscreen] = useState(() =>
    typeof document !== 'undefined' && document.fullscreenElement !== null
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handler = (): void => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const enter = useCallback(async (): Promise<void> => {
    if (!isSupported()) return;
    await document.documentElement.requestFullscreen();
  }, []);

  const exit = useCallback(async (): Promise<void> => {
    if (!isSupported() || document.fullscreenElement === null) return;
    await document.exitFullscreen();
  }, []);

  const toggle = useCallback(async (): Promise<void> => {
    if (document.fullscreenElement !== null) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }, []);

  return { isFullscreen, enter, exit, toggle };
}
