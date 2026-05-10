import type { Question, QuizGenerator } from '../../../lib/types'
import { CIRCLE, getOppositeKey, allMajorKeys } from '../../../lib/circle-of-fifths'
import { randomFrom, shuffle } from '../../utils'

export const generateOppositeKeyQuestion: QuizGenerator = (difficulty): Question => {
  const key = randomFrom(allMajorKeys())
  const answer = getOppositeKey(key)
  const allKeys = CIRCLE.map(e => e.enharmonic ? `${e.major}/${e.enharmonic}` : e.major)
  const distractors = shuffle(allKeys.filter(k => k !== answer)).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = difficulty === 'easy'
    ? `Which key is directly opposite ${key} on the Circle of Fifths?`
    : `What is the tritone substitution key for ${key}?`
  return { text, options, answer, difficulty }
}
