import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  acknowledgeChallengeResult,
  applyCardChoice,
  applyChallengeChoice,
  applySlowDown,
  applyTeamAssist,
  playRoll,
} from '../engine/gameplay'
import {
  createInitialModel,
  resetWorkspace,
  setDraftGameLength,
  setDraftPlayerCount,
  setDraftPlayerName,
  setDraftPlayerToken,
  startGame,
  updateAccessibility,
} from '../engine/model'
import type {
  AccessibilityPreferences,
  GameLength,
  PersistedGameModel,
} from '../types'

interface GameStoreState {
  previous: PersistedGameModel | null
  present: PersistedGameModel
  setPlayerCount: (playerCount: number) => void
  setGameLength: (gameLength: GameLength) => void
  setPlayerName: (playerIndex: number, name: string) => void
  setPlayerToken: (playerIndex: number, colorToken: string) => void
  setAccessibility: (patch: Partial<AccessibilityPreferences>) => void
  startGame: () => void
  playRoll: (rollValue: number) => void
  chooseCardOption: (choiceId: string) => void
  chooseChallengeOption: (selectedIndex: number) => void
  continueChallengeResult: () => void
  useTeamAssist: (targetPlayerId: string) => void
  useSlowDown: () => void
  resetWorkspace: () => void
  undoLastAction: () => void
}

const storageKey = 'graduate-together-workspace'

function remember(
  state: GameStoreState,
  nextPresent: PersistedGameModel,
): Pick<GameStoreState, 'previous' | 'present'> {
  return {
    previous: state.present,
    present: nextPresent,
  }
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set) => ({
      previous: null,
      present: createInitialModel(),
      setPlayerCount: (playerCount) =>
        set((state) => remember(state, setDraftPlayerCount(state.present, playerCount))),
      setGameLength: (gameLength) =>
        set((state) => remember(state, setDraftGameLength(state.present, gameLength))),
      setPlayerName: (playerIndex, name) =>
        set((state) =>
          remember(state, setDraftPlayerName(state.present, playerIndex, name)),
        ),
      setPlayerToken: (playerIndex, colorToken) =>
        set((state) =>
          remember(state, setDraftPlayerToken(state.present, playerIndex, colorToken)),
        ),
      setAccessibility: (patch) =>
        set((state) => remember(state, updateAccessibility(state.present, patch))),
      startGame: () => set((state) => remember(state, startGame(state.present))),
      playRoll: (rollValue) =>
        set((state) => remember(state, playRoll(state.present, rollValue))),
      chooseCardOption: (choiceId) =>
        set((state) => remember(state, applyCardChoice(state.present, choiceId))),
      chooseChallengeOption: (selectedIndex) =>
        set((state) => remember(state, applyChallengeChoice(state.present, selectedIndex))),
      continueChallengeResult: () =>
        set((state) => remember(state, acknowledgeChallengeResult(state.present))),
      useTeamAssist: (targetPlayerId) =>
        set((state) => remember(state, applyTeamAssist(state.present, targetPlayerId))),
      useSlowDown: () =>
        set((state) => remember(state, applySlowDown(state.present))),
      resetWorkspace: () =>
        set((state) => remember(state, resetWorkspace(state.present))),
      undoLastAction: () =>
        set((state) => {
          if (!state.previous) {
            return state
          }

          return {
            previous: null,
            present: state.previous,
          }
        }),
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        previous: state.previous,
        present: state.present,
      }),
    },
  ),
)
