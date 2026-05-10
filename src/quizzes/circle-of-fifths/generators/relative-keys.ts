import type { Question, QuizGenerator } from '../../../lib/types'
import { CIRCLE, getRelativeMinor, allMajorKeys } from '../../../lib/circle-of-fifths'
import { randomFrom, shuffle } from '../../utils'

export const generateRelativeKeyQuestion: QuizGenerator = (difficulty): Question => {
  const key = randomFrom(allMajorKeys())
  const answer = getRelativeMinor(key)
  const allMinors = CIRCLE.map(e => e.minor)
  const distractors = shuffle(allMinors.filter(m => m !== answer)).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = difficulty === 'easy'
    ? `What is the relative minor of ${key} major?`
    : `Which minor key shares the same key signature as ${key} major?`
  return { text, options, answer, difficulty }
}
