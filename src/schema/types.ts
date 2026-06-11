export type ThemeKey = 'solari' | 'amber' | 'green' | 'custom';

export type Align = 'left' | 'center' | 'right';

export interface ThemePalette {
  flapBg: string;
  flapFg: string;
  flapDivider: string;
  flapShadow: string;
  pageBg: string;
  pageFg: string;
  accent: string;
}

export interface Column {
  key: string;
  label: string;
  widthChars: number;
  align: Align;
}

export interface Row {
  id: string;
  values: Record<string, string>;
}

export interface BoardConfig {
  schemaVersion: 'flap-board.v1';
  title: string;
  showHeader: boolean;
  columns: Column[];
  rows: Row[];
  theme: ThemeKey;
  customTheme: ThemePalette | null;
  cascadeStaggerMs: number;
  flapMs: number;
}
