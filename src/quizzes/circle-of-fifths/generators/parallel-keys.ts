import type { Question, QuizGenerator } from '../../../lib/types'
import { getParallelMinor, allMajorKeys } from '../../../lib/circle-of-fifths'
import { randomFrom, shuffle } from '../../utils'

export const generateParallelKeyQuestion: QuizGenerator = (difficulty): Question => {
  const key = randomFrom(allMajorKeys())
  const answer = getParallelMinor(key)
  const allMinors = allMajorKeys().map(k => k + 'm')
  const distractors = shuffle(allMinors.filter(m => m !== answer)).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = difficulty === 'easy'
    ? `What is the parallel minor of ${key} major?`
    : `Which minor key has the same root note as ${key} major?`
  return { text, options, answer, difficulty }
}
