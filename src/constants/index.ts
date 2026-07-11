import type { NavEntry, NavItem } from '../types'

/** Flip to `true` while tuning glass / typography against a flat black backdrop. */
export const DEBUG_BLACK_BG = false

export const PROFILE = {
  name: 'Fenglai Zhang',
  title: 'Software Engineer',
  avatar: '/avatar.webp',
  location: 'Shanghai, China',
  joined: '2020',
  slogan: 'Building software that feels effortless.',
  bio: 'Focused on elegant, performant interfaces and reliable systems — clean architecture, thoughtful interaction, and just enough craft to make complexity disappear.',
} as const

/** Login wallpaper set — kebab-case WebP under /public/backgrounds */
export const BACKGROUNDS = [
  '/backgrounds/ayaka.webp',
  '/backgrounds/mashiro.webp',
  '/backgrounds/neuro.webp',
  '/backgrounds/anime-girl-6.webp',
  '/backgrounds/anime-girl-7.webp',
  '/backgrounds/anime-girl-8.webp',
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
  'GraphQL',
]

export const TIMELINE = [
  {
    year: '2024 — Present',
    title: 'Senior Software Engineer',
    company: 'Company Name',
    description: 'Building scalable web applications and design systems.',
  },
  {
    year: '2022 — 2024',
    title: 'Software Engineer',
    company: 'Previous Company',
    description: 'Shipped full-stack features across product surfaces.',
  },
  {
    year: '2020 — 2022',
    title: 'Junior Developer',
    company: 'First Company',
    description: 'Started the journey in software engineering.',
  },
]

/** Solid text colors — avoid translucent white on glass */
export const INK = {
  primary: '#f4f4f5',
  secondary: '#d4d4d8',
  muted: '#a1a1aa',
  faint: '#71717a',
  accent: '#93c5fd',
  accentSoft: '#bfdbfe',
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
