import { FlapCell } from './FlapCell';
import { padValue } from '../animation/cascade';
import type { Column } from '../schema/types';

interface BoardHeaderProps {
  columns: Column[];
}

export function BoardHeader({ columns }: BoardHeaderProps) {
  return (
    <div className="flap-row flap-row-header" aria-label="board header">
      {columns.map((col) => {
        const padded = padValue(col.label, col.widthChars, col.align);
        return (
          <div key={col.key} className="flap-col">
            {Array.from(padded).map((ch, i) => (
              <FlapCell
                key={`${col.key}-${i}`}
                char={ch}
                flapMs={40}
                delayMs={0}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
