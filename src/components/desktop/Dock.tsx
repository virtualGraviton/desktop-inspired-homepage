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
const PAD_Y = 12
const PAD_X = 18
/** Fixed slot: icon + gap under icon for the indicator (never shifts layout) */
const SLOT_H = ICON + 10
const EXPANDED_H = PAD_Y * 2 + SLOT_H
const COLLAPSED_H = 12

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
      className="fixed left-1/2 z-[60] -translate-x-1/2 pointer-events-auto bottom-3.5"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={{ y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: DESKTOP_EASE, delay: 0.08 }}
    >
      <motion.div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          background: 'var(--dock-bg)',
          backdropFilter: 'blur(18px)',
          border: '1px solid var(--dock-border)',
          boxShadow: 'var(--dock-shadow)',
        }}
        initial={false}
        animate={{
          height: expanded ? EXPANDED_H : COLLAPSED_H,
          paddingLeft: expanded ? PAD_X : 28,
          paddingRight: expanded ? PAD_X : 28,
          borderRadius: expanded ? 20 : 10,
        }}
        transition={{ duration: 0.35, ease: DESKTOP_EASE }}
      >
        {/* Collapsed peeker — true center (left 50% + translate), not inset-x + mx-auto */}
        <motion.div
          className="absolute rounded-full pointer-events-none w-8 h-[3px] -ml-4 -mt-[1.5px]"
          style={{
            left: '50%',
            top: '50%',
            background: 'var(--dock-peeker)',
          }}
          initial={false}
          animate={{ opacity: expanded ? 0 : 1 }}
          transition={{ duration: 0.2, ease: DESKTOP_EASE }}
        />

        <motion.button
          type="button"
          onClick={onToggle}
          title={HOMEPAGE_APP.name}
          className="relative flex items-start justify-center cursor-pointer bg-transparent border-0 p-0 shrink-0 w-11 h-[54px]"
          style={{
            pointerEvents: expanded ? 'auto' : 'none',
          }}
          initial={false}
          animate={{
            opacity: expanded ? 1 : 0,
            scale: expanded ? 1 : 0.85,
            y: expanded ? 0 : 8,
          }}
          transition={{ duration: 0.3, ease: DESKTOP_EASE }}
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
        >
          <span
            className="block overflow-hidden rounded-[12px] ring-1 ring-white/20 shrink-0 transition-transform duration-200 w-11 h-11"
            style={{
              transform: focused && open ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            <img
              src={PROFILE.avatar}
              alt={HOMEPAGE_APP.name}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </span>
          {/* Indicator sits in reserved slot — no layout shift when open */}
          <span
            className="absolute left-1/2 -translate-x-1/2 rounded-full transition-opacity duration-200 bottom-0 w-[5px] h-[5px] bg-[#93c5fd]"
            style={{
              opacity: open ? 1 : 0,
            }}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
