interface ProgressTracksProps {
  credits: number
  graduationTarget: number
  supportTokens: number
  turnNumber: number
  lastRoll: number | null
  className?: string
}

export function ProgressTracks({
  credits,
  graduationTarget,
  supportTokens,
  turnNumber,
  lastRoll,
  className,
}: ProgressTracksProps) {
  const creditPercent = Math.min(100, (credits / graduationTarget) * 100)

  return (
    <article className={`content-card content-card--hud${className ? ` ${className}` : ''}`}>
      <h2>Team progress</h2>
      <div className="track-stack">
        <div>
          <div className="track-label-row">
            <span>Credits</span>
            <strong>
              {credits} / {graduationTarget}
            </strong>
          </div>
          <div aria-hidden="true" className="progress-track">
            <span className="progress-track__fill" style={{ width: `${creditPercent}%` }} />
          </div>
        </div>

        <div>
          <div className="track-label-row">
            <span>Support pool</span>
            <strong>{supportTokens}</strong>
          </div>
          <div className="support-token-row" aria-label={`${supportTokens} support tokens`}>
            {Array.from({ length: Math.max(1, Math.min(8, supportTokens)) }, (_, index) => (
              <span className="support-token" key={index} />
            ))}
          </div>
        </div>

        <dl className="status-grid">
          <div>
            <dt>Turn</dt>
            <dd>{turnNumber}</dd>
          </div>
          <div>
            <dt>Last roll</dt>
            <dd>{lastRoll ?? 'None yet'}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
