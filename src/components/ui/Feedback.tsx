import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

export function Badge({
  children,
  tone = 'brand',
  className,
}: {
  children: ReactNode
  tone?: 'brand' | 'accent' | 'muted'
  className?: string
}) {
  const tones = {
    brand: 'bg-brand-100 text-brand-800',
    accent: 'bg-accent-400/30 text-ink',
    muted: 'bg-line text-muted',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('mb-6 max-w-2xl', className)}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-2 text-base leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
  )
}

export function PageHero({
  title,
  subtitle,
  eyebrow,
}: {
  title: string
  subtitle?: string
  eyebrow?: string
}) {
  return (
    <section className="relative overflow-hidden bg-brand-700 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(232,184,74,0.25),transparent_45%),linear-gradient(160deg,#0b3d2e_0%,#083226_55%,#05261c_100%)]" />
      <div className="container-app relative py-12 sm:py-16 lg:py-20">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  )
}

export function EmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700',
        className,
      )}
      role="status"
      aria-label="Chargement"
    />
  )
}
