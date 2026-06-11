import { describe, it, expect } from 'vitest';
import { parsePollResponse } from '../src/polling/parser';

describe('parsePollResponse', () => {
  it('accepts { rows: [...] } shape', () => {
    const data = { rows: [{ id: 'r1', values: { col: 'val' } }] };
    expect(parsePollResponse(data)).toEqual(data.rows);
  });

  it('accepts bare array shape', () => {
    const data = [{ id: 'r1', values: { col: 'val' } }];
    expect(parsePollResponse(data)).toEqual(data);
  });

  it('throws on missing rows field', () => {
    expect(() => parsePollResponse({ wrong: 'field' })).toThrow();
  });

  it('throws on non-array rows', () => {
    expect(() => parsePollResponse({ rows: 'not-an-array' })).toThrow();
  });

  it('throws on null', () => {
    expect(() => parsePollResponse(null)).toThrow();
  });

  it('throws when a row is missing id', () => {
    expect(() => parsePollResponse([{ values: { x: 'y' } }])).toThrow();
  });
});
