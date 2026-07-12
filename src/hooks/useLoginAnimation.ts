import { useState, useCallback, useEffect } from 'react'
import type { AnimationPhase } from '../types'

const MORPH_MS = 500
const LOADING_DISPLAY_MS = 1200

export function useLoginAnimation() {
  const [phase, setPhase] = useState<AnimationPhase>('boot')

  /** When loading phase begins, auto-transition to idle after delay. */
  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('idle'), LOADING_DISPLAY_MS)
    return () => clearTimeout(t)
  }, [phase])

  /** Called once wallpaper image finishes loading. Transitions boot → loading. */
  const onWallpaperReady = useCallback(() => {
    setPhase('loading')
  }, [])

  const handleLogin = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('morphContent')
    setTimeout(() => setPhase('complete'), MORPH_MS)
  }, [phase])

  const isMorphing = phase === 'morphContent' || phase === 'complete'
  const isDesktop = phase === 'complete'
  const showGlass = phase === 'loading' || phase === 'idle'
  const isBooting = phase === 'boot'
  const isLoading = phase === 'loading'
  const isBeforeIdle = phase === 'boot' || phase === 'loading'

  return {
    phase,
    isMorphing,
    isDesktop,
    showGlass,
    isBooting,
    isLoading,
    isBeforeIdle,
    handleLogin,
    onWallpaperReady,
  }
}
