import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useGameStore } from '../game/store/useGameStore'

function App() {
  const accessibility = useGameStore((state) => state.present.accessibility)

  useEffect(() => {
    document.documentElement.dataset.highContrast = String(accessibility.highContrast)
    document.documentElement.dataset.reducedMotion = String(accessibility.reducedMotion)
    document.documentElement.dataset.textSize = accessibility.textSize
  }, [accessibility.highContrast, accessibility.reducedMotion, accessibility.textSize])

  return <RouterProvider router={router} />
}

export default App
