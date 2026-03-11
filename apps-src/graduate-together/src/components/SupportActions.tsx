import type { PlayerState } from '../game/types'

interface SupportActionsProps {
  players: PlayerState[]
  supportTokens: number
  usedTeamAssistThisTurn: boolean
  onUseTeamAssist: (targetPlayerId: string) => void
  className?: string
}

export function SupportActions({
  players,
  supportTokens,
  usedTeamAssistThisTurn,
  onUseTeamAssist,
  className,
}: SupportActionsProps) {
  const availableTargets = players.filter((player) => !player.graduated)

  return (
    <article className={`content-card content-card--hud${className ? ` ${className}` : ''}`}>
      <h2>Team Assist</h2>
      <p className="helper-copy">
        Spend 1 support token to help a player who is behind. This can be used once per
        turn and gives that player the next unfinished milestone plus 1 credit for the team.
      </p>
      <p className="helper-copy">
        {supportTokens > 0
          ? `${supportTokens} support token${supportTokens === 1 ? '' : 's'} available.`
          : 'No support tokens available right now.'}
      </p>
      {usedTeamAssistThisTurn ? (
        <p className="helper-copy">This turn already used Team Assist.</p>
      ) : null}
      <ul className="support-action-list">
        {availableTargets.map((player) => (
          <li key={player.id}>
            <button
              disabled={supportTokens < 1 || usedTeamAssistThisTurn}
              onClick={() => onUseTeamAssist(player.id)}
              type="button"
            >
              Help {player.name}
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}
