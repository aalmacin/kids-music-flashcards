import type { Question, QuizGenerator } from '../../../lib/types'
import { getDominant, getSubdominant, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

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
