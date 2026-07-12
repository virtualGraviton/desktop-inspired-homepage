import { useCallback, useRef } from 'react'
import { MIN_WINDOW_H, MIN_WINDOW_W } from './constants'
import type { ResizeDir, WindowRect } from './types'

export function useControlledDragResize(
  rect: WindowRect | null,
  onRectChange: (rect: WindowRect) => void,
  enabled: boolean,
) {
  const dragRef = useRef<{
    mode: 'move' | 'resize'
    dir?: ResizeDir
    startX: number
    startY: number
    origin: WindowRect
  } | null>(null)

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return

      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      const o = drag.origin

      if (drag.mode === 'move') {
        onRectChange({ ...o, x: o.x + dx, y: o.y + dy })
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

      if (width < MIN_WINDOW_W) {
        if (dir.includes('w')) x = o.x + o.width - MIN_WINDOW_W
        width = MIN_WINDOW_W
      }
      if (height < MIN_WINDOW_H) {
        if (dir.includes('n')) y = o.y + o.height - MIN_WINDOW_H
        height = MIN_WINDOW_H
      }

      onRectChange({ x, y, width, height })
    },
    [onRectChange],
  )

  const onPointerUp = useCallback(() => {
    dragRef.current = null
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }, [onPointerMove])

  const beginDrag = useCallback(
    (e: React.PointerEvent, mode: 'move' | 'resize', dir?: ResizeDir) => {
      if (!enabled || !rect) return
      if (e.button !== 0 && mode === 'move') return
      if (mode === 'resize' && e.button !== 0) return

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
    onDragPointerDown,
    onResizePointerDown,
    beginDrag,
  }
}
