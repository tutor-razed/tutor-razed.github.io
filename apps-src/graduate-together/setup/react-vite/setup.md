# Setup: react-vite

This repository already contains the base Vite scaffold. Do not re-run `npm create vite@latest`.

## Required checks

1. Install dependencies: `npm install`
2. Verify local development: `npm run dev`
3. Verify production build: `npm run build`
4. Verify linting: `npm run lint`
5. Verify engine tests: `npm run test`
6. Verify browser smoke test: `npm run test:e2e`

## First implementation additions

When feature work starts, add these in small steps:

1. `react-router-dom`
2. `zustand`
3. `framer-motion`

Each addition must also update:

- `README.md`
- `ENV.md` or `.env.example` if setup changes
- `TODO.md`
- `.ai/session-log.md`

## Structure target

The app should move toward:

```text
src/
  app/
  components/
  game/
    data/
    engine/
    types.ts
  pages/
  styles/
  utils/
```

## Notes

- Keep engine logic pure.
- Keep accessibility part of the first-pass implementation, not a late polish step.
- Add tests as soon as engine functions are stable enough to lock behavior.
