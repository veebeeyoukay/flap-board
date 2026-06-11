import { useEffect } from 'react';
import { Sandbox } from './Sandbox';
import { FlapBoard } from './components/FlapBoard';
import { DemoControls } from './components/DemoControls';
import { useBoardStore } from './state/store';
import { resolvePalette } from './theme/themes';
import { applyTheme } from './theme/applyTheme';

function isSandboxRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has('sandbox');
}

function App() {
  const theme = useBoardStore((s) => s.config.theme);
  const customTheme = useBoardStore((s) => s.config.customTheme);

  useEffect(() => {
    applyTheme(resolvePalette(theme, customTheme));
  }, [theme, customTheme]);

  if (isSandboxRoute()) return <Sandbox />;

  return (
    <div className="board-page">
      <FlapBoard />
      <DemoControls />
    </div>
  );
}

export default App;
