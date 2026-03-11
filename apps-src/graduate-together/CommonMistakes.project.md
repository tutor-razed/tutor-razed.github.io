# Common Mistakes (Project)

## Graduate Together

- Mistake: Mixing UI behavior and game rules in the same component.
  - Symptom: Hard-to-test state changes and duplicated rule logic.
  - Prevention: Keep rule transitions in `src/game/engine` and call them from the store or UI layer.
  - Fix: Move conditional turn or progression logic into pure functions and add tests around them.

- Mistake: Making progress systems too punitive for the player who falls behind.
  - Symptom: One player cannot graduate without repeated lucky rolls.
  - Prevention: Preserve Support Pool and catch-up rules in every progression change.
  - Fix: Add or rebalance Team Assist and Slow Down actions before adjusting difficulty elsewhere.

- Mistake: Relying on color alone to explain board state or card outcomes.
  - Symptom: Players miss information in high-contrast mode or with screen readers.
  - Prevention: Pair color with text, icons, labels, and live announcements.
  - Fix: Add explicit labels and status text to the affected UI.

- Mistake: Letting card content become patronizing or overly wordy.
  - Symptom: Players skip reading cards or feel talked down to.
  - Prevention: Keep prompts short, friendly, and action-oriented.
  - Fix: Rewrite the card for plain language and test it aloud.
