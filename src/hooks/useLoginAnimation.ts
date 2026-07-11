import { useState, useCallback } from 'react'
import type { AnimationPhase } from '../types'

export function useLoginAnimation() {
  const [phase, setPhase] = useState<AnimationPhase>('idle')

  const handleLogin = useCallback(() => {
    if (phase !== 'idle') return

    setPhase('fadeGlass')

    setTimeout(() => {
      setPhase('morphContent')
    }, 280)

    setTimeout(() => {
      setPhase('expandWindow')
    }, 780)

    setTimeout(() => {
      setPhase('complete')
    }, 1300)
  }, [phase])

  const isDesktop = phase === 'complete'
  const isMorphing =
    phase === 'morphContent' || phase === 'expandWindow' || phase === 'complete'
  const showGlass = phase === 'idle' || phase === 'fadeGlass'

  return {
    phase,
    isDesktop,
    isMorphing,
    showGlass,
    handleLogin,
  }
}
