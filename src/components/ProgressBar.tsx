import type { FC } from 'react'

interface Props { current: number; total: number }

export const ProgressBar: FC<Props> = ({ current, total }) => {
  const pct = Math.min((current / total) * 100, 100)
  return (
    <div className="w-full bg-purple-100 rounded-full h-4 overflow-hidden">
      <div
        className="bg-purple-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
