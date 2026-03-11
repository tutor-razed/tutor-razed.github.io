import type { ReactNode } from 'react'

interface AmberNarrationProps {
  message: string
  actions?: ReactNode
  compact?: boolean
  title?: string
  reverse?: boolean
  muted?: boolean
}

export function AmberNarration({
  message,
  actions = null,
  compact = false,
  title = 'Amber says',
  reverse = false,
  muted = false,
}: AmberNarrationProps) {
  const displayMessage = message.replace(/^Amber:\s*/u, '')

  return (
    <section
      aria-live="polite"
      aria-atomic="true"
      className={`amber-panel${compact ? ' amber-panel--compact' : ''}${
        reverse ? ' amber-panel--reverse' : ''
      }${muted ? ' amber-panel--muted' : ''}`}
    >
      <div aria-hidden="true" className="amber-avatar">
        <span className="amber-avatar__halo" />
        <span className="amber-avatar__emoji">👩🏼</span>
        <span className="amber-avatar__earbud amber-avatar__earbud--left" />
        <span className="amber-avatar__earbud amber-avatar__earbud--right" />
      </div>
      <div className="amber-panel__content">
        <p className="amber-panel__title">{title}</p>
        <p className="amber-copy">{displayMessage}</p>
        {actions}
      </div>
    </section>
  )
}
