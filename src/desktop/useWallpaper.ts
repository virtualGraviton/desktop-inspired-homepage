import { useCallback, useRef, useState } from 'react'
import { BACKGROUNDS } from '../constants'

export interface RevealOrigin {
  x: number
  y: number
}

export function useWallpaper() {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * BACKGROUNDS.length),
  )
  const [reveal, setReveal] = useState<{
    nextIndex: number
    origin: RevealOrigin
    radius: number
  } | null>(null)
  const revealing = useRef(false)

  const current = BACKGROUNDS[index]
  const next =
    reveal !== null ? BACKGROUNDS[reveal.nextIndex] : null

  const cycleFromPoint = useCallback((origin: RevealOrigin) => {
    if (revealing.current) return
    revealing.current = true
    const nextIndex = (index + 1) % BACKGROUNDS.length
    const W = window.innerWidth
    const H = window.innerHeight
    const radius = Math.hypot(
      Math.max(origin.x, W - origin.x),
      Math.max(origin.y, H - origin.y),
    )
    setReveal({ nextIndex, origin, radius })
  }, [index])

  const onRevealEnd = useCallback(() => {
    if (!reveal) return
    setIndex(reveal.nextIndex)
    setReveal(null)
    revealing.current = false
  }, [reveal])

  return {
    current,
    next,
    reveal,
    cycleFromPoint,
    onRevealEnd,
  }
}

export type WallpaperApi = ReturnType<typeof useWallpaper>
