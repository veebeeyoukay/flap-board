import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { flipSequence } from '../animation/flapSequence';

interface FlapCellProps {
  char: string;
  flapMs?: number;
}

export function FlapCell({ char: targetChar, flapMs = 60 }: FlapCellProps) {
  const [current, setCurrent] = useState<string>(' ');
  const [pending, setPending] = useState<string | null>(null);

  const queueRef = useRef<string[]>([]);
  const currentRef = useRef(current);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    queueRef.current = flipSequence(currentRef.current, targetChar);

    let cancelled = false;

    const tick = (): void => {
      if (cancelled) return;
      const next = queueRef.current.shift();
      if (next === undefined) {
        setPending(null);
        return;
      }
      setPending(next);
      timerRef.current = window.setTimeout(() => {
        if (cancelled) return;
        setCurrent(next);
        tick();
      }, flapMs);
    };

    timerRef.current = window.setTimeout(tick, 0);

    return () => {
      cancelled = true;
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [targetChar, flapMs]);

  const topChar = pending ?? current;
  const botChar = current;
  const flipping = pending !== null;
  const cellStyle = { '--flap-ms': `${flapMs}ms` } as CSSProperties;

  return (
    <div className="flap-cell" style={cellStyle} aria-label={topChar}>
      <div className="flap-half flap-half-top">
        <span>{topChar}</span>
      </div>
      <div className="flap-half flap-half-bottom">
        <span>{botChar}</span>
      </div>
      {flipping && (
        <>
          <div key={`up-${current}-${pending}`} className="flap-leaf flap-leaf-upper">
            <span>{current}</span>
          </div>
          <div key={`lo-${current}-${pending}`} className="flap-leaf flap-leaf-lower">
            <span>{pending}</span>
          </div>
        </>
      )}
    </div>
  );
}
