import type { MysteryPack } from "../../engine/types";

interface MainMenuProps {
  mystery: MysteryPack;
  hasSave: boolean;
  difficulty: "easy" | "normal";
  onDifficultyChange: (v: "easy" | "normal") => void;
  soundOn: boolean;
  onSoundChange: (v: boolean) => void;
  themeId: string;
  onThemeChange: (themeId: string) => void;
  skipBoot: boolean;
  canSkipBoot: boolean;
  onSkipBootChange: (v: boolean) => void;
  onNewGame: () => void;
  onContinue: () => void;
}

export const MainMenu = ({
  mystery,
  hasSave,
  difficulty,
  onDifficultyChange,
  soundOn,
  onSoundChange,
  themeId,
  onThemeChange,
  skipBoot,
  canSkipBoot,
  onSkipBootChange,
  onNewGame,
  onContinue,
}: MainMenuProps): JSX.Element => (
  <div className="menu-shell" role="main">
    <h1>{mystery.manifest.metadata.title}</h1>
    <p>Estimated length: {mystery.manifest.metadata.estimatedMinutes} minutes</p>
    <div className="menu-grid">
      <section>
        <h2>Case File</h2>
        <button onClick={onNewGame}>New Game</button>
        <button onClick={onContinue} disabled={!hasSave}>
          Continue
        </button>
      </section>
      <section>
        <h2>Settings</h2>
        <label>
          Difficulty
          <select value={difficulty} onChange={(e) => onDifficultyChange(e.target.value as "easy" | "normal")}>
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
          </select>
        </label>
        <label>
          Theme
          <select value={themeId} onChange={(e) => onThemeChange(e.target.value)}>
            {mystery.manifest.metadata.themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={soundOn} onChange={(e) => onSoundChange(e.target.checked)} />
          Sound effects
        </label>
        <label>
          <input
            type="checkbox"
            checked={skipBoot}
            disabled={!canSkipBoot}
            onChange={(e) => onSkipBootChange(e.target.checked)}
          />
          Skip boot after first view
        </label>
      </section>
    </div>
    <p className="menu-hint">Keyboard: Tab to focus, Enter to activate, Esc to close popups in-game.</p>
  </div>
);
