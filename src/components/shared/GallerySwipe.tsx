import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { createPortal } from 'react-dom'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { GalleryItem } from '@/types'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import {
  getVideoEmbedUrl,
  isDirectVideoFile,
  resolveVideoCover,
} from '@/utils/videoEmbed'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.35

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function GalleryLightbox({
  items,
  index,
  open,
  onClose,
  onIndexChange,
}: {
  items: GalleryItem[]
  index: number
  open: boolean
  onClose: () => void
  onIndexChange: (index: number) => void
}) {
  const titleId = useId()
  const reduceMotion = useReducedMotion()
  const item = items[index]
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
    moved: boolean
  } | null>(null)
  const swipeRef = useRef<{ x: number; y: number } | null>(null)

  const resetView = useCallback(() => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!items.length) return
      const next = (index + dir + items.length) % items.length
      onIndexChange(next)
      resetView()
    },
    [index, items.length, onIndexChange, resetView],
  )

  const zoomBy = useCallback((delta: number) => {
    setZoom((z) => {
      const next = clamp(Number((z + delta).toFixed(2)), MIN_ZOOM, MAX_ZOOM)
      if (next === MIN_ZOOM) setOffset({ x: 0, y: 0 })
      return next
    })
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === '+' || e.key === '=') zoomBy(ZOOM_STEP)
      if (e.key === '-') zoomBy(-ZOOM_STEP)
      if (e.key === '0') resetView()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go, onClose, resetView, zoomBy])

  useEffect(() => {
    resetView()
  }, [index, resetView])

  const onWheel = (e: ReactWheelEvent) => {
    if (!open) return
    e.preventDefault()
    zoomBy(e.deltaY < 0 ? ZOOM_STEP * 0.6 : -ZOOM_STEP * 0.6)
  }

  const onPointerDown = (e: ReactPointerEvent) => {
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    if (zoom > 1) {
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originX: offset.x,
        originY: offset.y,
        moved: false,
      }
    } else {
      swipeRef.current = { x: e.clientX, y: e.clientY }
    }
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    const drag = dragRef.current
    if (drag && drag.pointerId === e.pointerId && zoom > 1) {
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) drag.moved = true
      setOffset({ x: drag.originX + dx, y: drag.originY + dy })
      return
    }
  }

  const onPointerUp = (e: ReactPointerEvent) => {
    const drag = dragRef.current
    if (drag && drag.pointerId === e.pointerId) {
      dragRef.current = null
      return
    }
    const swipe = swipeRef.current
    swipeRef.current = null
    if (!swipe || zoom > 1) return
    const dx = e.clientX - swipe.x
    const dy = e.clientY - swipe.y
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1)
    }
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && item ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[80] flex flex-col bg-brand-900/95 text-white backdrop-blur-md"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-5">
            <div className="min-w-0">
              <p id={titleId} className="truncate font-display text-base font-semibold sm:text-lg">
                {item.title}
              </p>
              <p className="truncate text-xs text-white/60">
                {item.album ? `${item.album} · ` : ''}
                {index + 1} / {items.length}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                className="border-white/15 bg-white/10 text-white hover:bg-white/20"
                aria-label="Zoom arrière"
                onClick={() => zoomBy(-ZOOM_STEP)}
                disabled={zoom <= MIN_ZOOM}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="hidden w-12 text-center text-xs tabular-nums text-white/70 sm:block">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="secondary"
                size="sm"
                className="border-white/15 bg-white/10 text-white hover:bg-white/20"
                aria-label="Zoom avant"
                onClick={() => zoomBy(ZOOM_STEP)}
                disabled={zoom >= MAX_ZOOM}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="border-white/15 bg-white/10 text-white hover:bg-white/20"
                aria-label="Fermer"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
            onWheel={onWheel}
          >
            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Image précédente"
                  className="absolute left-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-brand-900/60 text-white backdrop-blur-sm transition hover:bg-brand-800 sm:left-4"
                  onClick={() => go(-1)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Image suivante"
                  className="absolute right-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-brand-900/60 text-white backdrop-blur-sm transition hover:bg-brand-800 sm:right-4"
                  onClick={() => go(1)}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}

            <motion.div
              key={item.id}
              className={cn(
                'flex h-full w-full items-center justify-center p-3 sm:p-8',
                item.mediaType === 'video'
                  ? 'cursor-default'
                  : zoom > 1
                    ? 'touch-none cursor-grab active:cursor-grabbing'
                    : 'touch-none cursor-zoom-in',
              )}
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              onPointerDown={item.mediaType === 'video' ? undefined : onPointerDown}
              onPointerMove={item.mediaType === 'video' ? undefined : onPointerMove}
              onPointerUp={item.mediaType === 'video' ? undefined : onPointerUp}
              onPointerCancel={item.mediaType === 'video' ? undefined : onPointerUp}
              onDoubleClick={() => {
                if (item.mediaType === 'video') return
                if (zoom > 1) resetView()
                else setZoom(2)
              }}
            >
              {item.mediaType === 'video' && item.videoUrl ? (
                isDirectVideoFile(item.videoUrl) ? (
                  <video
                    key={item.videoUrl}
                    src={item.videoUrl}
                    controls
                    playsInline
                    className="max-h-[78dvh] max-w-full rounded-xl bg-black shadow-soft"
                  />
                ) : (
                  <iframe
                    title={item.title}
                    src={getVideoEmbedUrl(item.videoUrl) || item.videoUrl}
                    className="aspect-video h-auto max-h-[78dvh] w-full max-w-4xl rounded-xl bg-black shadow-soft"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                )
              ) : (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  draggable={false}
                  className="max-h-[78dvh] max-w-full select-none object-contain shadow-soft transition-transform duration-150"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  }}
                />
              )}
            </motion.div>
          </div>

          {items.length > 1 ? (
            <div className="border-t border-white/10 px-3 py-3 sm:px-5">
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map((thumb, i) => (
                  <button
                    key={thumb.id}
                    type="button"
                    aria-label={`Voir ${thumb.title}`}
                    aria-current={i === index}
                    onClick={() => onIndexChange(i)}
                    className={cn(
                      'relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition',
                      i === index
                        ? 'border-accent-400'
                        : 'border-transparent opacity-60 hover:opacity-100',
                    )}
                  >
                    {(() => {
                      const cover = resolveVideoCover({
                        thumbUrl: thumb.thumbUrl,
                        imageUrl: thumb.imageUrl,
                        videoUrl: thumb.videoUrl,
                      })
                      if (!cover) {
                        return (
                          <span className="flex h-full w-full items-center justify-center bg-brand-800 text-white">
                            <Play className="h-4 w-4" />
                          </span>
                        )
                      }
                      return <img src={cover} alt="" className="h-full w-full object-cover" />
                    })()}
                    {thumb.mediaType === 'video' ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <Play className="h-4 w-4 text-white" />
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function GalleryMediaCard({
  item,
  index,
  onOpen,
  reduceMotion,
  priority,
}: {
  item: GalleryItem
  index: number
  onOpen: (index: number) => void
  reduceMotion: boolean | null
  priority?: boolean
}) {
  const isVideo = item.mediaType === 'video'
  const cover = resolveVideoCover({
    thumbUrl: item.thumbUrl,
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
  })

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
      className="group overflow-hidden rounded-2xl border border-line bg-white text-left shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
    >
      <div className="relative overflow-hidden">
        <div className="transition duration-500 group-hover:scale-[1.04]">
          <OptimizedImage
            src={cover}
            alt={item.title}
            aspect="aspect-[4/3]"
            fit={item.album === 'Affiches' ? 'contain' : 'cover'}
            priority={priority}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-900/45 via-transparent to-transparent opacity-80" />
        {isVideo ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-brand-800 shadow-soft ring-4 ring-white/25 transition group-hover:scale-105">
              <Play className="h-5 w-5 fill-current" />
            </span>
          </span>
        ) : (
          <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-800 opacity-0 shadow-soft transition group-hover:opacity-100">
            <ZoomIn className="h-4 w-4" />
          </span>
        )}
        {item.album ? (
          <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full bg-brand-900/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            {item.album}
          </span>
        ) : null}
      </div>
      <div className="px-2.5 py-2.5 sm:px-3.5 sm:py-3.5">
        <p className="line-clamp-2 text-xs font-semibold leading-snug text-ink sm:truncate sm:text-sm">
          {item.title}
        </p>
        <p className="mt-0.5 text-[10px] text-muted sm:text-xs">{isVideo ? 'Vidéo' : 'Photo'}</p>
      </div>
    </motion.button>
  )
}

export function GallerySwipe({
  items,
  layout = 'grid',
}: {
  items: GalleryItem[]
  layout?: 'carousel' | 'grid'
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const openAt = (index: number) => {
    setLightboxIndex(index)
    setOpen(true)
  }

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 380), behavior: 'smooth' })
  }

  const onScrollerKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollBy(-1)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollBy(1)
    }
  }

  if (!items.length) return null

  return (
    <>
      {layout === 'carousel' ? (
        <div className="relative">
          <div
            ref={scrollerRef}
            tabIndex={0}
            onKeyDown={onScrollerKeyDown}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="w-[78%] shrink-0 snap-center sm:w-[42%] lg:w-[30%]"
              >
                <GalleryMediaCard
                  item={item}
                  index={index}
                  onOpen={openAt}
                  reduceMotion={reduceMotion}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-muted">
              {items.length} média{items.length > 1 ? 's' : ''} · cliquez pour ouvrir
            </p>
            <div className="hidden gap-2 sm:flex">
              <Button variant="secondary" size="sm" aria-label="Précédent" onClick={() => scrollBy(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" aria-label="Suivant" onClick={() => scrollBy(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
          {items.map((item, index) => (
            <GalleryMediaCard
              key={item.id}
              item={item}
              index={index}
              onOpen={openAt}
              reduceMotion={reduceMotion}
              priority={index < 4}
            />
          ))}
        </div>
      )}

      <GalleryLightbox
        items={items}
        index={lightboxIndex}
        open={open}
        onClose={() => setOpen(false)}
        onIndexChange={setLightboxIndex}
      />
    </>
  )
}
