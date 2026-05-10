import type { Question, QuizGenerator } from '../../../lib/types'
import { getScaleDegreeChord, allMajorKeys } from '../../../lib/circle-of-fifths'
import { randomFrom, shuffle } from '../../utils'

const DEGREE_NAMES: Record<number, string> = { 1: 'I', 2: 'ii', 3: 'iii', 4: 'IV', 5: 'V', 6: 'vi', 7: 'vii°' }
const EASY_DEGREES = [1, 4, 5] as const
const ALL_DEGREES = [1, 2, 3, 4, 5, 6, 7] as const

export const generateScaleDegreeQuestion: QuizGenerator = (difficulty): Question => {
  const key = randomFrom(allMajorKeys())
  const degrees = difficulty === 'easy' ? EASY_DEGREES : ALL_DEGREES
  const degree = randomFrom([...degrees]) as 1 | 2 | 3 | 4 | 5 | 6 | 7
  const answer = getScaleDegreeChord(key, degree)

  const otherDegrees = ALL_DEGREES.filter(d => d !== degree) as unknown as (1|2|3|4|5|6|7)[]
  let distractors = shuffle(otherDegrees)
    .slice(0, 5)
    .map(d => getScaleDegreeChord(key, d))
    .filter(c => c !== answer)

  distractors = [...new Set(distractors)]

  if (distractors.length < 3) {
    const padding = allMajorKeys()
      .filter(k => k !== answer && !distractors.includes(k))
    distractors = [...distractors, ...padding].slice(0, 3)
  }

  const options = shuffle([answer, distractors[0], distractors[1], distractors[2]]) as [string, string, string, string]
  const text = `What is the ${DEGREE_NAMES[degree]} chord in ${key} major?`
  return { text, options, answer, difficulty }
}
