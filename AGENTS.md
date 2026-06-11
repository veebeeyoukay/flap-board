# flap-board — AGENTS.md

Root contract for the flap-board project (DOX root). Read this and every
parent `AGENTS.md` above this file before editing.

## Purpose

A configurable, content-agnostic split-flap display board (Solari-style).
Web app first (React + Vite + PWA), Capacitor wrap planned for Phase 2.

## Ownership

| Role | Owner |
|---|---|
| Sponsor | Vikas Bhatia (vikas@itsjen.ai) |
| Build (current) | plan-mm-06 / Claude session — overrode the dev-mm-04 default for this slice |
| Security review | AKCF (akcf-mm-13) — `cc:akcf` Vikunja label |
| Coordination | plan-mm-06 — SR + Vikunja + GitHub Issue |

## Local Contracts

- **Binding brief:** [GitHub Issue #1](https://github.com/veebeeyoukay/flap-board/issues/1)
  is canonical. Mirror in this repo: `docs/PROJECT-BRIEF.md`.
- **Tracking:**
  - Service Request: `SR-2026-06-10-001` on plan-mm-06 `ops.support_requests`
  - Vikunja task: id 89 (project 34 = `HitSquad Fleet > 04-Projects > flap-board`)
  - Activity log: per Doctrine §5
- **Decisions locked (Vikas 2026-06-10):**
  1. Build on whichever machine the working tree resides
  2. Clack sound = shipped audio sample (real WAV/MP3, not synthesized)
  3. URL polling = plain fetch + configurable Authorization header + optional CORS proxy URL
  4. Service worker = app shell + last polled snapshot

## Work Guidance

- **TypeScript strict, zero `any`.** Lint must pass on every commit.
- **No heavy animation libraries.** CSS transforms and React state only.
- **Persistence goes through `src/storage/index.ts`** — never call
  `localStorage` directly from app code. Slice 1 ships `LocalStorageImpl`;
  Phase 2 swaps in a Capacitor Preferences implementation with the same
  interface.
- **State management:** Zustand with `subscribeWithSelector`. Do NOT use
  Zustand's `persist` middleware — persistence belongs to the storage layer
  so the Capacitor swap stays clean.
- **Validation at the boundary:** import/export of board configs goes through
  Zod schemas in `src/schema/` (introduced in slice 3).
- **Schema versioning:** every persisted config carries
  `schemaVersion: "flap-board.v1"`. Imports with an unknown major version are
  refused with a clear error.
- **Theming:** CSS custom properties only. Three baked themes + custom palette
  — switching theme must not remount any cell.
- **Accessibility:** honor `prefers-reduced-motion` (cascade skipped, characters
  jump to final). Settings panel keyboard-accessible.
- **Per-slice commits:** each of the 7 slices in the brief lands as a single
  commit (or PR) reviewed by Vikas. Don't bundle slices.

## Verification

Before committing:

- `pnpm lint` — zero ESLint errors
- `pnpm build` — zero TypeScript errors, zero warnings
- `pnpm test` — all Vitest specs green

Before declaring a slice done:

- The slice's BDD acceptance criteria (in `docs/PROJECT-BRIEF.md` and Issue #1)
  all pass
- Vikas has confirmed in-browser behavior matches the criteria

## Child DOX Index

(None yet — add child `AGENTS.md` files as folders become durable boundaries.)
