import { rm, mkdir, cp, stat, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { getApps } from "./apps-config.mjs";

const root = process.cwd();
const siteDir = resolve(root, "site");
const staticSrcDir = resolve(root, "static-src");

function runNpm(args) {
  const escaped = args
    .map((arg) => (arg.includes(" ") ? `"${arg}"` : arg))
    .join(" ");
  execSync(`npm ${escaped}`, { stdio: "inherit" });
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function getStaticSites() {
  if (!(await exists(staticSrcDir))) return [];

  const entries = await readdir(staticSrcDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      sourceDir: resolve(staticSrcDir, entry.name),
      siteSubdir: entry.name
    }));
}

async function main() {
  runNpm(["run", "resources:sync"]);

  const apps = await getApps(root);
  const staticSites = await getStaticSites();

  console.log("Cleaning site directory...");
  await rm(siteDir, { recursive: true, force: true });
  await mkdir(siteDir, { recursive: true });

  const usedSiteSubdirs = new Set();

  for (const app of apps) {
    console.log(`Building ${app.name}...`);
    runNpm(["--prefix", app.path, "run", "build"]);

    const distDir = resolve(root, app.path, "dist");
    if (!(await exists(distDir))) {
      throw new Error(`Missing dist output for ${app.name}: ${distDir}`);
    }

    const targetDir = app.siteSubdir ? resolve(siteDir, app.siteSubdir) : siteDir;
    await mkdir(targetDir, { recursive: true });

    console.log(`Copying ${app.name} dist -> ${targetDir}`);
    await cp(distDir, targetDir, { recursive: true, force: true });
    usedSiteSubdirs.add(app.siteSubdir);
  }

  for (const staticSite of staticSites) {
    if (usedSiteSubdirs.has(staticSite.siteSubdir)) {
      throw new Error(
        `Path conflict: static site '${staticSite.name}' collides with app output '${staticSite.siteSubdir}'.`
      );
    }

    const targetDir = resolve(siteDir, staticSite.siteSubdir);
    await mkdir(targetDir, { recursive: true });

    console.log(`Copying static site ${staticSite.name} -> ${targetDir}`);
    await cp(staticSite.sourceDir, targetDir, { recursive: true, force: true });
    usedSiteSubdirs.add(staticSite.siteSubdir);
  }

  console.log("Assemble complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});