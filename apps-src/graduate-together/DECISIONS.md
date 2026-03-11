# Decisions

## 2026-02-27 - Starter architecture direction

- Context: The project needs a stable implementation direction before feature work begins.
- Options considered:
  - Redux Toolkit plus a larger UI framework
  - Zustand plus simple custom components
- Decision: Prefer Zustand for state and simple custom components with CSS modules.
- Consequences:
  - Lower setup overhead for a single-purpose browser app
  - Need to stay disciplined about keeping engine logic pure outside the store

## 2026-02-27 - Phase 1 state boundary

- Context: The project needs a stable way to persist setup and accessibility while keeping gameplay rules testable.
- Options considered:
  - Store full logic directly in React components
  - Put mutable app state in Zustand and keep state creation in pure engine helpers
- Decision: Use a persisted Zustand store with one-step undo and call pure functions from `src/game/engine`.
- Consequences:
  - Setup and accessibility work can move quickly without coupling to page components
  - Phase 2 rules can reuse the same state model without rewriting route code

## 2026-02-27 - Deterministic turn resolution

- Context: The first playable loop needed explicit state transitions while keeping engine behavior testable and debuggable.
- Options considered:
  - Hide random behavior inside the engine
  - Keep the engine pure and pass explicit roll values into turn resolution
- Decision: Use explicit roll inputs and pure transitions for move, draw, special-tile effects, and card choice resolution.
- Consequences:
  - The current UI uses manual roll buttons as a temporary control
  - Automated tests can lock engine behavior without mocking browser randomness

## 2026-02-27 - First Team Assist rule

- Context: The cooperative loop needed an intentional catch-up action that players could trigger directly from the UI.
- Options considered:
  - Keep support token effects only on cards and tiles
  - Add a direct Team Assist action with a strict per-turn limit
- Decision: Add a visible Team Assist action that costs 1 support token, can be used once per turn, and advances the target player's next unfinished milestone.
- Consequences:
  - The game now has a clear player-driven catch-up tool
  - The balance may need adjustment once deck size and difficulty increase

## 2026-02-27 - Slow Down escape hatch

- Context: The cooperative loop also needed a lower-pressure option when a card prompt becomes overwhelming.
- Options considered:
  - Force every card draw to resolve through a choice
  - Let players spend support to safely end a stressful card prompt
- Decision: Add a Slow Down action that spends 1 support token during `await_choice` and ends the turn without resolving the card.
- Consequences:
  - Players have a direct anti-stall tool that matches the project brief
  - Card difficulty can be increased later without creating hard dead ends

## Template

### YYYY-MM-DD - Decision title

- Context:
- Options considered:
- Decision:
- Consequences:
