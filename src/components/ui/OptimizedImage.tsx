import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  aspect?: string
  priority?: boolean
  fit?: 'cover' | 'contain'
}

function isImageReady(img: HTMLImageElement) {
  return img.complete && img.naturalWidth > 0
}

export function OptimizedImage({
  src,
  alt,
  className,
  aspect = 'aspect-[16/10]',
  priority = false,
  fit = 'cover',
}: OptimizedImageProps) {
  const safeSrc = (src || '').trim()
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useLayoutEffect(() => {
    setLoaded(false)
    setFailed(false)

    const img = imgRef.current
    if (img && safeSrc && isImageReady(img)) {
      setLoaded(true)
    }
  }, [safeSrc])

  if (!safeSrc || failed) {
    return (
      <div className={cn('relative overflow-hidden bg-brand-100', aspect, className)}>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-100 via-brand-50 to-brand-200">
          <span className="font-display text-sm font-semibold text-brand-700/70">CMEIS-DG3</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden bg-brand-100', aspect, className)}>
      {!loaded ? (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-brand-100 to-brand-200" />
      ) : null}
      <img
        key={safeSrc}
        ref={imgRef}
        src={safeSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => {
          setLoaded(true)
          setFailed(false)
        }}
        onError={() => {
          const img = imgRef.current
          if (img && isImageReady(img)) {
            setLoaded(true)
            setFailed(false)
            return
          }
          setFailed(true)
          setLoaded(false)
        }}
        className={cn(
          'h-full w-full transition-opacity duration-300',
          fit === 'contain' ? 'object-contain bg-white' : 'object-cover',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}
