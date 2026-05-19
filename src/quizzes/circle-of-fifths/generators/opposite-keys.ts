import type { Question, QuizEnumerator } from '../../../lib/types'
import { CIRCLE, getOppositeKey, allMajorKeys } from '../../../lib/circle-of-fifths'
import { shuffle } from '../../utils'

export const enumerateOppositeKeyQuestions: QuizEnumerator = (): Question[] => {
  const allKeys = CIRCLE.map(e => e.enharmonic ? `${e.major}/${e.enharmonic}` : e.major)
  return allMajorKeys().flatMap(key => {
    const answer = getOppositeKey(key)
    const distractors = shuffle(allKeys.filter(k => k !== answer)).slice(0, 3)
    return [
      { text: `Which key is directly opposite ${key} on the Circle of Fifths?`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'easy' as const },
      { text: `What is the tritone substitution key for ${key}?`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'hard' as const },
    ]
  })
}
