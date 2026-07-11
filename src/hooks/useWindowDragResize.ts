import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export interface WindowRect {
  x: number
  y: number
  width: number
  height: number
}

const DEFAULT_W = 1200
const DEFAULT_H = 760
const MIN_W = 480

function centeredDefault(): WindowRect {
  return {
    x: (window.innerWidth - DEFAULT_W) / 2,
    y: (window.innerHeight - DEFAULT_H) / 2,
    width: DEFAULT_W,
    height: DEFAULT_H,
  }
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

  const onPointerMove = useCallback((e: PointerEvent) => {
    const drag = dragRef.current
    if (!drag) return

    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    const o = drag.origin

    if (drag.mode === 'move') {
      setRect({ ...o, x: o.x + dx, y: o.y + dy })
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

    if (width < MIN_W) {
      if (dir.includes('w')) x = o.x + o.width - MIN_W
      width = MIN_W
    }

    setRect({ x, y, width, height })
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
