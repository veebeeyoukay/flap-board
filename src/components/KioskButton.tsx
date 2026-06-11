import { useFullscreen } from '../hooks/useFullscreen';
import { useAutoHideCursor } from '../hooks/useAutoHideCursor';

export function KioskButton() {
  const { isFullscreen, toggle } = useFullscreen();
  useAutoHideCursor(isFullscreen);

  return (
    <button
      type="button"
      className="kiosk-toggle"
      onClick={() => {
        void toggle();
      }}
      aria-label={isFullscreen ? 'exit kiosk mode' : 'enter kiosk mode'}
      data-fullscreen={isFullscreen || undefined}
    >
      {isFullscreen ? 'Exit kiosk' : 'Kiosk'}
    </button>
  );
}
