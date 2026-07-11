import { motion } from 'framer-motion'
import { ArrowRight, User } from 'lucide-react'
import { PROFILE } from '../../constants'
import type { AnimationPhase } from '../../types'

interface LoginCapsuleProps {
  phase: AnimationPhase
  onEnter: () => void
}

export default function LoginCapsule({ phase, onEnter }: LoginCapsuleProps) {
  const isMorphing = phase === 'morphContent' || phase === 'expandWindow'

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <motion.div
        layout
        className="flex items-center justify-between px-8 overflow-hidden border shadow-2xl"
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: 'rgba(255,255,255,0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
        animate={
          isMorphing
            ? { width: 1200, height: 760, borderRadius: 32 }
            : { width: 680, height: 92, borderRadius: 999 }
        }
        transition={{
          type: 'tween',
          ease: [0.16, 1, 0.3, 1],
          duration: 0.5,
        }}
      >
        {/* Avatar */}
        <motion.div
          className="flex items-center justify-center rounded-full bg-white/10 shrink-0"
          animate={
            isMorphing
              ? { width: 72, height: 72 }
              : { width: 64, height: 64 }
          }
          transition={{ duration: 0.4 }}
        >
          <User
            size={isMorphing ? 36 : 32}
            className="text-white/70"
          />
        </motion.div>

        {/* Name & Title */}
        <motion.div
          className="flex flex-col ml-5"
          animate={isMorphing ? { x: -40 } : { x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.span
            className="font-semibold text-white leading-tight"
            animate={isMorphing ? { fontSize: 24 } : { fontSize: 20 }}
            transition={{ duration: 0.4 }}
          >
            {PROFILE.name}
          </motion.span>
          <motion.span
            className="text-white/50 leading-tight"
            animate={isMorphing ? { fontSize: 14 } : { fontSize: 13 }}
            transition={{ duration: 0.4 }}
          >
            {PROFILE.title}
          </motion.span>
        </motion.div>

        {/* Login Button */}
        {!isMorphing && (
          <motion.button
            onClick={onEnter}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 text-white/90 text-sm font-medium border border-white/15 hover:bg-white/25 transition-colors cursor-pointer ml-auto shrink-0"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Enter</span>
            <ArrowRight size={16} />
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
