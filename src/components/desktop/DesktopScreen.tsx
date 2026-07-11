import { motion } from 'framer-motion'
import WindowFrame from './WindowFrame'

export default function DesktopScreen() {
  return (
    <motion.div
      key="desktop-screen"
      className="fixed inset-0 z-20 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0c0e14 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%)',
        }}
      />

      <WindowFrame />
    </motion.div>
  )
}
