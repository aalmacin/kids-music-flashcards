import type { Question, QuizEnumerator } from '../../../lib/types'
import { CIRCLE, getStepsFrom, allMajorKeys } from '../../../lib/circle-of-fifths'
import { shuffle } from '../../utils'

const ORDINALS = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth']
const STEP_DIFFICULTIES = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard'] as const

export const enumerateStepsQuestions: QuizEnumerator = (): Question[] => {
  const directions = ['clockwise', 'counterclockwise'] as const
  return allMajorKeys().flatMap(startKey => {
    const startIdx = CIRCLE.findIndex(e => e.major === startKey)
    const adjacentPool = [
      CIRCLE[(startIdx + 1) % 12].major,
      CIRCLE[(startIdx - 1 + 12) % 12].major,
      CIRCLE[(startIdx + 2) % 12].major,
      CIRCLE[(startIdx - 2 + 12) % 12].major,
    ]
    return directions.flatMap(directionLabel =>
      [1, 2, 3, 4, 5, 6].map(steps => {
        const direction = directionLabel === 'clockwise' ? 1 : -1
        const answer = getStepsFrom(startKey, direction * steps)
        const adjacent = adjacentPool.filter(k => k !== answer)
        let distractors = shuffle(adjacent).slice(0, 3)
        if (distractors.length < 3) {
          const extra = allMajorKeys().filter(k => k !== answer && !distractors.includes(k))
          distractors = [...distractors, ...shuffle(extra)].slice(0, 3)
        }
        const difficulty = STEP_DIFFICULTIES[steps - 1]
        return { text: `Starting from ${startKey}, what key is ${ORDINALS[steps]} step ${directionLabel} on the Circle of Fifths?`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty }
      })
    )
  })
}
