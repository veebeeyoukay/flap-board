# Locked design decisions (v0.1.0)

This document records the decisions that shaped the codebase. Each entry
states **what** was chosen, **why**, and **when**. Anything not in this
list is open for change.

## 2026-06-10 — initial brief

| Decision | Choice |
|---|---|
| Build machine | dev-mm-04 (Q + Woz) — though slice 1 was built on plan-mm-06 as a one-off |
| Clack sound | Shipped audio sample (Python-synthesized placeholder) |
| URL polling | Plain fetch + Authorization header + optional CORS proxy URL |
| Service worker | App shell + last polled snapshot |

Sponsor: Vikas Bhatia.

## Defaults baked in (slice 1)

- Zod for validation (small, TS-friendly, runtime guards at the import
  boundary)
- vite-plugin-pwa for PWA / manifest / SW (added in slice 6)
- System mono font stack (Space Mono webfont deferred)
- Schema id `"flap-board.v1"` with literal-only version match
- Cursor auto-hide in kiosk: 3 s
- `prefers-reduced-motion` skips cascade — characters jump to final
- Practical board cap ~24 × 80; not hard-enforced in v0.1.0
- Audio: `<audio>` pool of 5 elements, rate-limited 25 ms between plays
- State: Zustand + `subscribeWithSelector`; persistence is the storage
  layer's job, **not** Zustand's `persist` middleware (keeps the
  Capacitor swap clean)
- Themes: 3 baked + custom palette slot (custom palette UI deferred —
  set via JSON import for now)
- `noUncheckedIndexedAccess`: on. `exactOptionalPropertyTypes`: off
  (conflicts with Zod-inferred optionals)
- ESLint rule `react-hooks/set-state-in-effect`: respected via deferred
  setState patterns (`setTimeout(fn, 0)`, callback nesting)

## Slice 1 — scaffold + isolated FlapCell

- Two animated leaves (upper + lower) per cell, CSS transforms only
- Char cycling sequence: ` ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:./+`
- StrictMode on in dev; useEffect cleanups prevent leaked timers

## Slice 2 — FlapBoard + cascade + themes

- Row stagger multiplier: 5× per row (e.g., 25 ms cell stagger → 125 ms row)
- Auto-fit aspect ratio: cell height : width ≈ 1.4
- Demo config: 12 European flights + 5 columns (40 chars total)

## Slice 3 — settings + persistence + JSON I/O

- Persistence key: `flap-board.config` (prefixed by storage layer)
- Settings drawer opens from the right (480 px max width)
- JSON export: pretty-printed (2-space indent), ISO-date filename

## Slice 4 — URL polling

- Backoff: exponential, capped at 60 s
- Polled rows merge by `id`; rows missing from the poll are preserved
- Snapshot storage key: `flap-board.snapshot`

## Slice 5 — kiosk + sound + a11y

- `flap.wav`: 22050 Hz, mono, 16-bit, ~75 ms long (Python-synthesized).
  Swap for a recorded sample before a public release.
- Audio pool `warmup()` is triggered on first enable to satisfy the
  iOS user-gesture rule
- Escape closes the settings drawer

## Slice 6 — PWA + offline snapshot

- Workbox `registerType: 'autoUpdate'` — SW updates silently on next load
- Runtime cache for JSON polls: NetworkFirst, 5 s timeout, 5 entries,
  7-day TTL
- Snapshot hydration runs on mount when polling is enabled, before the
  first network attempt

## Slice 7 — README + docs + final QA

- README + docs/{SCHEMA,CAPACITOR,DECISIONS}.md added
- `v0.1.0` tag points at the slice-7 commit
- No license shipped — deferred
