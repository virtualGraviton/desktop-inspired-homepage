import { motion } from 'framer-motion'
import { User, MapPin, Calendar } from 'lucide-react'
import { SKILLS, TIMELINE } from '../../constants'
import type { NavItem } from '../../types'

interface ContentAreaProps {
  activeNav: NavItem
}

export default function ContentArea({ activeNav }: ContentAreaProps) {
  if (activeNav !== 'about') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/30 text-lg">Coming soon</p>
      </div>
    )
  }

  return (
    <motion.div
      key="about"
      className="flex-1 overflow-y-auto px-10 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', duration: 0.45, stiffness: 160 }}
    >
      {/* Hero */}
      <div className="flex items-center gap-6 mb-10">
        <div
          className="flex items-center justify-center rounded-2xl shrink-0"
          style={{
            width: 88,
            height: 88,
            background: 'rgba(255,255,255,0.1)',
          }}
        >
          <User size={44} className="text-white/60" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Fenglai Zhang</h1>
          <p className="text-white/50 text-base">Software Engineer</p>
          <div className="flex items-center gap-4 mt-2 text-white/35 text-sm">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> Shanghai, China
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> Joined 2020
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-white/55 text-sm leading-relaxed mb-10 max-w-xl">
        Passionate about building elegant, performant web applications with modern
        technologies. Focused on creating seamless user experiences with clean
        architecture and thoughtful design.
      </p>

      {/* Skills */}
      <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-4">
        Tech Stack
      </h2>
      <div className="flex flex-wrap gap-2 mb-10">
        {SKILLS.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: 'rgba(79,142,247,0.15)',
              color: '#7eaef8',
              border: '1px solid rgba(79,142,247,0.25)',
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Timeline */}
      <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-4">
        Experience
      </h2>
      <div className="flex flex-col gap-0">
        {TIMELINE.map((item, i) => (
          <div
            key={i}
            className="relative flex gap-4 pb-7"
            style={{
              borderLeft:
                i < TIMELINE.length - 1
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid transparent',
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                left: -4,
                top: 4,
                width: 7,
                height: 7,
                background: '#4F8EF7',
              }}
            />
            <div className="pl-5">
              <span className="text-white/35 text-xs">{item.year}</span>
              <h3 className="text-white/90 text-sm font-semibold mt-0.5">
                {item.title}
              </h3>
              <p className="text-white/40 text-xs mt-0.5">{item.company}</p>
              <p className="text-white/45 text-xs mt-1 leading-relaxed max-w-md">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
