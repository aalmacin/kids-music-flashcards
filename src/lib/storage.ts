import type { HighScores, HighScoreEntry, Difficulty } from './types'

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

export function getHighScores(): HighScores {
  const raw = localStorage.getItem(SCORES_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as HighScores
  } catch {
    return {}
  }
}

export function saveHighScore(
  quizId: string,
  modeKey: string,
  difficulty: Difficulty,
  entry: HighScoreEntry
): void {
  const scores = getHighScores()
  if (!scores[quizId]) scores[quizId] = {}
  if (!scores[quizId][modeKey]) scores[quizId][modeKey] = {} as HighScores[string][string]
  if (!scores[quizId][modeKey][difficulty]) scores[quizId][modeKey][difficulty] = []

  scores[quizId][modeKey][difficulty].push(entry)
  scores[quizId][modeKey][difficulty].sort((a, b) => b.score - a.score)
  scores[quizId][modeKey][difficulty] = scores[quizId][modeKey][difficulty].slice(0, 5)

  localStorage.setItem(SCORES_KEY, JSON.stringify(scores))
}

export function clearHighScores(): void {
  localStorage.removeItem(SCORES_KEY)
}

export function modeKey(mode: { type: string; seconds?: number; count?: number }): string {
  return mode.type === 'timed' ? `timed-${mode.seconds}` : `fixed-${mode.count}`
}
