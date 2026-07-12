export type NavItem = 'about' | 'projects' | 'blog' | 'github' | 'contact'

export type AnimationPhase = 'boot' | 'loading' | 'idle' | 'morphContent' | 'complete'

export interface NavEntry {
  id: NavItem
  label: string
  icon: string
}
