import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { symbols } from "../game/data/symbols";
import { getPlayerTokenColor } from "../game/playerTokens";
import { useGameStore } from "../game/store/useGameStore";

export function HomePage() {
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const navigate = useNavigate();
  const draftSetup = useGameStore((state) => state.present.draftSetup);
  const currentGame = useGameStore((state) => state.present.currentGame);
  const accessibility = useGameStore((state) => state.present.accessibility);
  const setGameLength = useGameStore((state) => state.setGameLength);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const setPlayerToken = useGameStore((state) => state.setPlayerToken);
  const setAccessibility = useGameStore((state) => state.setAccessibility);
  const startGame = useGameStore((state) => state.startGame);
  const activePlayerCount = draftSetup.playerNames.filter((name) => name.trim().length > 0).length;

  return (
    <section className="page-grid home-grid">
      <article className="content-card content-card--feature home-card home-card--hero">
        <div className="home-card__header">
          <div>
            <p className="eyebrow">Welcome</p>
            <h2>Choose the board and start when ready.</h2>
          </div>
          <button
            aria-expanded={accessibilityOpen}
            aria-haspopup="dialog"
            className="icon-button"
            onClick={() => setAccessibilityOpen(true)}
            type="button"
          >
            <span aria-hidden="true">♿</span>
            <span className="visually-hidden">Open accessibility settings</span>
          </button>
        </div>
        <div className="welcome-board-picker welcome-board-picker--compact">
          <div className="welcome-board-picker__main">
            <div>
              <div
                aria-label="Game length"
                className="toggle-row"
                role="radiogroup"
              >
                <button
                  aria-pressed={draftSetup.gameLength === "quick"}
                  className={
                    draftSetup.gameLength === "quick"
                      ? "toggle-button toggle-button--active"
                      : "toggle-button"
                  }
                  onClick={() => setGameLength("quick")}
                  type="button"
                >
                  Quick Game
                </button>
                <button
                  aria-pressed={draftSetup.gameLength === "full"}
                  className={
                    draftSetup.gameLength === "full"
                      ? "toggle-button toggle-button--active"
                      : "toggle-button"
                  }
                  onClick={() => setGameLength("full")}
                  type="button"
                >
                  Full Journey
                </button>
              </div>
            </div>
            <div className="welcome-board-picker__actions">
              <button
                className="button-link button-link--primary"
                disabled={activePlayerCount === 0}
                onClick={() => {
                  startGame();
                  navigate("/game");
                }}
                type="button"
              >
                {currentGame ? "Start fresh game" : "Start game"}
              </button>
              {currentGame ? (
                <Link className="button-link" to="/game">
                  Resume game
                </Link>
              ) : null}
            </div>
          </div>
          <p className="helper-copy">
            Quick Game uses 24 tiles. Full Journey uses 32 tiles.
          </p>
        </div>
      </article>

      <article className="content-card home-card home-card--players">
        <h2>Players</h2>
        <div className="player-input-grid" aria-label="Player names">
          {Array.from({ length: 4 }, (_, index) => {
            const defaultColors = ["#d62828", "#457b9d", "#2a9d8f", "#e9b949"];
            const selectedToken = draftSetup.playerTokens?.[index] ?? defaultColors[index];

            return (
              <div className="player-input-card" key={`player-name-${index + 1}`}>
                <div className="player-input-row">
                  <input
                    aria-label={`Player ${index + 1} name`}
                    onChange={(event) => setPlayerName(index, event.target.value)}
                    placeholder={`Player ${index + 1}`}
                    type="text"
                    value={draftSetup.playerNames[index] ?? ""}
                  />
                  <label
                    className="player-color-picker"
                    style={{ '--player-token-color': getPlayerTokenColor(selectedToken) } as React.CSSProperties}
                  >
                    <span className="visually-hidden">Player {index + 1} color</span>
                    <input
                      aria-label={`Player ${index + 1} color`}
                      className="player-color-picker__input"
                      onChange={(event) => setPlayerToken(index, event.target.value)}
                      type="color"
                      value={selectedToken}
                    />
                    <span aria-hidden="true" className="player-color-picker__swatch" />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      <article className="content-card content-card--wide home-card home-card--symbols">
        <div className="symbol-stage" aria-hidden="true">
          <span className="symbol-stage__amber symbol-stage__amber--one">
            👩🏼
          </span>
          <span className="symbol-stage__amber symbol-stage__amber--two">
            👩🏼
          </span>
          <span className="symbol-stage__amber symbol-stage__amber--three">
            👩🏼
          </span>
        </div>
        <div className="home-symbols__header">
          <div>
            <h2>Tutoring symbols</h2>
            <p className="helper-copy">
              Every symbol points to a different kind of support around the
              board.
            </p>
          </div>
        </div>
        <div className="symbol-grid symbol-grid--tutoring">
          {symbols.map((symbol, index) => (
            <article
              className={`symbol-card symbol-card--amber-${(index % 8) + 1}`}
              key={symbol.id}
            >
              <div className="symbol-card__header">
                <p className="symbol-card__label">
                  <span
                    aria-hidden="true"
                    className={`symbol-card__glyph symbol-card__glyph--${symbol.id}`}
                  >
                    {getSymbolGlyph(symbol.id)}
                  </span>
                  <span>{symbol.label}</span>
                </p>
              </div>
              <h3 className="symbol-card__title">{symbol.title}</h3>
              <p>{symbol.coachingPrompt}</p>
            </article>
          ))}
        </div>
      </article>

      {accessibilityOpen ? (
        <section
          aria-labelledby="accessibility-title"
          aria-modal="true"
          className="card-modal"
          role="dialog"
        >
          <div
            className="card-modal__scrim"
            onClick={() => setAccessibilityOpen(false)}
          />
          <div className="card-modal__panel card-modal__panel--settings">
            <div className="home-card__header">
              <div>
                <p className="eyebrow">Accessibility</p>
                <h2 id="accessibility-title">Display and motion</h2>
              </div>
              <button
                className="icon-button icon-button--quiet"
                onClick={() => setAccessibilityOpen(false)}
                type="button"
              >
                <span aria-hidden="true">✕</span>
                <span className="visually-hidden">
                  Close accessibility settings
                </span>
              </button>
            </div>

            <div className="field-checkbox">
              <label>
                <input
                  checked={accessibility.reducedMotion}
                  onChange={(event) =>
                    setAccessibility({ reducedMotion: event.target.checked })
                  }
                  type="checkbox"
                />
                Reduced motion
              </label>
            </div>

            <div className="field-checkbox">
              <label>
                <input
                  checked={accessibility.highContrast}
                  onChange={(event) =>
                    setAccessibility({ highContrast: event.target.checked })
                  }
                  type="checkbox"
                />
                High contrast
              </label>
            </div>

            <label className="field field--compact">
              <span>Text size</span>
              <select
                onChange={(event) =>
                  setAccessibility({
                    textSize: event.target
                      .value as typeof accessibility.textSize,
                  })
                }
                value={accessibility.textSize}
              >
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="x-large">Extra Large</option>
              </select>
            </label>
          </div>
        </section>
      ) : null}
    </section>
  );
}

function getSymbolGlyph(symbolId: string) {
  switch (symbolId) {
    case "star":
      return "★";
    case "circles":
      return "◎";
    case "clapperboard":
      return "▤";
    case "litmus-strip":
      return "▮";
    case "heart":
      return "♥";
    case "stop-sign":
      return "⬢";
    case "target":
      return "◉";
    case "happy-face":
      return "☺";
    default:
      return "•";
  }
}
