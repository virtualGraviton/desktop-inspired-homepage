import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PROFILE } from '../constants'
import TitleBar from './desktop/TitleBar'
import Sidebar from './desktop/Sidebar'
import ContentArea from './desktop/ContentArea'
import ResizeHandles from './desktop/ResizeHandles'
import { useWindowDragResize } from '../hooks/useWindowDragResize'
import type { NavItem } from '../types'

interface MorphWindowProps {
  isMorphing: boolean
  isDesktop: boolean
  onEnter: () => void
}

export default function MorphWindow({
  isMorphing,
  isDesktop,
  onEnter,
}: MorphWindowProps) {
  const [activeNav, setActiveNav] = useState<NavItem>('about')
  const { rect, interactive, onDragPointerDown, onResizePointerDown } =
    useWindowDragResize(isDesktop)

  return (
    <div
      className={
        interactive
          ? 'fixed inset-0 z-10 pointer-events-none'
          : 'fixed inset-0 z-10 flex items-center justify-center pointer-events-none'
      }
    >
      <motion.div
        className={
          interactive
            ? 'absolute flex flex-col border overflow-hidden pointer-events-auto'
            : 'relative flex flex-col border overflow-hidden pointer-events-auto max-w-[calc(100vw-80px)] max-h-[calc(100vh-80px)]'
        }
        style={{
          background:
            'linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06)), rgba(10,10,14,0.62)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderColor: 'rgba(255,255,255,0.18)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.45)',
          ...(interactive && rect
            ? {
                left: rect.x,
                top: rect.y,
                width: rect.width,
                height: rect.height,
              }
            : null),
        }}
        initial={false}
        animate={
          interactive
            ? { borderRadius: 32, paddingLeft: 0, paddingRight: 0 }
            : isMorphing
              ? {
                  width: 1200,
                  height: 760,
                  borderRadius: 32,
                  paddingLeft: 0,
                  paddingRight: 0,
                }
              : {
                  width: 440,
                  height: 64,
                  borderRadius: 999,
                  paddingLeft: 14,
                  paddingRight: 14,
                }
        }
        transition={
          interactive
            ? { duration: 0 }
            : {
                type: 'tween',
                ease: [0.16, 1, 0.3, 1],
                duration: 0.5,
              }
        }
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
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
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
                className="min-w-0 font-semibold text-white text-center truncate"
                style={{ fontSize: 18, lineHeight: '24px' }}
              >
                {PROFILE.name}
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
              key="desktop-chrome"
              className="absolute inset-0 flex flex-col overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.12 }}
            >
              <TitleBar
                activeNav={activeNav}
                onDragPointerDown={
                  interactive ? onDragPointerDown : undefined
                }
              />
              <div className="flex flex-1 overflow-hidden min-h-0">
                <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
                <ContentArea activeNav={activeNav} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {interactive && (
          <ResizeHandles onResizePointerDown={onResizePointerDown} />
        )}
      </motion.div>
    </div>
  )
}
