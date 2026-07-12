import Sidebar from './Sidebar'
import ContentArea from './ContentArea'
import type { NavItem } from '../../types'

interface HomepageAppProps {
  activeNav: NavItem
  onNavChange: (item: NavItem) => void
}

export default function HomepageApp({
  activeNav,
  onNavChange,
}: HomepageAppProps) {
  return (
    <div className="flex flex-1 overflow-hidden min-h-0 h-full">
      <Sidebar activeNav={activeNav} onNavChange={onNavChange} />
      <ContentArea activeNav={activeNav} />
    </div>
  )
}
