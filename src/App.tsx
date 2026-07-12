import { motion, AnimatePresence } from 'framer-motion'
import LoginMorph from './components/login/LoginMorph'
import DesktopShell from './components/desktop/DesktopShell'
import WallpaperLayer from './components/desktop/WallpaperLayer'
import { useLoginAnimation } from './hooks/useLoginAnimation'
import { useWallpaper } from './desktop/useWallpaper'

export default function App() {
  const { isMorphing, isDesktop, showGlass, handleLogin } = useLoginAnimation()
  // Lifted so login → desktop keeps the same wallpaper instance (no remount flash).
  const wallpaper = useWallpaper()

  if (isDesktop) {
    return <DesktopShell wallpaper={wallpaper} seamlessBoot />
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <WallpaperLayer wallpaper={wallpaper} />

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
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              backdropFilter: 'blur(0px) brightness(100%)',
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      <LoginMorph isMorphing={isMorphing} onEnter={handleLogin} />
    </div>
  )
}
