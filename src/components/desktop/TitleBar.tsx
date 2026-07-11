import { NAV_PATHS } from '../../constants'
import type { NavItem } from '../../types'

interface TitleBarProps {
  activeNav: NavItem
}

export default function TitleBar({ activeNav }: TitleBarProps) {
  return (
    <div
      className="relative flex items-center shrink-0 select-none"
      style={{
        height: 44,
        paddingLeft: 24,
        paddingRight: 16,
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <div className="flex items-center gap-2 z-10">
        <span
          className="inline-block rounded-full"
          style={{ width: 12, height: 12, background: '#ff5f57' }}
          title="Close"
        />
        <span
          className="inline-block rounded-full"
          style={{ width: 12, height: 12, background: '#febc2e' }}
          title="Minimize"
        />
        <span
          className="inline-block rounded-full"
          style={{ width: 12, height: 12, background: '#28c840' }}
          title="Maximize"
        />
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center font-mono text-[13px] pointer-events-none"
        style={{ color: 'rgba(244,244,245,0.55)' }}
      >
        {NAV_PATHS[activeNav]}
      </div>
    </div>
  )
}
