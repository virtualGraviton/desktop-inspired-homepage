import type { NavEntry, NavItem } from '../types'

/** Flip to `true` while tuning glass / typography against a flat black backdrop. */
export const DEBUG_BLACK_BG = false

export const PROFILE = {
  name: 'Fenglai Zhang',
  title: 'Backend Developing Engineer',
  avatar: '/avatar.webp',
  location: 'ShenZhen, China',
  joined: '2025',
  slogan: 'Building software that feels effortless.',
  bio: 'Focused on elegant, performant interfaces and reliable systems — clean architecture, thoughtful interaction, and just enough craft to make complexity disappear.',
} as const

/** Login wallpaper set */
export const BACKGROUNDS = [
  '/backgrounds/ayaka.webp',
  '/backgrounds/mashiro.webp',
  '/backgrounds/100664563_p0.webp',
  '/backgrounds/44873217_p0.webp',
  '/backgrounds/80147951_p0.webp',
  '/backgrounds/140944633_p0.webp',
  '/backgrounds/141365252_p0.webp',
  '/backgrounds/142323952_p0.webp',
  '/backgrounds/143443847_p6.webp',
] as const

export const NAV_GROUPS: { label: string; items: NavEntry[] }[] = [
  {
    label: 'General',
    items: [
      { id: 'about', label: 'About', icon: 'User' },
      { id: 'projects', label: 'Projects', icon: 'FolderGit2' },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'blog', label: 'Blog', icon: 'PenLine' },
      { id: 'github', label: 'GitHub', icon: 'ExternalLink' },
    ],
  },
  {
    label: 'Social',
    items: [{ id: 'contact', label: 'Contact', icon: 'Mail' }],
  },
]

/** Flat list kept for convenience */
export const NAV_ITEMS: NavEntry[] = NAV_GROUPS.flatMap((g) => g.items)

export const NAV_PATHS: Record<NavItem, string> = {
  about: '~/homepage/README.md',
  projects: '~/homepage/projects',
  blog: '~/homepage/blog',
  github: '~/homepage/github',
  contact: '~/homepage/contact.md',
}

export const SKILLS = [
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Go',
  'Docker',
  'PostgreSQL',
]

export const TIMELINE = [
  {
    year: '2025 — Present',
    title: 'Backend Developing Engineer',
    company: 'Vivix',
    description:
      'Encapsulating foundational inference capabilities and delivering atomic APIs and streaming inference interfaces to business teams and external users.',
  },
]

/** Solid text colors via theme CSS vars — avoid translucent white on glass */
export const INK = {
  primary: 'var(--ink-primary)',
  secondary: 'var(--ink-secondary)',
  muted: 'var(--ink-muted)',
  faint: 'var(--ink-faint)',
  accent: 'var(--ink-accent)',
  accentSoft: 'var(--ink-accent-soft)',
} as const

/** 8pt spacing system */
export const SPACE = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  section: 48,
  pageX: 56,
  pageY: 56,
  windowInset: 40,
} as const

export const COLORS = {
  primary: '#4F8EF7',
  accent: '#7C5CFF',
  background: '#0F1115',
  glass: 'rgba(255,255,255,0.08)',
  glassHeavy: 'rgba(255,255,255,0.15)',
  border: 'rgba(255,255,255,0.18)',
} as const
