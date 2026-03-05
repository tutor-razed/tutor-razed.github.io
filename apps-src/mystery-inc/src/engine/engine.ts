import type {
  ClueDef,
  EngineState,
  EventRule,
  EventTrigger,
  MysteryPack,
  Objective,
  SolveAttempt,
  SolveResult,
  TimelineEntry,
  VfsNode,
} from "./types";
import { buildVfs, normalizePath, parentPath } from "./vfs";

const nowStamp = (): string => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const uniq = <T>(values: T[]): T[] => Array.from(new Set(values));

export interface Engine {
  readonly manifest: MysteryPack["manifest"];
  readonly nodes: Map<string, VfsNode>;
  readonly cluesById: Map<string, ClueDef>;
}

export interface ActionResult {
  ok: boolean;
  message?: string;
  timeline?: TimelineEntry[];
}

export const createEngine = (pack: MysteryPack): Engine => {
  const { nodes } = buildVfs(pack.manifest, pack.fileSeeds);
  return {
    manifest: pack.manifest,
    nodes,
    cluesById: new Map(pack.manifest.clues.map((c) => [c.id, c] as const)),
  };
};

export const createInitialState = (engine: Engine): EngineState => ({
  currentPath: normalizePath(engine.manifest.initialPath),
  selectedPath: null,
  actionCount: 0,
  objectives: engine.manifest.initialObjectives.map((o) => ({ ...o })),
  flags: {},
  discoveredPaths: [normalizePath(engine.manifest.initialPath)],
  discoveredClues: [],
  unlockedPaths: [],
  lockAttempts: {},
  timeline: [{ ts: nowStamp(), text: "Session started." }],
  eventHistory: [],
  currentFilePath: null,
  notesOpen: false,
  complete: false,
});

export const listDirectory = (engine: Engine, state: EngineState, path: string): VfsNode[] => {
  const node = engine.nodes.get(normalizePath(path));
  if (!node || node.type !== "dir") return [];
  const easyMode = state.flags.difficulty === "easy";
  return node.children
    .map((childPath) => engine.nodes.get(childPath))
    .filter((child): child is VfsNode => Boolean(child))
    .filter((child) => child.revealed && (easyMode || !child.hidden));
};

const hasAccess = (state: EngineState, node: VfsNode): boolean => {
  if (!node.lock) return true;
  if (node.lock.type === "flag") {
    return Boolean(state.flags[node.lock.value]);
  }
  return state.unlockedPaths.includes(node.path);
};

const addTimeline = (state: EngineState, text: string): EngineState => ({
  ...state,
  timeline: [...state.timeline, { ts: nowStamp(), text }],
});

const markAction = (state: EngineState): EngineState => ({
  ...state,
  actionCount: state.actionCount + 1,
});

const markDiscovered = (state: EngineState, path: string): EngineState => ({
  ...state,
  discoveredPaths: uniq([...state.discoveredPaths, normalizePath(path)]),
});

const setObjective = (state: EngineState, objectiveId: string, completed: boolean): EngineState => ({
  ...state,
  objectives: state.objectives.map((o) => (o.id === objectiveId ? { ...o, completed } : o)),
});

const applyEventEffects = (engine: Engine, state: EngineState, rule: EventRule): EngineState => {
  let next = { ...state };
  for (const effect of rule.effects) {
    if (effect.type === "reveal_path") {
      const node = engine.nodes.get(normalizePath(effect.path));
      if (node) node.revealed = true;
    }
    if (effect.type === "unlock_path") {
      next = { ...next, unlockedPaths: uniq([...next.unlockedPaths, normalizePath(effect.path)]) };
    }
    if (effect.type === "add_message") {
      next = addTimeline(next, effect.message);
    }
    if (effect.type === "add_clue") {
      if (!next.discoveredClues.includes(effect.clueId)) {
        next = {
          ...next,
          discoveredClues: [...next.discoveredClues, effect.clueId],
          timeline: [...next.timeline, { ts: nowStamp(), text: `Clue added: ${effect.clueId}` }],
        };
      }
    }
    if (effect.type === "set_flag") {
      next = { ...next, flags: { ...next.flags, [effect.key]: effect.value } };
    }
    if (effect.type === "update_objective") {
      next = setObjective(next, effect.objectiveId, effect.completed);
    }
  }
  return {
    ...next,
    eventHistory: [...next.eventHistory, rule.id],
  };
};

const triggerMatches = (
  trigger: EventTrigger,
  state: EngineState,
  context: { type: "read" | "open_dir" | "set_flag" | "action"; path?: string; flag?: string },
): boolean => {
  if (trigger.type === "after_actions") {
    return state.actionCount >= trigger.count;
  }
  if (trigger.type === "on_read") {
    return context.type === "read" && normalizePath(context.path ?? "") === normalizePath(trigger.path);
  }
  if (trigger.type === "on_open_dir") {
    return context.type === "open_dir" && normalizePath(context.path ?? "") === normalizePath(trigger.path);
  }
  if (trigger.type === "on_flag") {
    if (context.type !== "set_flag" || context.flag !== trigger.flag) return false;
    if (trigger.equals === undefined) return true;
    return state.flags[trigger.flag] === trigger.equals;
  }
  return false;
};

export const runEvents = (
  engine: Engine,
  state: EngineState,
  context: { type: "read" | "open_dir" | "set_flag" | "action"; path?: string; flag?: string },
): EngineState => {
  let next = state;
  for (const rule of engine.manifest.events) {
    if (next.eventHistory.includes(rule.id)) continue;
    if (triggerMatches(rule.trigger, next, context)) {
      next = applyEventEffects(engine, next, rule);
    }
  }
  return next;
};

export const moveToPath = (engine: Engine, state: EngineState, path: string): [EngineState, ActionResult] => {
  const p = normalizePath(path);
  const node = engine.nodes.get(p);
  if (!node || node.type !== "dir" || !node.revealed) {
    return [state, { ok: false, message: `cd: cannot access ${p}` }];
  }
  if (!hasAccess(state, node)) {
    return [state, { ok: false, message: `cd: permission denied ${p}` }];
  }
  let next = markAction({ ...state, currentPath: p, currentFilePath: null });
  next = markDiscovered(next, p);
  next = runEvents(engine, next, { type: "open_dir", path: p });
  next = runEvents(engine, next, { type: "action" });
  return [next, { ok: true, message: `Entered ${p}` }];
};

export const moveUp = (engine: Engine, state: EngineState): [EngineState, ActionResult] =>
  moveToPath(engine, state, parentPath(state.currentPath));

export const openPath = (engine: Engine, state: EngineState, path: string): [EngineState, ActionResult] => {
  const p = normalizePath(path.startsWith("/") ? path : `${state.currentPath}/${path}`);
  const node = engine.nodes.get(p);
  if (!node || !node.revealed) return [state, { ok: false, message: `open: no such file ${p}` }];
  if (!hasAccess(state, node)) return [state, { ok: false, message: `open: locked ${p}` }];
  if (node.type === "dir") return moveToPath(engine, state, p);

  let next = markAction({ ...state, currentFilePath: p, selectedPath: p });
  next = markDiscovered(next, p);
  next = runEvents(engine, next, { type: "read", path: p });
  next = runEvents(engine, next, { type: "action" });
  return [next, { ok: true, message: `Reading ${p}` }];
};

export const inspectMeta = (engine: Engine, state: EngineState, path: string): [EngineState, ActionResult] => {
  const p = normalizePath(path.startsWith("/") ? path : `${state.currentPath}/${path}`);
  const node = engine.nodes.get(p);
  if (!node || !node.revealed) return [state, { ok: false, message: `meta: no such path ${p}` }];
  const m = node.metadata;
  const msg = `${node.path} | owner=${m.owner} perms=${m.permissions} modified=${m.modifiedAt}`;
  const next = runEvents(engine, markAction(state), { type: "action" });
  return [addTimeline(next, msg), { ok: true, message: msg }];
};

export const search = (
  engine: Engine,
  state: EngineState,
  term: string,
): [EngineState, ActionResult & { hits: string[] }] => {
  const needle = term.trim().toLowerCase();
  if (!needle) return [state, { ok: false, message: "search: empty query", hits: [] }];
  const easyMode = state.flags.difficulty === "easy";
  const hits: string[] = [];
  for (const node of engine.nodes.values()) {
    if (!node.revealed) continue;
    if (!easyMode && !state.discoveredPaths.includes(node.path)) continue;
    if (node.name.toLowerCase().includes(needle)) hits.push(node.path);
    if (node.type === "file" && !node.binary && node.content?.toLowerCase().includes(needle)) hits.push(node.path);
  }
  const uniqueHits = uniq(hits);
  const next = runEvents(engine, markAction(state), { type: "action" });
  return [next, { ok: true, message: uniqueHits.length ? `search: ${uniqueHits.length} hit(s)` : "search: no hits", hits: uniqueHits }];
};

export const tryUnlock = (
  engine: Engine,
  state: EngineState,
  path: string,
  password: string,
): [EngineState, ActionResult] => {
  const p = normalizePath(path.startsWith("/") ? path : `${state.currentPath}/${path}`);
  const node = engine.nodes.get(p);
  if (!node?.lock || node.lock.type !== "password") return [state, { ok: false, message: "unlock: no password lock" }];
  const attempts = (state.lockAttempts[p] ?? 0) + 1;
  const nextBase: EngineState = {
    ...state,
    lockAttempts: { ...state.lockAttempts, [p]: attempts },
  };
  if (node.lock.value === password.trim()) {
    let next = {
      ...nextBase,
      unlockedPaths: uniq([...nextBase.unlockedPaths, p]),
      flags: { ...nextBase.flags, [`unlocked:${p}`]: true },
    };
    next = runEvents(engine, next, { type: "set_flag", flag: `unlocked:${p}` });
    next = runEvents(engine, markAction(next), { type: "action" });
    return [addTimeline(next, `Lock opened: ${p}`), { ok: true, message: "unlock: accepted" }];
  }
  const failMsg = node.lock.attemptsMessage ?? "unlock: incorrect password";
  const failed = runEvents(engine, markAction(nextBase), { type: "action" });
  return [failed, { ok: false, message: failMsg }];
};

export const toggleNotes = (state: EngineState): EngineState => ({ ...state, notesOpen: !state.notesOpen });

export const getCurrentFileContent = (engine: Engine, state: EngineState): string => {
  if (!state.currentFilePath) return "No file selected.";
  const node = engine.nodes.get(state.currentFilePath);
  if (!node || node.type !== "file") return "No file selected.";
  if (node.binary) return "Binary artifact cannot be rendered.\nUse `meta` to inspect metadata.";
  return node.content ?? "";
};

export const getStrongHint = (engine: Engine, state: EngineState): string => {
  const options = engine.manifest.hints.filter((h) => h.strong);
  for (const hint of options) {
    if (hint.minActions && state.actionCount < hint.minActions) continue;
    if (hint.whenFlag && !state.flags[hint.whenFlag]) continue;
    if (hint.whenObjectiveIncomplete) {
      const obj = state.objectives.find((o) => o.id === hint.whenObjectiveIncomplete);
      if (!obj || obj.completed) continue;
    }
    return hint.text;
  }
  return "Try opening logs in /var/log and compare with recent documents in /home/student/Documents.";
};

export const getNudgeHint = (engine: Engine, state: EngineState): string => {
  for (const hint of engine.manifest.hints) {
    if (hint.strong) continue;
    if (hint.minActions && state.actionCount < hint.minActions) continue;
    if (hint.whenFlag && !state.flags[hint.whenFlag]) continue;
    if (hint.whenObjectiveIncomplete) {
      const obj = state.objectives.find((o) => o.id === hint.whenObjectiveIncomplete);
      if (!obj || obj.completed) continue;
    }
    return hint.text;
  }
  return "Scan directory names for anything related to the science fair upload.";
};

export const solveCase = (engine: Engine, _state: EngineState, attempt: SolveAttempt): SolveResult => {
  const target = engine.manifest.solution;
  if (attempt.culprit !== target.culprit) {
    return { success: false, message: "That suspect does not fit the evidence." };
  }
  const missing = target.requiredClueIds.filter((id) => !attempt.evidenceIds.includes(id));
  if (missing.length > 0) {
    return {
      success: false,
      message: `Missing evidence: ${missing.join(", ")}`,
    };
  }
  return { success: true, message: "Case solved. Great detective work." };
};

export const getObjectiveProgress = (objectives: Objective[]): { done: number; total: number } => ({
  done: objectives.filter((o) => o.completed).length,
  total: objectives.length,
});
