import { useCallback, useMemo, useRef, useState } from 'react'
import { HOMEPAGE_WINDOW_ID, TOOLBAR_RESERVED_H } from './constants'
import { getCenteredFloatingRect } from './geometry'
import { createRootLeaf, getWorkArea, insetRect, layoutTileTree } from './tileLayout'
import type { DesktopWindow, TileNode, WindowRect } from './types'

function createHomepageWindow(): DesktopWindow {
  const rect = getCenteredFloatingRect()
  return {
    id: HOMEPAGE_WINDOW_ID,
    appId: 'homepage',
    title: 'Homepage',
    rect,
    floatingRect: rect,
    zIndex: 10,
    focused: true,
    closed: false,
    mode: 'floating',
    tileNodeId: 'tile-root',
  }
}

export function useWindowManager() {
  const zCounter = useRef(10)
  const [windows, setWindows] = useState<DesktopWindow[]>(() => [
    createHomepageWindow(),
  ])
  const [tileTree, setTileTree] = useState<TileNode>(() =>
    createRootLeaf(HOMEPAGE_WINDOW_ID),
  )

  const openWindows = useMemo(
    () => windows.filter((w) => !w.closed),
    [windows],
  )

  const focus = useCallback((id: string) => {
    zCounter.current += 1
    const z = zCounter.current
    setWindows((prev) =>
      prev.map((w) => ({
        ...w,
        focused: w.id === id,
        zIndex: w.id === id ? z : w.zIndex,
      })),
    )
  }, [])

  const close = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, closed: true, focused: false } : w,
      ),
    )
  }, [])

  const reopen = useCallback((id: string) => {
    zCounter.current += 1
    const z = zCounter.current
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return { ...w, focused: false }
        return {
          ...w,
          closed: false,
          focused: true,
          zIndex: z,
          mode: 'floating',
          rect: w.floatingRect,
        }
      }),
    )
  }, [])

  const toggleOrFocusHomepage = useCallback(() => {
    const win = windows.find((w) => w.id === HOMEPAGE_WINDOW_ID)
    if (!win) return
    if (win.closed) reopen(HOMEPAGE_WINDOW_ID)
    else focus(HOMEPAGE_WINDOW_ID)
  }, [windows, reopen, focus])

  const setRect = useCallback((id: string, rect: WindowRect) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        if (w.mode === 'tiled') {
          return {
            ...w,
            mode: 'floating',
            rect,
            floatingRect: rect,
          }
        }
        return { ...w, rect, floatingRect: rect }
      }),
    )
  }, [])

  const applyTiledLayout = useCallback(
    (tree: TileNode, list: DesktopWindow[]) => {
      const wa = getWorkArea(
        window.innerWidth,
        window.innerHeight,
        TOOLBAR_RESERVED_H,
      )
      const layouts = layoutTileTree(tree, wa)
      return list.map((w) => {
        if (w.closed || w.mode !== 'tiled') return w
        const next = layouts.get(w.id)
        return next ? { ...w, rect: next } : w
      })
    },
    [],
  )

  const toggleTile = useCallback((id: string) => {
    setWindows((prev) => {
      const target = prev.find((w) => w.id === id)
      if (!target || target.closed) return prev

      if (target.mode === 'tiled') {
        return prev.map((w) =>
          w.id === id
            ? {
                ...w,
                mode: 'floating',
                rect: w.floatingRect,
              }
            : w,
        )
      }

      const next = prev.map((w) =>
        w.id === id
          ? {
              ...w,
              mode: 'tiled' as const,
              floatingRect: w.rect,
              tileNodeId: 'tile-root',
            }
          : w,
      )
      return applyTiledLayout(tileTree, next)
    })
  }, [applyTiledLayout, tileTree])

  const untileToFloating = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id && w.mode === 'tiled'
          ? { ...w, mode: 'floating', floatingRect: w.rect }
          : w,
      ),
    )
  }, [])

  /** Reserved API for future multi-window splits */
  const splitAndTile = useCallback(
    (_targetId: string, _newWindowId: string) => {
      // Single-window phase: no-op entry point kept for API completeness
      void _targetId
      void _newWindowId
      void setTileTree
    },
    [],
  )

  const maximizeTiledRect = useCallback((): WindowRect => {
    return insetRect(
      getWorkArea(window.innerWidth, window.innerHeight, TOOLBAR_RESERVED_H),
    )
  }, [])

  return {
    windows,
    openWindows,
    tileTree,
    focus,
    close,
    reopen,
    toggleOrFocusHomepage,
    setRect,
    toggleTile,
    untileToFloating,
    splitAndTile,
    maximizeTiledRect,
  }
}

export type WindowManager = ReturnType<typeof useWindowManager>
