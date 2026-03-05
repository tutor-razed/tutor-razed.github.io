import type { EngineState, VfsNode } from "./types";

export interface CommandOption {
  id: string;
  command: string;
  description: string;
}

const baseCommands: CommandOption[] = [
  { id: "cmd-open", command: "open <name>", description: "Open a file or enter a directory" },
  { id: "cmd-meta", command: "meta <name>", description: "Inspect metadata" },
  { id: "cmd-search", command: "search <term>", description: "Search discovered files" },
  { id: "cmd-up", command: "cd ..", description: "Move to parent directory" },
  { id: "cmd-unlock", command: "unlock <path> <password>", description: "Unlock a protected path" },
  { id: "cmd-hint", command: "hint", description: "Get a nudge" },
  { id: "cmd-stuck", command: "stuck", description: "Get a stronger hint in Easy mode" },
  { id: "cmd-notes", command: "notes", description: "Toggle case notes app" },
  { id: "cmd-solve", command: "solve", description: "Open accusation form" },
  { id: "cmd-help", command: "help", description: "Show keyboard help" },
];

export const getValidCommands = (state: EngineState, entries: VfsNode[]): CommandOption[] => {
  const options = [...baseCommands];
  const hasFile = entries.some((e) => e.type === "file");
  if (!hasFile) {
    return options.filter((o) => o.id !== "cmd-meta");
  }
  if (state.flags.difficulty !== "easy") {
    return options.filter((o) => o.id !== "cmd-stuck");
  }
  return options;
};

export const autocompleteFromEntries = (entries: VfsNode[], input: string): string | null => {
  const trimmed = input.trimStart();
  if (!trimmed) return null;
  const [head, ...rest] = trimmed.split(/\s+/);
  if ((head !== "open" && head !== "meta") || rest.length === 0) return null;
  const prefix = rest.join(" ");
  const candidate = entries.find((e) => e.name.startsWith(prefix));
  if (!candidate) return null;
  return `${head} ${candidate.name}`;
};
