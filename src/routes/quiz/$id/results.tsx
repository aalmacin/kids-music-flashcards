import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { quizSessionStore, clearSession } from '../../../store/quiz-session'
import { useHighScores } from '../../../hooks/useHighScores'
import { usePlayerName } from '../../../hooks/usePlayerName'
import { HighScoresTable } from '../../../components/HighScoresTable'
import { Confetti } from '../../../components/Confetti'
import { getQuiz } from '../../../quizzes/registry'
import { modeKey, getHighScores } from '../../../lib/storage'

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
  const [unrankedEntry, setUnrankedEntry] = useState<import('../../../lib/types').HighScoreEntry | null>(null)
  const savedRef = useRef(false)

  useEffect(() => {
    if (!session || savedRef.current) return
    savedRef.current = true
    const mk = modeKey(session.mode)
    const currentScores = getHighScores()
    const existing = currentScores[id]?.[mk] ?? []
    const best = existing[0]?.score ?? 0
    const accuracy = session.attempted > 0 ? Math.round((session.score / session.attempted) * 100) : 0
    const entry = { name: name ?? 'Anonymous', score: session.score, accuracy, date: new Date().toISOString() }

    if (session.score > best) setIsNewBest(true)

    const isFull = existing.length >= 10
    const min = isFull ? existing[existing.length - 1].score : -Infinity

    if (isFull && session.score < min) {
      // Score doesn't make the leaderboard — show it but don't store
      setUnrankedEntry(entry)
    } else {
      addScore({ mode: session.mode, entry })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!session || !quiz) {
    return <div className="text-center"><Link to="/" className="text-purple-600 font-bold">Go Home</Link></div>
  }

  const accuracy = session.attempted > 0 ? Math.round((session.score / session.attempted) * 100) : 0
  const mk = modeKey(session.mode)
  const leaderboard = quizScores[mk] ?? []
  const displayEntries = unrankedEntry ? [...leaderboard, unrankedEntry] : leaderboard

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
        <HighScoresTable entries={displayEntries} />
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
