// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Poller } from '../src/polling/poller';
import type { PollerEvent } from '../src/polling/poller';
import type { PollingConfig } from '../src/schema/types';

const BASE_CONFIG: PollingConfig = {
  enabled: true,
  url: 'https://example.com/board.json',
  intervalMs: 30_000,
  authHeader: null,
  corsProxyUrl: null,
};

describe('Poller', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('reports success when fetch returns 200', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ rows: [] }), { status: 200 })
    );
    const events: PollerEvent[] = [];
    const poller = new Poller(BASE_CONFIG, (e) => events.push(e));
    poller.start();
    await vi.waitFor(() => expect(events.length).toBeGreaterThan(0));
    expect(events[0]?.type).toBe('success');
    poller.stop();
  });

  it('reports error on non-2xx', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('boom', { status: 500, statusText: 'Server Error' })
    );
    const events: PollerEvent[] = [];
    const poller = new Poller(BASE_CONFIG, (e) => events.push(e));
    poller.start();
    await vi.waitFor(() => expect(events.length).toBeGreaterThan(0));
    expect(events[0]?.type).toBe('error');
    if (events[0]?.type === 'error') {
      expect(events[0].error.message).toContain('500');
    }
    poller.stop();
  });

  it('sends Authorization header when configured', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ rows: [] }), { status: 200 })
    );
    const poller = new Poller(
      { ...BASE_CONFIG, authHeader: 'Bearer xyz' },
      () => {}
    );
    poller.start();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/board.json',
      expect.objectContaining({
        headers: { Authorization: 'Bearer xyz' },
      })
    );
    poller.stop();
  });

  it('prefixes URL with CORS proxy when configured', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ rows: [] }), { status: 200 })
    );
    const poller = new Poller(
      { ...BASE_CONFIG, corsProxyUrl: 'https://proxy.io/?' },
      () => {}
    );
    poller.start();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(fetchMock).toHaveBeenCalledWith(
      'https://proxy.io/?https://example.com/board.json',
      expect.any(Object)
    );
    poller.stop();
  });

  it('does not deliver events after stop()', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ rows: [] }), { status: 200 })
    );
    const events: PollerEvent[] = [];
    const poller = new Poller(BASE_CONFIG, (e) => events.push(e));
    poller.start();
    poller.stop();
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
    expect(events).toEqual([]);
  });
});
