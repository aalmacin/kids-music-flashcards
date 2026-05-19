import { describe, it, expect } from 'vitest'
import { enumerateRelativeKeyQuestions } from './relative-keys'

describe('enumerateRelativeKeyQuestions', () => {
  const questions = enumerateRelativeKeyQuestions()

  it('enumerates 24 questions (12 keys × 2 texts)', () => {
    expect(questions).toHaveLength(24)
  })

  it('every question has 4 options including the correct answer', () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4)
      expect(q.options).toContain(q.answer)
    }
  })

  it('all answers are minor keys', () => {
    for (const q of questions) {
      expect(q.answer).toMatch(/m$/)
    }
  })

  it('all question texts are unique', () => {
    const texts = questions.map(q => q.text)
    expect(new Set(texts).size).toBe(texts.length)
  })
})
