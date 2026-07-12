import { NAV_PATHS } from '../../constants'
import type { NavItem } from '../../types'

interface TitleBarProps {
  activeNav: NavItem
  focused?: boolean
  onDragPointerDown?: (e: React.PointerEvent) => void
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
}

export default function TitleBar({
  activeNav,
  focused = true,
  onDragPointerDown,
  onClose,
  onMinimize,
  onMaximize,
}: TitleBarProps) {
  return (
    <div
      className="relative flex items-center shrink-0 select-none"
      style={{
        height: 44,
        paddingLeft: 24,
        paddingRight: 16,
        borderBottom: '1px solid var(--titlebar-border)',
        cursor: onDragPointerDown ? 'grab' : 'default',
        touchAction: onDragPointerDown ? 'none' : undefined,
        opacity: focused ? 1 : 0.85,
      }}
      onPointerDown={onDragPointerDown}
    >
      <div
        className="flex items-center gap-2 z-10"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="inline-block rounded-full border-0 p-0 cursor-pointer"
          style={{ width: 12, height: 12, background: '#ff5f57' }}
          title="Close"
          onClick={onClose}
        />
        <button
          type="button"
          className="inline-block rounded-full border-0 p-0 cursor-pointer"
          style={{ width: 12, height: 12, background: '#febc2e' }}
          title="Minimize"
          onClick={onMinimize}
        />
        <button
          type="button"
          className="inline-block rounded-full border-0 p-0 cursor-pointer"
          style={{ width: 12, height: 12, background: '#28c840' }}
          title="Maximize / Tile"
          onClick={onMaximize}
        />
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center font-mono text-[13px] pointer-events-none"
        style={{ color: 'var(--titlebar-path)' }}
      >
        {NAV_PATHS[activeNav]}
      </div>
    </div>
  )
}
