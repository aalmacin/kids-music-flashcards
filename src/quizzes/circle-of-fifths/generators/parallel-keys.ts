import type { Question, QuizGenerator } from '../../../lib/types'
import { getParallelMinor, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

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
