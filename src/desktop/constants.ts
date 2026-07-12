export const TOOLBAR_RESERVED_H = 52
export const TILE_GAP = 10
export const DEFAULT_WINDOW_W = 1200
export const DEFAULT_WINDOW_H = 760
export const MIN_WINDOW_W = 480
export const MIN_WINDOW_H = 200
export const WINDOW_RADIUS = 12
export const HOMEPAGE_WINDOW_ID = 'win-homepage'
export const HOMEPAGE_APP = {
  id: 'homepage' as const,
  name: 'Homepage',
}

/** Shared motion easing: cubic-bezier(0.25, 0.10, 0.25, 1.00) */
export const DESKTOP_EASE = [0.25, 0.1, 0.25, 1] as const
