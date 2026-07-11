import { motion, AnimatePresence } from 'framer-motion'
import BackgroundSlideshow from './BackgroundSlideshow'
import LoginCapsule from './LoginCapsule'
import type { AnimationPhase } from '../../types'

interface LoginScreenProps {
  phase: AnimationPhase
  onEnter: () => void
}

export default function LoginScreen({ phase, onEnter }: LoginScreenProps) {
  const showGlass = phase === 'idle' || phase === 'fadeGlass'

  return (
    <AnimatePresence>
      {showGlass && (
        <motion.div
          key="login-screen"
          className="fixed inset-0 z-10"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Background */}
          <BackgroundSlideshow />

          {/* Glass overlay */}
          <motion.div
            className="absolute inset-0 z-[5]"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(40px) brightness(90%)',
              WebkitBackdropFilter: 'blur(40px) brightness(90%)',
            }}
            animate={
              phase === 'fadeGlass'
                ? { opacity: 0, backdropFilter: 'blur(0px) brightness(100%)' }
                : { opacity: 1, backdropFilter: 'blur(40px) brightness(90%)' }
            }
            transition={{ duration: 0.3 }}
          />

          {/* Capsule */}
          <LoginCapsule phase={phase} onEnter={onEnter} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
