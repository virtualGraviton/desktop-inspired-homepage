import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PROFILE } from '../../constants'
import { useTypewriter } from '../../hooks/useTypewriter'
import TitleBar from '../desktop/TitleBar'
import HomepageApp from '../desktop/HomepageApp'
import { WINDOW_RADIUS } from '../../desktop/constants'
import {
  getCenteredFloatingRect,
  getLoginCapsuleRect,
} from '../../desktop/geometry'
import type { WindowRect } from '../../desktop/types'
import type { NavItem } from '../../types'

/* ------------------------------------------------------------------ */
/* Spinner ring — SVG arc circling the avatar during loading          */
/* ------------------------------------------------------------------ */
function SpinnerRing() {
  return (
    <svg
      className="absolute inset-0"
      viewBox="0 0 80 80"
      style={{ animation: 'spin 1.2s linear infinite' }}
    >
      <circle
        cx={40}
        cy={40}
        r={36}
        fill="none"
        stroke="rgba(56,189,248,0.5)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="180 46"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
interface LoginMorphProps {
  isMorphing: boolean
  isBeforeIdle: boolean
  onEnter: () => void
}

const LOAD_CIRCLE = 80 // loading circle diameter

export default function LoginMorph({
  isMorphing,
  isBeforeIdle,
  onEnter,
}: LoginMorphProps) {
  const [activeNav, setActiveNav] = useState<NavItem>('about')
  const [capsule, setCapsule] = useState<WindowRect>(() => getLoginCapsuleRect())
  const [target, setTarget] = useState<WindowRect>(() =>
    getCenteredFloatingRect(),
  )

  /* Recalculate positions on window resize */
  useEffect(() => {
    const onResize = () => {
      setCapsule(getLoginCapsuleRect())
      if (isMorphing) setTarget(getCenteredFloatingRect())
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isMorphing])
  const [now, setNow] = useState(() => new Date())

  /* Live clock */
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])

  /* Position ------------------------------------------------------- */
  const morphRect = isMorphing ? target : capsule

  // Loading: centered circle
  const loadX = (window.innerWidth - LOAD_CIRCLE) / 2
  const loadY = (window.innerHeight - LOAD_CIRCLE) / 2

  // Decide current rect for the container
  const containerRect = isMorphing
    ? morphRect
    : isBeforeIdle
      ? { x: loadX, y: loadY, width: LOAD_CIRCLE, height: LOAD_CIRCLE }
      : capsule

  const isCapsule = !isMorphing && !isBeforeIdle

  /* Typewriter — only start when idle (not during loading morph) */
  const { displayed, isDone } = useTypewriter(
    isCapsule ? PROFILE.name : '',
    80,
    isCapsule ? 500 : 0,
  )

  /* Blinking cursor */
  const cursorVisible = useRef(true)
  useEffect(() => {
    if (!isDone) {
      cursorVisible.current = true
      return
    }
    const interval = window.setInterval(() => {
      cursorVisible.current = !cursorVisible.current
      const el = document.querySelector(
        '[data-typewriter-cursor]',
      ) as HTMLElement | null
      if (el) el.style.opacity = cursorVisible.current ? '1' : '0'
    }, 530)
    return () => window.clearInterval(interval)
  }, [isDone])

  /* Clock strings */
  const timeStr = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const dateStr = now.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {/* Date / Time — only during idle (login) */}
      <AnimatePresence>
        {isCapsule && (
          <motion.div
            key="login-clock"
            className="absolute left-0 w-full text-center pointer-events-none"
            style={{ top: capsule.y - 112 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="font-bold tracking-tight leading-none text-[56px] mb-2"
              style={{
                color: 'rgba(255,255,255,0.92)',
                textShadow: '0 2px 16px rgba(0,0,0,0.35)',
              }}
            >
              {timeStr}
            </div>
            <div
              className="text-lg font-medium"
              style={{
                color: 'rgba(255,255,255,0.6)',
                textShadow: '0 1px 8px rgba(0,0,0,0.3)',
              }}
            >
              {dateStr}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main morphing container */}
      <motion.div
        className="absolute flex flex-col border overflow-hidden pointer-events-auto"
        style={{
          background:
            'linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06)), rgba(10,10,14,0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderColor: 'rgba(56,189,248,0.9)',
          borderWidth: 2.5,
        }}
        initial={false}
        animate={{
          left: containerRect.x,
          top: containerRect.y,
          width: containerRect.width,
          height: containerRect.height,
          borderRadius: isBeforeIdle ? LOAD_CIRCLE / 2 : isMorphing ? WINDOW_RADIUS : 999,
          paddingLeft: isBeforeIdle ? 0 : isMorphing ? 0 : 14,
          paddingRight: isBeforeIdle ? 0 : isMorphing ? 0 : 14,
          boxShadow: isMorphing
            ? '0 28px 90px rgba(0,0,0,0.65), 0 0 0 1px rgba(56,189,248,0.25)'
            : isBeforeIdle
              ? '0 0 30px rgba(56,189,248,0.2)'
              : '0 4px 16px rgba(0,0,0,0.25)',
        }}
        transition={{
          type: 'tween',
          ease: [0.16, 1, 0.3, 1],
          duration: isBeforeIdle ? 0.6 : 0.5,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {!isMorphing ? (
            <motion.div
              key="login-content"
              className="h-full w-full flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3 }}
            >
              {/* Loading ring */}
              {isBeforeIdle && <SpinnerRing />}

              {/* Avatar */}
              <motion.div
                className="rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 z-10"
                layout
                animate={
                  isBeforeIdle
                    ? { width: 40, height: 40 }
                    : { width: 40, height: 40 }
                }
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={PROFILE.avatar}
                  alt={PROFILE.name}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </motion.div>

              {/* Name + Button — only in capsule state */}
              {isCapsule && (
                <motion.div
                  className="flex items-center w-full ml-3.5 gap-3.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  <span
                    className="min-w-0 flex-1 text-white text-center truncate text-lg leading-6 font-medium"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {displayed}
                    <span
                      data-typewriter-cursor
                      className="inline-block align-baseline relative w-[9px] h-0.5 ml-0.5 opacity-100"
                      style={{
                        top: 3,
                        background: 'rgba(255,255,255,0.7)',
                      }}
                    />
                  </span>

                  <motion.button
                    onClick={onEnter}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors cursor-pointer shrink-0"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Enter"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                  >
                    <ArrowRight size={18} />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="desktop-preview"
              className="absolute inset-0 flex flex-col overflow-hidden"
              style={{ borderRadius: WINDOW_RADIUS - 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, delay: 0.08 }}
            >
              <TitleBar activeNav={activeNav} focused />
              <HomepageApp activeNav={activeNav} onNavChange={setActiveNav} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
