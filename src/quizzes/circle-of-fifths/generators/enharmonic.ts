import type { Question, QuizGenerator } from '../../../lib/types'
import { CIRCLE, getEnharmonic, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

const ENHARMONIC_KEYS = CIRCLE.filter(e => e.enharmonic !== null).map(e => e.major)

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
