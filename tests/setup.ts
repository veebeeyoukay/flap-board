import '@testing-library/jest-dom/vitest';

// Vitest 4 + jsdom 29 + Node 26 don't reliably hand a working localStorage to
// the test environment. Provide a minimal in-memory polyfill so storage tests
// don't depend on the moving parts.
if (typeof window !== 'undefined' && !window.localStorage) {
  const store = new Map<string, string>();
  const polyfill: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k: string) => store.get(k) ?? null,
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    removeItem: (k: string) => {
      store.delete(k);
    },
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
  };
  Object.defineProperty(window, 'localStorage', {
    value: polyfill,
    writable: false,
    configurable: true,
  });
  Object.defineProperty(globalThis, 'localStorage', {
    value: polyfill,
    writable: false,
    configurable: true,
  });
}
