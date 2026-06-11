import { z } from 'zod';

export const AlignSchema = z.enum(['left', 'center', 'right']);

export const ThemeKeySchema = z.enum(['solari', 'amber', 'green', 'custom']);

export const ThemePaletteSchema = z.object({
  flapBg: z.string(),
  flapFg: z.string(),
  flapDivider: z.string(),
  flapShadow: z.string(),
  pageBg: z.string(),
  pageFg: z.string(),
  accent: z.string(),
});

export const ColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  widthChars: z.number().int().positive(),
  align: AlignSchema,
  colorRules: z.record(z.string(), z.string()).optional(),
});

export const RowSchema = z.object({
  id: z.string(),
  values: z.record(z.string(), z.string()),
});

export const PollingConfigSchema = z.object({
  enabled: z.boolean(),
  url: z.string(),
  intervalMs: z.number().int().positive(),
  authHeader: z.string().nullable(),
  corsProxyUrl: z.string().nullable(),
});

export const SoundConfigSchema = z.object({
  enabled: z.boolean(),
});

export const BoardConfigSchema = z.object({
  schemaVersion: z.literal('flap-board.v1'),
  title: z.string(),
  showHeader: z.boolean(),
  columns: z.array(ColumnSchema),
  rows: z.array(RowSchema),
  theme: ThemeKeySchema,
  customTheme: ThemePaletteSchema.nullable(),
  cascadeStaggerMs: z.number().int().positive(),
  flapMs: z.number().int().positive(),
  polling: PollingConfigSchema.optional(),
  sound: SoundConfigSchema.optional(),
});

export class SchemaVersionError extends Error {
  found: string;
  constructor(found: string) {
    super(`Schema version "${found}" not supported — need "flap-board.v1".`);
    this.name = 'SchemaVersionError';
    this.found = found;
  }
}

export function parseBoardConfig(input: unknown): z.infer<typeof BoardConfigSchema> {
  if (
    typeof input === 'object' &&
    input !== null &&
    'schemaVersion' in input &&
    typeof (input as { schemaVersion: unknown }).schemaVersion === 'string'
  ) {
    const v = (input as { schemaVersion: string }).schemaVersion;
    if (v !== 'flap-board.v1') throw new SchemaVersionError(v);
  }
  return BoardConfigSchema.parse(input);
}
