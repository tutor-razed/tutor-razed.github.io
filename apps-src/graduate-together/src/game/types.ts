export type SymbolType =
  | 'star'
  | 'circles'
  | 'clapperboard'
  | 'litmus-strip'
  | 'heart'
  | 'stop-sign'
  | 'target'
  | 'happy-face'

export type GameLength = 'quick' | 'full'
export type TextSize = 'medium' | 'large' | 'x-large'
export type GamePhase = 'await_roll' | 'await_choice' | 'await_result' | 'complete'
export type CardKind = 'opportunity' | 'challenge' | 'reflection'

export interface AccessibilityPreferences {
  reducedMotion: boolean
  highContrast: boolean
  textSize: TextSize
}

export interface SetupDraft {
  playerCount: number
  gameLength: GameLength
  playerNames: string[]
  playerTokens: string[]
}

export interface PlayerMilestones {
  goalDefined: boolean
  supportShared: boolean
  smartCheckComplete: boolean
}

export interface PlayerState {
  id: string
  name: string
  colorToken: string
  position: number
  lapsCompleted: number
  graduated: boolean
  milestones: PlayerMilestones
}

export interface TeamProgress {
  credits: number
  supportTokens: number
  graduationTarget: number
}

export interface CardOutcome {
  credits?: number
  supportTokens?: number
  milestone?: keyof PlayerMilestones
  teamAssist?: boolean
  narration?: string
}

export interface CardChoice {
  id: string
  label: string
  outcome: CardOutcome
}

export interface SymbolCard {
  id: string
  symbolType: SymbolType
  title: string
  prompt: string
  kind: CardKind
  choices: CardChoice[]
}

export interface MiniChallenge {
  id: string
  symbolType: SymbolType
  prompt: string
  options: string[]
  correctIndex: number
  successOutcome: CardOutcome
  fallbackOutcome: CardOutcome
}

export interface DeckState {
  drawPile: string[]
  discardPile: string[]
}

export interface TurnLogEntry {
  id: string
  playerName: string
  roll: number | null
  summary: string
}

export interface MovementState {
  playerId: string | null
  path: number[]
}

export interface ChallengeResultState {
  selectedIndex: number
  correctIndex: number
  wasCorrect: boolean
  feedback: string
}

export interface ActiveGame {
  gameLength: GameLength
  boardSize: number
  turnNumber: number
  currentPlayerIndex: number
  phase: GamePhase
  usedTeamAssistThisTurn: boolean
  usedSlowDownThisTurn: boolean
  amberMessage: string
  lastRoll: number | null
  activeTileId: string | null
  movement: MovementState
  activeCard: SymbolCard | null
  activeChallenge: MiniChallenge | null
  activeChallengeResult: ChallengeResultState | null
  deckState: Record<SymbolType, DeckState>
  symbolCounts: Record<SymbolType, number>
  log: TurnLogEntry[]
  players: PlayerState[]
  teamProgress: TeamProgress
}

export interface GameSummary {
  graduatedPlayers: string[]
  totalPlayers: number
  creditsEarned: number
  supportSpent: number
  reflectionNotes: string[]
  helpfulSymbols: string[]
}

export interface PersistedGameModel {
  accessibility: AccessibilityPreferences
  draftSetup: SetupDraft
  currentGame: ActiveGame | null
  summary: GameSummary | null
}

export interface SymbolDefinition {
  id: SymbolType
  label: string
  title: string
  coachingPrompt: string
  accentVar: string
}

export interface BoardTile {
  id: string
  kind: 'symbol' | 'special'
  label: string
  description: string
  symbolType?: SymbolType
  symbolLabel?: string
}
