// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import { loadConfig, saveConfig, clearConfig } from '../src/state/persistence';
import { DEMO_CONFIG } from '../src/schema/demo';

describe('persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns demo config when storage is empty', async () => {
    const cfg = await loadConfig();
    expect(cfg).toEqual(DEMO_CONFIG);
  });

  it('round-trips a customized config', async () => {
    const customized = { ...DEMO_CONFIG, title: 'CUSTOM TITLE' };
    await saveConfig(customized);
    const loaded = await loadConfig();
    expect(loaded).toEqual(customized);
  });

  it('falls back to demo when stored data is invalid JSON', async () => {
    window.localStorage.setItem('flap-board.config', 'not-json');
    const loaded = await loadConfig();
    expect(loaded).toEqual(DEMO_CONFIG);
  });

  it('falls back to demo when stored data fails schema validation', async () => {
    window.localStorage.setItem(
      'flap-board.config',
      JSON.stringify({ schemaVersion: 'flap-board.v1', not: 'a config' })
    );
    const loaded = await loadConfig();
    expect(loaded).toEqual(DEMO_CONFIG);
  });

  it('falls back to demo when schemaVersion is unknown', async () => {
    window.localStorage.setItem(
      'flap-board.config',
      JSON.stringify({ ...DEMO_CONFIG, schemaVersion: 'flap-board.v99' })
    );
    const loaded = await loadConfig();
    expect(loaded).toEqual(DEMO_CONFIG);
  });

  it('clearConfig() removes the stored value', async () => {
    await saveConfig(DEMO_CONFIG);
    await clearConfig();
    expect(window.localStorage.getItem('flap-board.config')).toBeNull();
  });
});
