import { useEffect, useMemo, useRef, useState } from "react";
import {
  createEngine,
  createInitialState,
  getCurrentFileContent,
  getNudgeHint,
  getObjectiveProgress,
  getStrongHint,
  inspectMeta,
  listDirectory,
  moveToPath,
  moveUp,
  openPath,
  search,
  solveCase,
  toggleNotes,
  tryUnlock,
} from "../../engine/engine";
import { autocompleteFromEntries, getValidCommands } from "../../engine/commands";
import type { EngineState, MysteryPack } from "../../engine/types";
import type { SavePayload } from "../storage";
import { HelpOverlay } from "./HelpOverlay";
import { SolveModal } from "./SolveModal";
import { useAudioFx } from "../audio";

interface TerminalGameProps {
  mystery: MysteryPack;
  initialSave: SavePayload | null;
  difficulty: "easy" | "normal";
  soundOn: boolean;
  onSoundChange: (v: boolean) => void;
  onDifficultyChange: (v: "easy" | "normal") => void;
  onPersist: (payload: SavePayload) => void;
  onCaseSolved: (endingMessage: string) => void;
}

const toClock = (actions: number): string => {
  const mins = 7 * 60 + actions;
  const hh = String(Math.floor(mins / 60) % 24).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const TerminalGame = ({
  mystery,
  initialSave,
  difficulty,
  soundOn,
  onSoundChange,
  onDifficultyChange,
  onPersist,
  onCaseSolved,
}: TerminalGameProps): JSX.Element => {
  const engine = useMemo(() => createEngine(mystery), [mystery]);
  const [state, setState] = useState<EngineState>(() => {
    const base = initialSave?.state ?? createInitialState(engine);
    return { ...base, flags: { ...base.flags, difficulty } };
  });
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [commandInput, setCommandInput] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [solveOpen, setSolveOpen] = useState(false);
  const [status, setStatus] = useState("Use arrows + Enter to explore.");
  const [searchHits, setSearchHits] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { beep, keyTick } = useAudioFx(soundOn);

  useEffect(() => {
    if (initialSave?.revealedPaths) {
      for (const path of initialSave.revealedPaths) {
        const node = engine.nodes.get(path);
        if (node) node.revealed = true;
      }
    }
  }, [engine, initialSave]);

  useEffect(() => {
    setState((prev) => ({ ...prev, flags: { ...prev.flags, difficulty } }));
  }, [difficulty]);

  useEffect(() => {
    onPersist({
      state,
      revealedPaths: Array.from(engine.nodes.values())
        .filter((n) => n.revealed)
        .map((n) => n.path),
    });
  }, [engine.nodes, onPersist, state]);

  useEffect(() => {
    beep();
  }, [beep, state.actionCount]);

  const entries = useMemo(() => listDirectory(engine, state, state.currentPath), [engine, state]);
  const validCommands = useMemo(() => getValidCommands(state, entries), [entries, state]);
  const selected = entries[selectedIdx] ?? null;

  useEffect(() => {
    if (selectedIdx >= entries.length) setSelectedIdx(Math.max(0, entries.length - 1));
  }, [entries.length, selectedIdx]);

  const applyResult = (next: EngineState, ok: boolean, message?: string): void => {
    setState(next);
    if (message) setStatus(message);
    if (!ok) keyTick();
    setSearchHits([]);
  };

  const executeCommand = (raw: string): void => {
    const input = raw.trim();
    if (!input) return;
    const [cmd, ...rest] = input.split(/\s+/);
    if (!validCommands.some((c) => c.command.startsWith(cmd))) {
      setStatus(`Unknown command: ${cmd}. Press / for guided commands.`);
      return;
    }
    if (cmd === "open" || cmd === "read") {
      if (rest.length === 0) {
        setStatus("Usage: open <name>");
        return;
      }
      const [next, res] = openPath(engine, state, rest.join(" "));
      applyResult(next, res.ok, res.message);
      return;
    }
    if (cmd === "meta") {
      if (rest.length === 0) {
        setStatus("Usage: meta <name>");
        return;
      }
      const [next, res] = inspectMeta(engine, state, rest.join(" "));
      applyResult(next, res.ok, res.message);
      return;
    }
    if (cmd === "search") {
      const [next, res] = search(engine, state, rest.join(" "));
      setState(next);
      setSearchHits(res.hits);
      setStatus(res.message ?? "search complete");
      return;
    }
    if (cmd === "cd") {
      const arg = rest.join(" ");
      const [next, res] = arg === ".." ? moveUp(engine, state) : moveToPath(engine, state, arg);
      applyResult(next, res.ok, res.message);
      return;
    }
    if (cmd === "unlock") {
      if (rest.length < 2) {
        setStatus("Usage: unlock <path> <password>");
        return;
      }
      const [next, res] = tryUnlock(engine, state, rest[0], rest.slice(1).join(" "));
      applyResult(next, res.ok, res.message);
      return;
    }
    if (cmd === "hint") {
      setStatus(getNudgeHint(engine, state));
      return;
    }
    if (cmd === "stuck") {
      if (difficulty !== "easy") {
        setStatus("Stronger hints are only available in Easy mode.");
        return;
      }
      setStatus(getStrongHint(engine, state));
      return;
    }
    if (cmd === "notes") {
      setState((prev) => toggleNotes(prev));
      setStatus("Case notes toggled.");
      return;
    }
    if (cmd === "solve") {
      setSolveOpen(true);
      return;
    }
    if (cmd === "help") {
      setHelpOpen(true);
      return;
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      const active = document.activeElement;
      const typing = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
      if (e.key === "Escape") {
        setHelpOpen(false);
        setPaletteOpen(false);
        setSolveOpen(false);
        return;
      }
      if (e.key === "?" && !typing) {
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }
      if ((e.ctrlKey && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
        e.preventDefault();
        setPaletteOpen(true);
        inputRef.current?.focus();
        return;
      }
      if (typing) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((v) => Math.min(v + 1, Math.max(0, entries.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((v) => Math.max(v - 1, 0));
      } else if (e.key === "Enter" && selected) {
        e.preventDefault();
        const [next, res] = openPath(engine, state, selected.path);
        applyResult(next, res.ok, res.message);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        const [next, res] = moveUp(engine, state);
        applyResult(next, res.ok, res.message);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [engine, entries.length, selected, state]);

  const progress = getObjectiveProgress(state.objectives);
  const fileContent = getCurrentFileContent(engine, state);
  const filteredCmds = validCommands.filter((c) => c.command.includes(commandInput.trim()) || c.description.includes(commandInput.trim()));

  return (
    <div className="terminal-shell">
      <header className="top-bar">
        <span>{mystery.manifest.metadata.title}</span>
        <span>{toClock(state.actionCount)}</span>
        <label>
          Sound
          <input type="checkbox" checked={soundOn} onChange={(e) => onSoundChange(e.target.checked)} />
        </label>
        <label>
          Difficulty
          <select value={difficulty} onChange={(e) => onDifficultyChange(e.target.value as "easy" | "normal")}>
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
          </select>
        </label>
      </header>
      <div className="pane-grid">
        <aside className="left-pane" aria-label="File explorer">
          <div className="path">{state.currentPath}</div>
          <ul>
            {entries.map((entry, idx) => (
              <li key={entry.path} className={idx === selectedIdx ? "selected" : ""}>
                <span>{entry.type === "dir" ? "d" : "-"}</span> {entry.name}
                {entry.lock ? " [LOCK]" : ""}
              </li>
            ))}
          </ul>
        </aside>
        <section className="right-pane" aria-label="Viewer">
          <h2>{state.notesOpen ? "Case Notes" : "Viewer"}</h2>
          {state.notesOpen ? (
            <div className="notes">
              <h3>Objectives ({progress.done}/{progress.total})</h3>
              <ul>
                {state.objectives.map((o) => (
                  <li key={o.id}>
                    [{o.completed ? "x" : " "}] {o.text}
                  </li>
                ))}
              </ul>
              <h3>Discovered Clues</h3>
              <ul>
                {mystery.manifest.clues
                  .filter((c) => state.discoveredClues.includes(c.id))
                  .map((clue) => (
                    <li key={clue.id}>
                      {clue.id}: {clue.title}
                    </li>
                  ))}
              </ul>
              <h3>Timeline</h3>
              <ul>
                {state.timeline.slice(-8).map((line, idx) => (
                  <li key={`${line.ts}-${idx}`}>
                    {line.ts} {line.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : searchHits.length > 0 ? (
            <div>
              <p>Search results:</p>
              <ul>
                {searchHits.map((hit) => (
                  <li key={hit}>{hit}</li>
                ))}
              </ul>
            </div>
          ) : (
            <pre>{fileContent}</pre>
          )}
        </section>
      </div>
      <footer className="bottom-bar">
        <div className="status">{status}</div>
        <div className="cmd-row">
          <input
            ref={inputRef}
            value={commandInput}
            placeholder="Type command or press / for palette"
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                executeCommand(commandInput);
                setCommandInput("");
              }
              if (e.key === "Tab") {
                e.preventDefault();
                const entryMatch = autocompleteFromEntries(entries, commandInput);
                if (entryMatch) {
                  setCommandInput(entryMatch);
                  return;
                }
                const cmdMatch = validCommands.find((c) => c.command.startsWith(commandInput.trim()));
                if (cmdMatch) setCommandInput(cmdMatch.command);
              }
            }}
          />
          <button
            onClick={() => {
              executeCommand(commandInput);
              setCommandInput("");
            }}
          >
            Run
          </button>
          {difficulty === "easy" && <button onClick={() => setStatus(getStrongHint(engine, state))}>I'm stuck</button>}
        </div>
        {paletteOpen && (
          <div className="palette" role="dialog" aria-modal="true">
            <p>Valid commands</p>
            <ul>
              {filteredCmds.map((cmd) => (
                <li key={cmd.id}>
                  <button
                    onClick={() => {
                      setCommandInput(cmd.command);
                      setPaletteOpen(false);
                      inputRef.current?.focus();
                    }}
                  >
                    {cmd.command} - {cmd.description}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </footer>
      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
      <SolveModal
        open={solveOpen}
        suspects={mystery.manifest.suspects}
        clues={mystery.manifest.clues}
        discoveredClueIds={state.discoveredClues}
        onSubmit={(culprit, evidenceIds) => {
          const res = solveCase(engine, state, { culprit, evidenceIds });
          setStatus(res.message);
          if (res.success) {
            onCaseSolved(res.message);
          }
          setSolveOpen(false);
        }}
        onClose={() => setSolveOpen(false)}
      />
    </div>
  );
};
