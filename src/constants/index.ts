import type { NavEntry } from '../types'

export const PROFILE = {
  name: 'Fenglai Zhang',
  title: 'Software Engineer',
  avatar: '/avatar.webp',
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

export const NAV_ITEMS: NavEntry[] = [
  { id: 'about', label: 'About', icon: 'User' },
  { id: 'projects', label: 'Projects', icon: 'FolderGit2' },
  { id: 'blog', label: 'Blog', icon: 'PenLine' },
  { id: 'github', label: 'GitHub', icon: 'ExternalLink' },
  { id: 'contact', label: 'Contact', icon: 'Mail' },
]

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
    year: '2024 - Present',
    title: 'Senior Software Engineer',
    company: 'Company Name',
    description: 'Building scalable web applications.',
  },
  {
    year: '2022 - 2024',
    title: 'Software Engineer',
    company: 'Previous Company',
    description: 'Developed full-stack solutions.',
  },
  {
    year: '2020 - 2022',
    title: 'Junior Developer',
    company: 'First Company',
    description: 'Started the journey in software engineering.',
  },
]

export const COLORS = {
  primary: '#4F8EF7',
  accent: '#7C5CFF',
  background: '#0F1115',
  glass: 'rgba(255,255,255,0.08)',
  glassHeavy: 'rgba(255,255,255,0.15)',
  border: 'rgba(255,255,255,0.15)',
} as const
