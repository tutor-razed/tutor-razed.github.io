import { useMemo, useState } from "react";
import type { ClueDef } from "../../engine/types";

interface SolveModalProps {
  open: boolean;
  suspects: string[];
  clues: ClueDef[];
  discoveredClueIds: string[];
  onSubmit: (culprit: string, evidenceIds: string[]) => void;
  onClose: () => void;
}

export const SolveModal = ({
  open,
  suspects,
  clues,
  discoveredClueIds,
  onSubmit,
  onClose,
}: SolveModalProps): JSX.Element | null => {
  const [culprit, setCulprit] = useState(suspects[0] ?? "");
  const [selected, setSelected] = useState<string[]>([]);

  const discovered = useMemo(
    () => clues.filter((clue) => discoveredClueIds.includes(clue.id)),
    [clues, discoveredClueIds],
  );

  if (!open) return null;
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="overlay-card">
        <h2>Submit Accusation</h2>
        <p>Pick one suspect and 2-3 pieces of evidence.</p>
        <div className="solve-grid">
          <fieldset>
            <legend>Suspect</legend>
            {suspects.map((name) => (
              <label key={name}>
                <input
                  type="radio"
                  name="suspect"
                  value={name}
                  checked={culprit === name}
                  onChange={() => setCulprit(name)}
                />
                {name}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Evidence</legend>
            {discovered.length === 0 && <p>No clues discovered yet.</p>}
            {discovered.map((clue) => (
              <label key={clue.id}>
                <input
                  type="checkbox"
                  value={clue.id}
                  checked={selected.includes(clue.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected((prev) => [...prev, clue.id].slice(0, 3));
                    } else {
                      setSelected((prev) => prev.filter((id) => id !== clue.id));
                    }
                  }}
                />
                {clue.id} - {clue.title}
              </label>
            ))}
          </fieldset>
        </div>
        <div className="row">
          <button onClick={() => onSubmit(culprit, selected)}>Validate</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
