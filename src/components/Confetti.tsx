import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function Confetti() {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
  }, [])
  return null
}
