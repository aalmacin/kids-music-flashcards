# Kids Music Flashcards — Design Spec

## Overview

A PWA for kids aged 6–12 to learn music theory through interactive quizzes and challenges. The app focuses on theory topics not commonly available in other apps. The first topic is the Circle of Fifths. The UI is bright, playful, and cartoon-like with big colorful buttons and fun animations.

---

## Stack

- **Vite + React + TypeScript** — fast builds, modern SPA
- **vite-plugin-pwa** — service worker, manifest, offline support
- **TanStack Router** — file-based routing
- **TanStack Query** — localStorage reads/writes with caching
- **TanStack Store** — active quiz session state
- **TanStack Table** — high scores leaderboard
- **TanStack Form** — quiz setup screen

---

## Project Structure

```
kids-music-flashcards/
├── src/
│   ├── quizzes/
│   │   └── circle-of-fifths/    # question generators per quiz type
│   ├── components/              # shared UI components
│   ├── routes/                  # TanStack Router file-based routes
│   ├── store/                   # TanStack Store slices
│   ├── hooks/                   # useTimer, useQuiz
│   └── lib/                     # music theory utilities
├── public/
│   └── icons/                   # PWA icons (multiple sizes)
└── vite.config.ts               # PWA plugin configured here
```

---

## Routing

| Route | Screen |
|---|---|
| `/` | Home — quiz topic tiles |
| `/quiz/:id/setup` | Quiz setup (mode, difficulty, name) |
| `/quiz/:id/play` | Active quiz |
| `/quiz/:id/results` | Results + leaderboard |
| `/scores` | Global high scores view |
| `/settings` | Player name + data management |

---

## Quiz Structure

### Circle of Fifths Topic

**Individual Quizzes**
- Steps on the Circle (clockwise/counterclockwise navigation)
- Relative Keys (relative major/minor)
- Opposite Keys (tritone / diametrically opposite)
- Key Signatures (sharps/flats count and names)
- Scale Degrees & Chords (ii, iii, IV, V, vi, vii° of a key)
- Dominant & Subdominant (V and IV relationships)
- Enharmonic Equivalents (Bb = A#, etc.)
- Parallel Keys (C major ↔ C minor)

**Group Quizzes**
- Navigation (Steps + Relative + Opposite)
- Key Signatures Mix (count + names + identify by key)
- Chord Relationships (Scale degrees + Dominant + Subdominant)

**Master Quiz**
- Circle of Fifths Master — all question types, random mix

Future topics (Intervals, Chord Construction, Rhythm) follow the same pattern.

---

## Question Format

- All questions are algorithmically generated at runtime (no static bank)
- Each question type has its own generator with session-scoped deduplication
- 4-option multiple choice — one correct, three musically adjacent distractors
- Questions tagged `easy | medium | hard` for difficulty scaling

---

## Quiz Play Experience

### Setup Screen (TanStack Form)
- Player name (pre-filled from storage, editable)
- Mode: **Timed** (30s / 60s / 90s / 120s) or **Fixed** (10 / 20 / 30 / 50 questions)
- Difficulty: Easy | Medium | Hard | Mixed

### Play Screen
- Large question text, 4 big colorful answer buttons
- Wrong answer: red flash, button disabled — kid tries remaining options
- Correct answer on first attempt = point scored; any prior wrong attempt = no point
- Progress bar (fixed mode) or countdown timer (timed mode) always visible
- Sound effects on correct/incorrect answers

### Results Screen
- Score, total attempted, accuracy %
- Personal best comparison ("New High Score!" or "Your best: X")
- Confetti/celebration animation on personal best
- Options: retry same quiz, return home

---

## Player Name & Settings

- On first visit, kid enters their name — stored in localStorage
- Pre-filled on all subsequent visits, editable before each quiz
- Settings screen allows clearing the stored name and optionally all high scores

---

## High Scores

- Stored in localStorage via TanStack Query
- Scoped per: `quizId + mode + difficulty`
- Top 5 scores stored per combination: `{ name, score, accuracy, date }`
- Rendered with TanStack Table on results screen and `/scores` page

### LocalStorage Schema

```ts
playerName: string

highScores: {
  [quizId: string]: {
    [mode: string]: {          // e.g. "timed-60" | "fixed-20"
      [difficulty: string]: {  // "easy" | "medium" | "hard" | "mixed"
        name: string;
        score: number;
        accuracy: number;
        date: string;
      }[]                      // top 5
    }
  }
}
```

---

## PWA

- Installable on iOS, Android, desktop Chrome
- Offline-capable — all quiz content is generated client-side, no network needed after install
- Cache-first service worker strategy for all assets
- App manifest includes name, icons (multiple sizes), and brand theme color

---

## UI & Accessibility

- Mobile-first responsive layout (phones, tablets, desktops)
- Minimum 48px tap targets on all interactive elements
- High contrast colors
- Friendly rounded typeface (e.g., Nunito or Fredoka One via Google Fonts)
- Bright, cartoon-like aesthetic with animations and sound effects
