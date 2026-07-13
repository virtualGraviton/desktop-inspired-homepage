import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Calendar } from 'lucide-react'
import { PROFILE, SKILLS, TIMELINE, INK } from '../../constants'
import type { NavItem } from '../../types'

interface ContentAreaProps {
  activeNav: NavItem
}

const pageTransition = {
  type: 'spring' as const,
  stiffness: 160,
  damping: 26,
}

export default function ContentArea({ activeNav }: ContentAreaProps) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={activeNav}
        className={
          activeNav === 'about'
            ? 'window-scroll flex-1 min-h-0 overflow-y-auto'
            : 'flex-1 min-h-0 flex items-center justify-center'
        }
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={pageTransition}
      >
        {activeNav === 'about' ? (
          <AboutPage />
        ) : (
          <p className="text-lg font-medium" style={{ color: INK.muted }}>
            Coming soon
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

function AboutPage() {
  return (
    <div
      className="mx-auto w-full max-w-[880px] py-[32px] px-[40px] pb-[40px]"
    >
      {/* Hero */}
      <header
        className="flex items-start gap-6 mb-12"
      >
        <div
          className="rounded-[28px] shrink-0 overflow-hidden ring-1 ring-white/20 shadow-lg w-[104px] h-[104px]"
        >
          <img
            src={PROFILE.avatar}
            alt={PROFILE.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>

        <div className="min-w-0 pt-1">
          <h1
            className="font-bold tracking-tight text-[40px] leading-[1.15] mb-3"
            style={{
              color: INK.primary,
            }}
          >
            {PROFILE.name}
          </h1>
          <p
            className="text-lg mb-2.5"
            style={{ color: INK.secondary }}
          >
            {PROFILE.title}
          </p>
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
            style={{ color: INK.muted }}
          >
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {PROFILE.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              Joined {PROFILE.joined}
            </span>
          </div>
        </div>
      </header>

      {/* Slogan + bio */}
      <section className="mb-12">
        <p
          className="text-xl font-medium leading-snug mb-4"
          style={{ color: INK.primary }}
        >
          {PROFILE.slogan}
        </p>
        <p
          className="text-[15px] leading-relaxed max-w-2xl"
          style={{ color: INK.secondary }}
        >
          {PROFILE.bio}
        </p>
      </section>

      {/* Skills */}
      <section className="mb-12">
        <h2
          className="text-xs font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: INK.muted }}
        >
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <motion.span
              key={skill}
              className="inline-flex items-center rounded-lg text-sm font-medium cursor-default h-8 px-4"
              style={{
                background: 'var(--skill-bg)',
                color: INK.accentSoft,
                border: '1px solid var(--skill-border)',
              }}
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Experience cards */}
      <section>
        <h2
          className="text-xs font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: INK.muted }}
        >
          Experience
        </h2>
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          }}
        >
          {TIMELINE.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl flex flex-col min-h-[200px] p-6 gap-2"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--surface-card-border)',
              }}
            >
              <span className="text-xs font-mono" style={{ color: INK.accent }}>
                {item.year}
              </span>
              <h3
                className="text-[15px] font-semibold leading-snug"
                style={{ color: INK.primary }}
              >
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: INK.muted }}>
                {item.company}
              </p>
              <p
                className="text-sm leading-relaxed mt-auto"
                style={{ color: INK.secondary }}
              >
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
