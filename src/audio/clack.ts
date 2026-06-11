const POOL_SIZE = 5;
const AUDIO_PATH = '/sounds/flap.wav';
const MIN_INTERVAL_MS = 25;

class ClackPool {
  private elements: HTMLAudioElement[];
  private idx = 0;
  private warmedUp = false;

  constructor() {
    this.elements = Array.from({ length: POOL_SIZE }, () => {
      const a = new Audio(AUDIO_PATH);
      a.preload = 'auto';
      a.volume = 0.35;
      return a;
    });
  }

  warmup(): void {
    if (this.warmedUp) return;
    this.warmedUp = true;
    for (const a of this.elements) {
      a.muted = true;
      a.play()
        .then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        })
        .catch(() => {
          /* ignored — will retry on next user gesture */
        });
    }
  }

  play(): void {
    const a = this.elements[this.idx];
    if (a === undefined) return;
    try {
      a.currentTime = 0;
      void a.play().catch(() => {});
    } catch {
      /* ignored */
    }
    this.idx = (this.idx + 1) % POOL_SIZE;
  }
}

let pool: ClackPool | null = null;
let enabled = false;
let lastPlay = 0;

function getPool(): ClackPool {
  if (pool === null) pool = new ClackPool();
  return pool;
}

export function setClackEnabled(b: boolean): void {
  enabled = b;
  if (b) getPool().warmup();
}

export function isClackEnabled(): boolean {
  return enabled;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function playClack(): void {
  if (!enabled) return;
  if (prefersReducedMotion()) return;
  const now = Date.now();
  if (now - lastPlay < MIN_INTERVAL_MS) return;
  lastPlay = now;
  getPool().play();
}
