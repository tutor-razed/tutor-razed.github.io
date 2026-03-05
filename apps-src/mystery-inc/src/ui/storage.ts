import type { EngineState } from "../engine/types";

const SETTINGS_KEY = "mystery-inc:settings";
const saveKey = (id: string): string => `mystery-inc:save:${id}`;
const skipBootKey = (id: string): string => `mystery-inc:skipboot:${id}`;
const bootSeenKey = (id: string): string => `mystery-inc:bootseen:${id}`;

export interface UserSettings {
  difficulty: "easy" | "normal";
  soundOn: boolean;
  themeId?: string;
}

export interface SavePayload {
  state: EngineState;
  revealedPaths: string[];
}

export const loadSettings = (): UserSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { difficulty: "normal", soundOn: false };
    const parsed = JSON.parse(raw) as UserSettings;
    return {
      difficulty: parsed.difficulty === "easy" ? "easy" : "normal",
      soundOn: Boolean(parsed.soundOn),
      themeId: parsed.themeId,
    };
  } catch {
    return { difficulty: "normal", soundOn: false };
  }
};

export const saveSettings = (settings: UserSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadSave = (mysteryId: string): SavePayload | null => {
  try {
    const raw = localStorage.getItem(saveKey(mysteryId));
    if (!raw) return null;
    return JSON.parse(raw) as SavePayload;
  } catch {
    return null;
  }
};

export const saveGame = (mysteryId: string, payload: SavePayload): void => {
  localStorage.setItem(saveKey(mysteryId), JSON.stringify(payload));
};

export const clearSave = (mysteryId: string): void => {
  localStorage.removeItem(saveKey(mysteryId));
};

export const getSkipBoot = (mysteryId: string): boolean => localStorage.getItem(skipBootKey(mysteryId)) === "1";

export const setSkipBoot = (mysteryId: string, value: boolean): void => {
  localStorage.setItem(skipBootKey(mysteryId), value ? "1" : "0");
};

export const getBootSeen = (mysteryId: string): boolean => localStorage.getItem(bootSeenKey(mysteryId)) === "1";

export const setBootSeen = (mysteryId: string): void => {
  localStorage.setItem(bootSeenKey(mysteryId), "1");
};
