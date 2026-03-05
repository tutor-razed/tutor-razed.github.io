interface HelpOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const HelpOverlay = ({ open, onClose }: HelpOverlayProps): JSX.Element | null => {
  if (!open) return null;
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="overlay-card">
        <h2>Keyboard Help</h2>
        <ul>
          <li>Arrow keys: Move selection in current directory</li>
          <li>Enter: Open selected item</li>
          <li>Backspace: Go up one directory</li>
          <li>Ctrl+K or /: Open command palette</li>
          <li>Tab: Autocomplete command bar</li>
          <li>?: Toggle this help</li>
          <li>Esc: Close modal/palette</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
