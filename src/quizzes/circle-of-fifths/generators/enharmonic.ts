import type { Question, QuizGenerator } from '../../../lib/types'
import { CIRCLE, getEnharmonic, allMajorKeys } from '../../../lib/circle-of-fifths'
import { randomFrom, shuffle } from '../../utils'

const ENHARMONIC_KEYS = CIRCLE.filter(e => e.enharmonic !== null).flatMap(e => [e.major, e.enharmonic!])

export const generateEnharmonicQuestion: QuizGenerator = (difficulty): Question => {
  const key = randomFrom(ENHARMONIC_KEYS)
  const answer = getEnharmonic(key)!
  const distractors = shuffle(allMajorKeys().filter(k => k !== key && k !== answer)).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = difficulty === 'easy'
    ? `What is the enharmonic equivalent of ${key}?`
    : `${key} major and _____ major are the same key with different names.`
  return { text, options, answer, difficulty }
}
