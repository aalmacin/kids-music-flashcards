import type { Question, QuizEnumerator } from '../../../lib/types'
import { getParallelMinor, allMajorKeys } from '../../../lib/circle-of-fifths'
import { shuffle } from '../../utils'

export const enumerateParallelKeyQuestions: QuizEnumerator = (): Question[] => {
  const allMinors = allMajorKeys().map(k => k + 'm')
  return allMajorKeys().flatMap(key => {
    const answer = getParallelMinor(key)
    const distractors = shuffle(allMinors.filter(m => m !== answer)).slice(0, 3)
    return [
      { text: `What is the parallel minor of ${key} major?`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'easy' as const },
      { text: `Which minor key has the same root note as ${key} major?`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'hard' as const },
    ]
  })
}
