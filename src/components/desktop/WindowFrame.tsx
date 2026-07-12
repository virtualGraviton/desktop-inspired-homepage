import { useState } from 'react'
import TitleBar from './TitleBar'
import HomepageApp from './HomepageApp'
import ResizeHandles from './ResizeHandles'
import { useControlledDragResize } from '../../desktop/useControlledDragResize'
import { WINDOW_RADIUS } from '../../desktop/constants'
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

  return (
    <div
      className="absolute flex flex-col overflow-visible pointer-events-auto"
      style={{
        left: win.rect.x,
        top: win.rect.y,
        width: win.rect.width,
        height: win.rect.height,
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
    </div>
  )
}
