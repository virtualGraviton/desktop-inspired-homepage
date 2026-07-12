import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PROFILE } from '../../constants'
import { DESKTOP_EASE, HOMEPAGE_APP } from '../../desktop/constants'

interface DockProps {
  open: boolean
  focused: boolean
  onToggle: () => void
}

const ICON = 44

export default function Dock({ open, focused, onToggle }: DockProps) {
  const [expanded, setExpanded] = useState(true)
  const leaveTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current)
    }
  }, [])

  const onEnter = () => {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current)
    setExpanded(true)
  }

  const onLeave = () => {
    leaveTimer.current = window.setTimeout(() => setExpanded(false), 900)
  }

  return (
    <motion.div
      className="fixed left-1/2 z-[60] -translate-x-1/2 pointer-events-auto"
      style={{ bottom: expanded ? 14 : 4 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={{ y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: DESKTOP_EASE, delay: 0.08 }}
    >
      <div
        className="flex items-center justify-center transition-all duration-300 overflow-visible"
        style={{
          minHeight: expanded ? 64 : 10,
          padding: expanded ? '10px 16px' : '3px 20px',
          borderRadius: 999,
          background: 'rgba(12,12,16,0.72)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
        }}
      >
        {expanded ? (
          <button
            type="button"
            onClick={onToggle}
            className="relative flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0"
            title={HOMEPAGE_APP.name}
          >
            <span
              className="block overflow-hidden rounded-[14px] ring-1 ring-white/20 transition-transform shrink-0"
              style={{
                width: ICON,
                height: ICON,
                transform: focused && open ? 'translateY(-6px)' : undefined,
              }}
            >
              <img
                src={PROFILE.avatar}
                alt={HOMEPAGE_APP.name}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </span>
            <span
              className="rounded-full shrink-0"
              style={{
                width: 4,
                height: 4,
                background: open ? '#93c5fd' : 'transparent',
              }}
            />
          </button>
        ) : (
          <div
            className="rounded-full"
            style={{
              width: 36,
              height: 4,
              background: 'rgba(255,255,255,0.35)',
            }}
          />
        )}
      </div>
    </motion.div>
  )
}
