# Copilot and Codex Instructions

Start every meaningful task with this preflight:

1. Read `.ai/project.json`.
2. Read `.ai/context.md`.
3. Read `TODO.md`, `ENV.md`, `DECISIONS.md`, `CommonMistakes.global.md`, and `CommonMistakes.project.md`.
4. Read the latest entry in `.ai/session-log.md`.
5. Read `setup/react-vite/setup.md`.

If `CommonMistakes.global.md` is missing or still contains the stub text, run `scripts/sync-common-mistakes.ps1` before implementation.

## Repo rules

- This is a `react-vite` project created by `dev-tools/new-project.ps1`.
- Do not re-run Vite scaffolding.
- Keep `.vscode/` limited to `settings.json`, `tasks.json`, and `extensions.json`.
- Keep changes PR-sized and verification-focused.
- Prefer PowerShell commands in docs and scripts.
- Preserve the existing app scaffold unless the task explicitly requires feature work.

## Product constraints

- Build one purposeful app, not a reusable template.
- Use the eight tutoring symbols exactly as defined in project docs.
- Keep gameplay cooperative. No Monopoly money or property buying.
- Prioritize completion, clarity, and accessibility over visual novelty.
- Separate pure game-engine rules from React presentation.

## Expected implementation loop

1. Read project memory files.
2. Plan the smallest useful change.
3. Implement.
4. Verify with commands or tests.
5. Update memory files and append `.ai/session-log.md`.
6. Self-report with:
   - What changed
   - Why it changed
   - How to verify
   - Common mistakes reviewed and mitigations
   - Next TODO items
   - Decision needed or logged

## Preferred architecture

- `src/app/` for router and shell
- `src/pages/` for route-level screens
- `src/components/` for reusable UI
- `src/game/engine/` for pure transitions and rules
- `src/game/data/` for decks, tiles, and copy
- `src/styles/` for tokens, themes, and accessibility styles

Document non-obvious game rules inline and mirror major design decisions in `DECISIONS.md`.
