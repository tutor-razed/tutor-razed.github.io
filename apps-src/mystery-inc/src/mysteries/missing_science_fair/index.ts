import manifestJson from "./mystery.json";
import type { FileSeed, MysteryManifest, MysteryPack } from "../../engine/types";
import { validateMysteryPack } from "../../engine/validator";

const files = import.meta.glob("./files/**/*", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const toPath = (modulePath: string): string => modulePath.replace("./files", "");

const fileSeeds: FileSeed[] = Object.entries(files).map(([key, content]) => ({
  path: toPath(key),
  content,
}));

const manifest = manifestJson as MysteryManifest;
const validation = validateMysteryPack(manifest, fileSeeds);
if (validation.errors.length || validation.warnings.length) {
  // Validation should be noisy in dev so content authoring failures are visible immediately.
  // eslint-disable-next-line no-console
  console.warn("[mystery-pack validation]", {
    id: manifest.metadata.id,
    errors: validation.errors,
    warnings: validation.warnings,
  });
}

export const missingScienceFairPack: MysteryPack = {
  manifest,
  fileSeeds,
};
