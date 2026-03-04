# NUMPTY

This repo is set up to assemble one deployable site in the root `site/` folder.

The current implementation matches the project goal with two important constraints:

- React/Vite apps are only included if they are listed in `apps.manifest.json`.
- Static sites are only included if they are direct subfolders of `static-src/`.

## Verified Current Behavior

These files are the source of truth:

- `apps.manifest.json`
- `scripts/apps-config.mjs`
- `scripts/apps-runner.mjs`
- `scripts/assemble.mjs`
- `.github/workflows/deploy-pages.yml`

What `npm run build` does today:

1. Runs `npm run resources:sync`.
2. Deletes and recreates `site/`.
3. Reads every app from `apps.manifest.json`.
4. Runs `npm --prefix <app-path> run build` for each listed app.
5. Copies each app's `dist/` output into `site/<mount>`.
6. Copies each folder in `static-src/` into `site/<folder-name>`.

Current repo result:

- `portal` is mounted at `/`, so its build output becomes the root of `site/`.
- `headline-to-story` is mounted at `/headline-to-story/`, so its build output becomes `site/headline-to-story/`.
- Static folders like `static-src/multiplication` become `site/multiplication/`.
- `apps-src/story-symphony` is present in the repo but is not assembled or deployed, because it is not listed in `apps.manifest.json`.

## 1. Assemble The Entire Site

From the repo root:

```powershell
npm run install:apps
npm run build
```

Useful supporting commands:

```powershell
npm run apps:list
npm run preview:site
```

What each command does:

- `npm run install:apps` runs `npm install` inside every manifest-listed app.
- `npm run build` assembles the final deployable `site/` folder.
- `npm run apps:list` shows which Vite apps are currently part of the pipeline.
- `npm run preview:site` serves the assembled `site/` locally.

Expected assembled shape:

```text
site/
  index.html                  <- portal app at "/"
  assets/                     <- portal assets
  headline-to-story/
    index.html
    assets/
  multiplication/
    index.html
    script.js
    style.css
  polygons/
  rumblerink/
  ...
```

Important rules:

- `site/` is generated output. Do not treat it as source.
- The root app should normally be the portal, mounted at `/`.
- Static folder names must not collide with app mount folders.
- `resources.portal.json` is synced into `apps-src/portal/public/resources.json` automatically during `npm run build`.

## 2. Add React-Vite Apps

There are two cases:

- a new app created inside this repo
- an existing app copied in from somewhere else

In both cases, the assembly pipeline only cares about three things:

- the app lives under `apps-src/<app-name>/`
- the app has a working `build` script that outputs `dist/`
- the app is registered in `apps.manifest.json`

### Step A: Put the app under `apps-src/`

Example target:

```text
apps-src/my-new-app/
```

### Step B: Make sure the app can build itself

Its `package.json` should include at least:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

If the imported app uses TypeScript compilation first, that is also fine:

```json
{
  "scripts": {
    "build": "tsc && vite build"
  }
}
```

### Step C: Register it in `apps.manifest.json`

Example:

```json
{
  "apps": [
    {
      "name": "portal",
      "path": "apps-src/portal",
      "mount": "/"
    },
    {
      "name": "headline-to-story",
      "path": "apps-src/headline-to-story",
      "mount": "/headline-to-story/"
    },
    {
      "name": "my-new-app",
      "path": "apps-src/my-new-app",
      "mount": "/my-new-app/"
    }
  ]
}
```

Manifest rules:

- `name` must be unique.
- `path` must point to the app folder.
- `mount` must be unique.
- Use `/` only for the one app that should own the site root.
- Non-root apps should usually use `/<app-name>/`.

### Step D: Set the Vite `base` correctly

This is the part that usually breaks GitHub Pages deployments.

Your app's `vite.config.*` should match its manifest `mount`:

- If `mount` is `/`, use Vite root base behavior.
- If `mount` is `/my-new-app/`, set `base: "/my-new-app/"`.

Example:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/my-new-app/"
});
```

Repo-specific notes:

- `apps-src/headline-to-story/vite.config.ts` already does this correctly with `base: "/headline-to-story/"`.
- `apps-src/portal/vite.config.ts` is fine for root deployment because it mounts at `/`.
- `apps-src/story-symphony/vite.config.ts` does not matter until the app is added to `apps.manifest.json`.

### Step E: Install and test it

From the repo root:

```powershell
npm run install:apps
npm run build
npm run preview:site
```

If you only want to work on one app during development:

```powershell
npm run dev -- my-new-app
```

### Bringing in an app from another repo

Checklist:

1. Copy the app into `apps-src/<app-name>/`.
2. Remove any repo-specific CI or deployment assumptions inside that app.
3. Confirm it builds with `npm --prefix apps-src/<app-name> run build`.
4. Set `vite.config.*` `base` to the final manifest mount.
5. Add it to `apps.manifest.json`.
6. Run the root assembly flow.

Common import problems:

- Hard-coded `/assets/...` or `/favicon...` paths that ignore the Vite base.
- Router configuration that assumes root deployment.
- Missing environment variables.
- Build scripts that output somewhere other than `dist/`.

## 3. Add Static Sites

Static sites do not need to be registered in `apps.manifest.json`.

They are discovered automatically from direct children of `static-src/`.

Example source:

```text
static-src/fractions-game/
  index.html
  style.css
  script.js
```

After assembly, that becomes:

```text
site/fractions-game/
  index.html
  style.css
  script.js
```

Steps:

1. Create a new folder under `static-src/`.
2. Put the full static site inside that folder.
3. Run `npm run build`.
4. Verify the output in `site/<folder-name>/`.

Rules:

- Only first-level folders under `static-src/` are treated as separate static sites.
- The folder name becomes the published URL path.
- A static folder name cannot match an app mount folder.

Examples:

- `static-src/polygons` publishes to `/polygons/`
- `static-src/rumblerink` publishes to `/rumblerink/`

## 4. Deploy

This repo is already configured for GitHub Pages deployment through:

```text
.github/workflows/deploy-pages.yml
```

What the workflow does on push to `main`:

1. Checks out the repo.
2. Installs Node 20.
3. Runs `npm run ci:apps`.
4. Runs `npm run build`.
5. Uploads `site/` as the Pages artifact.
6. Deploys that artifact with `actions/deploy-pages`.

### Local deploy checklist

Before pushing:

```powershell
npm run ci:apps
npm run build
npm run preview:site
```

Verify:

- the root portal loads from `/`
- each Vite app loads from its mount path
- each static site loads from its folder path
- asset URLs are correct
- client-side navigation works

### GitHub repository settings

For the workflow to publish correctly, the GitHub repo should use:

- Pages source: `GitHub Actions`
- default deployment branch: `main`

### Typical deployment workflow

1. Make changes to apps, static sites, or manifest.
2. Run the local checklist.
3. Commit and push to `main`.
4. Wait for `.github/workflows/deploy-pages.yml` to finish.
5. Open the GitHub Pages URL and verify the routes.

## Quick Reference

List registered apps:

```powershell
npm run apps:list
```

Install app dependencies:

```powershell
npm run install:apps
```

Install exactly from lockfiles in CI-style mode:

```powershell
npm run ci:apps
```

Build and assemble the whole site:

```powershell
npm run build
```

Preview the assembled site:

```powershell
npm run preview:site
```

Run one Vite app in dev mode:

```powershell
npm run dev -- portal
```

## Current Repo Caveats

- `apps.manifest.json` currently includes only `portal` and `headline-to-story`.
- `apps-src/story-symphony` exists but is not part of build, install, or deploy.
- `npm run build` writes to both `site/` and `apps-src/portal/public/resources.json`.
- If you want a new React/Vite app deployed, adding the folder alone is not enough. It must also be added to `apps.manifest.json`.
