import type { ThemeKey, ThemePalette } from '../schema/types';

export const THEMES: Record<Exclude<ThemeKey, 'custom'>, ThemePalette> = {
  solari: {
    flapBg: '#1a1a1a',
    flapFg: '#f4f4ef',
    flapDivider: '#050505',
    flapShadow: 'rgba(0, 0, 0, 0.6)',
    pageBg: '#0c0c0d',
    pageFg: '#f4f4ef',
    accent: '#5fa5b0',
  },
  amber: {
    flapBg: '#0a0500',
    flapFg: '#ffb000',
    flapDivider: '#000000',
    flapShadow: 'rgba(255, 176, 0, 0.18)',
    pageBg: '#0a0500',
    pageFg: '#ffb000',
    accent: '#ffd24a',
  },
  green: {
    flapBg: '#001100',
    flapFg: '#00ff88',
    flapDivider: '#000000',
    flapShadow: 'rgba(0, 255, 136, 0.15)',
    pageBg: '#001100',
    pageFg: '#00ff88',
    accent: '#88ff00',
  },
};

export function resolvePalette(
  theme: ThemeKey,
  custom: ThemePalette | null
): ThemePalette {
  if (theme === 'custom') return custom ?? THEMES.solari;
  return THEMES[theme];
}
