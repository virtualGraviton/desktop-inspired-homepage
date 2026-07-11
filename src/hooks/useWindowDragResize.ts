import { useCallback, useLayoutEffect, useEffect, useRef, useState } from 'react'

export type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export interface WindowRect {
  x: number
  y: number
  width: number
  height: number
}

const DEFAULT_W = 1200
const DEFAULT_H = 760
const MIN_W = 720
const MIN_H = 480
const MARGIN = 40

function clampRect(rect: WindowRect): WindowRect {
  const maxW = Math.max(MIN_W, window.innerWidth - MARGIN * 2)
  const maxH = Math.max(MIN_H, window.innerHeight - MARGIN * 2)
  const width = Math.min(Math.max(rect.width, MIN_W), maxW)
  const height = Math.min(Math.max(rect.height, MIN_H), maxH)
  const x = Math.min(Math.max(rect.x, MARGIN), window.innerWidth - width - MARGIN)
  const y = Math.min(
    Math.max(rect.y, MARGIN),
    window.innerHeight - height - MARGIN,
  )
  return { x, y, width, height }
}

function centeredDefault(): WindowRect {
  const width = Math.min(DEFAULT_W, window.innerWidth - MARGIN * 2)
  const height = Math.min(DEFAULT_H, window.innerHeight - MARGIN * 2)
  return clampRect({
    x: (window.innerWidth - width) / 2,
    y: (window.innerHeight - height) / 2,
    width,
    height,
  })
}

export function useWindowDragResize(enabled: boolean) {
  const [rect, setRect] = useState<WindowRect | null>(null)
  const dragRef = useRef<{
    mode: 'move' | 'resize'
    dir?: ResizeDir
    startX: number
    startY: number
    origin: WindowRect
  } | null>(null)

  useLayoutEffect(() => {
    if (enabled && !rect) {
      setRect(centeredDefault())
    }
  }, [enabled, rect])

  useEffect(() => {
    if (!enabled) return

    const onResize = () => {
      setRect((prev) => (prev ? clampRect(prev) : prev))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [enabled])

  const onPointerMove = useCallback((e: PointerEvent) => {
    const drag = dragRef.current
    if (!drag) return

    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    const o = drag.origin

    if (drag.mode === 'move') {
      setRect(clampRect({ ...o, x: o.x + dx, y: o.y + dy }))
      return
    }

    const dir = drag.dir!
    let { x, y, width, height } = o

    if (dir.includes('e')) width = o.width + dx
    if (dir.includes('s')) height = o.height + dy
    if (dir.includes('w')) {
      width = o.width - dx
      x = o.x + dx
    }
    if (dir.includes('n')) {
      height = o.height - dy
      y = o.y + dy
    }

    // Keep opposite edge anchored when hitting min size
    if (width < MIN_W) {
      if (dir.includes('w')) x = o.x + o.width - MIN_W
      width = MIN_W
    }
    if (height < MIN_H) {
      if (dir.includes('n')) y = o.y + o.height - MIN_H
      height = MIN_H
    }

    setRect(clampRect({ x, y, width, height }))
  }, [])

  const onPointerUp = useCallback(() => {
    dragRef.current = null
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }, [onPointerMove])

  const beginDrag = useCallback(
    (e: React.PointerEvent, mode: 'move' | 'resize', dir?: ResizeDir) => {
      if (!enabled || !rect) return
      if (e.button !== 0) return

      e.preventDefault()
      e.stopPropagation()

      dragRef.current = {
        mode,
        dir,
        startX: e.clientX,
        startY: e.clientY,
        origin: rect,
      }

      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    },
    [enabled, rect, onPointerMove, onPointerUp],
  )

  const onDragPointerDown = useCallback(
    (e: React.PointerEvent) => beginDrag(e, 'move'),
    [beginDrag],
  )

  const onResizePointerDown = useCallback(
    (dir: ResizeDir) => (e: React.PointerEvent) => beginDrag(e, 'resize', dir),
    [beginDrag],
  )

  return {
    rect,
    interactive: enabled && rect !== null,
    onDragPointerDown,
    onResizePointerDown,
  }
}
