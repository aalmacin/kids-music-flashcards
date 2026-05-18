import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { usePlayerName } from '../../../hooks/usePlayerName'
import { getQuiz } from '../../../quizzes/registry'
import { startSession } from '../../../store/quiz-session'
import type { QuizMode } from '../../../lib/types'

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
    },
    onSubmit: ({ value }) => {
      if (value.playerName.trim()) saveName(value.playerName.trim())
      const mode: QuizMode = value.modeType === 'timed'
        ? { type: 'timed', seconds: value.timedSeconds }
        : { type: 'fixed', count: value.fixedCount }
      startSession(quiz!, mode)
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

        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xl rounded-2xl py-4 shadow-lg transition-all active:scale-95">
          Start Quiz!
        </button>
      </form>
    </div>
  )
}
