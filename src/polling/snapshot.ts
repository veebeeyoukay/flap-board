import { z } from 'zod';
import { getStorage } from '../storage';
import { RowSchema } from '../schema/boardConfig';
import type { Row } from '../schema/types';

const KEY = 'snapshot';

const SnapshotSchema = z.object({
  at: z.number(),
  rows: z.array(RowSchema),
});

export interface Snapshot {
  at: number;
  rows: Row[];
}

export async function saveSnapshot(rows: Row[]): Promise<void> {
  const payload: Snapshot = { at: Date.now(), rows };
  await getStorage().set(KEY, JSON.stringify(payload));
}

export async function loadSnapshot(): Promise<Snapshot | null> {
  const raw = await getStorage().get(KEY);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return SnapshotSchema.parse(parsed);
  } catch {
    return null;
  }
}

export async function clearSnapshot(): Promise<void> {
  await getStorage().remove(KEY);
}

export function mergeRows(existing: Row[], incoming: Row[]): Row[] {
  const byId = new Map<string, Row>();
  for (const r of incoming) byId.set(r.id, r);
  return existing.map((r) => {
    const upd = byId.get(r.id);
    if (upd === undefined) return r;
    return { ...r, values: { ...r.values, ...upd.values } };
  });
}
