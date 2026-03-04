import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const DEFAULT_MANIFEST = "apps.manifest.json";

function normalizeMount(mount) {
  if (typeof mount !== "string" || mount.trim() === "") {
    throw new Error("Each app must define a non-empty mount path.");
  }

  let value = mount.trim();
  if (!value.startsWith("/")) value = `/${value}`;
  if (value !== "/" && !value.endsWith("/")) value = `${value}/`;
  return value;
}

function toSiteSubdir(mount) {
  if (mount === "/") return "";
  return mount.replace(/^\//, "").replace(/\/$/, "");
}

export async function getApps(rootDir = process.cwd(), manifestFile = DEFAULT_MANIFEST) {
  const manifestPath = resolve(rootDir, manifestFile);
  const raw = await readFile(manifestPath, "utf8");
  const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));

  if (!parsed || !Array.isArray(parsed.apps) || parsed.apps.length === 0) {
    throw new Error(`Manifest must contain a non-empty apps array: ${manifestPath}`);
  }

  const names = new Set();
  const mounts = new Set();

  const apps = parsed.apps.map((app) => {
    if (!app || typeof app !== "object") {
      throw new Error("Each app entry must be an object.");
    }
    if (typeof app.name !== "string" || app.name.trim() === "") {
      throw new Error("Each app must define a non-empty name.");
    }
    if (typeof app.path !== "string" || app.path.trim() === "") {
      throw new Error(`App '${app.name}' must define a non-empty path.`);
    }

    const name = app.name.trim();
    const mount = normalizeMount(app.mount ?? `/${name}/`);

    if (names.has(name)) throw new Error(`Duplicate app name in manifest: ${name}`);
    if (mounts.has(mount)) throw new Error(`Duplicate mount path in manifest: ${mount}`);

    names.add(name);
    mounts.add(mount);

    return {
      name,
      path: app.path.trim(),
      mount,
      siteSubdir: toSiteSubdir(mount)
    };
  });

  return apps;
}


