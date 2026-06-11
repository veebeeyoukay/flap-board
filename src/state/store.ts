import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { DEMO_CONFIG } from '../schema/demo';
import type {
  BoardConfig,
  Column,
  PollingConfig,
  Row,
  ThemeKey,
  ThemePalette,
} from '../schema/types';

export interface PollingStatus {
  lastOkAt: number | null;
  lastErrorAt: number | null;
  lastErrorMessage: string | null;
}

interface BoardStore {
  config: BoardConfig;
  pollingStatus: PollingStatus;

  setConfig: (c: BoardConfig) => void;
  setTitle: (t: string) => void;
  setShowHeader: (b: boolean) => void;

  addColumn: () => void;
  updateColumn: (idx: number, patch: Partial<Column>) => void;
  removeColumn: (idx: number) => void;

  addRow: () => void;
  removeRow: (rowId: string) => void;
  updateRowValue: (rowId: string, columnKey: string, value: string) => void;
  setRows: (rows: Row[]) => void;

  setTheme: (theme: ThemeKey) => void;
  setCustomTheme: (palette: ThemePalette) => void;

  setFlapMs: (ms: number) => void;
  setCascadeStaggerMs: (ms: number) => void;

  setPolling: (p: PollingConfig) => void;
  setPollingStatus: (s: Partial<PollingStatus>) => void;

  setSoundEnabled: (b: boolean) => void;
}

function newColumnKey(existing: Column[]): string {
  let n = existing.length + 1;
  while (existing.some((c) => c.key === `col${n}`)) n++;
  return `col${n}`;
}

function newRowId(existing: { id: string }[]): string {
  let n = existing.length + 1;
  while (existing.some((r) => r.id === `r${n}`)) n++;
  return `r${n}`;
}

export const useBoardStore = create<BoardStore>()(
  subscribeWithSelector((set) => ({
    config: DEMO_CONFIG,
    pollingStatus: {
      lastOkAt: null,
      lastErrorAt: null,
      lastErrorMessage: null,
    },

    setConfig: (config) => set({ config }),
    setTitle: (title) => set((s) => ({ config: { ...s.config, title } })),
    setShowHeader: (showHeader) =>
      set((s) => ({ config: { ...s.config, showHeader } })),

    addColumn: () =>
      set((s) => {
        const key = newColumnKey(s.config.columns);
        const newCol: Column = {
          key,
          label: key.toUpperCase(),
          widthChars: 8,
          align: 'left',
        };
        return {
          config: { ...s.config, columns: [...s.config.columns, newCol] },
        };
      }),
    updateColumn: (idx, patch) =>
      set((s) => ({
        config: {
          ...s.config,
          columns: s.config.columns.map((c, i) =>
            i === idx ? { ...c, ...patch } : c
          ),
        },
      })),
    removeColumn: (idx) =>
      set((s) => {
        const col = s.config.columns[idx];
        if (col === undefined) return s;
        const removedKey = col.key;
        return {
          config: {
            ...s.config,
            columns: s.config.columns.filter((_, i) => i !== idx),
            rows: s.config.rows.map((r) => {
              const values = { ...r.values };
              delete values[removedKey];
              return { ...r, values };
            }),
          },
        };
      }),

    addRow: () =>
      set((s) => {
        const id = newRowId(s.config.rows);
        const values: Record<string, string> = {};
        s.config.columns.forEach((c) => {
          values[c.key] = '';
        });
        return {
          config: { ...s.config, rows: [...s.config.rows, { id, values }] },
        };
      }),
    removeRow: (rowId) =>
      set((s) => ({
        config: {
          ...s.config,
          rows: s.config.rows.filter((r) => r.id !== rowId),
        },
      })),
    updateRowValue: (rowId, columnKey, value) =>
      set((s) => ({
        config: {
          ...s.config,
          rows: s.config.rows.map((r) =>
            r.id === rowId
              ? { ...r, values: { ...r.values, [columnKey]: value } }
              : r
          ),
        },
      })),
    setRows: (rows) => set((s) => ({ config: { ...s.config, rows } })),

    setTheme: (theme) => set((s) => ({ config: { ...s.config, theme } })),
    setCustomTheme: (palette) =>
      set((s) => ({ config: { ...s.config, customTheme: palette } })),

    setFlapMs: (ms) => set((s) => ({ config: { ...s.config, flapMs: ms } })),
    setCascadeStaggerMs: (ms) =>
      set((s) => ({ config: { ...s.config, cascadeStaggerMs: ms } })),

    setPolling: (polling) =>
      set((s) => ({ config: { ...s.config, polling } })),
    setPollingStatus: (patch) =>
      set((s) => ({ pollingStatus: { ...s.pollingStatus, ...patch } })),

    setSoundEnabled: (b) =>
      set((s) => ({ config: { ...s.config, sound: { enabled: b } } })),
  }))
);
