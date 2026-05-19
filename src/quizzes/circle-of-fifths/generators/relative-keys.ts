import type { Question, QuizEnumerator } from '../../../lib/types'
import { CIRCLE, getRelativeMinor, allMajorKeys } from '../../../lib/circle-of-fifths'
import { shuffle } from '../../utils'

export const enumerateRelativeKeyQuestions: QuizEnumerator = (): Question[] => {
  const allMinors = CIRCLE.map(e => e.minor)
  return allMajorKeys().flatMap(key => {
    const answer = getRelativeMinor(key)
    const distractors = shuffle(allMinors.filter(m => m !== answer)).slice(0, 3)
    return [
      { text: `What is the relative minor of ${key} major?`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'easy' as const },
      { text: `Which minor key shares the same key signature as ${key} major?`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'hard' as const },
    ]
  })
}
