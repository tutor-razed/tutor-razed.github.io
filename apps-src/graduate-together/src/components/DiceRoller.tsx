import { useEffect, useRef, useState } from 'react'

interface DiceRollerProps {
  disabled?: boolean
  onRoll: (value: number) => void
  reducedMotion: boolean
}

export function DiceRoller({
  disabled = false,
  onRoll,
  reducedMotion,
}: DiceRollerProps) {
  const timeoutRef = useRef<number | null>(null)
  const [face, setFace] = useState(1)
  const [isRolling, setIsRolling] = useState(false)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function handleRoll() {
    if (disabled || isRolling) {
      return
    }

    const finalValue = Math.floor(Math.random() * 6) + 1

    if (reducedMotion) {
      setFace(finalValue)
      onRoll(finalValue)
      return
    }

    setIsRolling(true)

    const frames = [1, 3, 5, 2, 6, 4, 2, 5, finalValue]
    let index = 0

    const advance = () => {
      setFace(frames[index] ?? finalValue)
      index += 1

      if (index < frames.length) {
        timeoutRef.current = window.setTimeout(advance, 140)
        return
      }

      setIsRolling(false)
      onRoll(finalValue)
    }

    advance()
  }

  return (
    <div className="dice-roller">
      <div
        aria-label={`Die showing ${face}`}
        className={`die-face${isRolling ? ' die-face--rolling' : ''}`}
        role="img"
      >
        {renderPips(face)}
      </div>
      <button disabled={disabled || isRolling} onClick={handleRoll} type="button">
        {isRolling ? 'Rolling...' : 'Roll die'}
      </button>
    </div>
  )
}

function renderPips(value: number) {
  const activePips = pipMap[value] ?? pipMap[1]

  return (
    <span className="die-grid" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => (
        <span
          className={`die-pip${activePips.includes(index) ? ' die-pip--active' : ''}`}
          key={index}
        />
      ))}
    </span>
  )
}

const pipMap: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}
