import { useGameStore } from '../game/store/useGameStore'
import { getActivePlayerNames } from '../game/engine/model'

export function ProgressOverview() {
  const draftSetup = useGameStore((state) => state.present.draftSetup)
  const currentGame = useGameStore((state) => state.present.currentGame)
  const playerCount = currentGame?.players.length ?? getActivePlayerNames(draftSetup).length

  return (
    <aside aria-label="Table status" className="status-card">
      <h2>Table status</h2>
      <dl className="status-grid">
        <div>
          <dt>Players</dt>
          <dd>{playerCount}</dd>
        </div>
        <div>
          <dt>Board</dt>
          <dd>{draftSetup.gameLength === 'quick' ? 'Quick Game' : 'Full Journey'}</dd>
        </div>
        <div>
          <dt>Session</dt>
          <dd>{currentGame ? 'In play' : 'Ready to start'}</dd>
        </div>
        <div>
          <dt>Turn</dt>
          <dd>{currentGame?.turnNumber ?? 0}</dd>
        </div>
      </dl>
    </aside>
  )
}
