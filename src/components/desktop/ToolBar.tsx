import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Battery,
  Bell,
  Bluetooth,
  Headphones,
  Image as ImageIcon,
  LayoutGrid,
  Music2,
  Power,
  Sun,
  Moon,
  Wifi,
} from 'lucide-react'
import { DESKTOP_EASE, TOOLBAR_RESERVED_H } from '../../desktop/constants'
import type { RevealOrigin } from '../../desktop/useWallpaper'
import NowPlaying from './NowPlaying'
import VolumeControl from './VolumeControl'

/** Build a Sun–Sat month grid; leading/trailing empties are null. */
function buildMonthCells(date: Date): (number | null)[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startWeekday = new Date(year, month, 1).getDay()
  const cells: (number | null)[] = Array.from(
    { length: startWeekday },
    () => null,
  )
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'] as const

/** Shared chrome size for every toolbar control */
const PILL_H = 32
const ICON = 14

interface ToolBarProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  onCycleWallpaper: (origin: RevealOrigin) => void
}

function Pill({
  children,
  className = '',
  onClick,
  title,
  square = false,
}: {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  title?: string
  /** Icon-only control: fixed square hit target */
  square?: boolean
}) {
  const style: React.CSSProperties = {
    height: PILL_H,
    minHeight: PILL_H,
    maxHeight: PILL_H,
    width: square ? PILL_H : undefined,
    minWidth: square ? PILL_H : undefined,
    padding: square ? 0 : '0 12px',
    background: 'var(--pill-bg)',
    color: 'var(--pill-fg)',
    border: '1px solid var(--pill-border)',
    backdropFilter: 'blur(16px)',
    boxSizing: 'border-box',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
  }

  const cls = `toolbar-pill inline-flex items-center justify-center gap-1.5 rounded-full text-[12px] leading-none shrink-0 overflow-hidden appearance-none ${
    onClick
      ? 'toolbar-pill--interactive cursor-pointer focus:outline-none focus-visible:outline-none'
      : ''
  } ${className}`

  if (onClick) {
    return (
      <button
        type="button"
        title={title}
        onClick={onClick}
        onMouseDown={(e) => e.preventDefault()}
        className={cls}
        style={style}
      >
        {children}
      </button>
    )
  }

  return (
    <div title={title} className={cls} style={style}>
      {children}
    </div>
  )
}

export default function ToolBar({
  theme,
  onToggleTheme,
  onCycleWallpaper,
}: ToolBarProps) {
  const [now, setNow] = useState(() => new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [musicOpen, setMusicOpen] = useState(false)
  const [volumeOpen, setVolumeOpen] = useState(false)
  const [workspace, setWorkspace] = useState(1)
  const [volume, setVolume] = useState(40)
  const calRef = useRef<HTMLDivElement>(null)
  const musicRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    if (!calendarOpen) return
    const onDoc = (e: MouseEvent) => {
      if (!calRef.current?.contains(e.target as Node)) setCalendarOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [calendarOpen])

  const timeLabel = now.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const precise = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()
  const monthCells = useMemo(
    () => buildMonthCells(new Date(year, month, 1)),
    [year, month],
  )

  return (
    <motion.div
      className="fixed top-0 inset-x-0 z-[55] flex items-center justify-between gap-3 px-4 pointer-events-none"
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: DESKTOP_EASE }}
      style={
        {
          height: TOOLBAR_RESERVED_H,
          ['--pill-bg' as string]:
            theme === 'light'
              ? 'rgba(255,255,255,0.82)'
              : 'rgba(10,10,14,0.78)',
          // Light: darker hover so it reads on pale pills; dark: lighter wash
          ['--pill-bg-hover' as string]:
            theme === 'light'
              ? 'rgba(24,24,27,0.12)'
              : 'rgba(255,255,255,0.14)',
          ['--pill-fg' as string]:
            theme === 'light' ? '#18181b' : 'rgba(244,244,245,0.9)',
          ['--pill-border' as string]:
            theme === 'light'
              ? 'rgba(0,0,0,0.08)'
              : 'rgba(255,255,255,0.12)',
          ['--pill-border-active' as string]:
            theme === 'light'
              ? 'rgba(59,130,246,0.85)'
              : 'rgba(125,211,252,0.95)',
        } as React.CSSProperties
      }
    >
      <div className="flex items-center gap-2 pointer-events-auto h-8">
        <Pill className="!px-1 !gap-0.5">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setWorkspace(n)}
              onMouseDown={(e) => e.preventDefault()}
              data-active={workspace === n ? 'true' : undefined}
              className="toolbar-pill--interactive flex items-center justify-center rounded-full text-[11px] font-semibold border border-transparent cursor-pointer shrink-0 outline-none focus:outline-none appearance-none"
              style={{
                width: 24,
                height: 24,
                background: workspace === n ? '#93c5fd' : 'transparent',
                color: workspace === n ? '#0f1115' : 'inherit',
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            >
              {n}
            </button>
          ))}
        </Pill>
        <div className="relative pointer-events-auto h-8" ref={musicRef}>
          <Pill
            title="Music"
            onClick={() => setMusicOpen((v) => !v)}
            square
          >
            <Music2 size={ICON} />
          </Pill>
          <NowPlaying
            open={musicOpen}
            onClose={() => setMusicOpen(false)}
            theme={theme}
            triggerRef={musicRef}
          />
        </div>
        <Pill title="Toggle theme" onClick={onToggleTheme} square>
          {theme === 'dark' ? <Moon size={ICON} /> : <Sun size={ICON} />}
        </Pill>
        <Pill
          title="Change wallpaper"
          square
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            onCycleWallpaper({
              x: r.left + r.width / 2,
              y: r.top + r.height / 2,
            })
          }}
        >
          <ImageIcon size={ICON} />
        </Pill>
      </div>

      <div className="relative pointer-events-auto h-8" ref={calRef}>
        <Pill onClick={() => setCalendarOpen((v) => !v)}>
          <span className="font-medium tracking-wide whitespace-nowrap">
            {timeLabel}
          </span>
        </Pill>
        <AnimatePresence>
          {calendarOpen && (
            <motion.div
              className="absolute top-full left-1/2 z-50 w-[280px] -translate-x-1/2 border shadow-2xl origin-top"
              style={{
                marginTop: 10,
                padding: '20px 20px 18px',
                borderRadius: 16,
                background:
                  theme === 'light'
                    ? 'rgba(255,255,255,0.96)'
                    : 'rgba(12,12,16,0.94)',
                borderColor: 'var(--pill-border)',
                color: 'var(--pill-fg)',
                backdropFilter: 'blur(20px)',
              }}
              initial={{ opacity: 0, y: -10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.28, ease: DESKTOP_EASE }}
            >
              <div className="text-center font-mono text-[28px] leading-none tracking-tight mb-3">
                {precise}
              </div>
              <div
                className="text-center text-[13px] mb-5"
                style={{ opacity: 0.65 }}
              >
                {now.toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </div>
              <div
                className="grid grid-cols-7 mb-2 text-center text-[11px] font-medium"
                style={{ opacity: 0.45, gap: '2px 0' }}
              >
                {WEEKDAYS.map((d) => (
                  <span key={d} className="py-1">
                    {d}
                  </span>
                ))}
              </div>
              <div
                className="grid grid-cols-7 text-center text-[13px]"
                style={{ gap: '4px 0', paddingBottom: 4 }}
              >
                {monthCells.map((d, i) => (
                  <span
                    key={i}
                    className="flex items-center justify-center rounded-lg"
                    style={{
                      height: 32,
                      background:
                        d === today
                          ? 'rgba(147,197,253,0.28)'
                          : 'transparent',
                      color:
                        d === today
                          ? theme === 'light'
                            ? '#2563eb'
                            : '#93c5fd'
                          : d == null
                            ? 'transparent'
                            : undefined,
                      fontWeight: d === today ? 600 : 400,
                    }}
                  >
                    {d ?? ''}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto h-8">
        <Pill>
          <Battery size={ICON} />
          <span>87%</span>
        </Pill>
        <Pill title="Network">
          <Wifi size={ICON} />
          <Bluetooth size={ICON} />
        </Pill>
        <Pill title="Background apps" square onClick={() => undefined}>
          <LayoutGrid size={ICON} />
        </Pill>
        <div className="relative pointer-events-auto h-8" ref={volumeRef}>
          <Pill
            title="Volume"
            onClick={() => setVolumeOpen((v) => !v)}
          >
            <Headphones size={ICON} />
            <span>{volume}%</span>
          </Pill>
          <VolumeControl
            open={volumeOpen}
            onClose={() => setVolumeOpen(false)}
            theme={theme}
            onVolumeChange={setVolume}
            triggerRef={volumeRef}
          />
        </div>
        <Pill title="Notifications" square onClick={() => undefined}>
          <span
            className="inline-flex h-full w-full items-center justify-center rounded-full"
            style={{ background: '#93c5fd', color: '#0f1115' }}
          >
            <Bell size={ICON} />
          </span>
        </Pill>
        <Pill title="Power" square onClick={() => undefined}>
          <span
            className="inline-flex h-full w-full items-center justify-center rounded-full"
            style={{ background: 'rgba(248,113,113,0.9)', color: '#0f1115' }}
          >
            <Power size={ICON} />
          </span>
        </Pill>
      </div>
    </motion.div>
  )
}
