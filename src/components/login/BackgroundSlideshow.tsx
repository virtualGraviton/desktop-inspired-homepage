import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { BACKGROUNDS } from '../../constants'

interface BackgroundSlideshowProps {
  /** Hide the switcher while the window is morphing / open (optional). */
  showSwitcher?: boolean
}

export default function BackgroundSlideshow({
  showSwitcher = true,
}: BackgroundSlideshowProps) {
  const [index, setIndex] = useState(0)

  const nextBg = useCallback(() => {
    setIndex((prev) => (prev + 1) % BACKGROUNDS.length)
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={BACKGROUNDS[index]}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${BACKGROUNDS[index]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'rgba(0,0,0,0.25)',
        }}
      />

      {showSwitcher && (
        <button
          onClick={nextBg}
          className="absolute bottom-6 right-6 z-20 rounded-full p-2.5 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
          aria-label="Change background"
        >
          <RefreshCw size={18} />
        </button>
      )}
    </div>
  )
}
