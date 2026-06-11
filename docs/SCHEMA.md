# JSON Config Schema — `flap-board.v1`

All persisted / exported / imported board configurations are validated
against the Zod schema in `src/schema/boardConfig.ts`. The schema version is
**literal**: `"flap-board.v1"`. Any other value (or none) is refused on
import via `SchemaVersionError`.

## Top level

```typescript
{
  schemaVersion: "flap-board.v1",
  title: string,
  showHeader: boolean,
  columns: Column[],
  rows: Row[],
  theme: "solari" | "amber" | "green" | "custom",
  customTheme: ThemePalette | null,
  cascadeStaggerMs: number,        // positive integer
  flapMs: number,                  // positive integer
  polling?: PollingConfig,
  sound?: { enabled: boolean }
}
```

## `Column`

```typescript
{
  key: string,                          // stable identifier; used in Row.values
  label: string,                        // displayed in the header row
  widthChars: number,                   // positive integer
  align: "left" | "center" | "right",
  colorRules?: Record<string, string>   // value → CSS color
}
```

`colorRules` lookup keys are matched after uppercase + trim of the cell
value.

## `Row`

```typescript
{
  id: string,                       // stable id; URL polling matches by id
  values: Record<string, string>    // keyed by Column.key
}
```

## `ThemePalette`

```typescript
{
  flapBg: string,        // cell background
  flapFg: string,        // cell foreground
  flapDivider: string,   // horizontal line between halves
  flapShadow: string,    // box-shadow color
  pageBg: string,        // page background
  pageFg: string,        // page foreground
  accent: string         // links + active state
}
```

## `PollingConfig`

```typescript
{
  enabled: boolean,
  url: string,                       // JSON endpoint
  intervalMs: number,                // positive integer (default 30000)
  authHeader: string | null,         // sent as `Authorization: <value>`
  corsProxyUrl: string | null        // prefixed before `url`
}
```

## Poll response

Either shape is accepted:

```typescript
// Object shape (recommended)
{ rows: Row[] }

// Or a bare array
Row[]
```

Polled rows are merged into existing rows by `id`. Rows missing from the
poll response are kept; matching rows have their `values` shallow-merged.
Unknown ids are ignored (not appended).

## Forward compatibility

The major version is `v1`. If/when a breaking change ships, the version
moves to `v2` and the importer refuses `v1` configs unless migrated via the
hook in `src/schema/migrate.ts`.
