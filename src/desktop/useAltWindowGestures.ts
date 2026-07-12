import { useEffect, useRef } from 'react'
import { MIN_WINDOW_H, MIN_WINDOW_W } from './constants'
import type { DesktopWindow, WindowRect } from './types'

interface AltGesturesOpts {
  enabled: boolean
  windows: DesktopWindow[]
  hoveredId: string | null
  setRect: (id: string, rect: WindowRect) => void
  untileToFloating: (id: string) => void
  toggleTile: (id: string) => void
  focus: (id: string) => void
}

/**
 * Alt+LMB: drag hovered window
 * Alt+RMB: resize by displacement vector (not path)
 * Alt+T: toggle tile on focused (or hovered) window
 */
export function useAltWindowGestures({
  enabled,
  windows,
  hoveredId,
  setRect,
  untileToFloating,
  toggleTile,
  focus,
}: AltGesturesOpts) {
  const gesture = useRef<{
    mode: 'move' | 'resize'
    id: string
    startX: number
    startY: number
    origin: WindowRect
  } | null>(null)

  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return
      if (e.code === 'KeyT' && !e.repeat) {
        e.preventDefault()
        const id =
          hoveredId ??
          windows.find((w) => w.focused && !w.closed)?.id ??
          null
        if (id) toggleTile(id)
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!e.altKey) return
      if (e.button !== 0 && e.button !== 2) return

      const id = hoveredId
      if (!id) return
      const win = windows.find((w) => w.id === id && !w.closed)
      if (!win) return

      e.preventDefault()
      untileToFloating(id)
      focus(id)

      // Re-read after untile — use current rect
      const origin = { ...win.rect }
      gesture.current = {
        mode: e.button === 0 ? 'move' : 'resize',
        id,
        startX: e.clientX,
        startY: e.clientY,
        origin,
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const g = gesture.current
      if (!g) return

      const dx = e.clientX - g.startX
      const dy = e.clientY - g.startY
      const o = g.origin

      if (g.mode === 'move') {
        setRect(g.id, { ...o, x: o.x + dx, y: o.y + dy })
        return
      }

      // Displacement-based resize: expand/shrink by dx/dy on corresponding edges
      let x = o.x
      let y = o.y
      let width: number
      let height: number
      if (dx >= 0) {
        width = o.width + dx
      } else {
        width = o.width - dx
        x = o.x + dx
      }
      if (dy >= 0) {
        height = o.height + dy
      } else {
        height = o.height - dy
        y = o.y + dy
      }

      if (width < MIN_WINDOW_W) {
        if (dx < 0) x = o.x + o.width - MIN_WINDOW_W
        width = MIN_WINDOW_W
      }
      if (height < MIN_WINDOW_H) {
        if (dy < 0) y = o.y + o.height - MIN_WINDOW_H
        height = MIN_WINDOW_H
      }

      setRect(g.id, { x, y, width, height })
    }

    const onPointerUp = () => {
      gesture.current = null
    }

    const onContextMenu = (e: MouseEvent) => {
      if (e.altKey) e.preventDefault()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('contextmenu', onContextMenu)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('contextmenu', onContextMenu)
    }
  }, [
    enabled,
    windows,
    hoveredId,
    setRect,
    untileToFloating,
    toggleTile,
    focus,
  ])
}
