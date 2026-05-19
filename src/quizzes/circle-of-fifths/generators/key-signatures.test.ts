import { describe, it, expect } from 'vitest'
import { enumerateKeySignatureQuestions } from './key-signatures'

describe('enumerateKeySignatureQuestions', () => {
  const questions = enumerateKeySignatureQuestions()

  it('enumerates 34 questions (12 count + 11 which-key + 11 name-accidentals)', () => {
    expect(questions).toHaveLength(34)
  })

  it('every question has 4 options including the correct answer', () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4)
      expect(q.options).toContain(q.answer)
    }
  })

  it('all question texts are unique', () => {
    const texts = questions.map(q => q.text)
    expect(new Set(texts).size).toBe(texts.length)
  })
})
