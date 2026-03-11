import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ProgressOverview } from '../components/ProgressOverview'

export function AppShell() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement | null>(null)
  const isGameRoute = location.pathname === '/game'

  useEffect(() => {
    mainRef.current?.focus()
  }, [location.pathname])

  const routeLabel = getRouteLabel(location.pathname)

  return (
    <div className={`app-shell${isGameRoute ? ' app-shell--game' : ''}`}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <p aria-atomic="true" aria-live="polite" className="visually-hidden">
        Current page: {routeLabel}
      </p>
      {!isGameRoute ? (
        <header className="hero-panel">
          <div>
            <h1>
              <span>Graduate</span>
              <span>Together</span>
            </h1>
            <p className="hero-copy">
              Roll around the square board, land on tutoring symbols, and help each
              player earn Goal, Support, and SMART before the team reaches its shared
              credit target.
            </p>
          </div>
          <ProgressOverview />
        </header>
      ) : null}

      <main className="page-shell" id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}

function getRouteLabel(pathname: string): string {
  switch (pathname) {
    case '/':
      return 'Home'
    case '/setup':
      return 'Home'
    case '/game':
      return 'Game'
    case '/how-to-play':
      return 'Home'
    case '/accessibility':
      return 'Home'
    case '/summary':
      return 'Game'
    default:
      return 'Graduate Together'
  }
}
