import { Store } from '@tanstack/react-store'
import type { QuizSession, Question, QuizMode, Difficulty, QuizDefinition } from '../lib/types'

interface QuizSessionState {
  session: QuizSession | null
}

export const quizSessionStore = new Store<QuizSessionState>({ session: null })

function pickDifficulty(difficulty: Difficulty): Exclude<Difficulty, 'mixed'> {
  if (difficulty !== 'mixed') return difficulty
  const options = ['easy', 'medium', 'hard'] as const
  return options[Math.floor(Math.random() * 3)]
}

function generateQuestions(quiz: QuizDefinition, count: number, difficulty: Difficulty): Question[] {
  const questions: Question[] = []
  const usedTexts = new Set<string>()
  let attempts = 0
  const maxAttempts = count * 20  // safety limit

  while (questions.length < count && attempts < maxAttempts) {
    attempts++
    const generator = quiz.generators[Math.floor(Math.random() * quiz.generators.length)]
    const d = pickDifficulty(difficulty)
    const q = generator(d, [])
    if (!usedTexts.has(q.text)) {
      usedTexts.add(q.text)
      questions.push(q)
    }
  }
  return questions
}

export function startSession(quiz: QuizDefinition, mode: QuizMode, difficulty: Difficulty): void {
  const count = mode.type === 'fixed' ? mode.count : 999 // timed mode generates a large pool
  const questions = generateQuestions(quiz, Math.min(count, 200), difficulty)

  quizSessionStore.setState(() => ({
    session: {
      quizId: quiz.id,
      mode,
      difficulty,
      questions,
      currentIndex: 0,
      score: 0,
      attempted: 0,
      wrongOnCurrent: false,
      startedAt: Date.now(),
      finishedAt: null,
    },
  }))
}

export function recordAnswer(isCorrect: boolean): void {
  quizSessionStore.setState(state => {
    if (!state.session) return state
    const s = state.session
    if (isCorrect) {
      const earned = s.wrongOnCurrent ? 0 : 1
      const nextIndex = s.currentIndex + 1
      const isLast = s.mode.type === 'fixed' && nextIndex >= s.mode.count
      return {
        session: {
          ...s,
          score: s.score + earned,
          attempted: s.attempted + 1,
          currentIndex: nextIndex,
          wrongOnCurrent: false,
          finishedAt: isLast ? Date.now() : null,
        },
      }
    }
    return { session: { ...s, wrongOnCurrent: true } }
  })
}

export function finishSession(): void {
  quizSessionStore.setState(state => ({
    session: state.session ? { ...state.session, finishedAt: Date.now() } : null,
  }))
}

export function clearSession(): void {
  quizSessionStore.setState(() => ({ session: null }))
}
