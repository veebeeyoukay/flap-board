import { useBoardStore } from '../state/store';
import type { PollingStatus } from '../state/store';

function formatTime(ts: number | null): string {
  if (ts === null) return '—';
  return new Date(ts).toLocaleTimeString();
}

function classify(status: PollingStatus): 'idle' | 'ok' | 'error' {
  if (
    status.lastErrorAt !== null &&
    (status.lastOkAt === null || status.lastErrorAt > status.lastOkAt)
  ) {
    return 'error';
  }
  if (status.lastOkAt !== null) return 'ok';
  return 'idle';
}

export function PollingIndicator() {
  const enabled = useBoardStore((s) => s.config.polling?.enabled === true);
  const status = useBoardStore((s) => s.pollingStatus);
  if (!enabled) return null;

  const kind = classify(status);
  let tooltip = 'Polling idle';
  if (kind === 'error') {
    tooltip = `Last error ${formatTime(status.lastErrorAt)}: ${status.lastErrorMessage ?? 'unknown'}`;
  } else if (kind === 'ok') {
    tooltip = `Last OK ${formatTime(status.lastOkAt)}`;
  }

  return (
    <div
      className={`polling-indicator polling-indicator-${kind}`}
      title={tooltip}
      aria-label={`polling status: ${kind}`}
      role="status"
    />
  );
}
