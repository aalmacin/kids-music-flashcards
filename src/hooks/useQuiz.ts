import { useStore } from '@tanstack/react-store'
import { quizSessionStore, recordAnswer, finishSession } from '../store/quiz-session'

export function useQuiz() {
  const { session } = useStore(quizSessionStore)

  const currentQuestion = session
    ? session.questions[session.currentIndex] ?? null
    : null

  const isFinished = session !== null && session.finishedAt !== null

  function answer(selected: string) {
    if (!session || isFinished) return
    const correct = selected === currentQuestion?.answer
    recordAnswer(correct)
    return correct
  }

  function expire() {
    finishSession()
  }

  return { session, currentQuestion, isFinished, answer, expire }
}
