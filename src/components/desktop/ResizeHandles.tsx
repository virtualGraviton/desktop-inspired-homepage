import type { ResizeDir } from '../../hooks/useWindowDragResize'

/**
 * Most edges sit half-in / half-out.
 * Right-side handles stay fully outside and thinner so they don't cover the scrollbar.
 */
const HANDLES: { dir: ResizeDir; className: string }[] = [
  { dir: 'n', className: '-top-2 left-3 right-3 h-4 cursor-n-resize' },
  { dir: 's', className: '-bottom-2 left-3 right-3 h-4 cursor-s-resize' },
  { dir: 'e', className: 'top-3 -right-2 bottom-3 w-2 cursor-e-resize' },
  { dir: 'w', className: 'top-3 -left-2 bottom-3 w-4 cursor-w-resize' },
  { dir: 'ne', className: '-top-2 -right-2 h-3 w-2 cursor-ne-resize' },
  { dir: 'nw', className: '-top-2 -left-2 h-4 w-4 cursor-nw-resize' },
  { dir: 'se', className: '-bottom-2 -right-2 h-3 w-2 cursor-se-resize' },
  { dir: 'sw', className: '-bottom-2 -left-2 h-4 w-4 cursor-sw-resize' },
]

interface ResizeHandlesProps {
  onResizePointerDown: (
    dir: ResizeDir,
  ) => (e: React.PointerEvent) => void
}

export default function ResizeHandles({ onResizePointerDown }: ResizeHandlesProps) {
  return (
    <>
      {HANDLES.map(({ dir, className }) => (
        <div
          key={dir}
          className={`absolute z-30 touch-none ${className}`}
          onPointerDown={onResizePointerDown(dir)}
        />
      ))}
    </>
  )
}
