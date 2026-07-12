import { TILE_GAP } from './constants'
import type { TileNode, WindowRect, WorkArea } from './types'

export function insetRect(rect: WindowRect, gap = TILE_GAP): WindowRect {
  return {
    x: rect.x + gap,
    y: rect.y + gap,
    width: Math.max(0, rect.width - gap * 2),
    height: Math.max(0, rect.height - gap * 2),
  }
}

export function getWorkArea(
  vw = typeof window !== 'undefined' ? window.innerWidth : 1920,
  vh = typeof window !== 'undefined' ? window.innerHeight : 1080,
  topReserved = 52,
): WorkArea {
  return {
    x: 0,
    y: topReserved,
    width: vw,
    height: Math.max(0, vh - topReserved),
  }
}

/** Layout leaf rects from a tile tree within workArea (before per-leaf inset). */
export function layoutTileTree(
  node: TileNode,
  area: WindowRect,
): Map<string, WindowRect> {
  const map = new Map<string, WindowRect>()

  function walk(n: TileNode, a: WindowRect) {
    if (n.kind === 'leaf') {
      map.set(n.windowId, insetRect(a))
      return
    }
    if (n.dir === 'vertical') {
      const leftW = a.width * n.ratio
      walk(n.a, { x: a.x, y: a.y, width: leftW, height: a.height })
      walk(n.b, {
        x: a.x + leftW,
        y: a.y,
        width: a.width - leftW,
        height: a.height,
      })
    } else {
      const topH = a.height * n.ratio
      walk(n.a, { x: a.x, y: a.y, width: a.width, height: topH })
      walk(n.b, {
        x: a.x,
        y: a.y + topH,
        width: a.width,
        height: a.height - topH,
      })
    }
  }

  walk(node, area)
  return map
}

export function createRootLeaf(windowId: string): TileNode {
  return { id: 'tile-root', kind: 'leaf', windowId }
}

/** Split a leaf 50/50 for a new window (API reserved; unused in single-window phase). */
export function splitLeaf(
  root: TileNode,
  targetWindowId: string,
  newWindowId: string,
  dir: 'horizontal' | 'vertical' = 'vertical',
): TileNode {
  function walk(n: TileNode): TileNode {
    if (n.kind === 'leaf') {
      if (n.windowId !== targetWindowId) return n
      return {
        id: `split-${n.id}-${newWindowId}`,
        kind: 'split',
        dir,
        ratio: 0.5,
        a: n,
        b: { id: `leaf-${newWindowId}`, kind: 'leaf', windowId: newWindowId },
      }
    }
    return { ...n, a: walk(n.a), b: walk(n.b) }
  }
  return walk(root)
}
