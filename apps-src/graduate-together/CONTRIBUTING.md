# Contributing

Keep contributions small, verifiable, and documented.

## Before you start

1. Read `.ai/context.md`.
2. Read `TODO.md`, `ENV.md`, `DECISIONS.md`, `CommonMistakes.global.md`, and `CommonMistakes.project.md`.
3. Read the latest `.ai/session-log.md` entry.
4. Read `setup/react-vite/setup.md`.

## Working rules

- Do not re-scaffold the app.
- Prefer PowerShell commands in docs and scripts.
- Keep gameplay logic in `src/game/engine`.
- Update docs when behavior or setup changes.
- Record non-trivial tradeoffs in `DECISIONS.md`.
- Append a short note to `.ai/session-log.md` after meaningful work.

## Verification

Use the smallest relevant verification for the change:

- `npm run lint`
- `npm run build`
- `npm run test`
- `npm run test:e2e`

If a command cannot run, document why.
