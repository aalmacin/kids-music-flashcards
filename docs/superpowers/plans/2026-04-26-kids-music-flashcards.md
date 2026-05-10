# Kids Music Flashcards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a PWA for kids aged 6–12 to learn music theory via interactive quizzes starting with the Circle of Fifths.

**Architecture:** Vite + React + TypeScript SPA with TanStack Router (file-based), TanStack Query (localStorage layer), TanStack Store (quiz session), TanStack Table (leaderboards), TanStack Form (quiz setup), and vite-plugin-pwa for offline/installable support. All quiz questions are algorithmically generated at runtime. No backend.

**Tech Stack:** Vite, React 18, TypeScript, TanStack Router, TanStack Query, TanStack Store, TanStack Table, TanStack Form, vite-plugin-pwa, Vitest, React Testing Library, Tailwind CSS

---

## File Map

```
src/
├── main.tsx                                         # app entry, router provider
├── test-setup.ts                                    # Vitest + RTL setup
├── lib/
│   ├── types.ts                                     # all shared TS types
│   ├── circle-of-fifths.ts                          # CoF data: notes, keys, intervals
│   └── storage.ts                                   # typed localStorage helpers
├── quizzes/
│   ├── registry.ts                                  # all quiz definitions
│   └── circle-of-fifths/
│       ├── generators/
│       │   ├── steps.ts                             # Steps on the Circle
│       │   ├── relative-keys.ts                     # Relative Keys
│       │   ├── opposite-keys.ts                     # Opposite Keys
│       │   ├── key-signatures.ts                    # Key Signatures
│       │   ├── scale-degrees.ts                     # Scale Degrees & Chords
│       │   ├── dominant.ts                          # Dominant & Subdominant
│       │   ├── enharmonic.ts                        # Enharmonic Equivalents
│       │   └── parallel-keys.ts                     # Parallel Keys
│       └── index.ts                                 # CoF quiz + group definitions
├── store/
│   └── quiz-session.ts                              # TanStack Store — active quiz
├── hooks/
│   ├── useTimer.ts                                  # countdown timer
│   ├── useQuiz.ts                                   # quiz orchestration
│   ├── usePlayerName.ts                             # TanStack Query — player name
│   └── useHighScores.ts                             # TanStack Query — high scores
├── components/
│   ├── AnswerButton.tsx                             # colored answer button
│   ├── ProgressBar.tsx                              # fixed-mode progress
│   ├── Timer.tsx                                    # timed-mode countdown
│   ├── QuizTile.tsx                                 # home page quiz card
│   ├── Confetti.tsx                                 # celebration animation
│   └── HighScoresTable.tsx                          # TanStack Table leaderboard
└── routes/
    ├── __root.tsx                                   # root layout
    ├── index.tsx                                    # home screen
    ├── settings.tsx                                 # player name + clear data
    ├── scores.tsx                                   # global scores
    └── quiz/
        └── $id/
            ├── setup.tsx                            # TanStack Form setup
            ├── play.tsx                             # active quiz
            └── results.tsx                          # results + leaderboard
public/
└── icons/                                           # PWA icons (all sizes)
vite.config.ts
tailwind.config.ts
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `src/test-setup.ts`
- Create: `src/main.tsx`

- [ ] **Step 1: Scaffold Vite project**

```bash
cd /Users/aalmacin/Projects/kids-music-flashcards
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @tanstack/react-router @tanstack/react-query @tanstack/react-store @tanstack/react-table @tanstack/react-form
npm install @tanstack/router-plugin
npm install vite-plugin-pwa
npm install tailwindcss @tailwindcss/vite
npm install canvas-confetti
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @types/canvas-confetti
```

- [ ] **Step 3: Configure vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ routesDirectory: './src/routes', generatedRouteTree: './src/routeTree.gen.ts' }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Kids Music Flashcards',
        short_name: 'MusicCards',
        description: 'Music theory quizzes for kids',
        theme_color: '#7C3AED',
        background_color: '#FFFFFF',
        display: 'standalone',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 4: Configure Tailwind**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { display: ['Nunito', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: '#7C3AED', light: '#A78BFA', dark: '#5B21B6' },
      },
    },
  },
} satisfies Config
```

- [ ] **Step 5: Configure test setup**

```ts
// src/test-setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add Nunito font to index.html**

In `index.html`, add inside `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
```

Also set `<title>Kids Music Flashcards</title>`.

- [ ] **Step 7: Verify scaffold builds**

```bash
npm run build
```
Expected: build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React + TS + TanStack + PWA project"
```

---

## Task 2: Core Types

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Write types**

```ts
// src/lib/types.ts

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed'

export type QuizMode =
  | { type: 'timed'; seconds: 30 | 60 | 90 | 120 }
  | { type: 'fixed'; count: 10 | 20 | 30 | 50 }

export interface Question {
  text: string
  options: [string, string, string, string]
  answer: string
  difficulty: Exclude<Difficulty, 'mixed'>
}

export type QuizGenerator = (
  difficulty: Exclude<Difficulty, 'mixed'>,
  exclude?: string[]
) => Question

export interface QuizDefinition {
  id: string
  title: string
  description: string
  category: 'individual' | 'group' | 'master'
  topic: string
  generators: QuizGenerator[]
}

export interface QuizSession {
  quizId: string
  mode: QuizMode
  difficulty: Difficulty
  questions: Question[]
  currentIndex: number
  score: number
  attempted: number
  wrongOnCurrent: boolean
  startedAt: number
  finishedAt: number | null
}

export interface HighScoreEntry {
  name: string
  score: number
  accuracy: number
  date: string
}

export type HighScores = Record<
  string, // quizId
  Record<
    string, // mode key e.g. "timed-60" | "fixed-20"
    Record<
      Difficulty,
      HighScoreEntry[]  // top 5
    >
  >
>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add core TypeScript types"
```

---

## Task 3: Circle of Fifths Data

**Files:**
- Create: `src/lib/circle-of-fifths.ts`
- Create: `src/lib/circle-of-fifths.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/circle-of-fifths.test.ts
import { describe, it, expect } from 'vitest'
import {
  CIRCLE,
  getStepsFrom,
  getRelativeMinor,
  getOppositeKey,
  getKeySignature,
  getEnharmonic,
  getParallelMinor,
  getScaleDegreeChord,
  getDominant,
  getSubdominant,
  sharpsOrder,
  flatsOrder,
} from './circle-of-fifths'

describe('CIRCLE', () => {
  it('has 12 entries', () => expect(CIRCLE).toHaveLength(12))
  it('starts with C', () => expect(CIRCLE[0].major).toBe('C'))
  it('has G at index 1', () => expect(CIRCLE[1].major).toBe('G'))
})

describe('getStepsFrom', () => {
  it('returns G for 1 step right of C', () => expect(getStepsFrom('C', 1)).toBe('G'))
  it('returns F for 1 step left of C (−1)', () => expect(getStepsFrom('C', -1)).toBe('F'))
  it('wraps around: 12 steps from C returns C', () => expect(getStepsFrom('C', 12)).toBe('C'))
  it('returns Bb for 2 steps left of C', () => expect(getStepsFrom('C', -2)).toBe('Bb'))
})

describe('getRelativeMinor', () => {
  it('returns Am for C', () => expect(getRelativeMinor('C')).toBe('Am'))
  it('returns Em for G', () => expect(getRelativeMinor('G')).toBe('Em'))
  it('returns F#m for A', () => expect(getRelativeMinor('A')).toBe('F#m'))
})

describe('getOppositeKey', () => {
  it('returns F# for C', () => expect(getOppositeKey('C')).toBe('F#/Gb'))
  it('returns C for F#', () => expect(getOppositeKey('F#')).toBe('C'))
})

describe('getKeySignature', () => {
  it('C has 0 accidentals', () => expect(getKeySignature('C')).toEqual({ count: 0, type: null, notes: [] }))
  it('G has 1 sharp', () => expect(getKeySignature('G')).toEqual({ count: 1, type: 'sharp', notes: ['F#'] }))
  it('F has 1 flat', () => expect(getKeySignature('F')).toEqual({ count: 1, type: 'flat', notes: ['Bb'] }))
  it('Bb has 2 flats', () => expect(getKeySignature('Bb')).toEqual({ count: 2, type: 'flat', notes: ['Bb', 'Eb'] }))
})

describe('getEnharmonic', () => {
  it('returns Gb for F#', () => expect(getEnharmonic('F#')).toBe('Gb'))
  it('returns F# for Gb', () => expect(getEnharmonic('Gb')).toBe('F#'))
  it('returns null for C', () => expect(getEnharmonic('C')).toBeNull())
})

describe('getParallelMinor', () => {
  it('returns Cm for C', () => expect(getParallelMinor('C')).toBe('Cm'))
  it('returns Gm for G', () => expect(getParallelMinor('G')).toBe('Gm'))
})

describe('getScaleDegreeChord', () => {
  it('ii of C is Dm', () => expect(getScaleDegreeChord('C', 2)).toBe('Dm'))
  it('V of C is G', () => expect(getScaleDegreeChord('C', 5)).toBe('G'))
  it('vii of C is Bdim', () => expect(getScaleDegreeChord('C', 7)).toBe('Bdim'))
  it('iii of D is F#m', () => expect(getScaleDegreeChord('D', 3)).toBe('F#m'))
})

describe('getDominant', () => {
  it('dominant of C is G', () => expect(getDominant('C')).toBe('G'))
  it('dominant of G is D', () => expect(getDominant('G')).toBe('D'))
})

describe('getSubdominant', () => {
  it('subdominant of C is F', () => expect(getSubdominant('C')).toBe('F'))
  it('subdominant of G is C', () => expect(getSubdominant('G')).toBe('C'))
})

describe('sharpsOrder', () => {
  it('is F# C# G# D# A# E# B#', () =>
    expect(sharpsOrder).toEqual(['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']))
})

describe('flatsOrder', () => {
  it('is Bb Eb Ab Db Gb Cb Fb', () =>
    expect(flatsOrder).toEqual(['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']))
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/lib/circle-of-fifths.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement circle-of-fifths.ts**

```ts
// src/lib/circle-of-fifths.ts

export const sharpsOrder = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']
export const flatsOrder = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']

export interface CircleEntry {
  major: string
  minor: string
  sharps: number   // positive = sharps, 0 = none
  flats: number    // positive = flats, 0 = none
  enharmonic: string | null
}

// Clockwise order starting at C
export const CIRCLE: CircleEntry[] = [
  { major: 'C',  minor: 'Am',  sharps: 0, flats: 0, enharmonic: null },
  { major: 'G',  minor: 'Em',  sharps: 1, flats: 0, enharmonic: null },
  { major: 'D',  minor: 'Bm',  sharps: 2, flats: 0, enharmonic: null },
  { major: 'A',  minor: 'F#m', sharps: 3, flats: 0, enharmonic: null },
  { major: 'E',  minor: 'C#m', sharps: 4, flats: 0, enharmonic: null },
  { major: 'B',  minor: 'G#m', sharps: 5, flats: 0, enharmonic: 'Cb' },
  { major: 'F#', minor: 'D#m', sharps: 6, flats: 6, enharmonic: 'Gb' },
  { major: 'Db', minor: 'Bbm', sharps: 0, flats: 5, enharmonic: 'C#' },
  { major: 'Ab', minor: 'Fm',  sharps: 0, flats: 4, enharmonic: null },
  { major: 'Eb', minor: 'Cm',  sharps: 0, flats: 3, enharmonic: null },
  { major: 'Bb', minor: 'Gm',  sharps: 0, flats: 2, enharmonic: null },
  { major: 'F',  minor: 'Dm',  sharps: 0, flats: 1, enharmonic: null },
]

const ENHARMONIC_MAP: Record<string, string> = {
  'F#': 'Gb', 'Gb': 'F#',
  'B': 'Cb', 'Cb': 'B',
  'Db': 'C#', 'C#': 'Db',
}

function indexOfMajor(note: string): number {
  // Accept either side of enharmonic pair
  const idx = CIRCLE.findIndex(
    e => e.major === note || e.enharmonic === note
  )
  return idx
}

export function getStepsFrom(note: string, steps: number): string {
  const idx = indexOfMajor(note)
  if (idx === -1) throw new Error(`Unknown note: ${note}`)
  const newIdx = ((idx + steps) % 12 + 12) % 12
  return CIRCLE[newIdx].major
}

export function getRelativeMinor(major: string): string {
  const entry = CIRCLE.find(e => e.major === major || e.enharmonic === major)
  if (!entry) throw new Error(`Unknown key: ${major}`)
  return entry.minor
}

export function getOppositeKey(major: string): string {
  const idx = indexOfMajor(major)
  if (idx === -1) throw new Error(`Unknown key: ${major}`)
  const opposite = CIRCLE[(idx + 6) % 12]
  return opposite.enharmonic ? `${opposite.major}/${opposite.enharmonic}` : opposite.major
}

export interface KeySignature {
  count: number
  type: 'sharp' | 'flat' | null
  notes: string[]
}

export function getKeySignature(major: string): KeySignature {
  const entry = CIRCLE.find(e => e.major === major || e.enharmonic === major)
  if (!entry) throw new Error(`Unknown key: ${major}`)
  if (entry.sharps > 0) {
    return { count: entry.sharps, type: 'sharp', notes: sharpsOrder.slice(0, entry.sharps) }
  }
  if (entry.flats > 0) {
    return { count: entry.flats, type: 'flat', notes: flatsOrder.slice(0, entry.flats) }
  }
  return { count: 0, type: null, notes: [] }
}

export function getEnharmonic(note: string): string | null {
  return ENHARMONIC_MAP[note] ?? null
}

export function getParallelMinor(major: string): string {
  return major + 'm'
}

// Scale degree intervals in semitones from root (major scale)
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11]
// Chromatic notes for building chords
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function noteToSemitone(note: string): number {
  const enharmonics: Record<string, string> = {
    'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B',
  }
  const n = enharmonics[note] ?? note
  const idx = CHROMATIC.indexOf(n)
  if (idx === -1) throw new Error(`Unknown note for semitone: ${note}`)
  return idx
}

function semitoneToNote(semitone: number, preferFlat = false): string {
  const s = ((semitone % 12) + 12) % 12
  const sharp = CHROMATIC[s]
  if (!preferFlat || !sharp.includes('#')) return sharp
  const flatMap: Record<string, string> = {
    'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
  }
  return flatMap[sharp] ?? sharp
}

// Chord qualities per scale degree (1-indexed): major=M, minor=m, diminished=dim
const DEGREE_QUALITY = ['', 'M', 'm', 'm', 'M', 'M', 'm', 'dim']

export function getScaleDegreeChord(major: string, degree: 1 | 2 | 3 | 4 | 5 | 6 | 7): string {
  const preferFlat = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(major)
  const rootSemitone = noteToSemitone(major)
  const interval = MAJOR_SCALE_INTERVALS[degree - 1]
  const chordRoot = semitoneToNote(rootSemitone + interval, preferFlat)
  const quality = DEGREE_QUALITY[degree]
  if (quality === 'M') return chordRoot
  if (quality === 'm') return chordRoot + 'm'
  return chordRoot + 'dim'
}

export function getDominant(major: string): string {
  return getStepsFrom(major, 1)
}

export function getSubdominant(major: string): string {
  return getStepsFrom(major, -1)
}

export function allMajorKeys(): string[] {
  return CIRCLE.map(e => e.major)
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/lib/circle-of-fifths.test.ts
```
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/circle-of-fifths.ts src/lib/circle-of-fifths.test.ts
git commit -m "feat: add Circle of Fifths data and utilities"
```

---

## Task 4: LocalStorage Helpers

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/lib/storage.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/storage.test.ts
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
    saveHighScore('cof-steps', 'timed-60', 'easy', { name: 'Alice', score: 10, accuracy: 90, date: '2026-04-26' })
    const scores = getHighScores()
    expect(scores['cof-steps']['timed-60']['easy']).toHaveLength(1)
    expect(scores['cof-steps']['timed-60']['easy'][0].name).toBe('Alice')
  })

  it('keeps only top 5 scores sorted by score desc', () => {
    for (let i = 1; i <= 6; i++) {
      saveHighScore('q', 'm', 'easy', { name: `P${i}`, score: i * 10, accuracy: 100, date: '2026-04-26' })
    }
    const scores = getHighScores()['q']['m']['easy']
    expect(scores).toHaveLength(5)
    expect(scores[0].score).toBe(60)
    expect(scores[4].score).toBe(20)
  })

  it('clears all scores', () => {
    saveHighScore('q', 'm', 'easy', { name: 'A', score: 5, accuracy: 50, date: '2026-04-26' })
    clearHighScores()
    expect(getHighScores()).toEqual({})
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/lib/storage.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement storage.ts**

```ts
// src/lib/storage.ts
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
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/lib/storage.test.ts
```
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/storage.ts src/lib/storage.test.ts
git commit -m "feat: add localStorage helpers with top-5 high score management"
```

---

## Task 5: Question Generator — Steps on the Circle

**Files:**
- Create: `src/quizzes/circle-of-fifths/generators/steps.ts`
- Create: `src/quizzes/circle-of-fifths/generators/steps.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/quizzes/circle-of-fifths/generators/steps.test.ts
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/quizzes/circle-of-fifths/generators/steps.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implement steps.ts**

```ts
// src/quizzes/circle-of-fifths/generators/steps.ts
import type { Question, QuizGenerator } from '../../../lib/types'
import { CIRCLE, getStepsFrom, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickDistractors(correct: string, count: number): string[] {
  const all = allMajorKeys().filter(k => k !== correct)
  const result: string[] = []
  // Prefer adjacent keys as distractors (musically close)
  const correctIdx = CIRCLE.findIndex(e => e.major === correct)
  const adjacent = [
    CIRCLE[(correctIdx + 1) % 12].major,
    CIRCLE[(correctIdx - 1 + 12) % 12].major,
    CIRCLE[(correctIdx + 2) % 12].major,
    CIRCLE[(correctIdx - 2 + 12) % 12].major,
  ].filter(k => k !== correct)

  while (result.length < count && adjacent.length > 0) {
    const idx = Math.floor(Math.random() * adjacent.length)
    result.push(adjacent.splice(idx, 1)[0])
  }
  while (result.length < count) {
    const pick = randomFrom(all.filter(k => !result.includes(k)))
    result.push(pick)
  }
  return result
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const generateStepsQuestion: QuizGenerator = (difficulty) => {
  const startKey = randomFrom(allMajorKeys())
  const directionLabel = randomFrom(['clockwise', 'counterclockwise'])
  const direction = directionLabel === 'clockwise' ? 1 : -1

  const stepRange = difficulty === 'easy' ? [1, 2] : difficulty === 'medium' ? [1, 4] : [1, 6]
  const steps = randomInt(stepRange[0], stepRange[1])

  const answer = getStepsFrom(startKey, direction * steps)
  const distractors = pickDistractors(answer, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]

  const ordinal = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth'][steps]
  const text = `What is the ${ordinal} key ${directionLabel} from ${startKey} on the Circle of Fifths?`

  return { text, options, answer, difficulty }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/quizzes/circle-of-fifths/generators/steps.test.ts
```
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/quizzes/circle-of-fifths/generators/steps.ts src/quizzes/circle-of-fifths/generators/steps.test.ts
git commit -m "feat: add Steps on the Circle question generator"
```

---

## Task 6: Question Generators — Relative Keys, Opposite Keys, Enharmonic, Parallel Keys

**Files:**
- Create: `src/quizzes/circle-of-fifths/generators/relative-keys.ts`
- Create: `src/quizzes/circle-of-fifths/generators/opposite-keys.ts`
- Create: `src/quizzes/circle-of-fifths/generators/enharmonic.ts`
- Create: `src/quizzes/circle-of-fifths/generators/parallel-keys.ts`
- Create: `src/quizzes/circle-of-fifths/generators/relative-keys.test.ts`

- [ ] **Step 1: Write failing test for relative keys**

```ts
// src/quizzes/circle-of-fifths/generators/relative-keys.test.ts
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
```

- [ ] **Step 2: Run to confirm fail**

```bash
npx vitest run src/quizzes/circle-of-fifths/generators/relative-keys.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implement all four generators**

```ts
// src/quizzes/circle-of-fifths/generators/relative-keys.ts
import type { QuizGenerator } from '../../../lib/types'
import { CIRCLE, getRelativeMinor, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

export const generateRelativeKeyQuestion: QuizGenerator = (difficulty) => {
  const key = randomFrom(allMajorKeys())
  const answer = getRelativeMinor(key)
  const allMinors = CIRCLE.map(e => e.minor)
  const distractors = shuffle(allMinors.filter(m => m !== answer)).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = difficulty === 'easy'
    ? `What is the relative minor of ${key} major?`
    : `Which minor key shares the same key signature as ${key} major?`
  return { text, options, answer, difficulty }
}
```

```ts
// src/quizzes/circle-of-fifths/generators/opposite-keys.ts
import type { QuizGenerator } from '../../../lib/types'
import { CIRCLE, getOppositeKey, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

export const generateOppositeKeyQuestion: QuizGenerator = (difficulty) => {
  const key = randomFrom(allMajorKeys())
  const answer = getOppositeKey(key)
  const allKeys = CIRCLE.map(e => e.enharmonic ? `${e.major}/${e.enharmonic}` : e.major)
  const distractors = shuffle(allKeys.filter(k => k !== answer)).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = difficulty === 'easy'
    ? `Which key is directly opposite ${key} on the Circle of Fifths?`
    : `What is the tritone substitution key for ${key}?`
  return { text, options, answer, difficulty }
}
```

```ts
// src/quizzes/circle-of-fifths/generators/enharmonic.ts
import type { QuizGenerator } from '../../../lib/types'
import { CIRCLE, getEnharmonic, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

const ENHARMONIC_KEYS = CIRCLE.filter(e => e.enharmonic !== null).map(e => e.major)

export const generateEnharmonicQuestion: QuizGenerator = (difficulty) => {
  const key = randomFrom(ENHARMONIC_KEYS)
  const answer = getEnharmonic(key)!
  const distractors = shuffle(allMajorKeys().filter(k => k !== key && k !== answer)).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = difficulty === 'easy'
    ? `What is the enharmonic equivalent of ${key}?`
    : `${key} major and _____ major are the same key with different names.`
  return { text, options, answer, difficulty }
}
```

```ts
// src/quizzes/circle-of-fifths/generators/parallel-keys.ts
import type { QuizGenerator } from '../../../lib/types'
import { getParallelMinor, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

export const generateParallelKeyQuestion: QuizGenerator = (difficulty) => {
  const key = randomFrom(allMajorKeys())
  const answer = getParallelMinor(key)
  const allMinors = allMajorKeys().map(k => k + 'm')
  const distractors = shuffle(allMinors.filter(m => m !== answer)).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = difficulty === 'easy'
    ? `What is the parallel minor of ${key} major?`
    : `Which minor key has the same root note as ${key} major?`
  return { text, options, answer, difficulty }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/quizzes/circle-of-fifths/generators/relative-keys.test.ts
```
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/quizzes/circle-of-fifths/generators/
git commit -m "feat: add relative keys, opposite keys, enharmonic, parallel keys generators"
```

---

## Task 7: Question Generators — Key Signatures, Scale Degrees, Dominant & Subdominant

**Files:**
- Create: `src/quizzes/circle-of-fifths/generators/key-signatures.ts`
- Create: `src/quizzes/circle-of-fifths/generators/scale-degrees.ts`
- Create: `src/quizzes/circle-of-fifths/generators/dominant.ts`
- Create: `src/quizzes/circle-of-fifths/generators/key-signatures.test.ts`
- Create: `src/quizzes/circle-of-fifths/generators/scale-degrees.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/quizzes/circle-of-fifths/generators/key-signatures.test.ts
import { describe, it, expect } from 'vitest'
import { generateKeySignatureQuestion } from './key-signatures'

describe('generateKeySignatureQuestion', () => {
  it('has 4 options and a correct answer', () => {
    const q = generateKeySignatureQuestion('easy', [])
    expect(q.options).toHaveLength(4)
    expect(q.options).toContain(q.answer)
  })
})
```

```ts
// src/quizzes/circle-of-fifths/generators/scale-degrees.test.ts
import { describe, it, expect } from 'vitest'
import { generateScaleDegreeQuestion } from './scale-degrees'

describe('generateScaleDegreeQuestion', () => {
  it('has 4 options and a correct answer', () => {
    const q = generateScaleDegreeQuestion('medium', [])
    expect(q.options).toHaveLength(4)
    expect(q.options).toContain(q.answer)
  })
})
```

- [ ] **Step 2: Run to confirm fail**

```bash
npx vitest run src/quizzes/circle-of-fifths/generators/key-signatures.test.ts src/quizzes/circle-of-fifths/generators/scale-degrees.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implement key-signatures.ts**

```ts
// src/quizzes/circle-of-fifths/generators/key-signatures.ts
import type { QuizGenerator } from '../../../lib/types'
import { CIRCLE, getKeySignature, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

type QuestionVariant = 'count' | 'which-key' | 'name-accidentals'

export const generateKeySignatureQuestion: QuizGenerator = (difficulty) => {
  const variants: QuestionVariant[] = difficulty === 'easy'
    ? ['count']
    : difficulty === 'medium'
    ? ['count', 'which-key']
    : ['count', 'which-key', 'name-accidentals']
  const variant = randomFrom(variants)
  const keys = allMajorKeys()

  if (variant === 'count') {
    const key = randomFrom(keys)
    const sig = getKeySignature(key)
    const answer = sig.count === 0 ? '0' : `${sig.count} ${sig.type}${sig.count > 1 ? 's' : ''}`
    const distractors = ['1 sharp', '2 sharps', '3 sharps', '1 flat', '2 flats', '3 flats', '4 sharps', '4 flats', '0']
      .filter(d => d !== answer)
    const options = shuffle([answer, ...shuffle(distractors).slice(0, 3)]) as [string, string, string, string]
    return { text: `How many sharps or flats does ${key} major have?`, options, answer, difficulty }
  }

  if (variant === 'which-key') {
    const ref = randomFrom(CIRCLE.filter(e => e.sharps > 0 || e.flats > 0))
    const answer = ref.major
    const desc = ref.sharps > 0 ? `${ref.sharps} sharp${ref.sharps > 1 ? 's' : ''}` : `${ref.flats} flat${ref.flats > 1 ? 's' : ''}`
    const distractors = shuffle(keys.filter(k => k !== answer)).slice(0, 3)
    const options = shuffle([answer, ...distractors]) as [string, string, string, string]
    return { text: `Which major key has ${desc}?`, options, answer, difficulty }
  }

  // name-accidentals
  const entry = randomFrom(CIRCLE.filter(e => e.sharps > 0 || e.flats > 0))
  const sig = getKeySignature(entry.major)
  const answer = sig.notes.join(', ')
  const otherSigs = CIRCLE
    .filter(e => e.major !== entry.major && (e.sharps > 0 || e.flats > 0))
    .map(e => getKeySignature(e.major).notes.join(', '))
  const distractors = shuffle(otherSigs).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  return { text: `Name the accidentals in ${entry.major} major (in order):`, options, answer, difficulty }
}
```

- [ ] **Step 4: Implement scale-degrees.ts**

```ts
// src/quizzes/circle-of-fifths/generators/scale-degrees.ts
import type { QuizGenerator } from '../../../lib/types'
import { getScaleDegreeChord, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

const DEGREE_NAMES: Record<number, string> = { 1: 'I', 2: 'ii', 3: 'iii', 4: 'IV', 5: 'V', 6: 'vi', 7: 'vii°' }
const EASY_DEGREES = [1, 4, 5] as const
const ALL_DEGREES = [1, 2, 3, 4, 5, 6, 7] as const

export const generateScaleDegreeQuestion: QuizGenerator = (difficulty) => {
  const key = randomFrom(allMajorKeys())
  const degrees = difficulty === 'easy' ? EASY_DEGREES : ALL_DEGREES
  const degree = randomFrom([...degrees]) as 1 | 2 | 3 | 4 | 5 | 6 | 7
  const answer = getScaleDegreeChord(key, degree)

  const otherDegrees = ALL_DEGREES.filter(d => d !== degree) as unknown as (1|2|3|4|5|6|7)[]
  const distractors = shuffle(otherDegrees)
    .slice(0, 5)
    .map(d => getScaleDegreeChord(key, d))
    .filter(c => c !== answer)
    .slice(0, 3)

  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = `What is the ${DEGREE_NAMES[degree]} chord in ${key} major?`
  return { text, options, answer, difficulty }
}
```

- [ ] **Step 5: Implement dominant.ts**

```ts
// src/quizzes/circle-of-fifths/generators/dominant.ts
import type { QuizGenerator } from '../../../lib/types'
import { getDominant, getSubdominant, allMajorKeys } from '../../../lib/circle-of-fifths'

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

export const generateDominantQuestion: QuizGenerator = (difficulty) => {
  const key = randomFrom(allMajorKeys())
  const askDominant = Math.random() > 0.5 || difficulty === 'easy'
  const answer = askDominant ? getDominant(key) : getSubdominant(key)
  const label = askDominant ? 'dominant (V)' : 'subdominant (IV)'
  const distractors = shuffle(allMajorKeys().filter(k => k !== answer)).slice(0, 3)
  const options = shuffle([answer, ...distractors]) as [string, string, string, string]
  const text = `What is the ${label} of ${key} major?`
  return { text, options, answer, difficulty }
}
```

- [ ] **Step 6: Run tests**

```bash
npx vitest run src/quizzes/circle-of-fifths/generators/key-signatures.test.ts src/quizzes/circle-of-fifths/generators/scale-degrees.test.ts
```
Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add src/quizzes/circle-of-fifths/generators/
git commit -m "feat: add key signatures, scale degrees, and dominant generators"
```

---

## Task 8: Quiz Registry

**Files:**
- Create: `src/quizzes/circle-of-fifths/index.ts`
- Create: `src/quizzes/registry.ts`

- [ ] **Step 1: Create CoF quiz index**

```ts
// src/quizzes/circle-of-fifths/index.ts
import type { QuizDefinition } from '../../lib/types'
import { generateStepsQuestion } from './generators/steps'
import { generateRelativeKeyQuestion } from './generators/relative-keys'
import { generateOppositeKeyQuestion } from './generators/opposite-keys'
import { generateKeySignatureQuestion } from './generators/key-signatures'
import { generateScaleDegreeQuestion } from './generators/scale-degrees'
import { generateDominantQuestion } from './generators/dominant'
import { generateEnharmonicQuestion } from './generators/enharmonic'
import { generateParallelKeyQuestion } from './generators/parallel-keys'

export const cofQuizzes: QuizDefinition[] = [
  // Individual
  { id: 'cof-steps', title: 'Steps on the Circle', description: 'Navigate clockwise and counterclockwise', category: 'individual', topic: 'Circle of Fifths', generators: [generateStepsQuestion] },
  { id: 'cof-relative', title: 'Relative Keys', description: 'Find the relative major or minor', category: 'individual', topic: 'Circle of Fifths', generators: [generateRelativeKeyQuestion] },
  { id: 'cof-opposite', title: 'Opposite Keys', description: 'Find the key across the circle', category: 'individual', topic: 'Circle of Fifths', generators: [generateOppositeKeyQuestion] },
  { id: 'cof-keysig', title: 'Key Signatures', description: 'Sharps, flats, and accidental names', category: 'individual', topic: 'Circle of Fifths', generators: [generateKeySignatureQuestion] },
  { id: 'cof-degrees', title: 'Scale Degrees & Chords', description: 'ii, iii, IV, V, vi, vii° of any key', category: 'individual', topic: 'Circle of Fifths', generators: [generateScaleDegreeQuestion] },
  { id: 'cof-dominant', title: 'Dominant & Subdominant', description: 'The V and IV chords', category: 'individual', topic: 'Circle of Fifths', generators: [generateDominantQuestion] },
  { id: 'cof-enharmonic', title: 'Enharmonic Equivalents', description: 'Same sound, different name', category: 'individual', topic: 'Circle of Fifths', generators: [generateEnharmonicQuestion] },
  { id: 'cof-parallel', title: 'Parallel Keys', description: 'Major and minor with the same root', category: 'individual', topic: 'Circle of Fifths', generators: [generateParallelKeyQuestion] },
  // Group
  { id: 'cof-navigation', title: 'Navigation', description: 'Steps + Relative + Opposite keys', category: 'group', topic: 'Circle of Fifths', generators: [generateStepsQuestion, generateRelativeKeyQuestion, generateOppositeKeyQuestion] },
  { id: 'cof-keysig-mix', title: 'Key Signatures Mix', description: 'All key signature question types', category: 'group', topic: 'Circle of Fifths', generators: [generateKeySignatureQuestion] },
  { id: 'cof-chords', title: 'Chord Relationships', description: 'Scale degrees, dominant, subdominant', category: 'group', topic: 'Circle of Fifths', generators: [generateScaleDegreeQuestion, generateDominantQuestion] },
  // Master
  { id: 'cof-master', title: 'Circle of Fifths Master', description: 'Every question type — the full challenge!', category: 'master', topic: 'Circle of Fifths', generators: [generateStepsQuestion, generateRelativeKeyQuestion, generateOppositeKeyQuestion, generateKeySignatureQuestion, generateScaleDegreeQuestion, generateDominantQuestion, generateEnharmonicQuestion, generateParallelKeyQuestion] },
]
```

- [ ] **Step 2: Create registry**

```ts
// src/quizzes/registry.ts
import type { QuizDefinition } from '../lib/types'
import { cofQuizzes } from './circle-of-fifths'

export const ALL_QUIZZES: QuizDefinition[] = [...cofQuizzes]

export function getQuiz(id: string): QuizDefinition | undefined {
  return ALL_QUIZZES.find(q => q.id === id)
}

export function getTopics(): string[] {
  return [...new Set(ALL_QUIZZES.map(q => q.topic))]
}

export function getQuizzesByTopic(topic: string): QuizDefinition[] {
  return ALL_QUIZZES.filter(q => q.topic === topic)
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/quizzes/
git commit -m "feat: add quiz registry with Circle of Fifths individual, group, and master quizzes"
```

---

## Task 9: TanStack Store — Quiz Session

**Files:**
- Create: `src/store/quiz-session.ts`

- [ ] **Step 1: Implement store**

```ts
// src/store/quiz-session.ts
import { Store } from '@tanstack/react-store'
import type { QuizSession, Question, QuizMode, Difficulty } from '../lib/types'
import type { QuizDefinition } from '../lib/types'

interface QuizSessionState {
  session: QuizSession | null
}

export const quizSessionStore = new Store<QuizSessionState>({ session: null })

function pickDifficulty(difficulty: Difficulty): Exclude<Difficulty, 'mixed'> {
  if (difficulty !== 'mixed') return difficulty
  const options = ['easy', 'medium', 'hard'] as const
  return options[Math.floor(Math.random() * 3)]
}

function generateQuestions(quiz: QuizDefinition, count: number, difficulty: Difficulty): Question[] {
  const questions: Question[] = []
  const usedTexts = new Set<string>()

  while (questions.length < count) {
    const generator = quiz.generators[Math.floor(Math.random() * quiz.generators.length)]
    const d = pickDifficulty(difficulty)
    const q = generator(d, [])
    if (!usedTexts.has(q.text)) {
      usedTexts.add(q.text)
      questions.push(q)
    }
  }
  return questions
}

export function startSession(quiz: QuizDefinition, mode: QuizMode, difficulty: Difficulty): void {
  const count = mode.type === 'fixed' ? mode.count : 999 // timed mode generates a large pool
  const questions = generateQuestions(quiz, Math.min(count, 200), difficulty)

  quizSessionStore.setState(() => ({
    session: {
      quizId: quiz.id,
      mode,
      difficulty,
      questions,
      currentIndex: 0,
      score: 0,
      attempted: 0,
      wrongOnCurrent: false,
      startedAt: Date.now(),
      finishedAt: null,
    },
  }))
}

export function recordAnswer(isCorrect: boolean): void {
  quizSessionStore.setState(state => {
    if (!state.session) return state
    const s = state.session
    if (isCorrect) {
      const earned = s.wrongOnCurrent ? 0 : 1
      const nextIndex = s.currentIndex + 1
      const isLast = s.mode.type === 'fixed' && nextIndex >= s.mode.count
      return {
        session: {
          ...s,
          score: s.score + earned,
          attempted: s.attempted + 1,
          currentIndex: nextIndex,
          wrongOnCurrent: false,
          finishedAt: isLast ? Date.now() : null,
        },
      }
    }
    return { session: { ...s, wrongOnCurrent: true } }
  })
}

export function finishSession(): void {
  quizSessionStore.setState(state => ({
    session: state.session ? { ...state.session, finishedAt: Date.now() } : null,
  }))
}

export function clearSession(): void {
  quizSessionStore.setState(() => ({ session: null }))
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/store/quiz-session.ts
git commit -m "feat: add TanStack Store quiz session with answer recording"
```

---

## Task 10: Hooks — useTimer, usePlayerName, useHighScores, useQuiz

**Files:**
- Create: `src/hooks/useTimer.ts`
- Create: `src/hooks/usePlayerName.ts`
- Create: `src/hooks/useHighScores.ts`
- Create: `src/hooks/useQuiz.ts`

- [ ] **Step 1: Implement useTimer**

```ts
// src/hooks/useTimer.ts
import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(initialSeconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const expireRef = useRef(onExpire)
  expireRef.current = onExpire

  useEffect(() => {
    if (remaining <= 0) {
      expireRef.current()
      return
    }
    const id = setInterval(() => setRemaining(r => r - 1), 1000)
    return () => clearInterval(id)
  }, [remaining])

  const reset = useCallback(() => setRemaining(initialSeconds), [initialSeconds])

  return { remaining, reset }
}
```

- [ ] **Step 2: Implement usePlayerName**

```ts
// src/hooks/usePlayerName.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPlayerName, setPlayerName, clearPlayerName } from '../lib/storage'

export function usePlayerName() {
  const qc = useQueryClient()

  const { data: name } = useQuery({
    queryKey: ['playerName'],
    queryFn: getPlayerName,
    staleTime: Infinity,
  })

  const { mutate: saveName } = useMutation({
    mutationFn: async (n: string) => { setPlayerName(n); return n },
    onSuccess: (n) => qc.setQueryData(['playerName'], n),
  })

  const { mutate: removeName } = useMutation({
    mutationFn: async () => { clearPlayerName(); return null },
    onSuccess: () => qc.setQueryData(['playerName'], null),
  })

  return { name: name ?? null, saveName, removeName }
}
```

- [ ] **Step 3: Implement useHighScores**

```ts
// src/hooks/useHighScores.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHighScores, saveHighScore, clearHighScores, modeKey } from '../lib/storage'
import type { HighScoreEntry, QuizMode, Difficulty } from '../lib/types'

export function useHighScores(quizId?: string) {
  const qc = useQueryClient()

  const { data: allScores } = useQuery({
    queryKey: ['highScores'],
    queryFn: getHighScores,
    staleTime: Infinity,
  })

  const quizScores = quizId ? (allScores?.[quizId] ?? {}) : {}

  const { mutate: addScore } = useMutation({
    mutationFn: async ({ mode, difficulty, entry }: { mode: QuizMode; difficulty: Difficulty; entry: HighScoreEntry }) => {
      saveHighScore(quizId!, modeKey(mode), difficulty, entry)
      return getHighScores()
    },
    onSuccess: (scores) => qc.setQueryData(['highScores'], scores),
  })

  const { mutate: clearScores } = useMutation({
    mutationFn: async () => { clearHighScores(); return {} },
    onSuccess: () => qc.setQueryData(['highScores'], {}),
  })

  return { allScores: allScores ?? {}, quizScores, addScore, clearScores }
}
```

- [ ] **Step 4: Implement useQuiz**

```ts
// src/hooks/useQuiz.ts
import { useStore } from '@tanstack/react-store'
import { quizSessionStore, recordAnswer, finishSession } from '../store/quiz-session'

export function useQuiz() {
  const { session } = useStore(quizSessionStore)

  const currentQuestion = session
    ? session.questions[session.currentIndex] ?? null
    : null

  const isFinished = session?.finishedAt !== null

  function answer(selected: string) {
    if (!session || isFinished) return
    const correct = selected === currentQuestion?.answer
    recordAnswer(correct)
    return correct
  }

  function expire() {
    finishSession()
  }

  return { session, currentQuestion, isFinished, answer, expire }
}
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/
git commit -m "feat: add useTimer, usePlayerName, useHighScores, useQuiz hooks"
```

---

## Task 11: Shared UI Components

**Files:**
- Create: `src/components/AnswerButton.tsx`
- Create: `src/components/ProgressBar.tsx`
- Create: `src/components/Timer.tsx`
- Create: `src/components/QuizTile.tsx`
- Create: `src/components/Confetti.tsx`
- Create: `src/components/HighScoresTable.tsx`

- [ ] **Step 1: Implement AnswerButton**

```tsx
// src/components/AnswerButton.tsx
import type { FC } from 'react'

interface Props {
  label: string
  state: 'default' | 'correct' | 'wrong' | 'disabled'
  onClick: () => void
}

const STATE_CLASSES: Record<Props['state'], string> = {
  default: 'bg-white border-4 border-purple-300 hover:border-purple-500 hover:bg-purple-50 active:scale-95',
  correct: 'bg-green-400 border-4 border-green-600 text-white scale-105',
  wrong: 'bg-red-400 border-4 border-red-600 text-white opacity-60 cursor-not-allowed',
  disabled: 'bg-gray-100 border-4 border-gray-200 text-gray-400 cursor-not-allowed',
}

export const AnswerButton: FC<Props> = ({ label, state, onClick }) => (
  <button
    onClick={state === 'default' ? onClick : undefined}
    disabled={state === 'wrong' || state === 'disabled'}
    className={`w-full rounded-2xl px-4 py-5 text-xl font-bold font-display transition-all duration-150 shadow-md ${STATE_CLASSES[state]}`}
  >
    {label}
  </button>
)
```

- [ ] **Step 2: Implement ProgressBar**

```tsx
// src/components/ProgressBar.tsx
import type { FC } from 'react'

interface Props { current: number; total: number }

export const ProgressBar: FC<Props> = ({ current, total }) => {
  const pct = Math.min((current / total) * 100, 100)
  return (
    <div className="w-full bg-purple-100 rounded-full h-4 overflow-hidden">
      <div
        className="bg-purple-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
```

- [ ] **Step 3: Implement Timer**

```tsx
// src/components/Timer.tsx
import type { FC } from 'react'

interface Props { remaining: number; total: number }

export const Timer: FC<Props> = ({ remaining, total }) => {
  const pct = (remaining / total) * 100
  const color = pct > 50 ? 'text-green-600' : pct > 25 ? 'text-yellow-500' : 'text-red-500'
  return (
    <div className={`text-4xl font-black font-display tabular-nums ${color}`}>
      {remaining}s
    </div>
  )
}
```

- [ ] **Step 4: Implement QuizTile**

```tsx
// src/components/QuizTile.tsx
import type { FC } from 'react'
import type { QuizDefinition } from '../lib/types'

const CATEGORY_COLORS: Record<QuizDefinition['category'], string> = {
  individual: 'from-blue-400 to-blue-600',
  group: 'from-purple-400 to-purple-600',
  master: 'from-yellow-400 to-orange-500',
}

interface Props {
  quiz: QuizDefinition
  onClick: () => void
}

export const QuizTile: FC<Props> = ({ quiz, onClick }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-br ${CATEGORY_COLORS[quiz.category]} rounded-3xl p-5 text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-150 text-left w-full`}
  >
    <div className="text-lg font-black font-display">{quiz.title}</div>
    <div className="text-sm font-semibold opacity-80 mt-1">{quiz.description}</div>
    {quiz.category === 'master' && (
      <div className="mt-2 text-xs font-bold uppercase tracking-wide bg-white/20 rounded-full px-3 py-1 w-fit">Master</div>
    )}
  </button>
)
```

- [ ] **Step 5: Implement Confetti**

```tsx
// src/components/Confetti.tsx
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function Confetti() {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
  }, [])
  return null
}
```

- [ ] **Step 6: Implement HighScoresTable**

```tsx
// src/components/HighScoresTable.tsx
import type { FC } from 'react'
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import type { HighScoreEntry } from '../lib/types'

const col = createColumnHelper<HighScoreEntry & { rank: number }>()

const columns = [
  col.accessor('rank', { header: '#', cell: i => i.getValue() }),
  col.accessor('name', { header: 'Name' }),
  col.accessor('score', { header: 'Score' }),
  col.accessor('accuracy', { header: 'Accuracy', cell: i => `${i.getValue()}%` }),
  col.accessor('date', { header: 'Date', cell: i => new Date(i.getValue()).toLocaleDateString() }),
]

interface Props { entries: HighScoreEntry[] }

export const HighScoresTable: FC<Props> = ({ entries }) => {
  const data = entries.map((e, i) => ({ ...e, rank: i + 1 }))
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  if (entries.length === 0) {
    return <p className="text-center text-gray-400 font-display py-4">No scores yet — play a quiz!</p>
  }

  return (
    <table className="w-full text-sm font-display">
      <thead>
        {table.getHeaderGroups().map(hg => (
          <tr key={hg.id} className="text-left text-purple-700">
            {hg.headers.map(h => (
              <th key={h.id} className="pb-2 font-black">{flexRender(h.column.columnDef.header, h.getContext())}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, i) => (
          <tr key={row.id} className={i % 2 === 0 ? 'bg-purple-50' : ''}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="py-2 px-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 7: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/
git commit -m "feat: add shared UI components (AnswerButton, ProgressBar, Timer, QuizTile, Confetti, HighScoresTable)"
```

---

## Task 12: Routing Setup + Root Layout

**Files:**
- Create: `src/main.tsx`
- Create: `src/routes/__root.tsx`

- [ ] **Step 1: Implement main.tsx**

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import './index.css'

const router = createRouter({ routeTree })
const queryClient = new QueryClient()

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
```

- [ ] **Step 2: Implement root layout**

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet, Link } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 font-display">
      <header className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <Link to="/" className="text-xl font-black tracking-tight">🎵 Music Flashcards</Link>
        <div className="flex gap-3 text-sm font-bold">
          <Link to="/scores" className="opacity-80 hover:opacity-100">Scores</Link>
          <Link to="/settings" className="opacity-80 hover:opacity-100">Settings</Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  ),
})
```

- [ ] **Step 3: Add index.css with Tailwind**

```css
/* src/index.css */
@import "tailwindcss";
```

- [ ] **Step 4: Run dev server to verify routing works**

```bash
npm run dev
```
Expected: app loads at localhost:5173 with header visible.

- [ ] **Step 5: Commit**

```bash
git add src/main.tsx src/routes/__root.tsx src/index.css
git commit -m "feat: add root layout and app entry with TanStack Router + Query providers"
```

---

## Task 13: Home Screen

**Files:**
- Create: `src/routes/index.tsx`

- [ ] **Step 1: Implement home screen**

```tsx
// src/routes/index.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { QuizTile } from '../components/QuizTile'
import { getTopics, getQuizzesByTopic } from '../quizzes/registry'
import type { QuizDefinition } from '../lib/types'

export const Route = createFileRoute('/')({
  component: HomeScreen,
})

function HomeScreen() {
  const navigate = useNavigate()
  const topics = getTopics()

  function handleQuizSelect(quiz: QuizDefinition) {
    navigate({ to: '/quiz/$id/setup', params: { id: quiz.id } })
  }

  return (
    <div className="space-y-8">
      <div className="text-center pt-2">
        <h1 className="text-3xl font-black text-purple-700">Choose a Quiz!</h1>
        <p className="text-gray-500 mt-1 font-semibold">Pick a challenge and become a music theory expert</p>
      </div>

      {topics.map(topic => {
        const quizzes = getQuizzesByTopic(topic)
        const individual = quizzes.filter(q => q.category === 'individual')
        const groups = quizzes.filter(q => q.category === 'group')
        const master = quizzes.filter(q => q.category === 'master')

        return (
          <section key={topic}>
            <h2 className="text-xl font-black text-purple-600 mb-3">{topic}</h2>

            {master.length > 0 && (
              <div className="mb-4">
                {master.map(q => <QuizTile key={q.id} quiz={q} onClick={() => handleQuizSelect(q)} />)}
              </div>
            )}

            {groups.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Group Challenges</h3>
                <div className="grid grid-cols-1 gap-3">
                  {groups.map(q => <QuizTile key={q.id} quiz={q} onClick={() => handleQuizSelect(q)} />)}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Individual Drills</h3>
              <div className="grid grid-cols-2 gap-3">
                {individual.map(q => <QuizTile key={q.id} quiz={q} onClick={() => handleQuizSelect(q)} />)}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: add home screen with quiz tiles organized by topic and category"
```

---

## Task 14: Settings Screen

**Files:**
- Create: `src/routes/settings.tsx`

- [ ] **Step 1: Implement settings screen**

```tsx
// src/routes/settings.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { usePlayerName } from '../hooks/usePlayerName'
import { useHighScores } from '../hooks/useHighScores'

export const Route = createFileRoute('/settings')({
  component: SettingsScreen,
})

function SettingsScreen() {
  const { name, saveName, removeName } = usePlayerName()
  const { clearScores } = useHighScores()
  const [input, setInput] = useState(name ?? '')
  const [saved, setSaved] = useState(false)
  const [confirming, setConfirming] = useState(false)

  function handleSave() {
    if (input.trim()) {
      saveName(input.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  function handleClearName() {
    removeName()
    setInput('')
  }

  function handleClearScores() {
    clearScores()
    setConfirming(false)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-purple-700">Settings</h1>

      <section className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="font-black text-lg text-gray-700">Player Name</h2>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-purple-500"
        />
        <div className="flex gap-3">
          <button onClick={handleSave} className="bg-purple-600 text-white font-bold rounded-xl px-5 py-2 hover:bg-purple-700">
            {saved ? 'Saved!' : 'Save Name'}
          </button>
          {name && (
            <button onClick={handleClearName} className="text-red-500 font-bold rounded-xl px-5 py-2 hover:bg-red-50">
              Clear Name
            </button>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="font-black text-lg text-gray-700">High Scores</h2>
        {confirming ? (
          <div className="space-y-3">
            <p className="text-red-600 font-bold">Are you sure? This will delete all high scores.</p>
            <div className="flex gap-3">
              <button onClick={handleClearScores} className="bg-red-500 text-white font-bold rounded-xl px-5 py-2">Yes, clear all</button>
              <button onClick={() => setConfirming(false)} className="text-gray-500 font-bold px-5 py-2">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} className="text-red-500 font-bold rounded-xl px-5 py-2 hover:bg-red-50">
            Clear All High Scores
          </button>
        )}
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/settings.tsx
git commit -m "feat: add settings screen for player name and high score management"
```

---

## Task 15: Quiz Setup Screen

**Files:**
- Create: `src/routes/quiz/$id/setup.tsx`

- [ ] **Step 1: Implement setup screen**

```tsx
// src/routes/quiz/$id/setup.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { usePlayerName } from '../../../hooks/usePlayerName'
import { getQuiz } from '../../../quizzes/registry'
import { startSession } from '../../../store/quiz-session'
import type { Difficulty, QuizMode } from '../../../lib/types'

export const Route = createFileRoute('/quiz/$id/setup')({
  component: SetupScreen,
})

function SetupScreen() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const quiz = getQuiz(id)
  const { name, saveName } = usePlayerName()

  const form = useForm({
    defaultValues: {
      playerName: name ?? '',
      modeType: 'fixed' as 'timed' | 'fixed',
      fixedCount: 20 as 10 | 20 | 30 | 50,
      timedSeconds: 60 as 30 | 60 | 90 | 120,
      difficulty: 'mixed' as Difficulty,
    },
    onSubmit: ({ value }) => {
      if (value.playerName.trim()) saveName(value.playerName.trim())
      const mode: QuizMode = value.modeType === 'timed'
        ? { type: 'timed', seconds: value.timedSeconds }
        : { type: 'fixed', count: value.fixedCount }
      startSession(quiz!, mode, value.difficulty)
      navigate({ to: '/quiz/$id/play', params: { id } })
    },
  })

  if (!quiz) return <p className="text-center text-red-500 font-bold">Quiz not found.</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-purple-700">{quiz.title}</h1>
      <p className="text-gray-500 font-semibold">{quiz.description}</p>

      <form onSubmit={e => { e.preventDefault(); form.handleSubmit() }} className="space-y-6">
        <form.Field name="playerName">
          {field => (
            <div>
              <label className="block font-black text-gray-600 mb-2">Your Name</label>
              <input
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-purple-500"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="modeType">
          {field => (
            <div>
              <label className="block font-black text-gray-600 mb-2">Mode</label>
              <div className="grid grid-cols-2 gap-3">
                {(['fixed', 'timed'] as const).map(m => (
                  <button key={m} type="button"
                    onClick={() => field.handleChange(m)}
                    className={`rounded-xl py-3 font-bold border-2 transition-all ${field.state.value === m ? 'bg-purple-600 text-white border-purple-600' : 'border-purple-200 text-purple-600 hover:border-purple-400'}`}>
                    {m === 'fixed' ? 'Fixed Questions' : 'Timed'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={s => s.values.modeType}>
          {modeType => modeType === 'fixed' ? (
            <form.Field name="fixedCount">
              {field => (
                <div>
                  <label className="block font-black text-gray-600 mb-2">Number of Questions</label>
                  <div className="flex gap-3 flex-wrap">
                    {([10, 20, 30, 50] as const).map(n => (
                      <button key={n} type="button"
                        onClick={() => field.handleChange(n)}
                        className={`rounded-xl px-5 py-2 font-bold border-2 transition-all ${field.state.value === n ? 'bg-purple-600 text-white border-purple-600' : 'border-purple-200 text-purple-600 hover:border-purple-400'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form.Field>
          ) : (
            <form.Field name="timedSeconds">
              {field => (
                <div>
                  <label className="block font-black text-gray-600 mb-2">Time Limit</label>
                  <div className="flex gap-3 flex-wrap">
                    {([30, 60, 90, 120] as const).map(s => (
                      <button key={s} type="button"
                        onClick={() => field.handleChange(s)}
                        className={`rounded-xl px-5 py-2 font-bold border-2 transition-all ${field.state.value === s ? 'bg-purple-600 text-white border-purple-600' : 'border-purple-200 text-purple-600 hover:border-purple-400'}`}>
                        {s}s
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form.Field>
          )}
        </form.Subscribe>

        <form.Field name="difficulty">
          {field => (
            <div>
              <label className="block font-black text-gray-600 mb-2">Difficulty</label>
              <div className="grid grid-cols-2 gap-3">
                {(['easy', 'medium', 'hard', 'mixed'] as const).map(d => (
                  <button key={d} type="button"
                    onClick={() => field.handleChange(d)}
                    className={`rounded-xl py-3 font-bold border-2 capitalize transition-all ${field.state.value === d ? 'bg-purple-600 text-white border-purple-600' : 'border-purple-200 text-purple-600 hover:border-purple-400'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form.Field>

        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xl rounded-2xl py-4 shadow-lg transition-all active:scale-95">
          Start Quiz!
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/quiz/
git commit -m "feat: add quiz setup screen with TanStack Form"
```

---

## Task 16: Quiz Play Screen

**Files:**
- Create: `src/routes/quiz/$id/play.tsx`

- [ ] **Step 1: Implement play screen**

```tsx
// src/routes/quiz/$id/play.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { quizSessionStore } from '../../../store/quiz-session'
import { useQuiz } from '../../../hooks/useQuiz'
import { useTimer } from '../../../hooks/useTimer'
import { AnswerButton } from '../../../components/AnswerButton'
import { ProgressBar } from '../../../components/ProgressBar'
import { Timer } from '../../../components/Timer'

export const Route = createFileRoute('/quiz/$id/play')({
  component: PlayScreen,
})

function PlayScreen() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { session } = useStore(quizSessionStore)
  const { currentQuestion, isFinished, answer, expire } = useQuiz()
  const [wrongOptions, setWrongOptions] = useState<string[]>([])
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null)

  const isTimed = session?.mode.type === 'timed'
  const totalSeconds = isTimed ? (session!.mode as { type: 'timed'; seconds: number }).seconds : 0
  const { remaining } = useTimer(totalSeconds, () => { if (isTimed) expire() })

  useEffect(() => {
    if (isFinished) navigate({ to: '/quiz/$id/results', params: { id } })
  }, [isFinished, navigate, id])

  useEffect(() => {
    setWrongOptions([])
    setFlash(null)
  }, [currentQuestion?.text])

  if (!session || !currentQuestion) return null

  const totalQuestions = session.mode.type === 'fixed' ? session.mode.count : undefined

  function handleAnswer(option: string) {
    const correct = answer(option)
    if (correct) {
      setFlash('correct')
    } else {
      setFlash('wrong')
      setWrongOptions(prev => [...prev, option])
      setTimeout(() => setFlash(null), 400)
    }
  }

  function optionState(option: string): 'default' | 'correct' | 'wrong' | 'disabled' {
    if (flash === 'correct' && option === currentQuestion!.answer) return 'correct'
    if (wrongOptions.includes(option)) return 'wrong'
    return 'default'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {isTimed
          ? <Timer remaining={remaining} total={totalSeconds} />
          : <ProgressBar current={session.currentIndex} total={totalQuestions!} />
        }
        <div className="text-right">
          <div className="text-2xl font-black text-purple-700">{session.score}</div>
          <div className="text-xs text-gray-400 font-bold">points</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md min-h-[100px] flex items-center">
        <p className="text-xl font-black text-gray-800 leading-snug">{currentQuestion.text}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {currentQuestion.options.map(opt => (
          <AnswerButton
            key={opt}
            label={opt}
            state={optionState(opt)}
            onClick={() => handleAnswer(opt)}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/quiz/$id/play.tsx
git commit -m "feat: add quiz play screen with try-again mechanic and timer/progress"
```

---

## Task 17: Results Screen

**Files:**
- Create: `src/routes/quiz/$id/results.tsx`

- [ ] **Step 1: Implement results screen**

```tsx
// src/routes/quiz/$id/results.tsx
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { quizSessionStore, clearSession } from '../../../store/quiz-session'
import { useHighScores } from '../../../hooks/useHighScores'
import { usePlayerName } from '../../../hooks/usePlayerName'
import { HighScoresTable } from '../../../components/HighScoresTable'
import { Confetti } from '../../../components/Confetti'
import { getQuiz } from '../../../quizzes/registry'
import { modeKey } from '../../../lib/storage'

export const Route = createFileRoute('/quiz/$id/results')({
  component: ResultsScreen,
})

function ResultsScreen() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { session } = useStore(quizSessionStore)
  const quiz = getQuiz(id)
  const { name } = usePlayerName()
  const { quizScores, addScore } = useHighScores(id)
  const [isNewBest, setIsNewBest] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!session || saved) return
    const mk = modeKey(session.mode)
    const existing = quizScores[mk]?.[session.difficulty] ?? []
    const best = existing[0]?.score ?? 0
    const accuracy = session.attempted > 0 ? Math.round((session.score / session.attempted) * 100) : 0

    if (session.score > best) setIsNewBest(true)

    addScore({
      mode: session.mode,
      difficulty: session.difficulty,
      entry: { name: name ?? 'Anonymous', score: session.score, accuracy, date: new Date().toISOString() },
    })
    setSaved(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!session || !quiz) {
    return <div className="text-center"><Link to="/" className="text-purple-600 font-bold">Go Home</Link></div>
  }

  const accuracy = session.attempted > 0 ? Math.round((session.score / session.attempted) * 100) : 0
  const mk = modeKey(session.mode)
  const leaderboard = quizScores[mk]?.[session.difficulty] ?? []

  function handleRetry() {
    clearSession()
    navigate({ to: '/quiz/$id/setup', params: { id } })
  }

  return (
    <div className="space-y-6">
      {isNewBest && <Confetti />}

      <div className="bg-white rounded-2xl p-6 shadow-md text-center space-y-2">
        {isNewBest && <div className="text-yellow-500 font-black text-lg">New High Score!</div>}
        <div className="text-5xl font-black text-purple-700">{session.score}</div>
        <div className="text-gray-400 font-semibold">points</div>
        <div className="flex justify-center gap-8 mt-4 text-sm font-bold text-gray-500">
          <div><span className="block text-2xl font-black text-gray-700">{session.attempted}</span>Attempted</div>
          <div><span className="block text-2xl font-black text-gray-700">{accuracy}%</span>Accuracy</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-black text-gray-700 mb-3">Leaderboard</h2>
        <HighScoresTable entries={leaderboard} />
      </div>

      <div className="flex gap-3">
        <button onClick={handleRetry} className="flex-1 bg-purple-600 text-white font-black rounded-2xl py-4 hover:bg-purple-700 active:scale-95 transition-all">
          Play Again
        </button>
        <Link to="/" onClick={clearSession} className="flex-1 bg-gray-100 text-gray-600 font-black rounded-2xl py-4 text-center hover:bg-gray-200 active:scale-95 transition-all">
          Home
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/quiz/$id/results.tsx
git commit -m "feat: add results screen with score, accuracy, leaderboard, and confetti"
```

---

## Task 18: Global Scores Screen

**Files:**
- Create: `src/routes/scores.tsx`

- [ ] **Step 1: Implement scores screen**

```tsx
// src/routes/scores.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useHighScores } from '../hooks/useHighScores'
import { HighScoresTable } from '../components/HighScoresTable'
import { ALL_QUIZZES } from '../quizzes/registry'

export const Route = createFileRoute('/scores')({
  component: ScoresScreen,
})

function ScoresScreen() {
  const { allScores } = useHighScores()
  const [selectedQuizId, setSelectedQuizId] = useState(ALL_QUIZZES[0]?.id ?? '')

  const quizScores = allScores[selectedQuizId] ?? {}
  const allEntries = Object.values(quizScores)
    .flatMap(byMode => Object.values(byMode).flat())
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-purple-700">High Scores</h1>

      <div className="overflow-x-auto flex gap-2 pb-2">
        {ALL_QUIZZES.map(q => (
          <button
            key={q.id}
            onClick={() => setSelectedQuizId(q.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 font-bold text-sm transition-all ${selectedQuizId === q.id ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border-2 border-purple-200'}`}>
            {q.title}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <HighScoresTable entries={allEntries} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/scores.tsx
git commit -m "feat: add global scores screen with quiz picker"
```

---

## Task 19: PWA Icons + Final Verification

**Files:**
- Create: `public/icons/icon-192.png` (generated)
- Create: `public/icons/icon-512.png` (generated)

- [ ] **Step 1: Generate PWA icons**

Use any image editor or online tool (e.g., https://maskable.app) to create two PNG icons — a simple music note or treble clef on a purple background:
- `public/icons/icon-192.png` — 192×192px
- `public/icons/icon-512.png` — 512×512px

For a quick placeholder during development, create SVG-based PNGs using a script:

```bash
# Install sharp for icon generation
npm install -D sharp

node -e "
const sharp = require('sharp');
const svg = Buffer.from('<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"#7C3AED\" rx=\"20\"/><text x=\"50\" y=\"70\" font-size=\"60\" text-anchor=\"middle\" fill=\"white\">🎵</text></svg>');
sharp(svg).resize(192,192).png().toFile('public/icons/icon-192.png', () => console.log('192 done'));
sharp(svg).resize(512,512).png().toFile('public/icons/icon-512.png', () => console.log('512 done'));
"
```

- [ ] **Step 2: Full build and PWA verification**

```bash
npm run build
npx vite preview
```
Expected: app served at localhost:4173. In Chrome DevTools → Application → Manifest: shows name, icons, theme color. Service Worker registered.

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```
Expected: all tests PASS.

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Final commit**

```bash
git add public/icons/
git commit -m "feat: add PWA icons and complete kids music flashcards MVP"
```
