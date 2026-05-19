import type { Question, QuizEnumerator } from '../../../lib/types'
import { CIRCLE, getEnharmonic, allMajorKeys } from '../../../lib/circle-of-fifths'
import { shuffle } from '../../utils'

const ENHARMONIC_KEYS = CIRCLE.filter(e => e.enharmonic !== null).flatMap(e => [e.major, e.enharmonic!])

export const enumerateEnharmonicQuestions: QuizEnumerator = (): Question[] => {
  return ENHARMONIC_KEYS.flatMap(key => {
    const answer = getEnharmonic(key)!
    const distractors = shuffle(allMajorKeys().filter(k => k !== key && k !== answer)).slice(0, 3)
    return [
      { text: `What is the enharmonic equivalent of ${key}?`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'easy' },
      { text: `${key} major and _____ major are the same key with different names.`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'hard' },
    ]
  })
}
