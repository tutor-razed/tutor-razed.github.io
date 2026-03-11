# Architecture

## Intent

Graduate Together should be built as a single browser app with a clear split between pure game logic and React rendering.

## Data flow

1. A route-level page triggers a user action.
2. The UI dispatches an intent to the game store.
3. The store calls pure engine functions under `src/game/engine`.
4. The engine returns the next deterministic state plus any announcements or effects to render.
5. The store persists state to local storage and exposes the result back to the UI.

## Preferred modules

- `src/app/`: router, providers, app shell
- `src/pages/`: Home, Setup, Game, How To Play, Accessibility, Summary
- `src/components/`: Board, PlayerHUD, AmberNarration, CardModal, DiceRoller, ProgressTracks, SettingsDrawer
- `src/game/engine/`: reducers, rules, helpers, win checks
- `src/game/data/`: board layouts, symbol decks, mini-challenges
- `src/styles/`: design tokens, themes, accessibility styles
- `src/utils/`: localStorage, randomization helpers, ARIA announcers

## State boundaries

Engine state should include:

- game mode and player roster
- current turn and token positions
- Credits, Support, and Milestones
- deck, discard, and revealed card state
- completed graduates and final summary data
- undo snapshot

UI-only state should stay separate when it does not affect gameplay rules, such as drawer visibility or transient animation state.

## Accessibility expectations

- Keyboard support for the full core loop
- Live regions for turn and card announcements
- Reduced-motion support that affects token and card animations
- High-contrast theme and text-size preferences stored with user settings

## Testing strategy

- Unit test all engine rules with Vitest
- Keep engine tests independent from React rendering
- Add at least one Playwright smoke test covering app load and quick-game setup
