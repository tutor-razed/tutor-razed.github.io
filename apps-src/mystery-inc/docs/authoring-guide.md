# Mystery Authoring Guide

## 1) Filesystem folder format

Place content files under:

`src/mysteries/<pack_id>/files/...`

Example:

```text
src/mysteries/missing_science_fair/files/
  home/student/Documents/draft_report_v2.md
  home/student/Downloads/usb_sync.sh
  var/log/recent_opened.log
```

Each file becomes a virtual FS file node. Directories are inferred automatically.

## 2) `mystery.json` schema (practical subset)

Required top-level fields:

- `metadata`
- `boot`
- `initialPath`
- `fileConfig`
- `initialObjectives`
- `hints`
- `clues`
- `suspects`
- `events`
- `solution`

Key sections:

- `metadata`: id, title, difficulty options, themes
- `boot`: boot lines + guided login
- `fileConfig`: per-path metadata/hidden/lock/reveal setup
- `clues`: clue IDs and evidence file references
- `events`: action-based trigger/effect rules
- `solution`: single culprit + required clue IDs

## 3) Event triggers/effects

### Trigger examples

```json
{ "type": "after_actions", "count": 5 }
{ "type": "on_read", "path": "/home/student/Documents/chat_log.txt" }
{ "type": "on_open_dir", "path": "/var/log" }
{ "type": "on_flag", "flag": "unlocked:/home/student/Downloads/Locker", "equals": true }
```

### Effect examples

```json
{ "type": "reveal_path", "path": "/var/log/recent_opened.log" }
{ "type": "unlock_path", "path": "/home/student/Downloads/Locker" }
{ "type": "add_message", "message": "New clue available." }
{ "type": "add_clue", "clueId": "clue_recent_log" }
{ "type": "set_flag", "key": "seen_weird_log", "value": true }
{ "type": "update_objective", "objectiveId": "obj_trace", "completed": true }
```

## 4) Hint writing guidelines (nudge style)

- Keep hints directional, not full spoilers.
- Start broad, then narrow.
- Only provide strong hints in Easy mode (`"strong": true`).
- Gate hints with `minActions` and/or `whenObjectiveIncomplete`.
- Ensure every lock puzzle has at least one explicit clue path.

Good nudge:

`"Check chat logs for patterns in how passwords are formed."`

Too strong for normal:

`"Type unlock /home/student/Downloads/Locker comet42"`

## 5) Validation

`validateMysteryPack(...)` checks:

- required fields
- file reference existence
- event trigger/effect targets
- solution clue references

Warnings/errors print in browser console on startup.
