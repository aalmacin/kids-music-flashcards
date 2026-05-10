import type { Question, QuizGenerator } from '../../../lib/types'
import { getDominant, getSubdominant, allMajorKeys } from '../../../lib/circle-of-fifths'
import { randomFrom, shuffle } from '../../utils'

export const generateDominantQuestion: QuizGenerator = (difficulty): Question => {
  const key = randomFrom(allMajorKeys())
  const askDominant = Math.random() > 0.5 || difficulty === 'easy'
  const answer = askDominant ? getDominant(key) : getSubdominant(key)
  const label = askDominant ? 'dominant (V)' : 'subdominant (IV)'
  const distractors = shuffle(allMajorKeys().filter(k => k !== answer)).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = `What is the ${label} of ${key} major?`
  return { text, options, answer, difficulty }
}
