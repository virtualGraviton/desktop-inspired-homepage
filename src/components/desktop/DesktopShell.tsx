import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import WallpaperLayer from './WallpaperLayer'
import ToolBar from './ToolBar'
import Dock from './Dock'
import WindowFrame from './WindowFrame'
import { useWindowManager } from '../../desktop/useWindowManager'
import { useWallpaper } from '../../desktop/useWallpaper'
import { useAltWindowGestures } from '../../desktop/useAltWindowGestures'
import { HOMEPAGE_WINDOW_ID } from '../../desktop/constants'
import type { RevealOrigin } from '../../desktop/useWallpaper'

export default function DesktopShell() {
  const wm = useWindowManager()
  const wallpaper = useWallpaper()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

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
              onFocus={() => wm.focus(win.id)}
              onClose={() => wm.close(win.id)}
              onMinimize={() => wm.close(win.id)}
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
