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

interface LoginMorphProps {
  isMorphing: boolean
  onEnter: () => void
}

/** Login capsule → expand with real chrome; DesktopShell takes over without a second enter anim. */
export default function LoginMorph({ isMorphing, onEnter }: LoginMorphProps) {
  const [activeNav, setActiveNav] = useState<NavItem>('about')
  const [capsule] = useState<WindowRect>(() => getLoginCapsuleRect())
  const [target, setTarget] = useState<WindowRect>(() =>
    getCenteredFloatingRect(),
  )
  const [now, setNow] = useState(() => new Date())

  /* Live clock */
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    if (!isMorphing) return
    setTarget(getCenteredFloatingRect())
  }, [isMorphing])

  const rect = isMorphing ? target : capsule

  const { displayed, isDone } = useTypewriter(PROFILE.name, 80, 500)
  const cursorVisible = useRef(true)

  /* Blinking cursor (CSS animation via data attribute) */
  useEffect(() => {
    if (!isDone) {
      cursorVisible.current = true
      return
    }
    const interval = window.setInterval(() => {
      cursorVisible.current = !cursorVisible.current
      // Force re-render via a tiny state toggle
      const el = document.querySelector('[data-typewriter-cursor]') as HTMLElement | null
      if (el) el.style.opacity = cursorVisible.current ? '1' : '0'
    }, 530)
    return () => window.clearInterval(interval)
  }, [isDone])

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
      {/* Date / Time — fades out when capsule morphs */}
      <AnimatePresence>
        {!isMorphing && (
          <motion.div
            key="login-clock"
            className="absolute left-0 w-full text-center pointer-events-none"
            style={{
              top: rect.y - 112,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="font-bold tracking-tight leading-none"
              style={{
                fontSize: 56,
                color: 'rgba(255,255,255,0.92)',
                textShadow: '0 2px 16px rgba(0,0,0,0.35)',
                marginBottom: 8,
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

      <motion.div
        className="absolute flex flex-col border overflow-hidden pointer-events-auto"
        style={{
          background:
            'linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06)), rgba(10,10,14,0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderColor: 'rgba(56,189,248,0.9)',
          borderWidth: 2.5,
          boxShadow: '0 25px 80px rgba(0,0,0,0.45)',
        }}
        initial={false}
        animate={{
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
          borderRadius: isMorphing ? WINDOW_RADIUS : 999,
          paddingLeft: isMorphing ? 0 : 14,
          paddingRight: isMorphing ? 0 : 14,
        }}
        transition={{
          type: 'tween',
          ease: [0.16, 1, 0.3, 1],
          duration: 0.5,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {!isMorphing ? (
            <motion.div
              key="login-chrome"
              className="grid h-full w-full items-center"
              style={{
                gridTemplateColumns: '40px minmax(0, 1fr) 40px',
                columnGap: 14,
              }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <div className="h-10 w-10 justify-self-start rounded-full overflow-hidden ring-1 ring-white/20">
                <img
                  src={PROFILE.avatar}
                  alt={PROFILE.name}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>

              <span
                className="min-w-0 text-white text-center truncate"
                style={{ fontSize: 18, lineHeight: '24px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
              >
                {displayed}
                <span
                  data-typewriter-cursor
                  className="inline-block align-baseline relative"
                  style={{
                    width: 9,
                    height: 2,
                    marginLeft: 2,
                    top: 3,
                    background: 'rgba(255,255,255,0.7)',
                    opacity: 1,
                  }}
                />
              </span>

              <motion.button
                onClick={onEnter}
                className="flex h-10 w-10 items-center justify-center justify-self-end rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors cursor-pointer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Enter"
              >
                <ArrowRight size={18} />
              </motion.button>
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
