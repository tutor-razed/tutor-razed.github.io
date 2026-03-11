import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { symbols } from '../game/data/symbols'
import { getPlayerTokenColor } from '../game/playerTokens'
import type { BoardTile, MovementState, PlayerState } from '../game/types'

interface BoardPreviewProps {
  activeTileId: string | null
  credits: number
  centerContent?: ReactNode
  currentPlayerIndex: number
  graduationTarget: number
  reducedMotion: boolean
  supportTokens: number
  turnNumber: number
  movement: MovementState
  players: PlayerState[]
  tiles: BoardTile[]
}

export function BoardPreview({
  activeTileId,
  credits,
  centerContent = null,
  currentPlayerIndex,
  graduationTarget,
  reducedMotion,
  supportTokens,
  turnNumber,
  movement,
  players,
  tiles,
}: BoardPreviewProps) {
  const [animationStep, setAnimationStep] = useState<{
    signature: string
    stepIndex: number
  }>({
    signature: '',
    stepIndex: -1,
  })

  const movementSignature = `${turnNumber}-${movement.playerId ?? 'none'}-${movement.path.join('-')}`
  const movingPlayerIndex = players.findIndex((player) => player.id === movement.playerId)

  useEffect(() => {
    if (movingPlayerIndex === -1 || movement.path.length === 0 || reducedMotion) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setAnimationStep({
        signature: movementSignature,
        stepIndex: 0,
      })
    }, 0)

    let stepIndex = 0
    const intervalId = window.setInterval(() => {
      stepIndex += 1

      if (stepIndex >= movement.path.length) {
        window.clearInterval(intervalId)
        setAnimationStep({
          signature: movementSignature,
          stepIndex: -1,
        })
        return
      }

      setAnimationStep({
        signature: movementSignature,
        stepIndex,
      })
    }, 240)

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [movement.path, movementSignature, movingPlayerIndex, reducedMotion])

  const animatedPosition = reducedMotion
    ? movement.path[movement.path.length - 1] ?? null
    : animationStep.signature === movementSignature && animationStep.stepIndex >= 0
      ? movement.path[animationStep.stepIndex] ?? null
      : null
  const isAnimating =
    !reducedMotion &&
    animationStep.signature === movementSignature &&
    animationStep.stepIndex >= 0

  const displayedPlayers = useMemo(() => {
    if (movingPlayerIndex === -1 || animatedPosition === null) {
      return players
    }

    return players.map((player, index) =>
      index === movingPlayerIndex ? { ...player, position: animatedPosition } : player,
    )
  }, [animatedPosition, movingPlayerIndex, players])

  const highlightedTileId =
    activeTileId ??
    (isAnimating && animatedPosition !== null ? tiles[animatedPosition]?.id ?? null : null)
  const boardDimension = Math.floor((tiles.length + 4) / 4)
  const centerStyle = {
    gridColumn: `2 / ${boardDimension}`,
    gridRow: `2 / ${boardDimension}`,
  }
  const symbolMap = useMemo(
    () => new Map(symbols.map((symbol) => [symbol.id, symbol])),
    [],
  )

  return (
    <div
      className="board-preview"
      style={{ '--board-size': String(boardDimension) } as React.CSSProperties}
    >
      <ol aria-label="Board preview" className="board-loop">
        {tiles.map((tile, index) => {
          const tilePosition = getBoardPosition(index, boardDimension)
          const milestoneLabel = getMilestoneLabel(tile)
          const symbolDefinition = tile.symbolType ? symbolMap.get(tile.symbolType) : null
          const symbolAccent = symbolDefinition?.accentVar ?? null
          const occupiedPlayers = displayedPlayers.filter((player) => player.position === index)

          return (
            <li
              className={`board-tile board-tile--${tile.kind}${
                tile.id === highlightedTileId ? ' board-tile--active' : ''
              }${milestoneLabel ? ` board-tile--${milestoneLabel.toLowerCase()}` : ''}${
                index === 0 ? ' board-tile--start' : ''
              }`}
              key={tile.id}
              style={{
                gridColumnStart: tilePosition.column,
                gridRowStart: tilePosition.row,
                ...(symbolAccent ? { '--tile-accent': `var(${symbolAccent})` } : {}),
              } as React.CSSProperties}
              aria-label={getTileAriaLabel(tile, index, milestoneLabel)}
              title={getTileTooltip(tile, milestoneLabel)}
            >
              <div className="board-tile__header">
                <span className="board-tile__index">{index + 1}</span>
              </div>
              <div className="board-tile__body">
                {tile.kind === 'symbol' && tile.symbolType ? (
                  <>
                    <span
                      aria-hidden="true"
                      className={`board-symbol board-symbol--${tile.symbolType}`}
                    >
                      {getSymbolGlyph(tile.symbolType)}
                    </span>
                    <span className="visually-hidden">{symbolDefinition?.label ?? tile.label}</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true" className="board-special-glyph">
                      {getSpecialGlyph(tile.label)}
                    </span>
                    <span className="visually-hidden">{tile.label}</span>
                  </>
                )}
              </div>
              {milestoneLabel ? (
                <span
                  aria-hidden="true"
                  className={`board-tile__marker board-tile__marker--${milestoneLabel.toLowerCase()}`}
                />
              ) : null}
              <div className="board-tile__tokens" aria-label={`Players on tile ${index + 1}`}>
                {occupiedPlayers.map((player) => (
                  <span
                    className={`board-token${
                      players[currentPlayerIndex]?.id === player.id
                        ? ' board-token--current'
                        : ''
                    }${
                      movement.playerId === player.id && animatedPosition === index
                        ? ' board-token--moving'
                        : ''
                    }${player.graduated ? ' board-token--graduated' : ''}`}
                    key={player.id}
                    style={{ '--player-token-color': getPlayerTokenColor(player.colorToken) } as React.CSSProperties}
                    title={`${player.name} on tile ${index + 1}`}
                  />
                ))}
              </div>
            </li>
          )
        })}
        <li className="board-center" style={centerStyle}>
          {centerContent ?? (
            <>
              <p className="eyebrow">Win together</p>
              <h3>Everyone needs Goal, Support, and SMART.</h3>
              <div className="board-center__stats" aria-label="Shared progress">
                <div className="board-center__stat">
                  <strong>{credits}</strong>
                  <span>Credits</span>
                </div>
                <div className="board-center__stat">
                  <strong>{supportTokens}</strong>
                  <span>Support</span>
                </div>
                <div className="board-center__stat">
                  <strong>{graduationTarget}</strong>
                  <span>Target</span>
                </div>
              </div>
              <ul className="board-center__legend">
                <li>
                  <span className="board-tile__badge board-tile__badge--goal">Goal</span> Star
                </li>
                <li>
                  <span className="board-tile__badge board-tile__badge--support">Support</span>{' '}
                  Circles or Mentor
                </li>
                <li>
                  <span className="board-tile__badge board-tile__badge--smart">SMART</span>{' '}
                  Target or SMART
                </li>
              </ul>
              <p className="board-center__win">
                Hit the credit target after every player is ready.
              </p>
            </>
          )}
        </li>
      </ol>
    </div>
  )
}

function getBoardPosition(index: number, boardDimension: number) {
  const topRowCount = boardDimension
  const rightColumnCount = boardDimension - 1
  const bottomRowCount = boardDimension - 1
  const bottomStart = topRowCount + rightColumnCount
  const leftStart = bottomStart + bottomRowCount

  if (index < topRowCount) {
    return {
      column: index + 1,
      row: 1,
    }
  }

  if (index < bottomStart) {
    return {
      column: boardDimension,
      row: index - topRowCount + 2,
    }
  }

  if (index < leftStart) {
    return {
      column: boardDimension - (index - bottomStart) - 1,
      row: boardDimension,
    }
  }

  return {
    column: 1,
    row: boardDimension - (index - leftStart) - 1,
  }
}

function getMilestoneLabel(tile: BoardTile): 'Goal' | 'Support' | 'SMART' | null {
  if (tile.symbolType === 'star') {
    return 'Goal'
  }

  if (tile.symbolType === 'circles' || tile.label === 'Mentor Moment') {
    return 'Support'
  }

  if (tile.symbolType === 'target' || tile.label === 'SMART Check-in') {
    return 'SMART'
  }

  return null
}

function getSpecialGlyph(label: string): string {
  switch (label) {
    case 'Mentor Moment':
      return 'M'
    case 'Reflection Bench':
      return 'R'
    case 'Slow Down Zone':
      return 'S'
    case 'SMART Check-in':
      return 'T'
    default:
      return '•'
  }
}

function getSymbolGlyph(symbolType: NonNullable<BoardTile['symbolType']>) {
  switch (symbolType) {
    case 'star':
      return '★'
    case 'circles':
      return '◎'
    case 'clapperboard':
      return '▤'
    case 'litmus-strip':
      return '▮'
    case 'heart':
      return '♥'
    case 'stop-sign':
      return '⬢'
    case 'target':
      return '◉'
    case 'happy-face':
      return '☺'
  }
}

function getTileTooltip(
  tile: BoardTile,
  milestoneLabel: 'Goal' | 'Support' | 'SMART' | null,
) {
  const prefix = milestoneLabel ? `${milestoneLabel} - ` : ''
  return `${prefix}${tile.label}: ${tile.description}`
}

function getTileAriaLabel(
  tile: BoardTile,
  index: number,
  milestoneLabel: 'Goal' | 'Support' | 'SMART' | null,
) {
  const milestone = milestoneLabel ? ` ${milestoneLabel} space.` : ''
  return `Tile ${index + 1}. ${tile.label}.${milestone} ${tile.description}`
}
