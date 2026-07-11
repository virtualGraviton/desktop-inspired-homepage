import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

const GRADIENTS = [
  'linear-gradient(135deg, #0c0e14 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%)',
  'linear-gradient(135deg, #0a0a0f 0%, #1a1025 30%, #251740 70%, #1a0a2e 100%)',
  'linear-gradient(135deg, #0a0f0a 0%, #0f1a1a 30%, #0a1a2e 70%, #0f2035 100%)',
  'linear-gradient(135deg, #0f0a0a 0%, #1a1510 30%, #2e1a0a 70%, #351a0f 100%)',
  'linear-gradient(135deg, #0a0a10 0%, #101525 30%, #151a30 70%, #0f1535 100%)',
]

export default function BackgroundSlideshow() {
  const [index, setIndex] = useState(0)

  const nextBg = useCallback(() => {
    setIndex((prev) => (prev + 1) % GRADIENTS.length)
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{ background: GRADIENTS[index] }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      {/* Darken & blur overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backdropFilter: 'brightness(0.8) blur(2px)',
          WebkitBackdropFilter: 'brightness(0.8) blur(2px)',
        }}
      />

      <button
        onClick={nextBg}
        className="absolute bottom-6 right-6 z-20 rounded-full p-2.5 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
        aria-label="Change background"
      >
        <RefreshCw size={18} />
      </button>
    </div>
  )
}
