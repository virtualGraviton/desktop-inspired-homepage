import { useState, useCallback } from 'react'
import type { AnimationPhase } from '../types'

const MORPH_MS = 500


export function useLoginAnimation() {
  const [phase, setPhase] = useState<AnimationPhase>('idle')

  const handleLogin = useCallback(() => {
    if (phase !== 'idle') return

    // Glass fade (exit) and window morph start together
    setPhase('morphContent')

    setTimeout(() => {
      setPhase('complete')
    }, MORPH_MS)
  }, [phase])

  const isMorphing = phase === 'morphContent' || phase === 'complete'
  const showGlass = phase === 'idle'

  return {
    phase,
    isMorphing,
    showGlass,
    handleLogin,
  }
}
