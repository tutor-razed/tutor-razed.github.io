# Testing

## Current verification

The repository currently supports:

- `npm run test`
- `npm run test:e2e`
- `npm run lint`
- `npm run build`
- manual `npm run dev`

## Current automated coverage

Vitest currently covers:

- dice roll bounds
- movement wrapping
- mini-challenge result staging
- Team Assist and Slow Down support actions
- win condition checks

Still to add with Vitest:

- deck draw, discard, and reshuffle
- broader outcome application cases
- more special-tile behaviors

Playwright currently covers:

1. Loads the app
2. Starts a Quick Game
3. Confirms the main game screen appears
4. Persists reduced-motion, high-contrast, and text-size settings
5. Confirms route focus lands on main content after navigation

Still to add with Playwright:

- resume-from-save coverage
- summary-route coverage
- deeper in-game accessibility checks during turn flow

## Manual test checklist for gameplay work

- Can a player start a game with 1 to 6 players?
- Is the next required action always obvious?
- Do keyboard-only interactions cover setup and turn flow?
- Are turn changes and card results announced to screen readers?
- Does reduced motion disable or soften major animations?
- Does the game recover cleanly from refresh via saved state?
