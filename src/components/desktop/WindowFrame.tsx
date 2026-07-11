import { motion } from 'framer-motion'
import { useState } from 'react'
import TitleBar from './TitleBar'
import Sidebar from './Sidebar'
import ContentArea from './ContentArea'
import type { NavItem } from '../../types'

export default function WindowFrame() {
  const [activeNav, setActiveNav] = useState<NavItem>('about')

  return (
    <motion.div
      className="relative flex flex-col overflow-hidden border shadow-2xl"
      style={{
        width: '75vw',
        height: '80vh',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        borderRadius: 32,
        borderColor: 'rgba(255,255,255,0.15)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        duration: 0.45,
        stiffness: 160,
        delay: 0.1,
      }}
    >
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
        <ContentArea activeNav={activeNav} />
      </div>
    </motion.div>
  )
}
