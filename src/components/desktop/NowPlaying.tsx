import { useRef, useEffect, useState, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Music2,
} from 'lucide-react'
import { DESKTOP_EASE } from '../../desktop/constants'

/* ------------------------------------------------------------------ */
/* Mock data — swap with a real audio source / state manager later.   */
/* ------------------------------------------------------------------ */
interface Song {
  title: string
  artist: string
  album: string
  duration: number // seconds
}

const MOCK_SONG: Song = {
  title: 'Midnight Echoes',
  artist: 'Lo-Fi Beats',
  album: 'Night Drives',
  duration: 242, // 3:42
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/* ------------------------------------------------------------------ */
interface NowPlayingProps {
  open: boolean
  onClose: () => void
  theme: 'dark' | 'light'
  /** The wrapper that contains both the trigger button and this popup,
   *  so clicks on the trigger itself don't fire onClose. */
  triggerRef: RefObject<HTMLDivElement | null>
}

export default function NowPlaying({ open, onClose, theme, triggerRef }: NowPlayingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(88) // seconds, ~60 % of 242
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)

  /* Progress tick */
  useEffect(() => {
    if (!playing) return
    const interval = window.setInterval(() => {
      setElapsed((prev) => {
        if (prev >= MOCK_SONG.duration) {
          setPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [playing])

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

  const progress = elapsed / MOCK_SONG.duration
  const isLight = theme === 'light'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className="absolute top-full left-0 z-50 w-[340px] border shadow-2xl origin-top mt-2.5 p-6 rounded-[16px]"
          style={{
            background: isLight
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
          {/* Album art placeholder */}
          <div
            className="mb-5 rounded-2xl overflow-hidden shadow-lg w-[200px] h-[200px] mx-auto"
            style={{
              background:
                'linear-gradient(135deg, #4F8EF7 0%, #7C5CFF 50%, #a78bfa 100%)',
            }}
          >
            <div className="h-full w-full flex items-center justify-center">
              <Music2 size={56} className="text-white/40" />
            </div>
          </div>

          {/* Song info */}
          <div className="text-center mb-4">
            <h2 className="font-semibold text-[15px] leading-snug truncate">
              {MOCK_SONG.title}
            </h2>
            <p className="text-[13px] mt-0.5 opacity-[0.55]">
              {MOCK_SONG.artist} — {MOCK_SONG.album}
            </p>
          </div>

          {/* Progress bar — interactive stub for future seek */}
          <div className="mb-2">
            <div
              className="relative h-1 rounded-full w-full cursor-pointer group"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              tabIndex={0}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-[#4F8EF7]"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[11px] opacity-[0.45]">
              <span>{formatTime(elapsed)}</span>
              <span>{formatTime(MOCK_SONG.duration)}</span>
            </div>
          </div>

          {/* Transport controls */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <button
              type="button"
              onClick={() => setShuffle((v) => !v)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              style={{ opacity: shuffle ? 1 : 0.4 }}
              aria-label="Shuffle"
            >
              <Shuffle size={16} />
            </button>

            <button
              type="button"
              onClick={() => setElapsed(0)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <SkipBack size={20} />
            </button>

            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              className="flex items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-105 w-11 h-11 bg-[#4F8EF7] text-white"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => setElapsed(MOCK_SONG.duration)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Next"
            >
              <SkipForward size={20} />
            </button>

            <button
              type="button"
              onClick={() => setRepeat((v) => !v)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              style={{ opacity: repeat ? 1 : 0.4 }}
              aria-label="Repeat"
            >
              <Repeat size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
