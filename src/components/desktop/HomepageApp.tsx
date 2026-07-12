import { useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import ContentArea from './ContentArea'
import type { NavItem } from '../../types'

interface HomepageAppProps {
  activeNav: NavItem
  onNavChange: (item: NavItem) => void
}

const SIDEBAR_FULL = 280
const MIN_CONTENT = 380
const COLLAPSE_THRESHOLD = SIDEBAR_FULL + MIN_CONTENT

export default function HomepageApp({
  activeNav,
  onNavChange,
}: HomepageAppProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setCollapsed(entry.contentRect.width < COLLAPSE_THRESHOLD)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden min-h-0 h-full">
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        collapsed={collapsed}
      />
      <ContentArea activeNav={activeNav} />
    </div>
  )
}
