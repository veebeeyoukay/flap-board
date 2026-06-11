# Capacitor wrap — Phase 2 guide

This app was built to be wrapped in Capacitor (iOS / Android) without
modifying app code. This document lists the swap points, the install steps,
and the known caveats.

## Touchpoints (already abstracted)

### 1. Storage

App code calls `getStorage().get/set/remove/clear` — never `localStorage`
directly. The interface lives in `src/storage/types.ts`.

To swap, write a `CapacitorPreferencesStorage` class that satisfies the same
`FlapStorage` interface, then call `setStorage(new CapacitorPreferencesStorage())`
once at startup (before any `loadConfig()` call).

```typescript
import { Preferences } from '@capacitor/preferences';
import { setStorage } from './storage';
import type { FlapStorage } from './storage';

const PREFIX = 'flap-board.';

class CapacitorPreferencesStorage implements FlapStorage {
  async get(key: string) {
    const { value } = await Preferences.get({ key: PREFIX + key });
    return value;
  }
  async set(key: string, value: string) {
    await Preferences.set({ key: PREFIX + key, value });
  }
  async remove(key: string) {
    await Preferences.remove({ key: PREFIX + key });
  }
  async clear() {
    const { keys } = await Preferences.keys();
    for (const k of keys) {
      if (k.startsWith(PREFIX)) await Preferences.remove({ key: k });
    }
  }
}

setStorage(new CapacitorPreferencesStorage());
```

### 2. Polling fetch

Standard `fetch()` works in the Capacitor WebView. No change needed.

### 3. Sound

`<audio>` works in Capacitor. iOS still requires a user gesture before
audio can play — that's already handled by `setClackEnabled(true)`
triggering `warmup()`, which is itself triggered by the user toggling
sound in the Settings panel (a gesture).

### 4. Fullscreen

`requestFullscreen()` works in Capacitor. On iOS web (Safari, no
Capacitor) the app should be installed via *Add to Home Screen* to get a
fullscreen-like experience.

## Service worker — the only "dropped" feature

Capacitor uses a native shell; the service worker is web-only and gets
dropped in the native build. This affects offline behavior:

- **Web (PWA):** SW caches the app shell + the last poll snapshot.
  Reload while offline → board renders.
- **Capacitor (native):** No SW. The native shell is already cached.
  Polled data is recovered from `loadSnapshot()` in
  `src/polling/snapshot.ts`, which reads from storage. App.tsx's
  mount-time `loadSnapshot()` hydration covers this — no extra code
  needed.

## Install steps (when ready)

```bash
pnpm add -D @capacitor/cli @capacitor/core
pnpm add @capacitor/preferences
npx cap init flap-board ai.itsjen.flapboard --web-dir dist
pnpm add @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
pnpm build && npx cap copy
npx cap open ios       # or android
```

Replace the storage impl in `main.tsx` before the first native build.
Test on a real device.

## Known caveats

- iOS Safari (web, not Capacitor) does not support PWA install on iPhones
  outside *Add to Home Screen*. The manifest still works.
- The shipped `public/sounds/flap.wav` is a synthesized placeholder. Swap
  with a recorded sample before shipping a paid version.
- Theme switches are immediate (CSS variables); they do not animate.
- Polling without a CORS proxy will fail against most public APIs — most
  don't send permissive CORS headers.
