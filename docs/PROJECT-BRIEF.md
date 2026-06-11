# flap-board — Project Brief

**Status:** Approved 2026-06-10, handed off to dev-mm-04 (Q + Woz)
**Sponsor:** Vikas Bhatia (vikas@itsjen.ai)
**Repo:** https://github.com/veebeeyoukay/flap-board
**SR:** SR-2026-06-10-001 (`ops.support_requests` on plan-mm-06)
**Vikunja:** `HitSquad Fleet > 04-Projects > flap-board` (project id TBD on creation)
**GitHub Issue:** TBD (filed alongside this brief)
**Brief location:** `~/Vaults/projects-006/flap-board/PROJECT-BRIEF.md` (plan-mm-06)

---

## 1. Purpose

Configurable old-school split-flap display board (Solari-style departure board). Web
app first, mobile (Capacitor) later. **Content-agnostic** — flights, task statuses,
sales numbers, countdowns, messages all work from the same board engine. Flight
semantics live only in the default demo config.

**Revenue lens (Doctrine §1):** not a near-term revenue feature. Vikas-commissioned
exploratory build. May seed a future product line. Treat as opportunity-seed, not
lock-down. AKCF awareness via `cc:akcf` on the Vikunja task; findings documented,
not gating during Phases 1–3.

## 2. Routing & ownership

| Role | Who | Where |
|---|---|---|
| **Sponsor** | Vikas | plan-mm-06 prep, all decisions |
| **Build lead** | Q | dev-mm-04 (192.168.86.31, user `vbdev`) |
| **Dev** | Woz | dev-mm-04 |
| **Security** | AKCF | akcf-mm-13 — `cc:akcf` Vikunja label |
| **Coordination** | plan-mm-06 Claude | files SR + Vikunja + Issue, then hands off |

Per standing directive: **all development on dev-mm-04**, not plan-mm-06.
plan-mm-06 does not touch the working tree after this brief is filed.

## 3. Decisions locked (Vikas, 2026-06-10)

| # | Decision | Choice |
|---|---|---|
| 1 | Build machine | **dev-mm-04** (Q + Woz) |
| 2 | Clack sound | **Shipped audio sample** — real WAV/MP3, 50–200KB bundled |
| 3 | URL polling auth | **Plain fetch + Authorization header + optional CORS proxy URL** |
| 4 | Service worker scope | **App shell + last polled snapshot** |

## 4. Defaults baked in (override anytime)

- **Validation:** Zod schemas (runtime guards on JSON import)
- **PWA:** `vite-plugin-pwa` (Workbox under the hood)
- **Font:** Space Mono self-hosted as woff2 (consistent character-cell width)
- **Schema id:** `"flap-board.v1"` semver in JSON; imports of unknown majors refused with a clear error
- **Cursor auto-hide in kiosk:** 3 seconds
- **`prefers-reduced-motion`:** cascade skipped, characters jump straight to final
- **Fetch error indicator:** corner LED-style dot, hover tooltip "Last OK: HH:MM:SS"
- **Max board:** 24 rows × 80 chars (still 60fps target on M-series mid-range)
- **Audio playback:** `<audio>` pool of 5 simultaneous, gated by mute toggle + reduced-motion + iOS auto-mute rules
- **State:** Zustand with `subscribeWithSelector` middleware. Persistence handled by `storage.ts`, **not** Zustand's `persist` middleware — keeps the Capacitor swap clean.
- **Themes:** 3 baked (Classic Solari = ivory-on-black, Amber CRT, Green CRT) + Custom (color pickers for bg/fg/divider/highlight + per-status colors)
- **CI:** GitHub Actions on the public repo — lint + typecheck + build + test, no deploy

## 5. Tech stack (non-negotiable)

- React 18 + TypeScript (strict mode, **zero `any`**) + Vite
- PWA-enabled (manifest, service worker, installable, offline)
- Zustand state
- localStorage behind single `storage.ts` abstraction (Capacitor Preferences swap-ready)
- Plain CSS / CSS Modules for flap animation — **no heavy animation libraries**
- No backend, no accounts, everything client-side
- No browser-only APIs without a fallback (this app will wrap with Capacitor for iOS/Android in Phase 2)

## 6. Plan — 7 slices

Each slice is a reviewable commit. Vikas reviews via "what to run and what should I see" at end of each.

### Slice 1 — Scaffold + isolated FlapCell

**Build:** Vite + React + TS strict + ESLint + Vitest, Zustand store, `storage.ts` interface + localStorage impl, single FlapCell component with 3D flip animation on a sandbox route. No board yet.

**BDD acceptance:**
- GIVEN the dev server is running on `/sandbox`
- WHEN I click "Flip to Z" on a cell currently showing "A"
- THEN the cell visually cycles through interim characters (3D flip, two halves) and lands on "Z"
- AND DevTools Performance tab shows transform-only repaints with no layout thrash
- AND animation holds 60fps on M-series mid-range hardware

### Slice 2 — FlapBoard + cascade + themes

**Build:** Grid of cells, left-to-right row-by-row stagger scheduler, 3 baked themes (Classic Solari / Amber CRT / Green CRT), custom palette stub, auto-fit font hook, demo flights config loads on first run.

**BDD acceptance:**
- GIVEN a 12×40 board with the demo flights config loaded
- WHEN any row's data changes
- THEN cells flip in a left-to-right cascade with configurable stagger
- AND switching theme swaps colors via CSS custom properties without remount
- AND font size auto-scales between a 320px-wide screen and a 1920px screen

### Slice 3 — Settings panel + persistence + JSON I/O

**Build:** Settings panel (title, columns CRUD, rows CRUD + drag-reorder, statuses with colors, timing controls). JSON export/import with `schemaVersion`. Persistence via `storage.ts`.

**BDD acceptance:**
- GIVEN a customized board (renamed columns, edited rows, custom status colors)
- WHEN I export to JSON, wipe localStorage, refresh, then import the JSON
- THEN the board renders identically to before
- AND importing a JSON with a newer schema major is refused with a clear error
- AND row drag-reorder updates the board in real time

### Slice 4 — URL polling

**Build:** Polling module — configurable interval, Authorization header field, optional CORS proxy URL prefix, `AbortController` + exponential backoff, silent error indicator (corner LED).

**BDD acceptance:**
- GIVEN a polling URL configured with a 30-second interval and a static JSON fixture
- WHEN the fixture changes between polls
- THEN the board cascades to the new values
- AND when the URL returns 500, the corner dot turns amber, hover shows the last-OK timestamp
- AND configuring an Authorization header sends it on subsequent polls
- AND configuring a CORS proxy URL prefixes the fetch through it

### Slice 5 — Kiosk + sound + a11y

**Build:** Fullscreen kiosk entry, cursor auto-hide (3s), shipped `flap.wav` playback with mute toggle, keyboard-accessible settings (Esc / Tab / Enter / arrow keys), `prefers-reduced-motion` handling.

**BDD acceptance:**
- GIVEN I press "Enter Kiosk Mode" or hit F11
- WHEN the board is fullscreen and no mouse moves for 3 seconds
- THEN the cursor hides
- AND if the user has `prefers-reduced-motion`, the cascade animation is skipped, characters jump to final state
- AND toggling mute silences the clack
- AND I can open settings, edit a row, save, and exit using only the keyboard

### Slice 6 — PWA + offline snapshot cache

**Build:** Web app manifest with icons (192/512/apple-touch), Workbox SW that caches app shell + last successful poll snapshot, install prompt UX.

**BDD acceptance:**
- GIVEN the app has been visited once with a polling URL configured and at least one successful poll
- WHEN I take the device offline and reload
- THEN the app shell loads and the board renders the last polled snapshot
- AND Lighthouse PWA category passes (90+)
- AND the install prompt fires on a supported browser

### Slice 7 — README + final QA

**Build:** README (setup, build, JSON schema, "Capacitor wrap (Phase 2)" section), `docs/SCHEMA.md`, `docs/CAPACITOR.md`, `docs/DECISIONS.md`. Build clean. Install verified on Chrome desktop + iOS Safari. Tag `v0.1.0`.

**BDD acceptance:**
- GIVEN `pnpm build` runs in the repo
- WHEN the build completes
- THEN there are zero TypeScript errors, zero ESLint errors, zero warnings
- AND the README contains a working Quick Start, JSON schema reference, and Capacitor wrap section
- AND the PWA installs on Chrome (desktop) and iOS Safari (Add to Home Screen)
- AND a `v0.1.0` tag is pushed to GitHub

## 7. File tree

```
flap-board/
├── public/
│   ├── favicon.svg
│   ├── fonts/space-mono-{regular,bold}.woff2
│   ├── pwa-icons/{icon-192,icon-512,apple-touch}.png
│   └── sounds/flap.wav
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── FlapCell.tsx
│   │   ├── FlapRow.tsx
│   │   ├── FlapBoard.tsx
│   │   ├── BoardHeader.tsx
│   │   ├── KioskShell.tsx
│   │   ├── PollingIndicator.tsx
│   │   └── SettingsPanel/
│   │       ├── index.tsx
│   │       ├── GeneralEditor.tsx
│   │       ├── ColumnsEditor.tsx
│   │       ├── RowsEditor.tsx
│   │       ├── StatusEditor.tsx
│   │       ├── ThemeEditor.tsx
│   │       ├── TimingEditor.tsx
│   │       └── DataSourceEditor.tsx
│   ├── state/{store.ts,selectors.ts,types.ts}
│   ├── storage/{index.ts,localStorage.ts,README.md}
│   ├── schema/{boardConfig.ts,migrate.ts,demo.ts}
│   ├── animation/{flapSequence.ts,cascade.ts}
│   ├── audio/{clack.ts,muteController.ts}
│   ├── polling/{poller.ts,headers.ts,parser.ts}
│   ├── theme/{themes.ts,applyTheme.ts,theme.css}
│   ├── styles/{reset.css,tokens.css,flap.css,board.css,settings.css}
│   ├── hooks/{useFullscreen.ts,useAutoHideCursor.ts,usePrefersReducedMotion.ts,useAutoFitFont.ts}
│   └── utils/id.ts
├── tests/{schema,storage,polling,flapSequence}.test.ts
├── docs/{SCHEMA.md,CAPACITOR.md,DECISIONS.md}
├── .github/workflows/ci.yml
├── AGENTS.md                  # DOX root contract — created in slice 1
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── LICENSE
└── .gitignore
```

## 8. Capacitor wrap (Phase 2) — touchpoints documented now

Pre-built so that the iOS/Android wrap requires no app-code changes:

- **`src/storage/index.ts`** — swap `LocalStorageImpl` for a `CapacitorPreferencesStorage` satisfying the same interface. No call-site changes.
- **Polling fetch** — standard `fetch()` works in Capacitor WebView. No XHR-specific API.
- **Sound** — `<audio>` works in Capacitor; iOS auto-mute rules already respected.
- **Service worker** — Capacitor uses native shell; SW is web-only and gets dropped. Offline snapshot must therefore **also** work from `storage.ts` fallback, not just the SW cache. Document this in `docs/CAPACITOR.md`.
- **Fullscreen** — `requestFullscreen()` works in Capacitor. For iOS Safari (web), document Add-to-Home-Screen as the alternative.

## 9. DOX (per `~/.claude/CLAUDE.md` "DOX protocol")

Repo currently has no `AGENTS.md`. First commit on dev-mm-04 (slice 1) must:

1. Initialize `AGENTS.md` at repo root with project-wide instructions, owner, and the Child DOX Index
2. Add child `AGENTS.md` files under `src/components/` and `src/state/` if those become durable boundaries
3. Reference this brief in the root `AGENTS.md` "Local Contracts" section
4. Run DOX closeout at the end of every slice

## 10. Activity logging (per Doctrine §5)

Every meaningful action on this project logs via `/log-activity`:
- Local source: flat dir on the working machine
- Gitea mirror: `itsjenai/agent-activity-log` → `<agent>/<machine>/YYYY-MM-DD.jsonl`

Cross-link this brief, the SR-ID, and the GitHub Issue URL in `working_notes`
on the SR and as backlink comments on the Vikunja task.
