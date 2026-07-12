import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginMorph from './components/login/LoginMorph'
import DesktopShell from './components/desktop/DesktopShell'
import WallpaperLayer from './components/desktop/WallpaperLayer'
import { useLoginAnimation } from './hooks/useLoginAnimation'
import { useWallpaper } from './desktop/useWallpaper'

export default function App() {
  const {
    isMorphing,
    isDesktop,
    showGlass,
    isBooting,
    isBeforeIdle,
    handleLogin,
    onWallpaperReady,
  } = useLoginAnimation()
  const wallpaper = useWallpaper()
  const preloaded = useRef(false)

  /* Preload wallpaper during boot phase, then transition to loading */
  useEffect(() => {
    if (preloaded.current) return
    preloaded.current = true

    const img = new Image()
    img.src = wallpaper.current
    img.onload = () => onWallpaperReady()
    img.onerror = () => onWallpaperReady()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (isDesktop) {
    return <DesktopShell wallpaper={wallpaper} seamlessBoot />
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Wallpaper hidden during boot, fades in during loading */}
      <div
        style={{
          opacity: isBooting ? 0 : 1,
          transition: 'opacity 0.8s ease',
        }}
      >
        <WallpaperLayer wallpaper={wallpaper} />
      </div>

      {/* Glass overlay — only during idle (login screen) */}
      <AnimatePresence>
        {showGlass && (
          <motion.div
            key="glass-overlay"
            className="absolute inset-0 z-[5] pointer-events-none"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(40px) brightness(90%)',
              WebkitBackdropFilter: 'blur(40px) brightness(90%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              backdropFilter: 'blur(0px) brightness(100%)',
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Black boot screen overlay */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            key="boot-black"
            className="absolute inset-0 z-20 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Login morph handles loading + idle + morph phases */}
      {!isBooting && (
        <LoginMorph
          isMorphing={isMorphing}
          isBeforeIdle={isBeforeIdle}
          onEnter={handleLogin}
        />
      )}
    </div>
  )
}
