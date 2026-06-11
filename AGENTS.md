# flap-board — AGENTS.md

Root contract for the flap-board project (DOX root). Read this and every
parent `AGENTS.md` above this file before editing.

## Purpose

A configurable, content-agnostic split-flap display board (Solari-style).
Web app first (React + Vite + PWA), Capacitor wrap planned for Phase 2.
See `docs/PROJECT-BRIEF.md` for the original brief and `docs/DECISIONS.md`
for the locked decisions log.

## Ownership

| Role | Owner |
|---|---|
| Sponsor | Vikas Bhatia (vikas@itsjen.ai) |
| Build | **dev-mm-04** (Q + Woz) — per standing directive |
| Security review | AKCF (akcf-mm-13) — `cc:akcf` Vikunja label |
| Coordination | plan-mm-06 — SR + Vikunja + GitHub Issue |

## Local Contracts

- **Binding brief:** [GitHub Issue #1](https://github.com/veebeeyoukay/flap-board/issues/1)
  is canonical. Mirror in this repo: `docs/PROJECT-BRIEF.md`.
- **Schema / docs:** `docs/SCHEMA.md`, `docs/CAPACITOR.md`,
  `docs/DECISIONS.md`.
- **Tracking:**
  - Service Request: `SR-2026-06-10-001` on plan-mm-06
    `ops.support_requests`
  - Vikunja task: id 89 (project 34 = `HitSquad Fleet > 04-Projects >
    flap-board`)
  - Activity log: per Doctrine §5

## Work Guidance

- **TypeScript strict, zero `any`.** Lint must pass on every commit.
- **No heavy animation libraries.** CSS transforms and React state only.
- **Persistence goes through `src/storage/index.ts`** — never call
  `localStorage` directly from app code. v0.1.0 ships `LocalStorageImpl`;
  Phase 2 swaps in a Capacitor Preferences implementation with the same
  interface (see `docs/CAPACITOR.md`).
- **State management:** Zustand with `subscribeWithSelector`. Do NOT use
  Zustand's `persist` middleware — persistence belongs to the storage
  layer so the Capacitor swap stays clean.
- **Validation at the boundary:** import/export of board configs goes
  through Zod schemas in `src/schema/boardConfig.ts`.
- **Schema versioning:** every persisted config carries
  `schemaVersion: "flap-board.v1"`. Imports with an unknown version are
  refused via `SchemaVersionError` with a clear message.
- **Theming:** CSS custom properties only. Switching theme must not
  remount any cell.
- **Accessibility:** honor `prefers-reduced-motion`. Settings panel
  keyboard-accessible (Escape closes drawer).
- **Per-slice commits:** historical — v0.1.0 shipped 7 slices, each a
  single commit. Future changes follow the same one-thing-per-commit rule.

## Verification

Before committing:

- `pnpm lint` — zero ESLint errors
- `pnpm build` — zero TypeScript errors, zero warnings
- `pnpm test` — all Vitest specs green

Before declaring a release done:

- The release's BDD acceptance criteria all pass
- Vikas has confirmed in-browser behavior matches the criteria
- README, SCHEMA, CAPACITOR, DECISIONS docs reflect the shipped code

## Child DOX Index

(None yet — add child `AGENTS.md` files as folders become durable
boundaries.)
