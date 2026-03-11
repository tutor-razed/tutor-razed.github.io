import { createBoardLayout } from '../data/boards'
import { miniChallenges, symbolCards } from '../data/cards'
import type {
  ActiveGame,
  BoardTile,
  CardOutcome,
  DeckState,
  PersistedGameModel,
  PlayerState,
  SymbolCard,
  SymbolType,
  TurnLogEntry,
} from '../types'

const symbolOrder: SymbolType[] = [
  'star',
  'circles',
  'clapperboard',
  'litmus-strip',
  'heart',
  'stop-sign',
  'target',
  'happy-face',
]

export function createDeckState(): Record<SymbolType, DeckState> {
  return symbolOrder.reduce<Record<SymbolType, DeckState>>((accumulator, symbolType) => {
    accumulator[symbolType] = {
      drawPile: symbolCards
        .filter((card) => card.symbolType === symbolType)
        .map((card) => card.id),
      discardPile: [],
    }
    return accumulator
  }, {} as Record<SymbolType, DeckState>)
}

export function createSymbolCounts(): Record<SymbolType, number> {
  return symbolOrder.reduce<Record<SymbolType, number>>((accumulator, symbolType) => {
    accumulator[symbolType] = 0
    return accumulator
  }, {} as Record<SymbolType, number>)
}

export function playRoll(
  model: PersistedGameModel,
  rollValue: number,
): PersistedGameModel {
  if (!model.currentGame || model.currentGame.phase !== 'await_roll') {
    return model
  }

  const roll = Math.max(1, Math.min(6, Math.floor(rollValue)))
  const currentGame = model.currentGame
  const board = createBoardLayout(currentGame.gameLength)
  const player = currentGame.players[currentGame.currentPlayerIndex]
  const movementPath = createMovementPath(player.position, roll, board.length)
  const completedLap = player.position + roll >= board.length
  const nextPosition = (player.position + roll) % board.length
  const landedTile = board[nextPosition]
  const nextPlayers = currentGame.players.map((entry, index) =>
    index === currentGame.currentPlayerIndex
      ? {
          ...entry,
          lapsCompleted: entry.lapsCompleted + (completedLap ? 1 : 0),
          position: nextPosition,
        }
      : entry,
  )

  const movedGame: ActiveGame = {
    ...currentGame,
    lastRoll: roll,
    players: nextPlayers,
    activeTileId: landedTile.id,
    movement: {
      playerId: player.id,
      path: movementPath,
    },
    amberMessage: `Amber: ${player.name} rolled a ${roll} and landed on ${landedTile.label}.`,
    activeChallengeResult: null,
  }

  if (landedTile.kind === 'special') {
    const resolvedGame = resolveSpecialTile(movedGame, landedTile)
    return {
      ...model,
      currentGame: finishTurn(resolvedGame),
      summary: null,
    }
  }

  const resolvedCard = drawSymbolCard(
    landedTile.symbolType!,
    movedGame.deckState,
  )
  const nextSymbolCount = movedGame.symbolCounts[landedTile.symbolType!] + 1
  const challenge = drawMiniChallenge(landedTile.symbolType!, nextSymbolCount)

  if (challenge) {
    const awaitingChallenge: ActiveGame = {
      ...movedGame,
      phase: 'await_choice',
      activeCard: null,
      activeChallenge: challenge,
      symbolCounts: {
        ...movedGame.symbolCounts,
        [landedTile.symbolType!]: nextSymbolCount,
      },
      amberMessage: `Amber: ${player.name}, pause for a mini-challenge before the turn continues.`,
    }

    return {
      ...model,
      currentGame: awaitingChallenge,
      summary: null,
    }
  }

  const awaitingChoice: ActiveGame = {
    ...movedGame,
    phase: 'await_choice',
    activeCard: resolvedCard.card,
    activeChallenge: null,
    deckState: resolvedCard.deckState,
    symbolCounts: {
      ...movedGame.symbolCounts,
      [landedTile.symbolType!]: nextSymbolCount,
    },
    amberMessage: `Amber: ${player.name}, read "${resolvedCard.card.title}" and choose what to do next.`,
  }

  return {
    ...model,
    currentGame: awaitingChoice,
    summary: null,
  }
}

export function applyChallengeChoice(
  model: PersistedGameModel,
  selectedIndex: number,
): PersistedGameModel {
  const currentGame = model.currentGame

  if (!currentGame || currentGame.phase !== 'await_choice') {
    return model
  }

  const { activeChallenge } = currentGame
  if (!activeChallenge) {
    return model
  }

  const currentPlayer = currentGame.players[currentGame.currentPlayerIndex]
  const wasCorrect = selectedIndex === activeChallenge.correctIndex
  const outcome = wasCorrect
    ? activeChallenge.successOutcome
    : activeChallenge.fallbackOutcome
  const updatedPlayers = currentGame.players.map((player, index) =>
    index === currentGame.currentPlayerIndex ? applyOutcomeToPlayer(player, outcome) : player,
  )
  const updatedTeamProgress = applyOutcomeToTeam(currentGame.teamProgress, outcome)
  const graduationReady = updatedTeamProgress.credits >= updatedTeamProgress.graduationTarget

  const resolvedGame: ActiveGame = {
    ...currentGame,
    phase: 'await_result',
    players: updatedPlayers.map((player) =>
      canGraduate(player, graduationReady) ? { ...player, graduated: true } : player,
    ),
    teamProgress: updatedTeamProgress,
    activeCard: null,
    activeChallengeResult: {
      selectedIndex,
      correctIndex: activeChallenge.correctIndex,
      wasCorrect,
      feedback: wasCorrect
        ? `${currentPlayer.name} chose the strongest answer and earned the full challenge outcome.`
        : `${currentPlayer.name} chose a different answer, so the fallback outcome still keeps the team learning.`,
    },
    amberMessage: wasCorrect
      ? `Amber: ${currentPlayer.name} solved the mini-challenge and kept the team moving.`
      : `Amber: ${currentPlayer.name} took the mini-challenge thoughtfully and still learned from it.`,
    log: [
      createLogEntry(
        currentGame.turnNumber,
        currentPlayer.name,
        currentGame.lastRoll,
        `Mini-challenge: ${activeChallenge.prompt} (${wasCorrect ? 'success' : 'fallback'})`,
      ),
      ...currentGame.log,
    ].slice(0, 8),
  }

  return {
    ...model,
    currentGame: resolvedGame,
    summary: null,
  }
}

export function acknowledgeChallengeResult(
  model: PersistedGameModel,
): PersistedGameModel {
  const currentGame = model.currentGame

  if (
    !currentGame ||
    currentGame.phase !== 'await_result' ||
    !currentGame.activeChallenge ||
    !currentGame.activeChallengeResult
  ) {
    return model
  }

  return {
    ...model,
    currentGame: finishTurn({
      ...currentGame,
      activeChallenge: null,
      activeChallengeResult: null,
    }),
    summary: null,
  }
}

export function applyCardChoice(
  model: PersistedGameModel,
  choiceId: string,
): PersistedGameModel {
  const currentGame = model.currentGame

  if (!currentGame || currentGame.phase !== 'await_choice') {
    return model
  }

  const { activeCard } = currentGame
  if (!activeCard) {
    return model
  }

  const selectedChoice = activeCard.choices.find((choice) => choice.id === choiceId)
  if (!selectedChoice) {
    return model
  }

  const currentPlayer = currentGame.players[currentGame.currentPlayerIndex]
  const updatedPlayers = currentGame.players.map((player, index) =>
    index === currentGame.currentPlayerIndex
      ? applyOutcomeToPlayer(player, selectedChoice.outcome)
      : player,
  )
  const updatedTeamProgress = applyOutcomeToTeam(
    currentGame.teamProgress,
    selectedChoice.outcome,
  )
  const graduationReady = updatedTeamProgress.credits >= updatedTeamProgress.graduationTarget
  const graduatedPlayers = updatedPlayers.map((player) =>
    canGraduate(player, graduationReady) ? { ...player, graduated: true } : player,
  )

  const resolvedGame: ActiveGame = {
    ...currentGame,
    players: graduatedPlayers,
    teamProgress: updatedTeamProgress,
    activeCard: null,
    activeChallenge: null,
    amberMessage:
      selectedChoice.outcome.narration ??
      `Amber: ${currentPlayer.name} chose "${selectedChoice.label}".`,
    log: [
      createLogEntry(
        currentGame.turnNumber,
        currentPlayer.name,
        currentGame.lastRoll,
        `${activeCard.title}: ${selectedChoice.label}`,
      ),
      ...currentGame.log,
    ].slice(0, 8),
  }

  return {
    ...model,
    currentGame: finishTurn(resolvedGame),
    summary: null,
  }
}

export function canPrepareSummary(model: PersistedGameModel): boolean {
  return Boolean(model.currentGame && model.currentGame.players.every((player) => player.graduated))
}

export function applyTeamAssist(
  model: PersistedGameModel,
  targetPlayerId: string,
): PersistedGameModel {
  const currentGame = model.currentGame

  if (!currentGame || currentGame.phase === 'complete') {
    return model
  }

  if (currentGame.usedTeamAssistThisTurn || currentGame.teamProgress.supportTokens < 1) {
    return model
  }

  const targetIndex = currentGame.players.findIndex((player) => player.id === targetPlayerId)
  if (targetIndex === -1) {
    return model
  }

  const targetPlayer = currentGame.players[targetIndex]
  if (targetPlayer.graduated) {
    return model
  }

  const assistedPlayer = applyTeamAssistToPlayer(targetPlayer)
  const updatedPlayers = currentGame.players.map((player, index) =>
    index === targetIndex ? assistedPlayer : player,
  )
  const didAdvanceMilestone =
    !targetPlayer.milestones.goalDefined ||
    !targetPlayer.milestones.supportShared ||
    !targetPlayer.milestones.smartCheckComplete

  const updatedTeamProgress = {
    ...currentGame.teamProgress,
    supportTokens: currentGame.teamProgress.supportTokens - 1,
    credits: clamp(
      currentGame.teamProgress.credits + (didAdvanceMilestone ? 1 : 0),
      0,
      currentGame.teamProgress.graduationTarget,
    ),
  }

  const assistedGame: ActiveGame = {
    ...currentGame,
    players: updatedPlayers.map((player) =>
      canGraduate(player, updatedTeamProgress.credits >= updatedTeamProgress.graduationTarget)
        ? { ...player, graduated: true }
        : player,
    ),
    teamProgress: updatedTeamProgress,
    usedTeamAssistThisTurn: true,
    amberMessage: didAdvanceMilestone
      ? `Amber: The team spent 1 support token to help ${targetPlayer.name} move forward.`
      : `Amber: The team spent 1 support token to encourage ${targetPlayer.name}.`,
    log: [
      createLogEntry(
        currentGame.turnNumber,
        targetPlayer.name,
        currentGame.lastRoll,
        didAdvanceMilestone
          ? 'Team Assist spent 1 support token and advanced a milestone.'
          : 'Team Assist spent 1 support token for encouragement.',
      ),
      ...currentGame.log,
    ].slice(0, 8),
  }

  return {
    ...model,
    currentGame: assistedGame,
  }
}

export function applySlowDown(model: PersistedGameModel): PersistedGameModel {
  const currentGame = model.currentGame

  if (
    !currentGame ||
    currentGame.phase !== 'await_choice' ||
    (!currentGame.activeCard && !currentGame.activeChallenge) ||
    currentGame.usedSlowDownThisTurn ||
    currentGame.teamProgress.supportTokens < 1
  ) {
    return model
  }

  const currentPlayer = currentGame.players[currentGame.currentPlayerIndex]
  const calmedGame: ActiveGame = {
    ...currentGame,
    teamProgress: {
      ...currentGame.teamProgress,
      supportTokens: currentGame.teamProgress.supportTokens - 1,
    },
    usedSlowDownThisTurn: true,
    activeCard: null,
    activeChallenge: null,
    activeChallengeResult: null,
    amberMessage: `Amber: Slow Down gave ${currentPlayer.name} room to breathe. The turn ends without pressure.`,
    log: [
      createLogEntry(
        currentGame.turnNumber,
        currentPlayer.name,
        currentGame.lastRoll,
        'Slow Down spent 1 support token to safely end the card choice.',
      ),
      ...currentGame.log,
    ].slice(0, 8),
  }

  return {
    ...model,
    currentGame: finishTurn(calmedGame),
  }
}

function drawMiniChallenge(
  symbolType: SymbolType,
  nextSymbolCount: number,
) {
  const challenges = miniChallenges.filter((entry) => entry.symbolType === symbolType)
  if (challenges.length === 0 || nextSymbolCount % 2 !== 0) {
    return null
  }

  return challenges[(nextSymbolCount / 2 - 1) % challenges.length] ?? null
}

function drawSymbolCard(
  symbolType: SymbolType,
  deckState: Record<SymbolType, DeckState>,
): {
  card: SymbolCard
  deckState: Record<SymbolType, DeckState>
} {
  const currentDeck = deckState[symbolType]
  const replenishedDrawPile =
    currentDeck.drawPile.length > 0 ? currentDeck.drawPile : currentDeck.discardPile
  const [nextCardId, ...remainingDrawPile] = replenishedDrawPile
  const card = symbolCards.find((entry) => entry.id === nextCardId)

  if (!card) {
    throw new Error(`No card found for id "${nextCardId}"`)
  }

  return {
    card,
    deckState: {
      ...deckState,
      [symbolType]: {
        drawPile: remainingDrawPile,
        discardPile: [...currentDeck.discardPile.filter((id) => id !== nextCardId), nextCardId],
      },
    },
  }
}

function resolveSpecialTile(game: ActiveGame, tile: BoardTile): ActiveGame {
  const player = game.players[game.currentPlayerIndex]

  switch (tile.label) {
    case 'Mentor Moment':
      return {
        ...game,
        players: game.players.map((entry, index) =>
          index === game.currentPlayerIndex
            ? {
                ...entry,
                milestones: {
                  ...entry.milestones,
                  supportShared: true,
                },
              }
            : entry,
        ),
        teamProgress: {
          ...game.teamProgress,
          supportTokens: game.teamProgress.supportTokens + 2,
        },
        amberMessage: `Amber: Mentor Moment gives ${player.name} a team assist boost.`,
        log: [createLogEntry(game.turnNumber, player.name, game.lastRoll, 'Mentor Moment gained 2 support tokens.'), ...game.log].slice(0, 8),
      }
    case 'Reflection Bench':
      return {
        ...game,
        teamProgress: {
          ...game.teamProgress,
          credits: Math.min(
            game.teamProgress.graduationTarget,
            game.teamProgress.credits + 1,
          ),
        },
        amberMessage: `Amber: Reflection Bench helped the team pause and earn 1 credit.`,
        log: [createLogEntry(game.turnNumber, player.name, game.lastRoll, 'Reflection Bench earned 1 credit.'), ...game.log].slice(0, 8),
      }
    case 'Slow Down Zone':
      return {
        ...game,
        teamProgress: {
          ...game.teamProgress,
          supportTokens: game.teamProgress.supportTokens + 1,
        },
        amberMessage: `Amber: Slow Down Zone gave the group room to breathe and 1 support token.`,
        log: [createLogEntry(game.turnNumber, player.name, game.lastRoll, 'Slow Down Zone earned 1 support token.'), ...game.log].slice(0, 8),
      }
    case 'SMART Check-in':
      return {
        ...game,
        players: game.players.map((entry, index) =>
          index === game.currentPlayerIndex
            ? {
                ...entry,
                milestones: {
                  ...entry.milestones,
                  smartCheckComplete: true,
                },
              }
            : entry,
        ),
        teamProgress: {
          ...game.teamProgress,
          credits: Math.min(
            game.teamProgress.graduationTarget,
            game.teamProgress.credits + 1,
          ),
        },
        amberMessage: `Amber: SMART Check-in moved ${player.name} closer to graduation.`,
        log: [createLogEntry(game.turnNumber, player.name, game.lastRoll, 'SMART Check-in completed a milestone.'), ...game.log].slice(0, 8),
      }
    default:
      return game
  }
}

function applyOutcomeToPlayer(player: PlayerState, outcome: CardOutcome): PlayerState {
  if (!outcome.milestone) {
    return player
  }

  return {
    ...player,
    milestones: {
      ...player.milestones,
      [outcome.milestone]: true,
    },
  }
}

function applyOutcomeToTeam(
  teamProgress: ActiveGame['teamProgress'],
  outcome: CardOutcome,
) {
  return {
    ...teamProgress,
    credits: clamp(teamProgress.credits + (outcome.credits ?? 0), 0, teamProgress.graduationTarget),
    supportTokens: Math.max(0, teamProgress.supportTokens + (outcome.supportTokens ?? 0)),
  }
}

function finishTurn(game: ActiveGame): ActiveGame {
  const nextPlayers = game.players.map((player) =>
    canGraduate(player, game.teamProgress.credits >= game.teamProgress.graduationTarget)
      ? { ...player, graduated: true }
      : player,
  )
  const everyoneGraduated = nextPlayers.every((player) => player.graduated)

  if (everyoneGraduated) {
    return {
      ...game,
      players: nextPlayers,
      phase: 'complete',
      activeTileId: null,
      activeCard: null,
      activeChallenge: null,
      activeChallengeResult: null,
      amberMessage: 'Amber: Everyone has graduated. The team did it together.',
    }
  }

  const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length
  const nextPlayer = nextPlayers[nextPlayerIndex]

  return {
    ...game,
    players: nextPlayers,
    currentPlayerIndex: nextPlayerIndex,
    turnNumber: game.turnNumber + 1,
    phase: 'await_roll',
      usedTeamAssistThisTurn: false,
      usedSlowDownThisTurn: false,
      activeTileId: null,
      activeCard: null,
      activeChallenge: null,
      activeChallengeResult: null,
      amberMessage: `Amber: ${nextPlayer.name}, it is your turn. Choose a roll to keep the team moving.`,
  }
}

function applyTeamAssistToPlayer(player: PlayerState): PlayerState {
  if (!player.milestones.goalDefined) {
    return {
      ...player,
      milestones: {
        ...player.milestones,
        goalDefined: true,
      },
    }
  }

  if (!player.milestones.supportShared) {
    return {
      ...player,
      milestones: {
        ...player.milestones,
        supportShared: true,
      },
    }
  }

  if (!player.milestones.smartCheckComplete) {
    return {
      ...player,
      milestones: {
        ...player.milestones,
        smartCheckComplete: true,
      },
    }
  }

  return player
}

function canGraduate(player: PlayerState, graduationReady: boolean): boolean {
  return (
    graduationReady &&
    player.lapsCompleted >= 2 &&
    player.milestones.goalDefined &&
    player.milestones.supportShared &&
    player.milestones.smartCheckComplete
  )
}

function createLogEntry(
  turnNumber: number,
  playerName: string,
  roll: number | null,
  summary: string,
): TurnLogEntry {
  return {
    id: `turn-${turnNumber}-${playerName}-${summary}`,
    playerName,
    roll,
    summary,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function createMovementPath(
  startPosition: number,
  roll: number,
  boardSize: number,
): number[] {
  return Array.from({ length: roll }, (_, index) => (startPosition + index + 1) % boardSize)
}
