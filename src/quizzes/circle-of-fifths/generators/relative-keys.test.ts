import { describe, it, expect } from 'vitest'
import { generateRelativeKeyQuestion } from './relative-keys'

describe('generateRelativeKeyQuestion', () => {
  it('has 4 options including the correct answer', () => {
    const q = generateRelativeKeyQuestion('easy', [])
    expect(q.options).toHaveLength(4)
    expect(q.options).toContain(q.answer)
  })
  it('answer ends with m (minor)', () => {
    const q = generateRelativeKeyQuestion('easy', [])
    expect(q.answer).toMatch(/m$/)
  })
})
