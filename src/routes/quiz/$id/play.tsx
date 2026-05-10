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
