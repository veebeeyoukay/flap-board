import type { FlapStorage } from './types';

const PREFIX = 'flap-board.';

export class LocalStorageImpl implements FlapStorage {
  async get(key: string): Promise<string | null> {
    return window.localStorage.getItem(PREFIX + key);
  }

  async set(key: string, value: string): Promise<void> {
    window.localStorage.setItem(PREFIX + key, value);
  }

  async remove(key: string): Promise<void> {
    window.localStorage.removeItem(PREFIX + key);
  }

  async clear(): Promise<void> {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k !== null && k.startsWith(PREFIX)) keys.push(k);
    }
    for (const k of keys) window.localStorage.removeItem(k);
  }
}
