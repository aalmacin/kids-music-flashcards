import { Store } from '@tanstack/react-store'
import type { QuizSession, Question, QuizMode, QuizDefinition } from '../lib/types'

interface QuizSessionState {
  session: QuizSession | null
}

export const quizSessionStore = new Store<QuizSessionState>({ session: null })

function generateQuestions(quiz: QuizDefinition, count: number): Question[] {
  const pool = quiz.generators.flatMap(e => e())

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

export function startSession(quiz: QuizDefinition, mode: QuizMode): void {
  const count = mode.type === 'fixed' ? mode.count : 999
  const questions = generateQuestions(quiz, Math.min(count, 200))

  quizSessionStore.setState(() => ({
    session: {
      quizId: quiz.id,
      mode,
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
      const isLast = (s.mode.type === 'fixed' && nextIndex >= s.mode.count) || nextIndex >= s.questions.length
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
