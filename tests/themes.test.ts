import { describe, expect, it } from 'vitest';
import { THEMES, resolvePalette } from '../src/theme/themes';

describe('THEMES', () => {
  it('has the three baked themes', () => {
    expect(Object.keys(THEMES).sort()).toEqual(['amber', 'green', 'solari']);
  });

  it('each theme provides all palette fields', () => {
    for (const palette of Object.values(THEMES)) {
      expect(palette.flapBg).toBeTruthy();
      expect(palette.flapFg).toBeTruthy();
      expect(palette.flapDivider).toBeTruthy();
      expect(palette.flapShadow).toBeTruthy();
      expect(palette.pageBg).toBeTruthy();
      expect(palette.pageFg).toBeTruthy();
      expect(palette.accent).toBeTruthy();
    }
  });
});

describe('resolvePalette', () => {
  it('returns the baked palette for solari/amber/green', () => {
    expect(resolvePalette('solari', null)).toBe(THEMES.solari);
    expect(resolvePalette('amber', null)).toBe(THEMES.amber);
    expect(resolvePalette('green', null)).toBe(THEMES.green);
  });

  it('returns custom when provided', () => {
    const custom = { ...THEMES.solari, flapFg: '#ff00ff' };
    expect(resolvePalette('custom', custom)).toBe(custom);
  });

  it('falls back to solari when custom is null', () => {
    expect(resolvePalette('custom', null)).toBe(THEMES.solari);
  });
});
