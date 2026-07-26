import { useCallback, useEffect, useRef, useState } from 'react'
import { BACKGROUNDS } from '../constants'

export interface RevealOrigin {
  x: number
  y: number
}

/**
 * Preload a single image and resolve when loaded or error.
 * Falls back to an in-memory cache hit for each URL.
 */
const preloadedCache = new Map<string, HTMLImageElement>()

function preloadImage(url: string): Promise<HTMLImageElement> {
  const cached = preloadedCache.get(url)
  if (cached?.complete) return Promise.resolve(cached)

  return new Promise((resolve) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      preloadedCache.set(url, img)
      resolve(img)
    }
    img.onerror = () => {
      // Still resolve on error so the reveal isn't blocked forever
      resolve(img)
    }
  })
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

  // Preload next wallpaper proactively when current index changes
  useEffect(() => {
    const nextIndex = (index + 1) % BACKGROUNDS.length
    preloadImage(BACKGROUNDS[nextIndex])
  }, [index])

  const cycleFromPoint = useCallback(
    async (origin: RevealOrigin) => {
      if (revealing.current) return
      revealing.current = true

      const nextIndex = (index + 1) % BACKGROUNDS.length
      const nextUrl = BACKGROUNDS[nextIndex]

      // Wait for next image to be fully loaded before revealing
      await preloadImage(nextUrl)

      const W = window.innerWidth
      const H = window.innerHeight
      const radius = Math.hypot(
        Math.max(origin.x, W - origin.x),
        Math.max(origin.y, H - origin.y),
      )
      setReveal({ nextIndex, origin, radius })
    },
    [index],
  )

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
