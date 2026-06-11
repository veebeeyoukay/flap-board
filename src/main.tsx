import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/flap.css';
import './styles/board.css';
import './styles/settings.css';
import './styles/polling.css';
import './styles/kiosk.css';

const root = document.getElementById('root');
if (!root) throw new Error('root element missing');

registerSW({ immediate: true });

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
