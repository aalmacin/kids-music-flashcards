import { describe, it, expect } from 'vitest'
import { enumerateStepsQuestions } from './steps'

describe('enumerateStepsQuestions', () => {
  const questions = enumerateStepsQuestions()

  it('enumerates 144 questions (12 keys × 2 directions × 6 steps)', () => {
    expect(questions).toHaveLength(144)
  })

  it('every question has 4 options including the correct answer', () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4)
      expect(q.options).toContain(q.answer)
    }
  })

  it('all options are valid major keys', () => {
    const KEYS = ['C','G','D','A','E','B','F#','Db','Ab','Eb','Bb','F']
    for (const q of questions) {
      for (const opt of q.options) {
        expect(KEYS).toContain(opt)
      }
    }
  })

  it('all question texts are unique', () => {
    const texts = questions.map(q => q.text)
    expect(new Set(texts).size).toBe(texts.length)
  })
})
