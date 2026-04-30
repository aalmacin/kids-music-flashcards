import type { Question, QuizGenerator } from '../../../lib/types'
import { CIRCLE, getKeySignature, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

type QuestionVariant = 'count' | 'which-key' | 'name-accidentals'

export const generateKeySignatureQuestion: QuizGenerator = (difficulty): Question => {
  const variants: QuestionVariant[] = difficulty === 'easy'
    ? ['count']
    : difficulty === 'medium'
    ? ['count', 'which-key']
    : ['count', 'which-key', 'name-accidentals']
  const variant = randomFrom(variants)
  const keys = allMajorKeys()

  if (variant === 'count') {
    const key = randomFrom(keys)
    const sig = getKeySignature(key)
    const answer = sig.count === 0 ? '0' : `${sig.count} ${sig.type}${sig.count > 1 ? 's' : ''}`
    const distractors = ['1 sharp', '2 sharps', '3 sharps', '1 flat', '2 flats', '3 flats', '4 sharps', '4 flats', '0']
      .filter(d => d !== answer)
    const options = shuffle([answer, ...shuffle(distractors).slice(0, 3)]) as [string, string, string, string]
    return { text: `How many sharps or flats does ${key} major have?`, options, answer, difficulty }
  }

  if (variant === 'which-key') {
    const ref = randomFrom(CIRCLE.filter(e => e.sharps > 0 || e.flats > 0))
    const answer = ref.major
    const desc = ref.sharps > 0 ? `${ref.sharps} sharp${ref.sharps > 1 ? 's' : ''}` : `${ref.flats} flat${ref.flats > 1 ? 's' : ''}`
    const distractors = shuffle(keys.filter(k => k !== answer)).slice(0, 3)
    const options = shuffle([answer, ...distractors]) as [string, string, string, string]
    return { text: `Which major key has ${desc}?`, options, answer, difficulty }
  }

  // name-accidentals
  const entry = randomFrom(CIRCLE.filter(e => e.sharps > 0 || e.flats > 0))
  const sig = getKeySignature(entry.major)
  const answer = sig.notes.join(', ')
  const otherSigs = CIRCLE
    .filter(e => e.major !== entry.major && (e.sharps > 0 || e.flats > 0))
    .map(e => getKeySignature(e.major).notes.join(', '))
  const distractors = shuffle(otherSigs).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  return { text: `Name the accidentals in ${entry.major} major (in order):`, options, answer, difficulty }
}
