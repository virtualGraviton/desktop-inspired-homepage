import {
  DEFAULT_WINDOW_H,
  DEFAULT_WINDOW_W,
  TOOLBAR_RESERVED_H,
} from './constants'
import type { WindowRect } from './types'

/** Floating window rect centered in the work area below the toolbar. */
export function getCenteredFloatingRect(): WindowRect {
  const w = Math.min(DEFAULT_WINDOW_W, window.innerWidth - 80)
  const h = Math.min(
    DEFAULT_WINDOW_H,
    window.innerHeight - TOOLBAR_RESERVED_H - 80,
  )
  return {
    x: (window.innerWidth - w) / 2,
    y: TOOLBAR_RESERVED_H + (window.innerHeight - TOOLBAR_RESERVED_H - h) / 2,
    width: w,
    height: h,
  }
}

/** Login capsule centered in the full viewport (no toolbar yet). */
export function getLoginCapsuleRect(): WindowRect {
  const w = 440
  const h = 64
  return {
    x: (window.innerWidth - w) / 2,
    y: (window.innerHeight - h) / 2,
    width: w,
    height: h,
  }
}
