import { motion } from 'framer-motion'
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

interface SidebarProps {
  activeNav: NavItem
  onNavChange: (item: NavItem) => void
}

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside
      className="flex flex-col shrink-0 overflow-y-auto"
      style={{
        width: 280,
        paddingLeft: SPACE.lg,
        paddingRight: SPACE.lg,
        background: 'rgba(0,0,0,0.18)',
        borderRight: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <div
        className="flex items-center gap-3"
        style={{
          paddingTop: SPACE.xl,
          paddingBottom: SPACE.lg,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="rounded-full shrink-0 overflow-hidden ring-1 ring-white/25"
          style={{ width: 48, height: 48 }}
        >
          <img
            src={PROFILE.avatar}
            alt={PROFILE.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <div className="flex flex-col min-w-0" style={{ gap: SPACE.xs }}>
          <span
            className="font-semibold text-sm truncate"
            style={{ color: INK.primary }}
          >
            {PROFILE.name}
          </span>
          <span className="text-xs truncate" style={{ color: INK.muted }}>
            {PROFILE.title}
          </span>
        </div>
      </div>

      <nav
        className="flex flex-col flex-1"
        style={{
          paddingTop: SPACE.lg,
          paddingBottom: SPACE.md,
          gap: SPACE.lg,
        }}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col" style={{ gap: 4 }}>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{
                color: INK.faint,
                marginBottom: 6,
                paddingLeft: 12,
              }}
            >
              {group.label}
            </span>
            {group.items.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = activeNav === item.id
              const activeBg = 'rgba(255,255,255,0.12)'
              const idleBg = 'rgba(255,255,255,0)'
              const hoverBg = 'rgba(255,255,255,0.06)'

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavChange(item.id)}
                  className="flex items-center gap-3 rounded-xl text-sm cursor-pointer w-full text-left"
                  style={{
                    height: 40,
                    paddingLeft: 12,
                    paddingRight: 12,
                    color: isActive ? INK.primary : INK.secondary,
                  }}
                  // Framer must own backgroundColor via animate; mixing style.background
                  // with whileHover.backgroundColor leaves a stale inline value after hover.
                  initial={false}
                  animate={{
                    backgroundColor: isActive ? activeBg : idleBg,
                    x: 0,
                  }}
                  whileHover={{
                    x: 3,
                    backgroundColor: isActive ? activeBg : hoverBg,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  {Icon && <Icon size={17} />}
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              )
            })}
          </div>
        ))}
      </nav>

      <div
        className="mt-auto font-mono text-[11px] leading-relaxed"
        style={{
          color: INK.muted,
          paddingTop: SPACE.md,
          paddingBottom: SPACE.lg,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="flex items-center gap-2"
          style={{ marginBottom: SPACE.sm }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: 7, height: 7, background: '#34d399' }}
          />
          <span style={{ color: INK.secondary }}>Online</span>
        </div>
        <div>CN · UTC+8</div>
        <div style={{ color: INK.faint }}>homepage v0.1</div>
      </div>
    </aside>
  )
}
