import { symbols } from '../data/symbols'
import { createDeckState, createSymbolCounts } from './gameplay'
import type {
  AccessibilityPreferences,
  ActiveGame,
  GameLength,
  GameSummary,
  PersistedGameModel,
  PlayerMilestones,
  PlayerState,
  SetupDraft,
} from '../types'

const playerColors = [
  '#d62828',
  '#457b9d',
  '#2a9d8f',
  '#e9b949',
  '#7b2cbf',
  '#f77f00',
  '#1d7874',
  '#ef476f',
  '#6a994e',
  '#577590',
  '#bc4749',
  '#9c6644',
]

export function createDefaultAccessibility(): AccessibilityPreferences {
  return {
    reducedMotion: false,
    highContrast: false,
    textSize: 'medium',
  }
}

export function createDefaultSetupDraft(): SetupDraft {
  return {
    playerCount: 0,
    gameLength: 'quick',
    playerNames: ['', '', '', ''],
    playerTokens: getRandomDefaultPlayerColors(),
  }
}

export function createInitialModel(): PersistedGameModel {
  return {
    accessibility: createDefaultAccessibility(),
    draftSetup: createDefaultSetupDraft(),
    currentGame: null,
    summary: null,
  }
}

export function setDraftPlayerCount(
  model: PersistedGameModel,
  playerCount: number,
): PersistedGameModel {
  const clampedCount = Math.max(1, Math.min(4, playerCount))
  const nextNames = Array.from({ length: 4 }, (_, index) => {
    return model.draftSetup.playerNames[index] ?? ''
  })

  return {
    ...model,
    draftSetup: {
      ...model.draftSetup,
      playerCount: clampedCount,
      playerNames: nextNames,
    },
  }
}

export function setDraftGameLength(
  model: PersistedGameModel,
  gameLength: GameLength,
): PersistedGameModel {
  return {
    ...model,
    draftSetup: {
      ...model.draftSetup,
      gameLength,
    },
  }
}

export function setDraftPlayerName(
  model: PersistedGameModel,
  playerIndex: number,
  name: string,
): PersistedGameModel {
  const nextNames = [...model.draftSetup.playerNames]
  nextNames[playerIndex] = name.slice(0, 24)

  return {
    ...model,
    draftSetup: {
      ...model.draftSetup,
      playerNames: nextNames,
    },
  }
}

export function setDraftPlayerToken(
  model: PersistedGameModel,
  playerIndex: number,
  colorToken: string,
): PersistedGameModel {
  const nextTokens = [
    ...(model.draftSetup.playerTokens?.length
      ? model.draftSetup.playerTokens
      : getRandomDefaultPlayerColors()),
  ]
  const duplicateIndex = nextTokens.findIndex(
    (token, index) => index !== playerIndex && token === colorToken,
  )

  if (duplicateIndex !== -1) {
    return model
  }

  nextTokens[playerIndex] = colorToken

  return {
    ...model,
    draftSetup: {
      ...model.draftSetup,
      playerTokens: nextTokens.slice(0, 4),
    },
  }
}

export function updateAccessibility(
  model: PersistedGameModel,
  patch: Partial<AccessibilityPreferences>,
): PersistedGameModel {
  return {
    ...model,
    accessibility: {
      ...model.accessibility,
      ...patch,
    },
  }
}

export function startGame(model: PersistedGameModel): PersistedGameModel {
  const activePlayerNames = getActivePlayerNames(model.draftSetup)

  if (activePlayerNames.length === 0) {
    return model
  }

  const currentGame = createActiveGame(model.draftSetup)

  return {
    ...model,
    draftSetup: {
      ...model.draftSetup,
      playerCount: activePlayerNames.length,
    },
    currentGame,
    summary: null,
  }
}

export function createSummary(model: PersistedGameModel): PersistedGameModel {
  if (!model.currentGame) {
    return model
  }

  const summary: GameSummary = {
    graduatedPlayers: model.currentGame.players
      .filter((player) => player.graduated)
      .map((player) => player.name),
    totalPlayers: model.currentGame.players.length,
    creditsEarned: model.currentGame.teamProgress.credits,
    supportSpent: Math.max(
      0,
      model.currentGame.players.length + 2 - model.currentGame.teamProgress.supportTokens,
    ),
    reflectionNotes: [
      `Amber opened with: ${model.currentGame.amberMessage}`,
      `Board preview uses ${model.currentGame.boardSize} tiles for the selected journey.`,
      `Turns logged so far: ${model.currentGame.log.length}`,
    ],
    helpfulSymbols: getHelpfulSymbols(model.currentGame.symbolCounts),
  }

  return {
    ...model,
    summary,
  }
}

function getHelpfulSymbols(symbolCounts: ActiveGame['symbolCounts']): string[] {
  return [...symbols]
    .sort((left, right) => symbolCounts[right.id] - symbolCounts[left.id])
    .filter((symbol) => symbolCounts[symbol.id] > 0)
    .slice(0, 3)
    .map((symbol) => symbol.label)
}

export function resetWorkspace(model: PersistedGameModel): PersistedGameModel {
  return {
    ...model,
    currentGame: null,
    summary: null,
    draftSetup: createDefaultSetupDraft(),
  }
}

function createActiveGame(draftSetup: SetupDraft): ActiveGame {
  const boardSize = draftSetup.gameLength === 'quick' ? 24 : 32
  const activePlayerNames = getActivePlayerNames(draftSetup)
  const players = activePlayerNames.map((playerName, index) =>
    createPlayerState(index, playerName, draftSetup.playerTokens?.[index]),
  )

  return {
    gameLength: draftSetup.gameLength,
    boardSize,
    turnNumber: 1,
    currentPlayerIndex: 0,
    phase: 'await_roll',
    usedTeamAssistThisTurn: false,
    usedSlowDownThisTurn: false,
    amberMessage: `Amber: ${players[0].name}, you are first. Let's build momentum together.`,
    lastRoll: null,
    activeTileId: null,
    movement: {
      playerId: null,
      path: [],
    },
    activeCard: null,
    activeChallenge: null,
    activeChallengeResult: null,
    deckState: createDeckState(),
    symbolCounts: createSymbolCounts(),
    log: [],
    players,
    teamProgress: {
      credits: 0,
      supportTokens: players.length + 2,
      graduationTarget: getGraduationTarget(players.length, draftSetup.gameLength),
    },
  }
}

export function getActivePlayerNames(draftSetup: SetupDraft): string[] {
  return draftSetup.playerNames
    .map((playerName) => playerName.trim())
    .filter((playerName) => playerName.length > 0)
    .slice(0, 4)
}

export function getAvailablePlayerTokens(): string[] {
  return playerColors
}

function createPlayerState(
  index: number,
  rawName: string | undefined,
  colorTokenOverride?: string,
): PlayerState {
  return {
    id: `player-${index + 1}`,
    name: rawName?.trim() || `Player ${index + 1}`,
    colorToken: colorTokenOverride ?? playerColors[index] ?? `Color ${index + 1}`,
    position: 0,
    lapsCompleted: 0,
    graduated: false,
    milestones: createMilestones(),
  }
}

function getGraduationTarget(playerCount: number, gameLength: GameLength): number {
  const creditsPerPlayer = gameLength === 'quick' ? 8 : 10
  return playerCount * creditsPerPlayer
}

function getRandomDefaultPlayerColors(): string[] {
  const shuffledColors = [...playerColors]

  for (let index = shuffledColors.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentColor = shuffledColors[index]
    shuffledColors[index] = shuffledColors[swapIndex]
    shuffledColors[swapIndex] = currentColor
  }

  return shuffledColors.slice(0, 4)
}

function createMilestones(): PlayerMilestones {
  return {
    goalDefined: false,
    supportShared: false,
    smartCheckComplete: false,
  }
}
