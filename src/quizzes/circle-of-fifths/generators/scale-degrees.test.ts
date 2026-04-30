import { describe, it, expect } from 'vitest'
import { generateScaleDegreeQuestion } from './scale-degrees'

describe('generateScaleDegreeQuestion', () => {
  it('has 4 options and a correct answer', () => {
    const q = generateScaleDegreeQuestion('medium', [])
    expect(q.options).toHaveLength(4)
    expect(q.options).toContain(q.answer)
  })
})
