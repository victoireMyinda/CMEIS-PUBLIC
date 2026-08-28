import { useEffect, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/utils/cn'
import type { HomepageConfig } from '@/types'

export function resolveBannerSlides(
  home?: HomepageConfig | null,
  fallback: string[] = [],
): string[] {
  const fromAdmin = (home?.bannerUrls || [])
    .map((url) => (url || '').trim())
    .filter(Boolean)
    .slice(0, 3)
  if (fromAdmin.length > 0) return fromAdmin
  const legacy = home?.bannerUrl?.trim()
  if (legacy) return [legacy]
  return fallback.filter(Boolean).slice(0, 3)
}

export function HeroBanner({
  slides,
  children,
  align = 'center',
  className,
}: {
  slides: string[]
  children: ReactNode
  align?: 'center' | 'end'
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const count = slides.length

  useEffect(() => {
    setIndex(0)
  }, [slides.join('|')])

  useEffect(() => {
    if (reduceMotion || count < 2) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, 7000)
    return () => window.clearInterval(id)
  }, [reduceMotion, count])

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-brand-900 text-white',
        'min-h-[82dvh] sm:min-h-[86dvh]',
        'lg:min-h-[40rem] lg:h-[min(76vh,48rem)] lg:max-h-[48rem]',
        className,
      )}
    >
      {count > 0 ? (
        <div className="absolute inset-0" aria-hidden>
          {slides.map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              alt=""
              className={cn(
                'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out',
                i === index ? 'opacity-100' : 'opacity-0',
              )}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
          ))}
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-[linear-gradient(145deg,#05261c_0%,#0b3d2e_42%,#2f7f5e_78%,#c9a227_140%)]"
          aria-hidden
        />
      )}
      <div
        className={cn(
          'absolute inset-0',
          count > 0
            ? 'bg-gradient-to-t from-brand-900/80 via-brand-900/25 to-brand-900/10 lg:from-brand-900/75 lg:via-brand-900/20 lg:to-transparent'
            : '',
        )}
        aria-hidden
      />
      <div
        className={cn(
          'container-app relative flex h-full flex-col pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-16 lg:pt-24',
          align === 'end' ? 'justify-end' : 'justify-center',
          'min-h-[82dvh] sm:min-h-[86dvh] lg:min-h-0',
        )}
      >
        <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl">{children}</div>
      </div>
      {count > 1 ? (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 lg:bottom-8">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'h-2 rounded-full transition',
                i === index ? 'w-7 bg-accent-400' : 'w-2 bg-white/45 hover:bg-white/80',
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
