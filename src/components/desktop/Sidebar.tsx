import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, FolderGit2, PenLine, ExternalLink, Mail } from 'lucide-react'
import { NAV_GROUPS, PROFILE, INK, SPACE } from '../../constants'
import type { NavItem } from '../../types'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  User,
  FolderGit2,
  PenLine,
  ExternalLink,
  Mail,
}

const SIDEBAR_FULL = 280
const SIDEBAR_COLLAPSED = 56

interface SidebarProps {
  activeNav: NavItem
  onNavChange: (item: NavItem) => void
  collapsed: boolean
  /** Mount without entrance animation (login handoff). */
  skipEnter?: boolean
}

export default function Sidebar({
  activeNav,
  onNavChange,
  collapsed,
  skipEnter = false,
}: SidebarProps) {
  /* When skipEnter, start at the target width to avoid jump */
  const initialWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL

  // After initial mount, re-enable transitions for collapse/expand
  const skipAnimRef = useRef(skipEnter)
  useEffect(() => {
    skipAnimRef.current = false
  }, [])

  return (
    <motion.aside
      layout
      className="flex flex-col shrink-0 overflow-y-auto overflow-x-hidden"
      initial={skipEnter ? { width: initialWidth } : false}
      animate={{ width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL }}
      transition={
        skipAnimRef.current
          ? { duration: 0 }
          : { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.5 }
      }
      style={{
        paddingLeft: collapsed ? 12 : SPACE.lg,
        paddingRight: collapsed ? 12 : SPACE.lg,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {/* Profile header */}
      <motion.div
        layout
        className="flex items-center pt-8 pb-6"
          style={{
            borderBottom: '1px solid var(--sidebar-divider)',
            gap: collapsed ? 0 : 12,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        transition={
          skipAnimRef.current
            ? { duration: 0 }
            : { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.5 }
        }
      >
        <div
          className="rounded-full shrink-0 overflow-hidden ring-1 ring-white/25"
          style={{ width: collapsed ? 32 : 48, height: collapsed ? 32 : 48 }}
        >
          <img
            src={PROFILE.avatar}
            alt={PROFILE.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="flex flex-col min-w-0"
              style={{ gap: SPACE.xs }}
              initial={skipEnter ? false : { opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: skipAnimRef.current ? 0 : 0.25 }}
            >
              <span
                className="font-semibold text-sm truncate"
                style={{ color: INK.primary }}
              >
                {PROFILE.name}
              </span>
              <span className="text-xs truncate" style={{ color: INK.muted }}>
                {PROFILE.title}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <nav
        className="flex flex-col flex-1 pt-6 pb-4"
        style={{
          gap: collapsed ? 4 : SPACE.lg,
        }}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-1.5 pl-3"
                  style={{
                    color: INK.faint,
                  }}
                  initial={skipEnter ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: skipAnimRef.current ? 0 : 0.2 }}
                >
                  {group.label}
                </motion.span>
              )}
            </AnimatePresence>

            {group.items.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = activeNav === item.id

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => onNavChange(item.id)}
                  data-active={isActive ? 'true' : undefined}
                  className="sidebar-nav-item flex items-center rounded-xl text-sm cursor-pointer shrink-0 relative group h-10"
                  style={{
                    paddingLeft: collapsed ? 0 : 12,
                    paddingRight: collapsed ? 0 : 12,
                    color: isActive ? INK.primary : INK.secondary,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    width: collapsed ? 32 : '100%',
                    marginLeft: collapsed ? 'auto' : 0,
                    marginRight: collapsed ? 'auto' : 0,
                    borderRadius: collapsed ? 8 : 12,
                  }}
                  initial={false}
                  whileHover={{ x: 3, transition: { type: 'spring', stiffness: 300, damping: 35 } }}
                  transition={
                    skipAnimRef.current
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 300, damping: 35 }
                  }
                >
                  {Icon && <Icon size={17} />}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        className="font-medium ml-2"
                        initial={skipEnter ? false : { opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: skipAnimRef.current ? 0 : 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip in collapsed mode */}
                  {collapsed && (
                    <span
                      className="pointer-events-none fixed z-50 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'rgba(10,10,14,0.92)',
                        color: 'rgba(244,244,245,0.95)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        transition: 'opacity 0.15s ease',
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer — hidden when collapsed */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="mt-auto font-mono text-[11px] leading-relaxed pt-4 pb-6"
            style={{
              color: INK.muted,
              borderTop: '1px solid var(--sidebar-divider)',
            }}
            initial={skipEnter ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: skipAnimRef.current ? 0 : 0.25 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block rounded-full w-[7px] h-[7px] bg-[#34d399]" />
              <span style={{ color: INK.secondary }}>Online</span>
            </div>
            <div>CN / UTC+8</div>
            <div style={{ color: INK.faint }}>homepage v0.1</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
