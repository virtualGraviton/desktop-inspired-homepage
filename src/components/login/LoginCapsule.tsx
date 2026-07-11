import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
        className="grid items-center border shadow-xl overflow-hidden"
        style={{
          gridTemplateColumns: 'auto 1fr auto',
          gap: 12,
          padding: '0 16px',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderColor: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
        animate={
          isMorphing
            ? { width: 1200, height: 760, borderRadius: 32 }
            : { width: 420, height: 64, borderRadius: 999 }
        }
        transition={{
          type: 'tween',
          ease: [0.16, 1, 0.3, 1],
          duration: 0.5,
        }}
      >
        {/* Avatar — col 1, auto width */}
        <motion.div
          className="rounded-full shrink-0 overflow-hidden ring-1 ring-white/20"
          animate={
            isMorphing ? { width: 72, height: 72 } : { width: 40, height: 40 }
          }
          transition={{ duration: 0.4 }}
        >
          <img
            src={PROFILE.avatar}
            alt={PROFILE.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </motion.div>

        {/* Name — col 2, 1fr, truly centered */}
        <motion.span
          className="font-semibold text-white leading-none text-center"
          animate={isMorphing ? { fontSize: 24 } : { fontSize: 16 }}
          transition={{ duration: 0.4 }}
        >
          {PROFILE.name}
        </motion.span>

        {/* Login Button — col 3, auto width */}
        {!isMorphing && (
          <motion.button
            onClick={onEnter}
            className="flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors cursor-pointer shrink-0"
            style={{ width: 40, height: 40 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight size={18} />
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
