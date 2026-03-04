import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const sourcePath = resolve(root, "resources.portal.json");
const targetPath = resolve(root, "apps-src/portal/public/resources.json");

async function main() {
  const raw = await readFile(sourcePath, "utf8");
  const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));

  if (!Array.isArray(parsed)) {
    throw new Error("resources.portal.json must contain a JSON array.");
  }

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");

  console.log(`Synced resources: ${sourcePath} -> ${targetPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});