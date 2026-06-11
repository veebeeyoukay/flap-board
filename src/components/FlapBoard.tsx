import { useMemo, useRef } from 'react';
import { useBoardStore } from '../state/store';
import { useAutoFitFont } from '../hooks/useAutoFitFont';
import { FlapRow } from './FlapRow';
import { BoardHeader } from './BoardHeader';

export function FlapBoard() {
  const config = useBoardStore((s) => s.config);
  const boardRef = useRef<HTMLDivElement>(null);

  const totalCols = useMemo(
    () => config.columns.reduce((sum, c) => sum + c.widthChars, 0),
    [config.columns]
  );

  const totalRows = config.rows.length + (config.showHeader ? 2 : 0);

  useAutoFitFont(boardRef, totalCols, totalRows);

  return (
    <div className="flap-board-wrap">
      {config.title !== '' && (
        <h1 className="flap-board-title">{config.title}</h1>
      )}
      <div className="flap-board" ref={boardRef}>
        {config.showHeader && <BoardHeader columns={config.columns} />}
        {config.rows.map((row, rowIdx) => (
          <FlapRow
            key={row.id}
            row={row}
            columns={config.columns}
            rowIdx={rowIdx}
            cascadeStaggerMs={config.cascadeStaggerMs}
            flapMs={config.flapMs}
          />
        ))}
      </div>
    </div>
  );
}
