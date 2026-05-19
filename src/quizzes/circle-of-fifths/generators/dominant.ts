import type { Question, QuizEnumerator } from '../../../lib/types'
import { getDominant, getSubdominant, allMajorKeys } from '../../../lib/circle-of-fifths'
import { shuffle } from '../../utils'

export const enumerateDominantQuestions: QuizEnumerator = (): Question[] => {
  return allMajorKeys().flatMap(key => {
    const dominant = getDominant(key)
    const subdominant = getSubdominant(key)
    const domDistractors = shuffle(allMajorKeys().filter(k => k !== dominant)).slice(0, 3)
    const subDistractors = shuffle(allMajorKeys().filter(k => k !== subdominant)).slice(0, 3)
    return [
      { text: `What is the dominant (V) of ${key} major?`, options: shuffle([dominant, ...domDistractors]) as [string, string, string, string], answer: dominant, difficulty: 'easy' as const },
      { text: `What is the subdominant (IV) of ${key} major?`, options: shuffle([subdominant, ...subDistractors]) as [string, string, string, string], answer: subdominant, difficulty: 'hard' as const },
    ]
  })
}
