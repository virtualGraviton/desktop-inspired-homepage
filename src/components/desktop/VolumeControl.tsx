import { useRef, useEffect, useState, useCallback, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Volume2, Volume1, VolumeX } from 'lucide-react'
import { DESKTOP_EASE } from '../../desktop/constants'

/* ------------------------------------------------------------------ */
/* VolumeControl — horizontal slider popup, styled like the calendar. */
/* All plumbing is self-contained; parent only needs open / onClose.  */
/* ------------------------------------------------------------------ */

interface VolumeControlProps {
  open: boolean
  onClose: () => void
  theme: 'dark' | 'light'
  /** Allow parent to read back the value if needed (e.g. persist). */
  onVolumeChange?: (v: number) => void
  /** The wrapper containing both trigger button and popup, so clicks on trigger don't fire onClose. */
  triggerRef: RefObject<HTMLDivElement | null>
}

export default function VolumeControl({
  open,
  onClose,
  theme,
  onVolumeChange,
  triggerRef,
}: VolumeControlProps) {
  const ref = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [volume, setVolume] = useState(40)
  const [dragging, setDragging] = useState(false)

  /* Click outside */
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node
      if (ref.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      onClose()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, onClose, triggerRef])

  /* Sync up to parent when value settles */
  useEffect(() => {
    if (!open) return
    onVolumeChange?.(volume)
  }, [volume, open, onVolumeChange])

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      setVolume(Math.round(ratio * 100))
    },
    [],
  )

  /* Pointer drag (mouse + touch) */
  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => updateFromClientX(e.clientX)
    const onUp = () => setDragging(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, updateFromClientX])

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2

  const fillColor =
    theme === 'light'
      ? 'rgba(59,130,246,0.85)'
      : 'rgba(125,211,252,0.95)'

  const trackBg =
    theme === 'light'
      ? 'rgba(0,0,0,0.08)'
      : 'rgba(255,255,255,0.12)'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className="absolute top-full right-0 z-50 w-[280px] border shadow-2xl origin-top mt-3.5 p-5 pb-[18px] rounded-[16px]"
          style={{
            background: theme === 'light'
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
          <div className="flex items-center gap-3 mb-3.5">
            <VolumeIcon size={20} className="opacity-[0.65]" />
            <span className="text-[13px] font-medium">Volume</span>
            <span className="ml-auto text-[13px] font-mono tabular-nums opacity-[0.55]">
              {volume}%
            </span>
          </div>

          {/* Slider track */}
          <div
            ref={trackRef}
            className="relative h-2 w-full rounded-full cursor-pointer mb-3.5"
            style={{ background: trackBg }}
            onPointerDown={(e) => {
              setDragging(true)
              updateFromClientX(e.clientX)
            }}
            role="slider"
            aria-label="Volume"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={volume}
            tabIndex={0}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full pointer-events-none"
              style={{
                width: `${volume}%`,
                background: fillColor,
                transition: dragging ? 'none' : 'width 0.12s ease',
              }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full shadow pointer-events-none w-3.5 h-3.5 bg-white"
              style={{
                left: `${volume}%`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                opacity: dragging ? 1 : 0,
                transition: dragging ? 'none' : 'opacity 0.15s ease',
              }}
            />
          </div>

          {/* Quick presets */}
          <div className="flex justify-between gap-2 mt-1.5">
            {[0, 25, 50, 75, 100].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVolume(v)}
                className="flex-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors cursor-pointer"
                style={{
                  background:
                    volume === v
                      ? fillColor
                      : 'transparent',
                  color: volume === v ? '#fff' : undefined,
                  opacity: volume === v ? 1 : 0.5,
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
