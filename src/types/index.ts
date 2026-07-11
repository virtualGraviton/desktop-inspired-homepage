export type NavItem = 'about' | 'projects' | 'blog' | 'github' | 'contact'

export type AnimationPhase =
  | 'idle'
  | 'fadeGlass'
  | 'morphContent'
  | 'expandWindow'
  | 'complete'

export interface NavEntry {
  id: NavItem
  label: string
  icon: string
}
