import { useEffect } from 'react';
import { Poller } from '../polling/poller';
import { parsePollResponse } from '../polling/parser';
import { saveSnapshot, mergeRows } from '../polling/snapshot';
import { useBoardStore } from '../state/store';
import type { PollingConfig } from '../schema/types';

export function usePoller(config: PollingConfig | undefined): void {
  const enabled = config?.enabled === true && (config.url ?? '') !== '';
  const url = config?.url ?? '';
  const intervalMs = config?.intervalMs ?? 30_000;
  const authHeader = config?.authHeader ?? null;
  const corsProxyUrl = config?.corsProxyUrl ?? null;

  useEffect(() => {
    if (!enabled) return;

    const effective: PollingConfig = {
      enabled: true,
      url,
      intervalMs,
      authHeader,
      corsProxyUrl,
    };

    const poller = new Poller(effective, (event) => {
      const store = useBoardStore.getState();
      if (event.type === 'success') {
        try {
          const rows = parsePollResponse(event.data);
          const merged = mergeRows(store.config.rows, rows);
          useBoardStore.setState((s) => ({
            config: { ...s.config, rows: merged },
            pollingStatus: {
              lastOkAt: event.at,
              lastErrorAt: null,
              lastErrorMessage: null,
            },
          }));
          void saveSnapshot(rows);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'parse failed';
          store.setPollingStatus({
            lastErrorAt: event.at,
            lastErrorMessage: msg,
          });
        }
      } else {
        store.setPollingStatus({
          lastErrorAt: event.at,
          lastErrorMessage: event.error.message,
        });
      }
    });

    poller.start();
    return () => poller.stop();
  }, [enabled, url, intervalMs, authHeader, corsProxyUrl]);
}
