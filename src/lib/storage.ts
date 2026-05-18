import type { HighScores, HighScoreEntry } from './types'

const PLAYER_KEY = 'playerName'
const SCORES_KEY = 'highScores'

export function getPlayerName(): string | null {
  return localStorage.getItem(PLAYER_KEY)
}

export function setPlayerName(name: string): void {
  localStorage.setItem(PLAYER_KEY, name)
}

export function clearPlayerName(): void {
  localStorage.removeItem(PLAYER_KEY)
}

function isLegacyScores(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false
  for (const quizVal of Object.values(data as Record<string, unknown>)) {
    if (typeof quizVal !== 'object' || quizVal === null) continue
    for (const modeVal of Object.values(quizVal as Record<string, unknown>)) {
      // Old format: modeVal is an object keyed by difficulty (not an array)
      if (!Array.isArray(modeVal)) return true
    }
  }
  return false
}

export function getHighScores(): HighScores {
  const raw = localStorage.getItem(SCORES_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (isLegacyScores(parsed)) {
      localStorage.removeItem(SCORES_KEY)
      return {}
    }
    return parsed as HighScores
  } catch {
    return {}
  }
}

const MAX_LEADERBOARD_SIZE = 10

export function saveHighScore(
  quizId: string,
  modeKey: string,
  entry: HighScoreEntry
): boolean {
  const scores = getHighScores()
  if (!scores[quizId]) scores[quizId] = {}
  if (!scores[quizId][modeKey]) scores[quizId][modeKey] = []

  const existing = scores[quizId][modeKey]
  const isFull = existing.length >= MAX_LEADERBOARD_SIZE
  const min = isFull ? existing[existing.length - 1].score : -Infinity

  // Score doesn't beat the lowest on a full leaderboard — don't store
  if (isFull && entry.score < min) return false

  existing.push(entry)
  existing.sort((a, b) => b.score - a.score)
  scores[quizId][modeKey] = existing.slice(0, MAX_LEADERBOARD_SIZE)

  localStorage.setItem(SCORES_KEY, JSON.stringify(scores))
  return true
}

export function clearHighScores(): void {
  localStorage.removeItem(SCORES_KEY)
}

export function modeKey(mode: { type: string; seconds?: number; count?: number }): string {
  return mode.type === 'timed' ? `timed-${mode.seconds}` : `fixed-${mode.count}`
}
