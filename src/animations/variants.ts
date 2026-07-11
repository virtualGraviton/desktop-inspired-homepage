import type { Variants } from 'framer-motion'

export const springTransition = {
  type: 'spring' as const,
  duration: 0.45,
  stiffness: 160,
}

export const easeOutExpo = {
  type: 'tween' as const,
  ease: [0.16, 1, 0.3, 1],
  duration: 0.6,
} as const

export const glassOverlayVariants: Variants = {
  visible: {
    opacity: 1,
    backdropFilter: 'blur(40px)',
    transition: { duration: 0.3 },
  },
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.3 },
  },
}

export const capsuleVariants: Variants = {
  initial: {
    width: 680,
    height: 92,
    borderRadius: 999,
  },
  window: {
    width: 1200,
    height: 760,
    borderRadius: 32,
    transition: {
      type: 'tween' as const,
      ease: [0.16, 1, 0.3, 1],
      duration: 0.5,
    },
  },
}

export const windowExpandVariants: Variants = {
  initial: {
    width: 1200,
    height: 760,
    scale: 1,
  },
  expanded: {
    width: '75vw',
    height: '80vh',
    transition: { ...springTransition },
  },
}

export const fadeVariants: Variants = {
  visible: { opacity: 1, transition: { duration: 0.3 } },
  hidden: { opacity: 0, transition: { duration: 0.2 } },
}

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ...springTransition } },
}

export const desktopEnterVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...springTransition, delay: 0.1 },
  },
}

export const sidebarItemVariants: Variants = {
  idle: { x: 0 },
  hover: { x: 4, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
}
