# Environment

## Required local tools

- Node.js 22 LTS or newer
- npm 10 or newer
- Git
- PowerShell 7 or Windows PowerShell
- VS Code

## Current project commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run preview`

## Environment variables

No runtime environment variables are required for the initial browser-only game.

If future configuration is added:

1. Add the variable to `.env.example`.
2. Document it here.
3. Note whether it is build-time or runtime.

## Secrets rule

- Do not commit `.env`.
- Keep `.env.example` free of secrets.
