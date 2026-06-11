import type { ThemePalette } from '../schema/types';

export function applyTheme(
  palette: ThemePalette,
  target: HTMLElement = document.documentElement
): void {
  target.style.setProperty('--flap-bg', palette.flapBg);
  target.style.setProperty('--flap-fg', palette.flapFg);
  target.style.setProperty('--flap-divider', palette.flapDivider);
  target.style.setProperty('--flap-shadow', palette.flapShadow);
  target.style.setProperty('--page-bg', palette.pageBg);
  target.style.setProperty('--page-fg', palette.pageFg);
  target.style.setProperty('--accent', palette.accent);
}
