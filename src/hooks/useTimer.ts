import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(initialSeconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const expireRef = useRef(onExpire)
  expireRef.current = onExpire

  useEffect(() => {
    // No-op in fixed mode where initialSeconds is 0
    if (remaining <= 0) {
      if (initialSeconds > 0) expireRef.current()
      return
    }
    const id = setInterval(() => setRemaining(r => r - 1), 1000)
    return () => clearInterval(id)
  }, [remaining, initialSeconds])

  const reset = useCallback(() => setRemaining(initialSeconds), [initialSeconds])

  return { remaining, reset }
}
