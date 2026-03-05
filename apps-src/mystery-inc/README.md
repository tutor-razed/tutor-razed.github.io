# Mystery Inc (Terminal Mystery Engine)

Keyboard-first React + Vite + TypeScript game engine for Unix-flavored mystery content packs.

## Features

- Simulated terminal UI (browser-only, no server needed)
- Engine/UI separation:
  - `src/engine`: pure logic, no React imports
  - `src/ui`: React components
- Hybrid interaction:
  - file explorer navigation
  - guided command bar + command palette
  - autocomplete and context-valid commands
- Action-based event system (no timed triggers)
- Boot/login flow with optional skip after first view
- Objectives + case notes + easy-mode nudges (`hint`, `stuck`)
- Local save/continue via `localStorage`
- Included playable mystery: **The Missing Science Fair File**
- Theme system with two examples:
  - Green Phosphor
  - Amber
- Optional sound effects (off by default)

## Tech stack

- React
- Vite
- TypeScript

Dependency policy:
- Only core React/Vite/TS dependencies are used.
- No extra state-library dependency was added; app uses local component state + pure engine helpers.

## Run locally

```bash
cd apps-src/mystery-inc
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Keyboard controls

- Arrow Up / Arrow Down: move explorer selection
- Enter: open selected file/folder
- Backspace: go up one directory
- `Ctrl+K` or `/`: open command palette
- Tab (inside command input): autocomplete
- `?`: help overlay
- Esc: close overlays/palette

## Main gameplay loop

1. Main Menu (`New Game` / `Continue`)
2. Boot + Login sequence
3. Explore terminal filesystem and gather clues
4. Open `solve` modal, choose culprit + evidence IDs
5. Engine validates single correct solution

## Add a new mystery pack

1. Create folder: `src/mysteries/<your_pack>/`.
2. Add virtual files under `src/mysteries/<your_pack>/files/...`.
3. Add `mystery.json` manifest (see `docs/authoring-guide.md`).
4. Add `index.ts` exporting a `MysteryPack`:
   - load files with `import.meta.glob("./files/**/*", { query: "?raw", eager: true, import: "default" })`
   - run `validateMysteryPack(...)`
5. Export it from `src/mysteries/index.ts`.
6. Update menu selection if you add multiple packs.

## GitHub Pages deploy

This app includes:
- configurable Vite base path in `vite.config.ts` via `VITE_BASE_PATH`
- SPA fallback file `public/404.html`
- sample GitHub Actions workflow in `.github/workflows/deploy-pages.yml`

### Deploy steps

1. Push repo to GitHub.
2. In repo settings, enable **Pages** with source **GitHub Actions**.
3. Ensure workflow runs in `apps-src/mystery-inc`.
4. Workflow sets:
   - `VITE_BASE_PATH=/<repo-name>/`
5. After deploy, app is available at:
   - `https://<user>.github.io/<repo-name>/`

## Accessibility notes

- Keyboard-first interactions are fully supported.
- Sound is optional and defaults to off.
- Focus-visible styling is provided for controls.
- No flashing effects.
