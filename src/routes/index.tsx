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
