import { describe, expect, it } from 'vitest'
import {
  acknowledgeChallengeResult,
  applyCardChoice,
  applyChallengeChoice,
  applySlowDown,
  applyTeamAssist,
  playRoll,
} from './gameplay'
import {
  createInitialModel,
  setDraftGameLength,
  setDraftPlayerCount,
  setDraftPlayerName,
  startGame,
} from './model'
import type { PersistedGameModel, PlayerMilestones } from '../types'

describe('gameplay engine', () => {
  it('wraps movement and records each traversed tile', () => {
    let model = createStartedModel(1)

    for (let index = 0; index < 4; index += 1) {
      model = playRoll(model, 6)
      model = resolveCurrentTurn(model)
    }

    model = playRoll(model, 3)

    expect(model.currentGame?.players[0]?.position).toBe(3)
    expect(model.currentGame?.players[0]?.lapsCompleted).toBe(1)
    expect(model.currentGame?.movement.playerId).toBe('player-1')
    expect(model.currentGame?.movement.path).toEqual([1, 2, 3])
    expect(model.currentGame?.activeTileId).toBe('litmus-strip-4')
  })

  it('holds a mini-challenge result until the user continues', () => {
    let model = createStartedModel()
    const currentGame = model.currentGame

    if (!currentGame) {
      throw new Error('Expected a current game')
    }

    model = {
      ...model,
      currentGame: {
        ...currentGame,
        symbolCounts: {
          ...currentGame.symbolCounts,
          circles: 1,
        },
      },
    }

    model = playRoll(model, 1)
    expect(model.currentGame?.phase).toBe('await_choice')
    expect(model.currentGame?.activeChallenge?.symbolType).toBe('circles')

    model = applyChallengeChoice(model, 0)

    expect(model.currentGame?.phase).toBe('await_result')
    expect(model.currentGame?.activeChallengeResult).toMatchObject({
      selectedIndex: 0,
      correctIndex: 1,
      wasCorrect: false,
    })
    expect(model.currentGame?.activeChallenge).not.toBeNull()

    model = acknowledgeChallengeResult(model)

    expect(model.currentGame?.phase).toBe('await_roll')
    expect(model.currentGame?.currentPlayerIndex).toBe(1)
    expect(model.currentGame?.activeChallenge).toBeNull()
    expect(model.currentGame?.activeChallengeResult).toBeNull()
  })

  it('spends support on Team Assist and advances the next unfinished milestone', () => {
    let model = createStartedModel()

    const startingSupport = model.currentGame?.teamProgress.supportTokens ?? 0
    model = applyTeamAssist(model, 'player-2')

    expect(model.currentGame?.teamProgress.supportTokens).toBe(startingSupport - 1)
    expect(model.currentGame?.teamProgress.credits).toBe(1)
    expect(model.currentGame?.players[1]?.milestones.goalDefined).toBe(true)
    expect(model.currentGame?.usedTeamAssistThisTurn).toBe(true)
  })

  it('lets Slow Down safely end an active choice', () => {
    let model = createStartedModel()

    model = playRoll(model, 2)
    expect(model.currentGame?.phase).toBe('await_choice')

    const supportBefore = model.currentGame?.teamProgress.supportTokens ?? 0
    model = applySlowDown(model)

    expect(model.currentGame?.phase).toBe('await_roll')
    expect(model.currentGame?.currentPlayerIndex).toBe(1)
    expect(model.currentGame?.teamProgress.supportTokens).toBe(supportBefore - 1)
    expect(model.currentGame?.activeCard).toBeNull()
    expect(model.currentGame?.activeChallenge).toBeNull()
  })

  it('marks the game complete when the final graduation requirements are met', () => {
    let model = createStartedModel()
    const currentGame = model.currentGame

    if (!currentGame) {
      throw new Error('Expected a current game')
    }

    model = {
      ...model,
      currentGame: {
        ...currentGame,
        phase: 'await_choice',
        teamProgress: {
          ...currentGame.teamProgress,
          credits: currentGame.teamProgress.graduationTarget - 2,
        },
        players: currentGame.players.map((player) => ({
          ...player,
          lapsCompleted: 2,
          milestones: completedMilestones(),
        })),
        activeCard: {
          id: 'final-card',
          symbolType: 'star',
          title: 'Final push',
          prompt: 'Finish the last step.',
          kind: 'opportunity',
          choices: [
            {
              id: 'finish',
              label: 'Finish together',
              outcome: {
                credits: 2,
                narration: 'Amber: The team reached the final graduation target.',
              },
            },
          ],
        },
        activeChallenge: null,
        activeChallengeResult: null,
      },
    }

    model = applyCardChoice(model, 'finish')

    expect(model.currentGame?.phase).toBe('complete')
    expect(model.currentGame?.players.every((player) => player.graduated)).toBe(true)
    expect(model.currentGame?.activeCard).toBeNull()
    expect(model.currentGame?.activeChallenge).toBeNull()
  })
})

function createStartedModel(playerCount = 2): PersistedGameModel {
  let model = createInitialModel()
  model = setDraftPlayerCount(model, playerCount)
  model = setDraftGameLength(model, 'quick')
  model = setDraftPlayerName(model, 0, 'Avery')
  if (playerCount > 1) {
    model = setDraftPlayerName(model, 1, 'Jordan')
  }
  return startGame(model)
}

function resolveCurrentTurn(model: PersistedGameModel): PersistedGameModel {
  const currentGame = model.currentGame

  if (!currentGame) {
    return model
  }

  if (currentGame.activeChallenge) {
    const correctIndex = currentGame.activeChallenge.correctIndex
    return acknowledgeChallengeResult(applyChallengeChoice(model, correctIndex))
  }

  if (currentGame.activeCard) {
    return applyCardChoice(model, currentGame.activeCard.choices[0].id)
  }

  return model
}

function completedMilestones(): PlayerMilestones {
  return {
    goalDefined: true,
    supportShared: true,
    smartCheckComplete: true,
  }
}
