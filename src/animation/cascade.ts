import type { Align } from '../schema/types';

export function cellDelay(
  rowIdx: number,
  colIdx: number,
  rowStaggerMs: number,
  cellStaggerMs: number
): number {
  return rowIdx * rowStaggerMs + colIdx * cellStaggerMs;
}

export function padValue(value: string, width: number, align: Align): string {
  const v = value.toUpperCase();
  if (v.length >= width) return v.slice(0, width);
  const pad = width - v.length;
  if (align === 'left') return v + ' '.repeat(pad);
  if (align === 'right') return ' '.repeat(pad) + v;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return ' '.repeat(left) + v + ' '.repeat(right);
}
