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
