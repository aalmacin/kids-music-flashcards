import type { QuizDefinition } from '../lib/types'
import { cofQuizzes } from './circle-of-fifths'

export const ALL_QUIZZES: QuizDefinition[] = [...cofQuizzes]

export function getQuiz(id: string): QuizDefinition | undefined {
  return ALL_QUIZZES.find(q => q.id === id)
}

export function getTopics(): string[] {
  return [...new Set(ALL_QUIZZES.map(q => q.topic))]
}

export function getQuizzesByTopic(topic: string): QuizDefinition[] {
  return ALL_QUIZZES.filter(q => q.topic === topic)
}
