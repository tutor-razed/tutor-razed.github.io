import type { FileSeed, MysteryManifest } from "./types";
import { normalizePath } from "./vfs";

const existsPath = (paths: Set<string>, path: string): boolean => paths.has(normalizePath(path));

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export const validateMysteryPack = (manifest: MysteryManifest, files: FileSeed[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const filePaths = new Set(files.map((f) => normalizePath(f.path)));
  const cfgPaths = new Set(manifest.fileConfig.map((f) => normalizePath(f.path)));
  const allPaths = new Set([...filePaths, ...cfgPaths, "/"]);

  if (!manifest.metadata?.id) errors.push("metadata.id is required");
  if (!manifest.metadata?.title) errors.push("metadata.title is required");
  if (!manifest.initialPath) errors.push("initialPath is required");
  if (!manifest.solution?.culprit) errors.push("solution.culprit is required");
  if (!manifest.solution?.requiredClueIds?.length) errors.push("solution.requiredClueIds must not be empty");

  if (manifest.initialPath && !existsPath(allPaths, manifest.initialPath)) {
    errors.push(`initialPath does not exist: ${manifest.initialPath}`);
  }

  for (const clue of manifest.clues) {
    for (const ref of clue.evidenceRefs) {
      if (!existsPath(allPaths, ref)) {
        errors.push(`clue ${clue.id} references missing path: ${ref}`);
      }
    }
  }

  for (const event of manifest.events) {
    const trigger = event.trigger;
    if (trigger.type === "on_read" || trigger.type === "on_open_dir") {
      if (!existsPath(allPaths, trigger.path)) {
        errors.push(`event ${event.id} trigger path missing: ${trigger.path}`);
      }
    }
    for (const effect of event.effects) {
      if ((effect.type === "reveal_path" || effect.type === "unlock_path") && !existsPath(allPaths, effect.path)) {
        errors.push(`event ${event.id} effect path missing: ${effect.path}`);
      }
      if (effect.type === "add_clue") {
        const exists = manifest.clues.some((c) => c.id === effect.clueId);
        if (!exists) errors.push(`event ${event.id} references missing clueId: ${effect.clueId}`);
      }
      if (effect.type === "update_objective") {
        const exists = manifest.initialObjectives.some((o) => o.id === effect.objectiveId);
        if (!exists) errors.push(`event ${event.id} references missing objectiveId: ${effect.objectiveId}`);
      }
    }
  }

  for (const id of manifest.solution.requiredClueIds) {
    if (!manifest.clues.some((c) => c.id === id)) {
      errors.push(`solution references unknown clue id: ${id}`);
    }
  }

  if (!manifest.metadata.difficultyOptions.includes("easy")) {
    warnings.push("difficultyOptions does not include easy; hints may be unreachable.");
  }
  if (manifest.hints.length === 0) {
    warnings.push("No hints defined.");
  }

  return { errors, warnings };
};
