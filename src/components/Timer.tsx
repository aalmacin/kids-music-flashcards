import type { FC } from 'react'

interface Props { remaining: number; total: number }

export const Timer: FC<Props> = ({ remaining, total }) => {
  const pct = (remaining / total) * 100
  const color = pct > 50 ? 'text-green-600' : pct > 25 ? 'text-yellow-500' : 'text-red-500'
  return (
    <div className={`text-4xl font-black font-display tabular-nums ${color}`}>
      {remaining}s
    </div>
  )
}
