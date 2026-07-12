export interface WindowRect {
  x: number
  y: number
  width: number
  height: number
}

export type WindowMode = 'floating' | 'tiled'
export type AppId = 'homepage'
export type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export interface DesktopWindow {
  id: string
  appId: AppId
  title: string
  rect: WindowRect
  floatingRect: WindowRect
  zIndex: number
  focused: boolean
  closed: boolean
  mode: WindowMode
  tileNodeId?: string
}

/** Binary tile tree — reserved for multi-window splits */
export type TileNode =
  | { id: string; kind: 'leaf'; windowId: string }
  | {
      id: string
      kind: 'split'
      dir: 'horizontal' | 'vertical'
      ratio: number
      a: TileNode
      b: TileNode
    }

export interface WorkArea {
  x: number
  y: number
  width: number
  height: number
}
