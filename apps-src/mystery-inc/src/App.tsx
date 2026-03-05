import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { mysteries } from "./mysteries";
import { BootLogin } from "./ui/components/BootLogin";
import { MainMenu } from "./ui/components/MainMenu";
import { TerminalGame } from "./ui/components/TerminalGame";
import {
  clearSave,
  getBootSeen,
  getSkipBoot,
  loadSave,
  loadSettings,
  saveSettings,
  setBootSeen,
  setSkipBoot,
  type SavePayload,
} from "./ui/storage";

type Screen = "menu" | "boot" | "game" | "ending";

const mystery = mysteries[0];

export default function App(): JSX.Element {
  const initialSettings = useMemo(() => loadSettings(), []);
  const [screen, setScreen] = useState<Screen>("menu");
  const [ending, setEnding] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "normal">(initialSettings.difficulty);
  const [soundOn, setSoundOn] = useState(initialSettings.soundOn);
  const [themeId, setThemeId] = useState(initialSettings.themeId ?? mystery.manifest.metadata.defaultTheme);
  const [savePayload, setSavePayload] = useState<SavePayload | null>(() => loadSave(mystery.manifest.metadata.id));
  const [bootSeen, setBootSeenState] = useState<boolean>(() => getBootSeen(mystery.manifest.metadata.id));
  const [skipBoot, setSkipBootState] = useState<boolean>(() => getSkipBoot(mystery.manifest.metadata.id));

  const theme = mystery.manifest.metadata.themes.find((t) => t.id === themeId) ?? mystery.manifest.metadata.themes[0];

  const persistSettings = (next: { difficulty?: "easy" | "normal"; soundOn?: boolean; themeId?: string }): void => {
    const merged = {
      difficulty: next.difficulty ?? difficulty,
      soundOn: next.soundOn ?? soundOn,
      themeId: next.themeId ?? themeId,
    };
    saveSettings(merged);
  };

  const styles = theme.vars as CSSProperties;
  const hasSave = Boolean(savePayload);

  return (
    <div className="app-root" style={styles}>
      {screen === "menu" && (
        <MainMenu
          mystery={mystery}
          hasSave={hasSave}
          difficulty={difficulty}
          onDifficultyChange={(v) => {
            setDifficulty(v);
            persistSettings({ difficulty: v });
          }}
          soundOn={soundOn}
          onSoundChange={(v) => {
            setSoundOn(v);
            persistSettings({ soundOn: v });
          }}
          themeId={themeId}
          onThemeChange={(v) => {
            setThemeId(v);
            persistSettings({ themeId: v });
          }}
          skipBoot={skipBoot}
          canSkipBoot={bootSeen}
          onSkipBootChange={(v) => {
            setSkipBootState(v);
            setSkipBoot(mystery.manifest.metadata.id, v);
          }}
          onNewGame={() => {
            clearSave(mystery.manifest.metadata.id);
            setSavePayload(null);
            setScreen(skipBoot ? "game" : "boot");
          }}
          onContinue={() => {
            const save = loadSave(mystery.manifest.metadata.id);
            setSavePayload(save);
            setScreen(skipBoot ? "game" : "boot");
          }}
        />
      )}
      {screen === "boot" && (
        <BootLogin
          mystery={mystery}
          onDone={() => {
            if (!bootSeen) {
              setBootSeen(mystery.manifest.metadata.id);
              setBootSeenState(true);
            }
            setSkipBoot(mystery.manifest.metadata.id, skipBoot);
            setScreen("game");
          }}
        />
      )}
      {screen === "game" && (
        <TerminalGame
          mystery={mystery}
          initialSave={savePayload}
          difficulty={difficulty}
          soundOn={soundOn}
          onSoundChange={(v) => {
            setSoundOn(v);
            persistSettings({ soundOn: v });
          }}
          onDifficultyChange={(v) => {
            setDifficulty(v);
            persistSettings({ difficulty: v });
          }}
          onPersist={(payload) => {
            setSavePayload(payload);
            localStorage.setItem(`mystery-inc:save:${mystery.manifest.metadata.id}`, JSON.stringify(payload));
          }}
          onCaseSolved={(message) => {
            setEnding(message);
            setScreen("ending");
          }}
        />
      )}
      {screen === "ending" && (
        <div className="menu-shell">
          <h1>Case Closed</h1>
          <p>{ending}</p>
          <p>Culprit: Alex Mora</p>
          <p>The missing science fair file was recovered from the locked Downloads folder.</p>
          <button onClick={() => setScreen("menu")}>Back to Menu</button>
        </div>
      )}
    </div>
  );
}
