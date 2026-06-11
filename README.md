# flap-board

A configurable old-school split-flap display board (Solari-style) for the web.
Content-agnostic — flights, task statuses, sales numbers, countdowns, messages
all work from the same engine. Installable as a PWA; Capacitor wrap for
iOS/Android is documented in `docs/CAPACITOR.md`.

> Status: **v0.1.0** — all 7 slices from the original brief shipped.

## Quick start

```bash
pnpm install
pnpm dev          # → http://localhost:5173/  (also bound to your LAN IP)
```

Open the URL in any browser. The board loads the demo flights config on first
visit. Click **Settings** to customize columns, rows, themes, polling URL,
sound, and to import/export JSON.

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Vite dev server (HMR, host `0.0.0.0:5173`) |
| `pnpm build` | TypeScript check + production build → `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest (single run) |
| `pnpm test:watch` | Vitest watch |

## Features

- 12 × 40 grid (configurable up to ~24 × 80) of authentic 3D split-flap cells
- Char cycling through interim glyphs to target (CSS transforms only)
- Left-to-right, row-by-row staggered cascade on data updates
- Three baked themes (Classic Solari · Amber CRT · Green CRT) + custom palette
- Per-column color rules (e.g., `STATUS` → `ON TIME` = green)
- Font auto-scales to viewport (320 px to 1920 px+)
- Honors `prefers-reduced-motion` (skips cascade, jumps to final char)
- Optional mechanical clack sound on flips (off by default)
- Fullscreen kiosk mode with cursor auto-hide (3 s)
- Installable as a PWA — works offline (app shell + last polled snapshot)
- `?sandbox=1` route for the single-cell flap sandbox

## Data sources

1. **Manual entry** in the Settings panel (columns + rows + values)
2. **JSON import** of a saved config (validates `schemaVersion`)
3. **URL polling** — fetch a JSON URL on a configurable interval
   - Optional `Authorization` header for private feeds
   - Optional CORS proxy URL prefix
   - Silent error indicator (corner LED) with last-OK timestamp on hover

See [`docs/SCHEMA.md`](docs/SCHEMA.md) for the full JSON config schema and the
expected poll payload shape.

## Capacitor wrap (Phase 2)

This codebase is built to be wrapped in Capacitor for iOS/Android distribution
without app-code changes. Touchpoints, swap-in instructions, and known
caveats are in [`docs/CAPACITOR.md`](docs/CAPACITOR.md).

## Tech stack

React 19 · TypeScript strict · Vite 8 · Zustand · Zod · vite-plugin-pwa
(Workbox) · Vitest

## Repo layout

```
src/
  components/        FlapCell, FlapBoard, FlapRow, BoardHeader,
                     SettingsPanel, DataSourceEditor, KioskButton,
                     PollingIndicator
  animation/         flapSequence + cascade helpers
  audio/             clack pool (shipped flap.wav)
  hooks/             useFullscreen, useAutoHideCursor, useAutoFitFont,
                     usePoller
  polling/           Poller class, parser, snapshot + mergeRows
  schema/            Zod schemas + TS types + demo config + migrate stub
  state/             Zustand store + persistence
  storage/           Storage interface + localStorage impl
                     (Capacitor swap point)
  styles/            tokens, reset, flap, board, settings, polling, kiosk
  theme/             baked + custom palettes, applyTheme
  Sandbox.tsx        single-cell sandbox at ?sandbox=1
public/
  pwa-icons/         192 + 512 + apple-touch PNGs
  sounds/flap.wav    shipped clack (Python-synthesized — swap for a
                     recorded sample before public release)
tests/               Vitest unit specs (50 tests across 8 files)
docs/
  PROJECT-BRIEF.md   original brief
  SCHEMA.md          JSON config schema reference
  CAPACITOR.md       Phase 2 wrap guide
  DECISIONS.md       locked design decisions log
AGENTS.md            DOX root contract — read before editing
```

## License

No license shipped with v0.1.0. Add before public release.
