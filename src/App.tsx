import { motion, AnimatePresence } from 'framer-motion'
import BackgroundSlideshow from './components/login/BackgroundSlideshow'
import MorphWindow from './components/MorphWindow'
import { useLoginAnimation } from './hooks/useLoginAnimation'

export default function App() {
  const { phase, isMorphing, showGlass, handleLogin } = useLoginAnimation()

  return (
    <div className="fixed inset-0 overflow-hidden">
      <BackgroundSlideshow showSwitcher />

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
            animate={
              phase === 'fadeGlass'
                ? { opacity: 0, backdropFilter: 'blur(0px) brightness(100%)' }
                : { opacity: 1, backdropFilter: 'blur(40px) brightness(90%)' }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <MorphWindow isMorphing={isMorphing} onEnter={handleLogin} />
    </div>
  )
}
