import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { DEMO_CONFIG } from '../schema/demo';
import type { BoardConfig, ThemeKey } from '../schema/types';

interface BoardStore {
  config: BoardConfig;
  setConfig: (c: BoardConfig) => void;
  updateRowValue: (rowId: string, columnKey: string, value: string) => void;
  setTheme: (theme: ThemeKey) => void;
  setFlapMs: (ms: number) => void;
  setCascadeStaggerMs: (ms: number) => void;
}

export const useBoardStore = create<BoardStore>()(
  subscribeWithSelector((set) => ({
    config: DEMO_CONFIG,
    setConfig: (config) => set({ config }),
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
    setTheme: (theme) => set((s) => ({ config: { ...s.config, theme } })),
    setFlapMs: (ms) => set((s) => ({ config: { ...s.config, flapMs: ms } })),
    setCascadeStaggerMs: (ms) =>
      set((s) => ({ config: { ...s.config, cascadeStaggerMs: ms } })),
  }))
);
