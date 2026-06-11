# flap-board

Configurable old-school split-flap display board (Solari-style). Web app first,
Capacitor mobile wrap planned for Phase 2. Content-agnostic — flights, task
statuses, sales numbers, countdowns, messages.

> Status: **slice 1 of 7** — isolated FlapCell with 3D split-flap animation on
> a sandbox page. See
> [GitHub Issue #1](https://github.com/veebeeyoukay/flap-board/issues/1) for
> the binding brief and the full plan.

## Quick start

```bash
pnpm install
pnpm dev
```

Dev server prints both `http://localhost:5173/` and a LAN URL (the server binds
to `0.0.0.0`). Click "Flip to Z" on the sandbox page to see the cell cycle.

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Vite dev server with HMR, host=0.0.0.0 |
| `pnpm build` | TypeScript check + production build |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest (single run) |
| `pnpm test:watch` | Vitest watch mode |

## Tech stack

React 19 · TypeScript (strict) · Vite 8 · Zustand · Vitest

## Repo layout (slice 1)

```
src/
  components/FlapCell.tsx       # 3D split-flap primitive
  animation/flapSequence.ts     # char-cycle generator
  storage/                      # abstraction — Capacitor swap point
  state/store.ts                # Zustand store
  styles/                       # tokens + flap animation + reset
  Sandbox.tsx                   # slice 1 demo page
tests/                          # Vitest unit specs
docs/                           # project brief, schema, Capacitor notes
AGENTS.md                       # DOX root contract — read before editing
```

## Capacitor wrap (Phase 2)

Touchpoints documented in `docs/PROJECT-BRIEF.md` §8. Storage is already behind
an interface; service worker is web-only (offline snapshot also writes to
storage); fullscreen uses `requestFullscreen()` which Capacitor supports.

## Contributing / DOX

Read `AGENTS.md` at the repo root before editing — it's the binding contract.
Per-slice acceptance criteria are in
[Issue #1](https://github.com/veebeeyoukay/flap-board/issues/1).
