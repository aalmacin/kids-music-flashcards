import { describe, it, expect, beforeEach } from 'vitest'
import { getPlayerName, setPlayerName, clearPlayerName, getHighScores, saveHighScore, clearHighScores } from './storage'

beforeEach(() => localStorage.clear())

describe('player name', () => {
  it('returns null when not set', () => expect(getPlayerName()).toBeNull())
  it('stores and retrieves name', () => {
    setPlayerName('Alice')
    expect(getPlayerName()).toBe('Alice')
  })
  it('clears name', () => {
    setPlayerName('Alice')
    clearPlayerName()
    expect(getPlayerName()).toBeNull()
  })
})

describe('high scores', () => {
  it('returns empty object when not set', () => expect(getHighScores()).toEqual({}))

  it('saves and retrieves a score', () => {
    saveHighScore('cof-steps', 'timed-60', { name: 'Alice', score: 10, accuracy: 90, date: '2026-04-26' })
    const scores = getHighScores()
    expect(scores['cof-steps']['timed-60']).toHaveLength(1)
    expect(scores['cof-steps']['timed-60'][0].name).toBe('Alice')
  })

  it('keeps only top 10 scores sorted by score desc', () => {
    for (let i = 1; i <= 11; i++) {
      saveHighScore('q', 'm', { name: `P${i}`, score: i * 10, accuracy: 100, date: '2026-04-26' })
    }
    const scores = getHighScores()['q']['m']
    expect(scores).toHaveLength(10)
    expect(scores[0].score).toBe(110)
    expect(scores[9].score).toBe(20)
  })

  it('clears all scores', () => {
    saveHighScore('q', 'm', { name: 'A', score: 5, accuracy: 50, date: '2026-04-26' })
    clearHighScores()
    expect(getHighScores()).toEqual({})
  })
})
