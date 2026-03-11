import { symbols } from './symbols'
import type { BoardTile, GameLength } from '../types'

const specialTiles = [
  {
    id: 'mentor-moment',
    label: 'Mentor Moment',
    description: 'A support-focused team boost inspired by Circles.',
  },
  {
    id: 'reflection-bench',
    label: 'Reflection Bench',
    description: 'A calm pause for Heart and Happy Face check-ins.',
  },
  {
    id: 'slow-down-zone',
    label: 'Slow Down Zone',
    description: 'A paced reset space inspired by the stop sign.',
  },
  {
    id: 'smart-check-in',
    label: 'SMART Check-in',
    description: 'A progress review tied to the Target symbol.',
  },
]

export function createBoardLayout(gameLength: GameLength): BoardTile[] {
  const tileCount = gameLength === 'quick' ? 24 : 32
  const tiles: BoardTile[] = []

  for (let index = 0; index < tileCount; index += 1) {
    if ((index + 1) % 6 === 0) {
      const special = specialTiles[Math.floor(index / 6) % specialTiles.length]
      tiles.push({
        id: `${special.id}-${index + 1}`,
        kind: 'special',
        label: special.label,
        description: special.description,
      })
      continue
    }

    const symbol = symbols[index % symbols.length]
    tiles.push({
      id: `${symbol.id}-${index + 1}`,
      kind: 'symbol',
      label: symbol.label,
      description: symbol.coachingPrompt,
      symbolType: symbol.id,
      symbolLabel: symbol.label,
    })
  }

  return tiles
}
