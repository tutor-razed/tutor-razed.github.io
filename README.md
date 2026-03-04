# Tutor GitHub Switch (Staging)

This repository is a clean staging architecture for a multi-app GitHub Pages site.

## Single Source Of Truth
All app registration lives in `apps.manifest.json`.

Example:
```json
{
  "apps": [
    { "name": "portal", "path": "apps-src/portal", "mount": "/" },
    { "name": "headline-to-story", "path": "apps-src/headline-to-story", "mount": "/headline-to-story/" }
  ]
}
```

- `name`: app id used by scripts
- `path`: location of the Vite app
- `mount`: URL base on GitHub Pages (`/` for portal, `/<tool>/` for tools)

## Static Sites
Legacy static sites go in `static-src/<site-name>/`.

Build behavior:
- `static-src/worksheets/index.html` -> `site/worksheets/index.html`
- `static-src/old-calculator/*` -> `site/old-calculator/*`

Rules:
- Each static site must be a subfolder directly inside `static-src`
- Folder name becomes its published path
- Static folder name cannot conflict with a Vite app mount folder

## Final Layout
```text
/apps-src/
/static-src/
/apps.manifest.json
/site/
/scripts/
  apps-config.mjs
  apps-runner.mjs
  assemble.mjs
/package.json
```

## Root Commands
- `npm run apps:list` -> prints manifest apps
- `npm run install:apps` -> `npm install` for each app in manifest
- `npm run ci:apps` -> `npm ci` for each app in manifest
- `npm run build` -> clean `site/`, build each app, copy app dist outputs and static sites into `site/`
- `npm run dev -- <app-name>` -> run Vite dev for one app (example: `npm run dev -- portal`)
- `npm run preview:site` -> serve assembled `site/`

## Migration Workflow
1. Remove placeholder apps you do not want.
2. Copy each real Vite app into `apps-src/<tool-name>/`.
3. Update `apps.manifest.json` only.
4. In each app, set `vite.config.ts` base to match manifest mount:
   - portal: `/`
   - tool app: `/<tool-name>/`
5. For old static sites, copy each one into `static-src/<site-name>/`.
6. Install deps for all apps:
   - `npm run install:apps`
7. Build all and assemble:
   - `npm run build`
8. Preview and verify routes:
   - `npm run preview:site`

## GitHub Actions
Workflow reads manifest indirectly via root scripts:
- install step: `npm run ci:apps`
- build step: `npm run build`

When apps change, update only `apps.manifest.json` and app configs.
When static sites change, update folders inside `static-src/`.

## Portal Resources Editing

Edit `resources.portal.json` at repo root.

Then run:
- `npm run build` (syncs resources automatically)

Optional manual sync only:
- `npm run resources:sync`