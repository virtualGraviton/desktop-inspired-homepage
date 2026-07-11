import { useState, useCallback } from 'react'
import type { AppState, AnimationPhase } from '../types'

export function useLoginAnimation() {
  const [appState, setAppState] = useState<AppState>('login')
  const [phase, setPhase] = useState<AnimationPhase>('idle')

  const handleLogin = useCallback(() => {
    setPhase('fadeGlass')

    setTimeout(() => {
      setPhase('morphContent')
    }, 300)

    setTimeout(() => {
      setPhase('expandWindow')
    }, 800)

    setTimeout(() => {
      setPhase('complete')
      setAppState('desktop')
    }, 1400)
  }, [])

  return {
    appState,
    phase,
    handleLogin,
  }
}
