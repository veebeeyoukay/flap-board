import { useState } from 'react';
import { FlapCell } from './components/FlapCell';

const PRESET_TARGETS = ['Z', 'A', 'M', '5', ' ', '+'];

export function Sandbox() {
  const [target, setTarget] = useState('A');
  const [input, setInput] = useState('Z');
  const [speed, setSpeed] = useState(60);

  return (
    <main className="sandbox">
      <header>
        <h1>flap-board sandbox</h1>
        <p>Slice 1 — isolated FlapCell with 3D split-flap animation.</p>
      </header>

      <section className="sandbox-stage" aria-label="cell">
        <FlapCell char={target} flapMs={speed} />
      </section>

      <section className="sandbox-controls">
        <div className="ctrl-row">
          {PRESET_TARGETS.map((c) => {
            const label = c === ' ' ? '␣' : c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setTarget(c)}
                aria-label={`Flip to ${c === ' ' ? 'space' : c}`}
              >
                Flip to {label}
              </button>
            );
          })}
        </div>
        <div className="ctrl-row">
          <label>
            Custom char:&nbsp;
            <input
              type="text"
              maxLength={1}
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              style={{ width: '3em' }}
            />
            <button
              type="button"
              style={{ marginLeft: '0.5em' }}
              onClick={() => setTarget(input || ' ')}
            >
              Flip
            </button>
          </label>
        </div>
        <div className="ctrl-row">
          <label>
            Flap speed:&nbsp;<code>{speed}ms</code>
            <input
              type="range"
              min={20}
              max={200}
              step={10}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ marginLeft: '0.5em', verticalAlign: 'middle' }}
            />
          </label>
        </div>
      </section>

      <footer>
        <small>
          Target: <code>{target}</code> · speed <code>{speed}ms</code> per flap ·{' '}
          <a
            href="https://github.com/veebeeyoukay/flap-board/issues/1"
            target="_blank"
            rel="noreferrer"
          >
            brief
          </a>
        </small>
      </footer>
    </main>
  );
}
