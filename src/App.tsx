import { useEffect, useState } from 'react';
import { Sandbox } from './Sandbox';
import { FlapBoard } from './components/FlapBoard';
import { SettingsPanel } from './components/SettingsPanel';
import { useBoardStore } from './state/store';
import { resolvePalette } from './theme/themes';
import { applyTheme } from './theme/applyTheme';
import { loadConfig, saveConfig } from './state/persistence';

function isSandboxRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has('sandbox');
}

function App() {
  const theme = useBoardStore((s) => s.config.theme);
  const customTheme = useBoardStore((s) => s.config.customTheme);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadConfig().then((cfg) => {
      if (!cancelled) useBoardStore.getState().setConfig(cfg);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsub = useBoardStore.subscribe(
      (s) => s.config,
      (cfg) => {
        void saveConfig(cfg);
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    applyTheme(resolvePalette(theme, customTheme));
  }, [theme, customTheme]);

  if (isSandboxRoute()) return <Sandbox />;

  return (
    <div className="board-page">
      <FlapBoard />
      <button
        type="button"
        className="settings-toggle"
        onClick={() => setSettingsOpen((v) => !v)}
        aria-expanded={settingsOpen}
      >
        {settingsOpen ? 'Close' : 'Settings'}
      </button>
      {settingsOpen && (
        <>
          <div
            className="settings-backdrop"
            onClick={() => setSettingsOpen(false)}
            aria-hidden="true"
          />
          <SettingsPanel onClose={() => setSettingsOpen(false)} />
        </>
      )}
    </div>
  );
}

export default App;
