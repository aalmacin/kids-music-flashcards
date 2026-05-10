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
    disabled={state === 'wrong' || state === 'disabled' || state === 'correct'}
    className={`w-full rounded-2xl px-4 py-5 text-xl font-bold font-display transition-all duration-150 shadow-md ${STATE_CLASSES[state]}`}
  >
    {label}
  </button>
)
