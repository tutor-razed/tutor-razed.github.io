# Graduate Together

Graduate Together is a cooperative browser board game for `1-4` local players on one device. Players move around a shared square board, resolve symbol cards and mini-challenges, build Goal, Support, and SMART milestones, and try to graduate together before the table loses momentum.

The app is built with React, Vite, and TypeScript, with game rules kept in a deterministic engine so behavior stays testable and easy to tune.

## Current game

- `1-4` players
- `Quick Game` uses a 24-tile board
- `Full Journey` uses a 32-tile board
- Players must complete `2` full laps to graduate
- The team must also hit a shared credit target and complete every player's Goal, Support, and SMART milestones
- Team Assist can spend support to help a player who is behind
- Accessibility settings include reduced motion, high contrast, and text size controls

## Tech stack

- React 19
- Vite 7
- TypeScript 5
- React Router 7
- Zustand
- Vitest
- Playwright
- ESLint 9

## Run locally

```powershell
npm install
npm run dev
```

Other useful commands:

```powershell
npm run build
npm run preview
npm run lint
npm test
npm run test:e2e
```

## Project structure

```text
src/
  app/            App shell and routing
  components/     Reusable UI components
  game/
    data/         Cards, boards, symbols
    engine/       Pure gameplay rules and model setup
    store/        Persisted Zustand store
    playerTokens.ts
    types.ts
  pages/          Home page and game table
  styles/         Global styling and accessibility themes
docs/             Rules, symbols, architecture, testing notes
e2e/              Playwright tests
scripts/          Windows-friendly helper scripts
```

## Gameplay model

The game state is split into two layers:

- UI state and persistence live in the Zustand store
- Rules and transitions live in `src/game/engine`

That means roll resolution, movement, special tiles, card outcomes, challenges, milestones, graduation checks, and team assist behavior are all driven by pure functions.

## Content snapshot

Current content includes:

- `160` symbol cards
- `16` mini-challenges
- `8` tutoring symbol types
- special tiles for Mentor Moment, Reflection Bench, Slow Down Zone, and SMART Check-in

## Editing game content

- Update cards in [src/game/data/cards.ts](/c:/Dev/Projects/graduate-together/src/game/data/cards.ts)
- Update boards in [src/game/data/boards.ts](/c:/Dev/Projects/graduate-together/src/game/data/boards.ts)
- Update symbol descriptions in [docs/symbols.md](/c:/Dev/Projects/graduate-together/docs/symbols.md)
- Verify rules changes in [src/game/engine/gameplay.test.ts](/c:/Dev/Projects/graduate-together/src/game/engine/gameplay.test.ts)
- Record notable balance decisions in [DECISIONS.md](/c:/Dev/Projects/graduate-together/DECISIONS.md)

## Accessibility

The app currently supports:

- keyboard-friendly controls
- `aria-live` narration through Amber
- reduced motion
- high contrast
- adjustable text size
- color-independent labels for progress systems

## Notes for contributors

- Keep gameplay logic in the engine instead of React components
- Prefer updating tests with rules changes
- Treat the data files as the source of truth for cards, symbols, and board content
