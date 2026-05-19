import type { Question, QuizEnumerator } from '../../../lib/types'
import { getScaleDegreeChord, allMajorKeys } from '../../../lib/circle-of-fifths'
import { shuffle } from '../../utils'

const DEGREE_NAMES: Record<number, string> = { 1: 'I', 2: 'ii', 3: 'iii', 4: 'IV', 5: 'V', 6: 'vi', 7: 'vii°' }
const ALL_DEGREES = [1, 2, 3, 4, 5, 6, 7] as const

export const enumerateScaleDegreeQuestions: QuizEnumerator = (): Question[] => {
  return allMajorKeys().flatMap(key =>
    ALL_DEGREES.map(degree => {
      const answer = getScaleDegreeChord(key, degree)
      const otherDegrees = ALL_DEGREES.filter(d => d !== degree) as unknown as (1 | 2 | 3 | 4 | 5 | 6 | 7)[]
      let distractors = [...new Set(shuffle(otherDegrees).map(d => getScaleDegreeChord(key, d)).filter(c => c !== answer))]
      if (distractors.length < 3) {
        const padding = allMajorKeys().filter(k => k !== answer && !distractors.includes(k))
        distractors = [...distractors, ...padding].slice(0, 3)
      }
      const difficulty = ([1, 4, 5] as number[]).includes(degree) ? 'easy' as const : 'hard' as const
      return { text: `What is the ${DEGREE_NAMES[degree]} chord in ${key} major?`, options: shuffle([answer, distractors[0], distractors[1], distractors[2]]) as [string, string, string, string], answer, difficulty }
    })
  )
}
