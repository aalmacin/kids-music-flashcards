import { createFileRoute } from '@tanstack/react-router'
import { useHighScores } from '../hooks/useHighScores'
import { HighScoresTable } from '../components/HighScoresTable'
import { ALL_QUIZZES } from '../quizzes/registry'

export const Route = createFileRoute('/scores')({
  component: ScoresScreen,
})

const MASTER_ID = 'cof-master'

function ScoresScreen() {
  const { allScores } = useHighScores()

  const sortedQuizzes = [
    ...ALL_QUIZZES.filter(q => q.id === MASTER_ID),
    ...ALL_QUIZZES.filter(q => q.id !== MASTER_ID),
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-purple-700">High Scores</h1>

      {sortedQuizzes.map(q => {
        const quizScores = allScores[q.id] ?? {}
        const entries = Object.values(quizScores)
          .flat()
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)

        return (
          <div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-black text-purple-700 mb-3">{q.title}</h2>
            <HighScoresTable entries={entries} />
          </div>
        )
      })}
    </div>
  )
}
