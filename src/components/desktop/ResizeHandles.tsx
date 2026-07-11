import type { ResizeDir } from '../../hooks/useWindowDragResize'

const HANDLES: { dir: ResizeDir; className: string }[] = [
  { dir: 'n', className: 'top-0 left-3 right-3 h-2 cursor-n-resize' },
  { dir: 's', className: 'bottom-0 left-3 right-3 h-2 cursor-s-resize' },
  { dir: 'e', className: 'top-3 right-0 bottom-3 w-2 cursor-e-resize' },
  { dir: 'w', className: 'top-3 left-0 bottom-3 w-2 cursor-w-resize' },
  { dir: 'ne', className: 'top-0 right-0 h-3 w-3 cursor-ne-resize' },
  { dir: 'nw', className: 'top-0 left-0 h-3 w-3 cursor-nw-resize' },
  { dir: 'se', className: 'bottom-0 right-0 h-3 w-3 cursor-se-resize' },
  { dir: 'sw', className: 'bottom-0 left-0 h-3 w-3 cursor-sw-resize' },
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
