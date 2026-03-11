import { symbols } from '../game/data/symbols'
import type {
  ChallengeResultState,
  MiniChallenge,
  SymbolCard,
} from '../game/types'

interface CardModalProps {
  card: SymbolCard | null
  challenge: MiniChallenge | null
  challengeResult: ChallengeResultState | null
  onChoose: (choiceId: string) => void
  onChooseChallenge: (selectedIndex: number) => void
  onContinueChallengeResult: () => void
}

export function CardModal({
  card,
  challenge,
  challengeResult,
  onChoose,
  onChooseChallenge,
  onContinueChallengeResult,
}: CardModalProps) {
  if (!card && !challenge) {
    return null
  }

  const symbolType = card?.symbolType ?? challenge!.symbolType
  const symbol = symbols.find((entry) => entry.id === symbolType)
  const accent = symbol ? `var(${symbol.accentVar})` : '#ffd166'
  const title = card?.title ?? 'Mini-challenge'
  const prompt = card?.prompt ?? challenge!.prompt
  const correctOption =
    challenge && challengeResult ? challenge.options[challengeResult.correctIndex] : null
  const selectedOption =
    challenge && challengeResult ? challenge.options[challengeResult.selectedIndex] : null

  return (
    <section
      aria-label={card ? `${card.title} card` : `${symbol?.label ?? 'Mini-challenge'} challenge`}
      aria-modal="true"
      className="card-modal"
      role="dialog"
    >
      <div className="card-modal__scrim" />
      <div className="card-modal__panel">
        <p className="eyebrow">{card ? 'Card draw' : 'Mini-challenge'}</p>
        <div className="card-flip-shell">
          <article className="card-face" style={{ '--card-accent': accent } as React.CSSProperties}>
            <p className="card-face__kind">{card ? card.kind : 'challenge'}</p>
            <p className="card-face__symbol">{symbol?.label ?? symbolType}</p>
            <h3>{title}</h3>
            <p>{prompt}</p>
            {challengeResult ? (
              <div
                aria-live="polite"
                className={`challenge-result challenge-result--${
                  challengeResult.wasCorrect ? 'success' : 'fallback'
                }`}
              >
                <p className="challenge-result__label">
                  {challengeResult.wasCorrect ? 'Strong answer' : 'Fallback outcome'}
                </p>
                <p>{challengeResult.feedback}</p>
                <p>
                  <strong>Selected:</strong> {selectedOption}
                </p>
                {!challengeResult.wasCorrect ? (
                  <p>
                    <strong>Best fit:</strong> {correctOption}
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>
        </div>
        {challengeResult ? (
          <div className="card-panel">
            <button onClick={onContinueChallengeResult} type="button">
              Continue turn
            </button>
          </div>
        ) : (
          <ul className="choice-list">
            {card
              ? card.choices.map((choice) => (
                  <li key={choice.id}>
                    <button onClick={() => onChoose(choice.id)} type="button">
                      {choice.label}
                    </button>
                  </li>
                ))
              : challenge!.options.map((option, index) => (
                  <li key={`${challenge!.id}-${index}`}>
                    <button onClick={() => onChooseChallenge(index)} type="button">
                      {option}
                    </button>
                  </li>
                ))}
          </ul>
        )}
      </div>
    </section>
  )
}
