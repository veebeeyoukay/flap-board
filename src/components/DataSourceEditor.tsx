import { useBoardStore } from '../state/store';
import type { PollingConfig } from '../schema/types';

const DEFAULT_POLLING: PollingConfig = {
  enabled: false,
  url: '',
  intervalMs: 30_000,
  authHeader: null,
  corsProxyUrl: null,
};

export function DataSourceEditor() {
  const polling = useBoardStore((s) => s.config.polling);
  const setPolling = useBoardStore.getState().setPolling;
  const current = polling ?? DEFAULT_POLLING;

  const patch = (p: Partial<PollingConfig>): void => {
    setPolling({ ...current, ...p });
  };

  return (
    <div className="data-source-editor">
      <label className="field-inline">
        <input
          type="checkbox"
          checked={current.enabled}
          onChange={(e) => patch({ enabled: e.target.checked })}
        />
        Poll a URL for live updates
      </label>

      <label className="field">
        URL
        <input
          type="url"
          value={current.url}
          onChange={(e) => patch({ url: e.target.value })}
          placeholder="https://example.com/board.json"
          disabled={!current.enabled}
        />
      </label>

      <label className="field">
        Interval (seconds)
        <input
          type="number"
          min={5}
          max={3600}
          value={Math.round(current.intervalMs / 1000)}
          onChange={(e) =>
            patch({ intervalMs: Math.max(5, Number(e.target.value)) * 1000 })
          }
          disabled={!current.enabled}
        />
      </label>

      <label className="field">
        Authorization header (optional)
        <input
          type="text"
          value={current.authHeader ?? ''}
          onChange={(e) =>
            patch({
              authHeader: e.target.value === '' ? null : e.target.value,
            })
          }
          placeholder="Bearer ..."
          disabled={!current.enabled}
        />
      </label>

      <label className="field">
        CORS proxy URL prefix (optional)
        <input
          type="url"
          value={current.corsProxyUrl ?? ''}
          onChange={(e) =>
            patch({
              corsProxyUrl: e.target.value === '' ? null : e.target.value,
            })
          }
          placeholder="https://corsproxy.io/?"
          disabled={!current.enabled}
        />
      </label>

      <p className="field-help">
        Expected payload: <code>{`{"rows":[{"id":"r1","values":{"status":"ON TIME"}}]}`}</code>{' '}
        or a bare JSON array of rows.
      </p>
    </div>
  );
}
