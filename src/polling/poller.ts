import type { PollingConfig } from '../schema/types';

export type PollerEvent =
  | { type: 'success'; data: unknown; at: number }
  | { type: 'error'; error: Error; at: number };

const MAX_BACKOFF_MS = 60_000;

export class Poller {
  private timer: number | null = null;
  private controller: AbortController | null = null;
  private failures = 0;
  private stopped = false;

  private config: PollingConfig;
  private onEvent: (e: PollerEvent) => void;

  constructor(config: PollingConfig, onEvent: (e: PollerEvent) => void) {
    this.config = config;
    this.onEvent = onEvent;
  }

  start(): void {
    this.stopped = false;
    void this.tick();
  }

  stop(): void {
    this.stopped = true;
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.controller !== null) {
      this.controller.abort();
      this.controller = null;
    }
  }

  private buildUrl(): string {
    const proxy = this.config.corsProxyUrl ?? '';
    return proxy + this.config.url;
  }

  private buildHeaders(): Record<string, string> {
    const h: Record<string, string> = {};
    if (this.config.authHeader !== null && this.config.authHeader !== '') {
      h['Authorization'] = this.config.authHeader;
    }
    return h;
  }

  private async tick(): Promise<void> {
    if (this.stopped) return;
    this.controller = new AbortController();
    try {
      const response = await fetch(this.buildUrl(), {
        signal: this.controller.signal,
        headers: this.buildHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      const data: unknown = await response.json();
      if (this.stopped) return;
      this.failures = 0;
      this.onEvent({ type: 'success', data, at: Date.now() });
      this.scheduleNext(this.config.intervalMs);
    } catch (err) {
      if (this.stopped) return;
      const error = err instanceof Error ? err : new Error(String(err));
      if (error.name === 'AbortError') return;
      this.failures++;
      this.onEvent({ type: 'error', error, at: Date.now() });
      const backoff = Math.min(
        MAX_BACKOFF_MS,
        this.config.intervalMs * Math.pow(2, this.failures - 1)
      );
      this.scheduleNext(backoff);
    }
  }

  private scheduleNext(ms: number): void {
    if (this.stopped) return;
    this.timer = window.setTimeout(() => {
      void this.tick();
    }, ms);
  }
}
