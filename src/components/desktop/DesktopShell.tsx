import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import WallpaperLayer from './WallpaperLayer'
import ToolBar from './ToolBar'
import Dock from './Dock'
import WindowFrame from './WindowFrame'
import { useWindowManager } from '../../desktop/useWindowManager'
import { useAltWindowGestures } from '../../desktop/useAltWindowGestures'
import { HOMEPAGE_WINDOW_ID } from '../../desktop/constants'
import type { RevealOrigin, WallpaperApi } from '../../desktop/useWallpaper'

interface DesktopShellProps {
  wallpaper: WallpaperApi
  /** Coming from login morph — don't replay window enter animation. */
  seamlessBoot?: boolean
}

export default function DesktopShell({
  wallpaper,
  seamlessBoot = false,
}: DesktopShellProps) {
  const wm = useWindowManager()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  /** Cleared on first close so dock-reopen still gets enter anim */
  const loginHandoff = useRef(seamlessBoot)

  useAltWindowGestures({
    enabled: true,
    windows: wm.windows,
    hoveredId,
    setRect: wm.setRect,
    untileToFloating: wm.untileToFloating,
    toggleTile: wm.toggleTile,
    focus: wm.focus,
  })

  const homepage = wm.windows.find((w) => w.id === HOMEPAGE_WINDOW_ID)

  const closeWindow = (id: string) => {
    loginHandoff.current = false
    wm.close(id)
  }

  return (
    <div className="fixed inset-0 overflow-hidden" data-theme={theme}>
      <WallpaperLayer wallpaper={wallpaper} />

      <ToolBar
        theme={theme}
        onToggleTheme={() =>
          setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
        }
        onCycleWallpaper={(origin: RevealOrigin) =>
          wallpaper.cycleFromPoint(origin)
        }
      />

      <div className="fixed inset-0 z-10 pointer-events-none">
        <AnimatePresence>
          {wm.openWindows.map((win) => (
            <WindowFrame
              key={win.id}
              win={win}
              skipEnter={
                loginHandoff.current && win.id === HOMEPAGE_WINDOW_ID
              }
              onFocus={() => wm.focus(win.id)}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => closeWindow(win.id)}
              onMaximize={() => wm.toggleTile(win.id)}
              onRectChange={(rect) => wm.setRect(win.id, rect)}
              onHoverChange={(hovered) =>
                setHoveredId(hovered ? win.id : null)
              }
            />
          ))}
        </AnimatePresence>
      </div>

      <Dock
        open={Boolean(homepage && !homepage.closed)}
        focused={Boolean(homepage?.focused && !homepage?.closed)}
        onToggle={wm.toggleOrFocusHomepage}
      />
    </div>
  )
}
