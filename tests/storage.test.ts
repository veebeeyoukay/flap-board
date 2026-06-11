// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import { LocalStorageImpl } from '../src/storage/localStorage';

describe('LocalStorageImpl', () => {
  let storage: LocalStorageImpl;

  beforeEach(() => {
    window.localStorage.clear();
    storage = new LocalStorageImpl();
  });

  it('returns null for unknown key', async () => {
    expect(await storage.get('unknown')).toBeNull();
  });

  it('persists and retrieves a value', async () => {
    await storage.set('foo', 'bar');
    expect(await storage.get('foo')).toBe('bar');
  });

  it('removes a value', async () => {
    await storage.set('foo', 'bar');
    await storage.remove('foo');
    expect(await storage.get('foo')).toBeNull();
  });

  it('clear() only removes prefixed keys', async () => {
    await storage.set('foo', 'bar');
    window.localStorage.setItem('outside', 'untouched');
    await storage.clear();
    expect(await storage.get('foo')).toBeNull();
    expect(window.localStorage.getItem('outside')).toBe('untouched');
  });
});
