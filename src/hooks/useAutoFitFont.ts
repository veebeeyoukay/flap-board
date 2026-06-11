import { useEffect } from 'react';
import type { RefObject } from 'react';

const ASPECT_RATIO = 1.4;
const MIN_CELL_W = 14;
const PADDING_PX = 32;

export function useAutoFitFont(
  ref: RefObject<HTMLElement | null>,
  totalCols: number,
  totalRows: number
): void {
  useEffect(() => {
    const fit = (): void => {
      const el = ref.current;
      if (el === null) return;
      const availW = window.innerWidth - PADDING_PX;
      const availH = window.innerHeight - PADDING_PX;
      const cellWFromWidth = Math.floor(availW / totalCols);
      const cellHFromHeight = Math.floor(availH / totalRows);
      const cellWFromHeight = Math.floor(cellHFromHeight / ASPECT_RATIO);
      const cellW = Math.max(
        MIN_CELL_W,
        Math.min(cellWFromWidth, cellWFromHeight)
      );
      const cellH = Math.floor(cellW * ASPECT_RATIO);
      el.style.setProperty('--cell-w', `${cellW}px`);
      el.style.setProperty('--cell-h', `${cellH}px`);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [ref, totalCols, totalRows]);
}
