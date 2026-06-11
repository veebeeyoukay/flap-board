import { describe, expect, it } from 'vitest';
import {
  parseBoardConfig,
  SchemaVersionError,
  BoardConfigSchema,
} from '../src/schema/boardConfig';
import { DEMO_CONFIG } from '../src/schema/demo';

describe('BoardConfigSchema', () => {
  it('accepts the demo config', () => {
    expect(() => BoardConfigSchema.parse(DEMO_CONFIG)).not.toThrow();
  });

  it('roundtrips demo config through JSON', () => {
    const json = JSON.stringify(DEMO_CONFIG);
    const reparsed = parseBoardConfig(JSON.parse(json));
    expect(reparsed).toEqual(DEMO_CONFIG);
  });

  it('rejects missing schemaVersion', () => {
    const { schemaVersion: _omit, ...rest } = DEMO_CONFIG;
    expect(() => parseBoardConfig(rest)).toThrow();
    void _omit;
  });

  it('rejects unknown schemaVersion with SchemaVersionError', () => {
    const bad = { ...DEMO_CONFIG, schemaVersion: 'flap-board.v2' };
    expect(() => parseBoardConfig(bad)).toThrowError(SchemaVersionError);
  });

  it('preserves colorRules round-trip', () => {
    const reparsed = parseBoardConfig(JSON.parse(JSON.stringify(DEMO_CONFIG)));
    const statusCol = reparsed.columns.find((c) => c.key === 'status');
    expect(statusCol?.colorRules?.['ON TIME']).toBeTruthy();
  });

  it('rejects non-positive widthChars', () => {
    const bad = {
      ...DEMO_CONFIG,
      columns: [{ key: 'x', label: 'X', widthChars: 0, align: 'left' }],
    };
    expect(() => parseBoardConfig(bad)).toThrow();
  });
});
