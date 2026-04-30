import type { Question, QuizGenerator } from '../../../lib/types'
import { CIRCLE, getStepsFrom, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickDistractors(correct: string, count: number): string[] {
  const all = allMajorKeys().filter(k => k !== correct)
  const result: string[] = []
  const correctIdx = CIRCLE.findIndex(e => e.major === correct)
  const adjacent = [
    CIRCLE[(correctIdx + 1) % 12].major,
    CIRCLE[(correctIdx - 1 + 12) % 12].major,
    CIRCLE[(correctIdx + 2) % 12].major,
    CIRCLE[(correctIdx - 2 + 12) % 12].major,
  ].filter(k => k !== correct)

  while (result.length < count && adjacent.length > 0) {
    const idx = Math.floor(Math.random() * adjacent.length)
    result.push(adjacent.splice(idx, 1)[0])
  }
  while (result.length < count) {
    const pick = randomFrom(all.filter(k => !result.includes(k)))
    result.push(pick)
  }
  return result
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const generateStepsQuestion: QuizGenerator = (difficulty): Question => {
  const startKey = randomFrom(allMajorKeys())
  const directionLabel = randomFrom(['clockwise', 'counterclockwise'])
  const direction = directionLabel === 'clockwise' ? 1 : -1

  const stepRange = difficulty === 'easy' ? [1, 2] : difficulty === 'medium' ? [1, 4] : [1, 6]
  const steps = randomInt(stepRange[0], stepRange[1])

  const answer = getStepsFrom(startKey, direction * steps)
  const distractors = pickDistractors(answer, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]

  const ordinal = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth'][steps]
  const text = `Starting from ${startKey}, what key is ${ordinal} step ${directionLabel} on the Circle of Fifths?`

  return { text, options, answer, difficulty }
}
