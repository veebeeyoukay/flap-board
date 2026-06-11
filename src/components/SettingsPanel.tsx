import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useBoardStore } from '../state/store';
import { parseBoardConfig, SchemaVersionError } from '../schema/boardConfig';
import { DEMO_CONFIG } from '../schema/demo';
import { DataSourceEditor } from './DataSourceEditor';
import type { Align, ThemeKey } from '../schema/types';

interface SettingsPanelProps {
  onClose: () => void;
}

const THEMES: ThemeKey[] = ['solari', 'amber', 'green', 'custom'];
const ALIGNS: Align[] = ['left', 'center', 'right'];

function downloadJson(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const config = useBoardStore((s) => s.config);
  const store = useBoardStore.getState();
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onExport = (): void => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadJson(`flap-board-${stamp}.json`, JSON.stringify(config, null, 2));
  };

  const onPickFile = (): void => {
    if (fileRef.current !== null) fileRef.current.click();
  };

  const onImportFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    void file
      .text()
      .then((text) => {
        const json: unknown = JSON.parse(text);
        const parsed = parseBoardConfig(json);
        store.setConfig(parsed);
      })
      .catch((err: unknown) => {
        if (err instanceof SchemaVersionError) {
          setImportError(err.message);
        } else if (err instanceof Error) {
          setImportError(`Invalid config: ${err.message}`);
        } else {
          setImportError('Invalid config');
        }
      })
      .finally(() => {
        if (fileRef.current !== null) fileRef.current.value = '';
      });
  };

  const onResetDemo = (): void => {
    store.setConfig(DEMO_CONFIG);
  };

  return (
    <aside className="settings-drawer" aria-label="settings">
      <header className="settings-header">
        <h2>Settings</h2>
        <button type="button" onClick={onClose} aria-label="close settings">
          ×
        </button>
      </header>

      <section className="settings-section">
        <h3>General</h3>
        <label className="field">
          Title
          <input
            type="text"
            value={config.title}
            onChange={(e) => store.setTitle(e.target.value)}
          />
        </label>
        <label className="field-inline">
          <input
            type="checkbox"
            checked={config.showHeader}
            onChange={(e) => store.setShowHeader(e.target.checked)}
          />
          Show column header
        </label>
      </section>

      <section className="settings-section">
        <h3>Theme</h3>
        <div className="ctrl-row">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              data-active={config.theme === t || undefined}
              onClick={() => store.setTheme(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h3>Timing</h3>
        <label className="field">
          Flap: <code>{config.flapMs}ms</code>
          <input
            type="range"
            min={20}
            max={200}
            step={10}
            value={config.flapMs}
            onChange={(e) => store.setFlapMs(Number(e.target.value))}
          />
        </label>
        <label className="field">
          Cascade stagger: <code>{config.cascadeStaggerMs}ms</code>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={config.cascadeStaggerMs}
            onChange={(e) => store.setCascadeStaggerMs(Number(e.target.value))}
          />
        </label>
      </section>

      <section className="settings-section">
        <h3>Sound</h3>
        <label className="field-inline">
          <input
            type="checkbox"
            checked={config.sound?.enabled === true}
            onChange={(e) => store.setSoundEnabled(e.target.checked)}
          />
          Play mechanical clack on flips
        </label>
        <p className="field-help">
          Off by default. Requires a user interaction to start on iOS.
        </p>
      </section>

      <section className="settings-section">
        <h3>Columns</h3>
        {config.columns.map((col, i) => (
          <div className="col-row" key={col.key}>
            <input
              type="text"
              value={col.label}
              onChange={(e) =>
                store.updateColumn(i, { label: e.target.value })
              }
              aria-label={`Column ${i + 1} label`}
            />
            <input
              type="number"
              min={1}
              max={20}
              value={col.widthChars}
              onChange={(e) =>
                store.updateColumn(i, {
                  widthChars: Math.max(1, Number(e.target.value)),
                })
              }
              aria-label={`Column ${i + 1} width`}
              style={{ width: '4em' }}
            />
            <select
              value={col.align}
              onChange={(e) =>
                store.updateColumn(i, { align: e.target.value as Align })
              }
              aria-label={`Column ${i + 1} align`}
            >
              {ALIGNS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => store.removeColumn(i)}
              aria-label={`Remove column ${i + 1}`}
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={() => store.addColumn()}>
          + Add column
        </button>
      </section>

      <section className="settings-section">
        <h3>Rows ({config.rows.length})</h3>
        <div className="rows-edit">
          {config.rows.map((row, i) => {
            const preview = config.columns
              .map((c) => row.values[c.key] ?? '')
              .filter((v) => v !== '')
              .slice(0, 2)
              .join(' · ');
            return (
              <details key={row.id}>
                <summary>
                  Row {i + 1}: {preview || '(empty)'}
                </summary>
                <div className="row-fields">
                  {config.columns.map((col) => (
                    <label key={col.key} className="field">
                      {col.label}
                      <input
                        type="text"
                        value={row.values[col.key] ?? ''}
                        onChange={(e) =>
                          store.updateRowValue(row.id, col.key, e.target.value)
                        }
                      />
                    </label>
                  ))}
                  <button type="button" onClick={() => store.removeRow(row.id)}>
                    Delete row
                  </button>
                </div>
              </details>
            );
          })}
          <button type="button" onClick={() => store.addRow()}>
            + Add row
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h3>Data Source</h3>
        <DataSourceEditor />
      </section>

      <section className="settings-section">
        <h3>Data</h3>
        <div className="ctrl-row">
          <button type="button" onClick={onExport}>
            Export JSON
          </button>
          <button type="button" onClick={onPickFile}>
            Import JSON
          </button>
          <button type="button" onClick={onResetDemo}>
            Reset to demo
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={onImportFile}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        {importError !== null && (
          <p className="settings-error" role="alert">
            {importError}
          </p>
        )}
      </section>

      <footer className="settings-footer">
        <small>
          schema {config.schemaVersion} ·{' '}
          <a href="?sandbox=1">sandbox</a>
        </small>
      </footer>
    </aside>
  );
}
