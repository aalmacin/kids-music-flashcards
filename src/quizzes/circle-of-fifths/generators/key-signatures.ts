import type { Question, QuizEnumerator } from '../../../lib/types'
import { CIRCLE, getKeySignature, allMajorKeys } from '../../../lib/circle-of-fifths'
import { shuffle } from '../../utils'

export const enumerateKeySignatureQuestions: QuizEnumerator = (): Question[] => {
  const keys = allMajorKeys()
  const accidentalKeys = CIRCLE.filter(e => e.sharps > 0 || e.flats > 0)
  const countDistractorPool = ['1 sharp', '2 sharps', '3 sharps', '4 sharps', '5 sharps', '6 sharps', '1 flat', '2 flats', '3 flats', '4 flats', '5 flats', '0']
  const questions: Question[] = []

  // count variant: all 12 keys
  for (const key of keys) {
    const sig = getKeySignature(key)
    const answer = sig.count === 0 ? '0' : `${sig.count} ${sig.type}${sig.count > 1 ? 's' : ''}`
    const distractors = shuffle(countDistractorPool.filter(d => d !== answer)).slice(0, 3)
    questions.push({ text: `How many sharps or flats does ${key} major have?`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'easy' })
  }

  // which-key variant: 11 keys with accidentals
  for (const entry of accidentalKeys) {
    const answer = entry.major
    const desc = entry.sharps > 0 ? `${entry.sharps} sharp${entry.sharps > 1 ? 's' : ''}` : `${entry.flats} flat${entry.flats > 1 ? 's' : ''}`
    const distractors = shuffle(keys.filter(k => k !== answer)).slice(0, 3)
    questions.push({ text: `Which major key has ${desc}?`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'medium' })
  }

  // name-accidentals variant: 11 keys with accidentals
  for (const entry of accidentalKeys) {
    const sig = getKeySignature(entry.major)
    const answer = sig.notes.join(', ')
    const otherSigs = accidentalKeys.filter(e => e.major !== entry.major).map(e => getKeySignature(e.major).notes.join(', '))
    const distractors = shuffle(otherSigs).slice(0, 3)
    questions.push({ text: `Name the accidentals in ${entry.major} major (in order):`, options: shuffle([answer, ...distractors]) as [string, string, string, string], answer, difficulty: 'hard' })
  }

  return questions
}
