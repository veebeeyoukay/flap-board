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
        const padded = padValue(
          row.values[col.key] ?? '',
          col.widthChars,
          col.align
        );
        const startOffset = offsets[colIdx] ?? 0;
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
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
