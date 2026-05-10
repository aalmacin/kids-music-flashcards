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
