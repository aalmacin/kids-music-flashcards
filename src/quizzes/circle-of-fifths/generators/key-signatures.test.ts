import { describe, it, expect } from 'vitest'
import { generateKeySignatureQuestion } from './key-signatures'

describe('generateKeySignatureQuestion', () => {
  it('has 4 options and a correct answer', () => {
    const q = generateKeySignatureQuestion('easy', [])
    expect(q.options).toHaveLength(4)
    expect(q.options).toContain(q.answer)
  })
})
