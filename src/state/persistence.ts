import { getStorage } from '../storage';
import { parseBoardConfig, SchemaVersionError } from '../schema/boardConfig';
import { migrateIfNeeded } from '../schema/migrate';
import { DEMO_CONFIG } from '../schema/demo';
import type { BoardConfig } from '../schema/types';

const CONFIG_KEY = 'config';

export async function loadConfig(): Promise<BoardConfig> {
  const raw = await getStorage().get(CONFIG_KEY);
  if (raw === null) return DEMO_CONFIG;
  try {
    const parsed = JSON.parse(raw) as unknown;
    const validated = parseBoardConfig(parsed) as BoardConfig;
    return migrateIfNeeded(validated);
  } catch (err) {
    if (err instanceof SchemaVersionError) {
      console.warn('flap-board: stored config has unsupported schema version, using demo', err);
    } else {
      console.warn('flap-board: stored config invalid, using demo', err);
    }
    return DEMO_CONFIG;
  }
}

export async function saveConfig(config: BoardConfig): Promise<void> {
  await getStorage().set(CONFIG_KEY, JSON.stringify(config));
}

export async function clearConfig(): Promise<void> {
  await getStorage().remove(CONFIG_KEY);
}
