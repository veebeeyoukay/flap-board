import { useBoardStore } from '../state/store';
import { STATUS_CYCLE } from '../schema/demo';
import type { ThemeKey } from '../schema/types';

const THEME_OPTIONS: ThemeKey[] = ['solari', 'amber', 'green'];

export function DemoControls() {
  const config = useBoardStore((s) => s.config);
  const setTheme = useBoardStore((s) => s.setTheme);
  const setFlapMs = useBoardStore((s) => s.setFlapMs);
  const setCascadeStaggerMs = useBoardStore((s) => s.setCascadeStaggerMs);
  const updateRowValue = useBoardStore((s) => s.updateRowValue);

  const cycleStatus = (rowId: string): void => {
    const cur = config.rows.find((r) => r.id === rowId)?.values['status'] ?? '';
    const idx = STATUS_CYCLE.indexOf(cur);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length] ?? STATUS_CYCLE[0]!;
    updateRowValue(rowId, 'status', next);
  };

  const cycleAllStatuses = (): void => {
    config.rows.forEach((r) => cycleStatus(r.id));
  };

  return (
    <aside className="demo-controls" aria-label="demo controls">
      <div className="ctrl-group">
        <span className="ctrl-label">Theme:</span>
        {THEME_OPTIONS.map((t) => (
          <button
            key={t}
            type="button"
            data-active={config.theme === t || undefined}
            onClick={() => setTheme(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="ctrl-group">
        <button type="button" onClick={cycleAllStatuses}>
          Cycle all statuses
        </button>
        <button
          type="button"
          onClick={() => {
            const id = config.rows[0]?.id;
            if (id !== undefined) cycleStatus(id);
          }}
        >
          Cycle row 1
        </button>
      </div>
      <div className="ctrl-group">
        <label>
          Flap {config.flapMs}ms
          <input
            type="range"
            min={20}
            max={200}
            step={10}
            value={config.flapMs}
            onChange={(e) => setFlapMs(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="ctrl-group">
        <label>
          Stagger {config.cascadeStaggerMs}ms
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={config.cascadeStaggerMs}
            onChange={(e) => setCascadeStaggerMs(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="ctrl-group">
        <small>
          <a href="?sandbox=1">Sandbox view</a>
        </small>
      </div>
    </aside>
  );
}
