import { describe, expect, it } from 'vitest';
import {
  flipSequence,
  nextChar,
  FLAP_CHARS,
  isFlapChar,
} from '../src/animation/flapSequence';

describe('flapSequence', () => {
  it('returns empty when from === to', () => {
    expect(flipSequence('A', 'A')).toEqual([]);
  });

  it('cycles forward by one step', () => {
    expect(flipSequence('A', 'B')).toEqual(['B']);
  });

  it('cycles forward through several steps', () => {
    expect(flipSequence('A', 'D')).toEqual(['B', 'C', 'D']);
  });

  it('wraps from the last char back to the first', () => {
    const last = FLAP_CHARS[FLAP_CHARS.length - 1]!;
    const seq = flipSequence(last, FLAP_CHARS[0]!);
    expect(seq).toEqual([FLAP_CHARS[0]]);
  });

  it('cycles through the full alphabet when target requires wrap', () => {
    const seq = flipSequence('Z', 'A');
    expect(seq[seq.length - 1]).toBe('A');
    expect(seq.length).toBeLessThan(FLAP_CHARS.length);
  });

  it('snaps to target if either char is unsupported', () => {
    expect(flipSequence('A', 'é')).toEqual(['é']);
    expect(flipSequence('é', 'A')).toEqual(['A']);
  });

  it('isFlapChar agrees with the FLAP_CHARS table', () => {
    expect(isFlapChar('A')).toBe(true);
    expect(isFlapChar('0')).toBe(true);
    expect(isFlapChar(' ')).toBe(true);
    expect(isFlapChar('é')).toBe(false);
    expect(isFlapChar('!')).toBe(false);
  });

  it('nextChar wraps around', () => {
    const last = FLAP_CHARS[FLAP_CHARS.length - 1]!;
    expect(nextChar(last)).toBe(FLAP_CHARS[0]);
  });
});
