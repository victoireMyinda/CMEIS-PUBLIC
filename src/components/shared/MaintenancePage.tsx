import { Wrench } from 'lucide-react'
import { Seo } from '@/components/shared/Seo'

export function MaintenancePage({
  siteName,
  logoUrl,
  message = 'Site en maintenance',
}: {
  siteName: string
  logoUrl: string
  message?: string
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-brand-900 text-white">
      <Seo title="Maintenance" description={message} path="/" noIndex />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 15% 10%, rgb(47 127 94 / 0.45), transparent 48%), radial-gradient(ellipse at 90% 85%, rgb(212 160 23 / 0.22), transparent 42%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <img
          src={logoUrl}
          alt={siteName}
          className="mb-8 h-16 w-16 rounded-2xl object-cover ring-2 ring-accent-500/50 shadow-lg"
        />
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-accent-400">
          <Wrench className="h-7 w-7" aria-hidden />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-400">
          {siteName}
        </p>
        <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {message || 'Site en maintenance'}
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
          Nous améliorons actuellement l’expérience. Merci de revenir un peu plus tard.
        </p>
        <div className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-accent-500 to-transparent" />
      </main>
    </div>
  )
}
