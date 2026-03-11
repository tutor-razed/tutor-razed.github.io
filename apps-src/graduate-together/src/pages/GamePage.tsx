import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AmberNarration } from '../components/AmberNarration'
import { BoardPreview } from '../components/BoardPreview'
import { CardModal } from '../components/CardModal'
import { DiceRoller } from '../components/DiceRoller'
import { PlayerHUD } from '../components/PlayerHUD'
import { ProgressTracks } from '../components/ProgressTracks'
import { SupportActions } from '../components/SupportActions'
import { createBoardLayout } from '../game/data/boards'
import { useGameStore } from '../game/store/useGameStore'

export function GamePage() {
  const [rulesOpen, setRulesOpen] = useState(true)
  const navigate = useNavigate()
  const currentGame = useGameStore((state) => state.present.currentGame)
  const reducedMotion = useGameStore(
    (state) => state.present.accessibility.reducedMotion,
  )
  const playRoll = useGameStore((state) => state.playRoll)
  const chooseCardOption = useGameStore((state) => state.chooseCardOption)
  const chooseChallengeOption = useGameStore((state) => state.chooseChallengeOption)
  const continueChallengeResult = useGameStore(
    (state) => state.continueChallengeResult,
  )
  const useTeamAssist = useGameStore((state) => state.useTeamAssist)
  const resetWorkspace = useGameStore((state) => state.resetWorkspace)

  if (!currentGame) {
    return <Navigate replace to="/" />
  }

  const boardTiles = createBoardLayout(currentGame.gameLength)
  const lastTurnEntry = currentGame.log[0] ?? null

  return (
    <section className="game-screen">
      <div className="game-milestone-strip" role="note" aria-label="Milestone guide">
        <span className="board-tile__badge board-tile__badge--goal">Goal</span>
        <span>Star</span>
        <span className="board-tile__badge board-tile__badge--support">Support</span>
        <span>Circles or Mentor</span>
        <span className="board-tile__badge board-tile__badge--smart">SMART</span>
        <span>Target or SMART</span>
      </div>

      <section className="game-layout">
      <div className="game-layout__players-column">
        <div className="game-layout__players-home">
          <button
            className="button-link"
            onClick={() => navigate('/')}
            type="button"
          >
            Home
          </button>
          <button
            className="button-link"
            onClick={() => setRulesOpen(true)}
            type="button"
          >
            Rules
          </button>
        </div>
        <PlayerHUD
          className="game-layout__players"
          currentPlayerIndex={currentGame.currentPlayerIndex}
          players={currentGame.players}
        />
      </div>

      <div className="game-layout__main">
        <article className="content-card content-card--board-stage">
          <div className="board-stage">
            <BoardPreview
              activeTileId={currentGame.activeTileId}
              centerContent={
                <div className="board-center-stage">
                  <AmberNarration
                    compact
                    message={currentGame.amberMessage}
                    actions={
                      currentGame.phase === 'complete' ? (
                        <div className="amber-panel__actions">
                          <button
                            className="button-link button-link--primary"
                            onClick={() => {
                              resetWorkspace()
                              navigate('/')
                            }}
                            type="button"
                          >
                            Reset game
                          </button>
                        </div>
                      ) : null
                    }
                  />
                  {lastTurnEntry ? (
                    <AmberNarration
                      compact
                      message={`${lastTurnEntry.playerName}: ${lastTurnEntry.summary}`}
                      actions={
                        lastTurnEntry.roll ? (
                          <div className="amber-panel__actions">
                            <span className="roll-pill" aria-label={`Last turn roll ${lastTurnEntry.roll}`}>
                              Roll {lastTurnEntry.roll}
                            </span>
                          </div>
                        ) : null
                      }
                      muted
                      reverse
                      title="Last turn"
                    />
                  ) : null}
                  <div className="game-turn-dock">
                    {currentGame.phase === 'await_roll' ? (
                      <DiceRoller
                        disabled={currentGame.phase !== 'await_roll'}
                        onRoll={playRoll}
                        reducedMotion={reducedMotion}
                      />
                    ) : (
                      <p className="game-turn-dock__status">
                        {currentGame.phase === 'await_choice'
                          ? 'Resolve the card in the panel.'
                          : currentGame.phase === 'await_result'
                            ? 'Review the result in the panel.'
                            : 'Graduation ready.'}
                      </p>
                    )}
                  </div>
                </div>
              }
              credits={currentGame.teamProgress.credits}
              currentPlayerIndex={currentGame.currentPlayerIndex}
              graduationTarget={currentGame.teamProgress.graduationTarget}
              movement={currentGame.movement}
              players={currentGame.players}
              reducedMotion={reducedMotion}
              supportTokens={currentGame.teamProgress.supportTokens}
              tiles={boardTiles}
              turnNumber={currentGame.turnNumber}
            />
          </div>
        </article>
      </div>

      <div className="game-layout__sidebar">
        <ProgressTracks
          className="game-sidebar-card"
          credits={currentGame.teamProgress.credits}
          graduationTarget={currentGame.teamProgress.graduationTarget}
          lastRoll={currentGame.lastRoll}
          supportTokens={currentGame.teamProgress.supportTokens}
          turnNumber={currentGame.turnNumber}
        />

        <SupportActions
          className="game-sidebar-card"
          onUseTeamAssist={useTeamAssist}
          players={currentGame.players}
          supportTokens={currentGame.teamProgress.supportTokens}
          usedTeamAssistThisTurn={currentGame.usedTeamAssistThisTurn}
        />

        <article className="content-card game-sidebar-card game-sidebar-card--log">
          <h2>Table log</h2>
          <ul className="stack-list game-log-list">
            {currentGame.log.length > 0 ? (
              currentGame.log.map((entry) => (
                <li key={entry.id}>
                  <div className="game-log-entry__meta">
                    {entry.roll ? (
                      <span className="roll-pill roll-pill--log" aria-label={`Roll ${entry.roll}`}>
                        {entry.roll}
                      </span>
                    ) : null}
                    <strong>{entry.playerName}</strong>
                  </div>
                  <p className="game-log-entry__summary">{entry.summary}</p>
                </li>
              ))
            ) : (
              <li>No turns resolved yet.</li>
            )}
          </ul>
          <div className="inline-actions">
            <button
              className="button-link"
              onClick={() => {
                resetWorkspace()
                navigate('/')
              }}
              type="button"
            >
              Reset game
            </button>
          </div>
        </article>
      </div>

      <CardModal
        card={currentGame.activeCard}
        challenge={currentGame.activeChallenge}
        challengeResult={currentGame.activeChallengeResult}
        onChoose={chooseCardOption}
        onChooseChallenge={chooseChallengeOption}
        onContinueChallengeResult={continueChallengeResult}
      />
      {rulesOpen ? (
        <section
          aria-labelledby="game-rules-title"
          aria-modal="true"
          className="card-modal"
          role="dialog"
        >
          <div className="card-modal__scrim" onClick={() => setRulesOpen(false)} />
          <div className="card-modal__panel card-modal__panel--rules">
            <div className="home-card__header">
              <div>
                <p className="eyebrow">How to play</p>
                <h2 id="game-rules-title">Graduate Together rules</h2>
              </div>
              <button
                className="icon-button icon-button--quiet"
                onClick={() => setRulesOpen(false)}
                type="button"
              >
                <span aria-hidden="true">✕</span>
                <span className="visually-hidden">Close rules</span>
              </button>
            </div>
            <div className="rules-sheet">
              <section className="rules-sheet__section rules-sheet__section--goal">
                <h3>Goal of the game</h3>
                <p>Help every player reach graduation together while keeping the table supportive, clear, and fun.</p>
              </section>
              <section className="rules-sheet__section rules-sheet__section--win">
                <h3>Winning conditions</h3>
                <p>The team wins when the shared credit target is reached, every player has gone around the board twice, and every player has completed Goal, Support, and SMART milestones.</p>
              </section>
              <section className="rules-sheet__section rules-sheet__section--howto">
                <h3>How to attain Goal, Support, and SMART</h3>
                <ul className="stack-list">
                  <li><strong>Goal:</strong> land on Star spaces and choose cards that clarify the learner&apos;s goal.</li>
                  <li><strong>Support:</strong> land on Circles or Mentor Moment spaces and use teamwork-focused card outcomes.</li>
                  <li><strong>SMART:</strong> land on Target or SMART Check-in spaces and choose measurable next steps.</li>
                </ul>
              </section>
              <section className="rules-sheet__section rules-sheet__section--assist">
                <h3>How Team Assist works</h3>
                <p>Spend 1 support token to help one player who is behind. Team Assist can be used once per turn and advances that player&apos;s next unfinished milestone while also helping the team keep pace.</p>
              </section>
              <section className="rules-sheet__section rules-sheet__section--spirit">
                <h3>Table spirit</h3>
                <p>Roll, support one another, celebrate progress, have fun, and graduate together.</p>
              </section>
            </div>
            <div className="inline-actions rules-sheet__actions">
              <button
                className="button-link button-link--primary rules-sheet__start"
                onClick={() => setRulesOpen(false)}
                type="button"
              >
                Start playing
              </button>
            </div>
          </div>
        </section>
      ) : null}
      </section>
    </section>
  )
}
