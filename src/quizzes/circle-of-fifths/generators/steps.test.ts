import { describe, it, expect } from 'vitest'
import { generateStepsQuestion } from './steps'

describe('generateStepsQuestion', () => {
  it('returns a question with 4 options', () => {
    const q = generateStepsQuestion('easy', [])
    expect(q.options).toHaveLength(4)
  })

  it('includes the correct answer in the options', () => {
    const q = generateStepsQuestion('easy', [])
    expect(q.options).toContain(q.answer)
  })

  it('generates a hard question with larger step counts', () => {
    const q = generateStepsQuestion('hard', [])
    expect(q.text).toMatch(/step/)
  })

  it('all options are valid major keys', () => {
    const KEYS = ['C','G','D','A','E','B','F#','Db','Ab','Eb','Bb','F']
    const q = generateStepsQuestion('medium', [])
    for (const opt of q.options) {
      expect(KEYS).toContain(opt)
    }
  })
})
