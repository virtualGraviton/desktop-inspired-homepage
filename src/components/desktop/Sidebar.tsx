import { motion } from 'framer-motion'
import { User, FolderGit2, PenLine, ExternalLink, Mail } from 'lucide-react'
import { NAV_ITEMS, PROFILE } from '../../constants'
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
    <div
      className="flex flex-col shrink-0 overflow-y-auto"
      style={{
        width: 280,
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Profile header */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div
          className="rounded-full shrink-0 overflow-hidden ring-1 ring-white/15"
          style={{ width: 48, height: 48 }}
        >
          <img
            src={PROFILE.avatar}
            alt={PROFILE.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-white font-semibold text-sm truncate">
            {PROFILE.name}
          </span>
          <span className="text-white/40 text-xs">{PROFILE.title}</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col px-3 pb-4">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = activeNav === item.id

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm cursor-pointer w-full text-left"
              style={{
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
              }}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {Icon && <Icon size={18} />}
              <span className="font-medium">{item.label}</span>
            </motion.button>
          )
        })}
      </nav>
    </div>
  )
}
