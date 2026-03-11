import type { PlayerState } from '../game/types'
import { getPlayerTokenColor } from '../game/playerTokens'

interface PlayerHUDProps {
  currentPlayerIndex: number
  players: PlayerState[]
  className?: string
}

export function PlayerHUD({ currentPlayerIndex, players, className }: PlayerHUDProps) {
  return (
    <article className={`content-card content-card--hud${className ? ` ${className}` : ''}`}>
      <h2>Players</h2>
      <ul className="player-hud-list">
        {players.map((player, index) => (
          <li
            className={`player-hud-card${
              index === currentPlayerIndex ? ' player-hud-card--active' : ''
            }${player.graduated ? ' player-hud-card--graduated' : ''}`}
            key={player.id}
          >
            <div className="player-hud-card__header">
              <strong>{player.name}</strong>
              <span
                aria-hidden="true"
                className="player-token-icon"
                style={{ '--player-token-color': getPlayerTokenColor(player.colorToken) } as React.CSSProperties}
                title={player.colorToken}
              />
            </div>
            <p className="player-hud-card__status">
              {index === currentPlayerIndex ? 'Current turn' : 'Waiting'}
              {' · '}
              Tile {player.position + 1}
              {' · '}
              Laps {player.lapsCompleted}
            </p>
            <ul className="milestone-list" aria-label={`${player.name} milestones`}>
              <li className={player.milestones.goalDefined ? 'milestone--done' : ''}>
                Goal
              </li>
              <li className={player.milestones.supportShared ? 'milestone--done' : ''}>
                Support
              </li>
              <li
                className={player.milestones.smartCheckComplete ? 'milestone--done' : ''}
              >
                SMART
              </li>
            </ul>
            <p className="player-hud-card__footer">
              {player.graduated ? 'Graduated' : 'Working toward graduation'}
            </p>
          </li>
        ))}
      </ul>
    </article>
  )
}
