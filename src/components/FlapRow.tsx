import { FlapCell } from './FlapCell';
import { padValue, cellDelay } from '../animation/cascade';
import type { Column, Row } from '../schema/types';

interface FlapRowProps {
  row: Row;
  columns: Column[];
  rowIdx: number;
  cascadeStaggerMs: number;
  flapMs: number;
}

const ROW_STAGGER_MULT = 5;

function cumulativeOffsets(columns: Column[]): number[] {
  const out: number[] = [];
  let acc = 0;
  for (const col of columns) {
    out.push(acc);
    acc += col.widthChars;
  }
  return out;
}

function lookupColor(col: Column, rawValue: string): string | undefined {
  if (col.colorRules === undefined) return undefined;
  const key = rawValue.toUpperCase().trim();
  return col.colorRules[key];
}

export function FlapRow({
  row,
  columns,
  rowIdx,
  cascadeStaggerMs,
  flapMs,
}: FlapRowProps) {
  const offsets = cumulativeOffsets(columns);
  return (
    <div className="flap-row">
      {columns.map((col, colIdx) => {
        const raw = row.values[col.key] ?? '';
        const padded = padValue(raw, col.widthChars, col.align);
        const startOffset = offsets[colIdx] ?? 0;
        const colorOverride = lookupColor(col, raw);
        return (
          <div key={col.key} className="flap-col">
            {Array.from(padded).map((ch, i) => (
              <FlapCell
                key={`${col.key}-${i}`}
                char={ch}
                flapMs={flapMs}
                delayMs={cellDelay(
                  rowIdx,
                  startOffset + i,
                  cascadeStaggerMs * ROW_STAGGER_MULT,
                  cascadeStaggerMs
                )}
                colorOverride={colorOverride}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
