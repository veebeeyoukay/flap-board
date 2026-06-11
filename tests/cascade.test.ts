import { describe, expect, it } from 'vitest';
import { cellDelay, padValue } from '../src/animation/cascade';

describe('cellDelay', () => {
  it('row 0 col 0 = 0', () => {
    expect(cellDelay(0, 0, 50, 10)).toBe(0);
  });

  it('row 1 col 0 = rowStagger', () => {
    expect(cellDelay(1, 0, 50, 10)).toBe(50);
  });

  it('row 0 col 3 = 3 * cellStagger', () => {
    expect(cellDelay(0, 3, 50, 10)).toBe(30);
  });

  it('row 2 col 5 = 2*rowStagger + 5*cellStagger', () => {
    expect(cellDelay(2, 5, 50, 10)).toBe(150);
  });
});

describe('padValue', () => {
  it('left pads to width', () => {
    expect(padValue('AB', 5, 'left')).toBe('AB   ');
  });

  it('right pads to width', () => {
    expect(padValue('AB', 5, 'right')).toBe('   AB');
  });

  it('center pads to width', () => {
    expect(padValue('AB', 6, 'center')).toBe('  AB  ');
  });

  it('center pads odd width with extra space on right', () => {
    expect(padValue('AB', 5, 'center')).toBe(' AB  ');
  });

  it('uppercases input', () => {
    expect(padValue('ab', 4, 'left')).toBe('AB  ');
  });

  it('truncates if too long', () => {
    expect(padValue('ABCDEF', 3, 'left')).toBe('ABC');
  });
});
