import { DEBUG_BLACK_BG } from '../../constants'
import type { WallpaperApi } from '../../desktop/useWallpaper'

interface WallpaperLayerProps {
  wallpaper: WallpaperApi
}

export default function WallpaperLayer({ wallpaper }: WallpaperLayerProps) {
  const { current, next, reveal, onRevealEnd } = wallpaper

  if (DEBUG_BLACK_BG) {
    return <div className="fixed inset-0 z-0 bg-black" />
  }

  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${current})` }}
      />

      {reveal && next && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat wallpaper-reveal"
          style={{
            backgroundImage: `url(${next})`,
            ['--reveal-x' as string]: `${reveal.origin.x}px`,
            ['--reveal-y' as string]: `${reveal.origin.y}px`,
            ['--reveal-r' as string]: `${reveal.radius}px`,
          }}
          onAnimationEnd={onRevealEnd}
        />
      )}

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.25)' }}
      />
    </div>
  )
}
