import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import TitleBar from './TitleBar'
import HomepageApp from './HomepageApp'
import ResizeHandles from './ResizeHandles'
import { useControlledDragResize } from '../../desktop/useControlledDragResize'
import { DESKTOP_EASE, WINDOW_RADIUS } from '../../desktop/constants'
import type { DesktopWindow, WindowRect } from '../../desktop/types'
import type { NavItem } from '../../types'

interface WindowFrameProps {
  win: DesktopWindow
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onRectChange: (rect: WindowRect) => void
  onHoverChange: (hovered: boolean) => void
}

const LAYOUT_MS = 450

export default function WindowFrame({
  win,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onRectChange,
  onHoverChange,
}: WindowFrameProps) {
  const [activeNav, setActiveNav] = useState<NavItem>('about')
  const floating = win.mode === 'floating'
  const { onDragPointerDown, onResizePointerDown } = useControlledDragResize(
    win.rect,
    onRectChange,
    floating,
  )

  // Detect mode change during render (before paint) so Framer gets
  // duration > 0 on the same frame the new rect arrives — avoids the
  // race where useLayoutEffect flips layoutTween one frame too late.
  const prevMode = useRef(win.mode)
  const modeChanged = prevMode.current !== win.mode
  const [layoutTween, setLayoutTween] = useState(false)
  const sizeDuration = modeChanged || layoutTween ? LAYOUT_MS / 1000 : 0

  useLayoutEffect(() => {
    if (!modeChanged) return
    prevMode.current = win.mode
    setLayoutTween(true)
    const t = window.setTimeout(() => setLayoutTween(false), LAYOUT_MS + 30)
    return () => window.clearTimeout(t)
  }, [modeChanged, win.mode])

  return (
    <motion.div
      className="absolute flex flex-col overflow-visible pointer-events-auto"
      style={{
        zIndex: win.zIndex,
        borderRadius: WINDOW_RADIUS,
        border: win.focused
          ? '2.5px solid rgba(56, 189, 248, 0.9)'
          : '2px solid rgba(56, 189, 248, 0.55)',
        background:
          'linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06)), rgba(10,10,14,0.72)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: win.focused
          ? '0 28px 90px rgba(0,0,0,0.65), 0 0 0 1px rgba(56,189,248,0.25)'
          : '0 12px 40px rgba(0,0,0,0.4)',
      }}
      initial={{ y: 56, opacity: 0, scale: 0.96 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
        left: win.rect.x,
        top: win.rect.y,
        width: win.rect.width,
        height: win.rect.height,
      }}
      exit={{ y: 56, opacity: 0, scale: 0.98 }}
      transition={{
        y: { duration: 0.3, ease: DESKTOP_EASE },
        opacity: { duration: 0.3, ease: DESKTOP_EASE },
        scale: {
          duration: sizeDuration > 0 ? sizeDuration : 0.3,
          ease: DESKTOP_EASE,
        },
        left: { duration: sizeDuration, ease: DESKTOP_EASE },
        top: { duration: sizeDuration, ease: DESKTOP_EASE },
        width: { duration: sizeDuration, ease: DESKTOP_EASE },
        height: { duration: sizeDuration, ease: DESKTOP_EASE },
      }}
      onPointerDown={() => onFocus()}
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
    >
      <div
        className="absolute inset-0 flex flex-col overflow-hidden"
        style={{ borderRadius: WINDOW_RADIUS - 1 }}
      >
        <TitleBar
          activeNav={activeNav}
          focused={win.focused}
          onDragPointerDown={floating ? onDragPointerDown : undefined}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
        />
        <HomepageApp activeNav={activeNav} onNavChange={setActiveNav} />
      </div>

      {floating && <ResizeHandles onResizePointerDown={onResizePointerDown} />}
    </motion.div>
  )
}
