
import { Project, GlobalSettings, Difficulty, Theme, MoodCategory } from '../types';

const SCHEMA_VERSION = 1;
const STORAGE_KEYS = {
  PROJECTS: 'story_symphony_projects',
  SETTINGS: 'story_symphony_settings',
  VERSION: 'story_symphony_version'
};

const DEFAULT_SETTINGS: GlobalSettings = {
  defaultDifficulty: Difficulty.BEGINNER,
  theme: Theme.LIGHT,
  focusModeDefault: false,
  reduceMotion: false,
  customLexicon: {
    mood: {
      [MoodCategory.JOY]: [],
      [MoodCategory.ANGER]: [],
      [MoodCategory.SADNESS]: [],
      [MoodCategory.FEAR]: [],
      [MoodCategory.WONDER]: []
    },
    sensory: {
      sight: [],
      sound: [],
      smell: [],
      taste: [],
      touch: []
    }
  }
};

export const initStorage = () => {
  const version = localStorage.getItem(STORAGE_KEYS.VERSION);
  if (!version || parseInt(version) < SCHEMA_VERSION) {
    localStorage.setItem(STORAGE_KEYS.VERSION, SCHEMA_VERSION.toString());
  }
};

export const getProjects = (): Project[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return data ? JSON.parse(data) : [];
};

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const getSettings = (): GlobalSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!data) return DEFAULT_SETTINGS;
  const parsed = JSON.parse(data);
  // Ensure customLexicon exists for older versions
  if (!parsed.customLexicon) {
    parsed.customLexicon = DEFAULT_SETTINGS.customLexicon;
  }
  return parsed;
};

export const saveSettings = (settings: GlobalSettings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};
