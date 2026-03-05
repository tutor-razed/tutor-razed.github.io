export type Difficulty = "easy" | "normal";

export interface ThemeConfig {
  id: string;
  label: string;
  vars: Record<string, string>;
}

export interface FileMetadata {
  createdAt: string;
  modifiedAt: string;
  owner: string;
  permissions: string;
}

export interface LockDef {
  type: "password" | "flag";
  value: string;
  attemptsMessage?: string;
}

export interface FileConfig {
  path: string;
  hidden?: boolean;
  binary?: boolean;
  lock?: LockDef;
  metadata?: Partial<FileMetadata>;
  revealed?: boolean;
}

export interface Objective {
  id: string;
  text: string;
  completed?: boolean;
}

export interface HintRule {
  id: string;
  text: string;
  whenObjectiveIncomplete?: string;
  whenFlag?: string;
  minActions?: number;
  strong?: boolean;
}

export interface ClueDef {
  id: string;
  title: string;
  description: string;
  evidenceRefs: string[];
}

export type EventTrigger =
  | { type: "after_actions"; count: number; once?: boolean }
  | { type: "on_read"; path: string; once?: boolean }
  | { type: "on_open_dir"; path: string; once?: boolean }
  | { type: "on_flag"; flag: string; equals?: string | boolean | number; once?: boolean };

export type EventEffect =
  | { type: "reveal_path"; path: string }
  | { type: "unlock_path"; path: string }
  | { type: "add_message"; message: string }
  | { type: "add_clue"; clueId: string }
  | { type: "set_flag"; key: string; value: string | boolean | number }
  | { type: "update_objective"; objectiveId: string; completed: boolean };

export interface EventRule {
  id: string;
  trigger: EventTrigger;
  effects: EventEffect[];
}

export interface SolutionRule {
  culprit: string;
  requiredClueIds: string[];
}

export interface MysteryManifest {
  metadata: {
    id: string;
    title: string;
    estimatedMinutes: string;
    difficultyOptions: Difficulty[];
    defaultTheme: string;
    themes: ThemeConfig[];
  };
  boot: {
    lines: string[];
    login: {
      username: string;
      prompt: string;
      acceptedPasswords: string[];
      welcomeMessage: string;
    };
  };
  initialPath: string;
  fileConfig: FileConfig[];
  initialObjectives: Objective[];
  hints: HintRule[];
  clues: ClueDef[];
  suspects: string[];
  events: EventRule[];
  solution: SolutionRule;
}

export interface FileSeed {
  path: string;
  content: string;
}

export type NodeType = "dir" | "file";

export interface VfsNode {
  path: string;
  name: string;
  type: NodeType;
  children: string[];
  content?: string;
  hidden: boolean;
  binary: boolean;
  lock?: LockDef;
  revealed: boolean;
  metadata: FileMetadata;
}

export interface TimelineEntry {
  ts: string;
  text: string;
}

export interface EngineState {
  currentPath: string;
  selectedPath: string | null;
  actionCount: number;
  objectives: Objective[];
  flags: Record<string, string | boolean | number>;
  discoveredPaths: string[];
  discoveredClues: string[];
  unlockedPaths: string[];
  lockAttempts: Record<string, number>;
  timeline: TimelineEntry[];
  eventHistory: string[];
  currentFilePath: string | null;
  notesOpen: boolean;
  complete: boolean;
}

export interface SolveAttempt {
  culprit: string;
  evidenceIds: string[];
}

export interface SolveResult {
  success: boolean;
  message: string;
}

export interface MysteryPack {
  manifest: MysteryManifest;
  fileSeeds: FileSeed[];
}
