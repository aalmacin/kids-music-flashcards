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

export type QuizEnumerator = () => Question[]

export interface QuizDefinition {
  id: string
  title: string
  description: string
  category: 'individual' | 'group' | 'master'
  topic: string
  generators: QuizEnumerator[]
}

export interface QuizSession {
  quizId: string
  mode: QuizMode
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
    HighScoreEntry[]
  >
>
