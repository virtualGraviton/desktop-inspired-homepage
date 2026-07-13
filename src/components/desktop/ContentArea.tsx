import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Calendar } from 'lucide-react'
import { PROFILE, SKILLS, TIMELINE, INK, SPACE } from '../../constants'
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
      className="mx-auto w-full max-w-[880px]"
      style={{
        padding: `${SPACE.pageY}px ${SPACE.pageX}px`,
        // Extra bottom room so the last section clears the rounded corner
        paddingBottom: SPACE.pageY + 8,
      }}
    >
      {/* Hero */}
      <header
        className="flex items-start"
        style={{ gap: SPACE.lg, marginBottom: SPACE.section }}
      >
        <div
          className="rounded-[28px] shrink-0 overflow-hidden ring-1 ring-white/20 shadow-lg"
          style={{ width: 104, height: 104 }}
        >
          <img
            src={PROFILE.avatar}
            alt={PROFILE.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>

        <div className="min-w-0" style={{ paddingTop: SPACE.xs }}>
          <h1
            className="font-bold tracking-tight"
            style={{
              color: INK.primary,
              fontSize: 40,
              lineHeight: 1.15,
              marginBottom: 12,
            }}
          >
            {PROFILE.name}
          </h1>
          <p
            className="text-lg"
            style={{ color: INK.secondary, marginBottom: 10 }}
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
      <section style={{ marginBottom: SPACE.section }}>
        <p
          className="text-xl font-medium leading-snug"
          style={{ color: INK.primary, marginBottom: SPACE.md }}
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
      <section style={{ marginBottom: SPACE.section }}>
        <h2
          className="text-xs font-semibold uppercase tracking-[0.16em]"
          style={{ color: INK.muted, marginBottom: SPACE.md }}
        >
          Tech Stack
        </h2>
        <div className="flex flex-wrap" style={{ gap: 12 }}>
          {SKILLS.map((skill) => (
            <motion.span
              key={skill}
              className="inline-flex items-center rounded-lg text-sm font-medium cursor-default"
              style={{
                height: 32,
                padding: '0 16px',
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
          className="text-xs font-semibold uppercase tracking-[0.16em]"
          style={{ color: INK.muted, marginBottom: SPACE.md }}
        >
          Experience
        </h2>
        <div
          className="grid"
          style={{
            gap: SPACE.lg,
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          }}
        >
          {TIMELINE.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl flex flex-col"
              style={{
                minHeight: 200,
                padding: SPACE.lg,
                gap: SPACE.sm,
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
                className="text-sm leading-relaxed"
                style={{ color: INK.secondary, marginTop: 'auto' }}
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
