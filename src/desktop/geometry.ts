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

/** Login capsule shifted down to leave room for the clock above it.
 *  Clock (~88px) + gap (24px) + capsule (64px) = 176px total group height.
 *  Capsule top = viewport_center + 24 (because clock takes 88+24=112 above). */
export function getLoginCapsuleRect(): WindowRect {
  const w = 440
  const h = 64
  const clockArea = 112 // clock height + gap
  return {
    x: (window.innerWidth - w) / 2,
    y: (window.innerHeight - h) / 2 + clockArea / 2,
    width: w,
    height: h,
  }
}
