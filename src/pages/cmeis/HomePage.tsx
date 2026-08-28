import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  FileText,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Lightbulb,
  Mail,
} from 'lucide-react'
import { Seo } from '@/components/shared/Seo'
import { NewsCard } from '@/components/shared/NewsCard'
import { GallerySwipe } from '@/components/shared/GallerySwipe'
import { HeroBanner, resolveBannerSlides } from '@/components/shared/HeroBanner'
import { Button } from '@/components/ui/Button'
import { institutional } from '@/app/institutionalContent'
import {
  getDocuments,
  getPartners,
  getPrograms,
  listenGallery,
  listenHomepage,
  listenNews,
} from '@/services/contentService'
import type {
  DocumentItem,
  GalleryItem,
  HomepageConfig,
  NewsItem,
  Partner,
  ProgramItem,
} from '@/types'
import { useSite } from '@/app/SiteProvider'
import { cn } from '@/utils/cn'
import pcaJpeg from '@/assets/PCA.jpeg'
import defensePcaJpeg from '@/assets/Defense PCA.jpeg'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

const pillars = [
  {
    icon: HeartPulse,
    title: 'Santé',
    text: 'Soins intégrés et santé communautaire.',
    to: '/domaines',
    tone: 'bg-brand-800 text-white',
    iconTone: 'text-accent-400',
  },
  {
    icon: GraduationCap,
    title: 'Formation',
    text: 'Compétences professionnelles via l’ISSSI.',
    to: '/isssi/filieres',
    tone: 'bg-brand-50 text-ink ring-1 ring-brand-100',
    iconTone: 'text-brand-700',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    text: 'Recherche et solutions locales.',
    to: '/programmes',
    tone: 'bg-white text-ink ring-1 ring-line',
    iconTone: 'text-accent-500',
  },
  {
    icon: HandHeart,
    title: 'Humanitaire',
    text: 'Protection et résilience.',
    to: '/services',
    tone: 'bg-brand-700 text-white',
    iconTone: 'text-accent-400',
  },
]

const domaines = institutional.domaines.slice(0, 9)

const stats = [
  { value: '12+', label: 'Domaines d’action' },
  { value: 'ISSSI', label: 'Bras académique' },
  { value: 'RDC', label: 'Ancrage national' },
  { value: 'ASBL', label: 'Engagement public' },
]

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
      {children}
    </p>
  )
}

export function HomePage() {
  const site = useSite()
  const reduceMotion = useReducedMotion()
  const [news, setNews] = useState<NewsItem[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [home, setHome] = useState<HomepageConfig | null>(null)
  const [programs, setPrograms] = useState<ProgramItem[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [documents, setDocuments] = useState<DocumentItem[]>([])

  useEffect(() => {
    const unsubNews = listenNews(undefined, 6, setNews)
    const unsubGallery = listenGallery('cmeis', (items) => setGallery(items.slice(0, 9)))
    const unsubHome = listenHomepage('cmeis', setHome)
    void Promise.all([getPrograms(), getPartners(), getDocuments('cmeis')]).then(([p, pt, d]) => {
      setPrograms(p.slice(0, 4))
      setPartners(pt.slice(0, 8))
      setDocuments(d.slice(0, 6))
    })
    return () => {
      unsubNews()
      unsubGallery()
      unsubHome()
    }
  }, [])

  const titlePrimary = home?.titlePrimary || site.name
  const titleSecondary = home?.titleSecondary || site.fullName
  const titleTertiary = home?.titleTertiary || home?.slogan || site.tagline
  const bannerSlides = resolveBannerSlides(home, [pcaJpeg, defensePcaJpeg])

  return (
    <>
      <Seo title="Accueil" description={titleTertiary} path="/" />

      <HeroBanner slides={bannerSlides}>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-accent-400 sm:w-14" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-400">
              ASBL · Kinshasa, RDC
            </p>
          </div>
          <p className="font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            {titlePrimary}
          </p>
          <h1 className="mt-4 max-w-2xl text-base font-medium leading-snug text-white/90 sm:mt-5 sm:text-xl lg:text-2xl">
            {titleSecondary}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base lg:text-lg">
            {titleTertiary}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
            <Link to="/a-propos" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" fullWidth className="sm:w-auto">
                Découvrir CMEIS-DG3
              </Button>
            </Link>
            <Link to="/isssi" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                Espace ISSSI
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </HeroBanner>

      {/* Stats */}
      <section className="relative z-10 -mt-10 pb-2">
        <div className="container-app">
          <Reveal>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-soft sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white px-4 py-5 text-center sm:px-6 sm:py-6">
                  <p className="font-display text-2xl font-semibold text-brand-800 sm:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Histoire + piliers (sans photos stock) */}
      <section className="container-app py-14 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <Reveal>
            <SectionEyebrow>Notre histoire</SectionEyebrow>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Une force au service des communautés
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {institutional.contexteCourt}
            </p>
            <Link
              to="/a-propos"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
            >
              Lire notre histoire
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-800 p-7 text-white sm:p-8">
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent-500/20 blur-2xl" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-400">
                Ambition
              </p>
              <p className="mt-4 font-display text-2xl font-semibold leading-snug">
                Santé · Formation · Innovation · Humanitaire
              </p>
              <ul className="mt-6 space-y-2.5">
                {institutional.ambitionPlateforme.slice(0, 5).map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-brand-100 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-accent-400 before:content-['']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((item, i) => (
            <Reveal key={item.title} delay={0.04 * i}>
              <Link
                to={item.to}
                className={cn(
                  'group flex h-full flex-col rounded-[1.35rem] p-5 transition hover:-translate-y-0.5 hover:shadow-soft',
                  item.tone,
                )}
              >
                <item.icon className={cn('h-6 w-6', item.iconTone)} />
                <h3 className="mt-4 font-display text-xl font-semibold">{item.title}</h3>
                <p
                  className={cn(
                    'mt-1 text-sm',
                    item.tone.includes('text-white') ? 'text-white/75' : 'text-muted',
                  )}
                >
                  {item.text}
                </p>
                <span
                  className={cn(
                    'mt-5 inline-flex items-center gap-1 text-sm font-semibold',
                    item.tone.includes('text-white') ? 'text-accent-400' : 'text-brand-700',
                  )}
                >
                  Explorer <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Vision — bandeau brand, pas d’image */}
      <section className="relative overflow-hidden bg-brand-900 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(232,184,74,0.16),transparent_45%),radial-gradient(ellipse_at_90%_80%,rgba(47,127,94,0.25),transparent_40%)]" />
        <div className="container-app relative">
          <Reveal>
            <SectionEyebrow>
              <span className="text-accent-400">Vision</span>
            </SectionEyebrow>
            <blockquote className="max-w-4xl font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl lg:text-4xl">
              « {institutional.vision} »
            </blockquote>
            <div className="mt-7 flex flex-wrap gap-2">
              {institutional.mission.slice(0, 4).map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-white/12 bg-white/6 px-3.5 py-1.5 text-sm text-white/85"
                >
                  {m}
                </span>
              ))}
            </div>
            <Link to="/vision-mission" className="mt-8 inline-block">
              <Button variant="accent" size="lg">
                Vision & mission
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Domaines — grille typo */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="container-app">
          <Reveal>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionEyebrow>Domaines</SectionEyebrow>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Là où nous agissons
                </h2>
              </div>
              <Link
                to="/domaines"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
              >
                Tous les domaines <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {domaines.map((domaine, i) => (
              <Reveal key={domaine} delay={0.03 * i}>
                <Link
                  to="/domaines"
                  className={cn(
                    'group flex min-h-[112px] items-end rounded-2xl border border-line p-5 transition hover:border-brand-300 hover:shadow-soft',
                    i % 3 === 0 ? 'bg-brand-800 text-white' : 'bg-white text-ink',
                  )}
                >
                  <div>
                    <span
                      className={cn(
                        'text-[11px] font-semibold uppercase tracking-[0.16em]',
                        i % 3 === 0 ? 'text-accent-400' : 'text-brand-600',
                      )}
                    >
                      0{i + 1}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug">
                      {domaine}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="relative overflow-hidden bg-brand-50 py-14 sm:py-16">
        <div className="container-app">
          <Reveal>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionEyebrow>Programmes & ISSSI</SectionEyebrow>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Former pour transformer
                </h2>
                <p className="mt-3 max-w-xl text-muted">
                  Des filières concrètes pour les professionnels de santé de demain.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/programmes">
                  <Button variant="secondary" size="sm">
                    Programmes CMEIS
                  </Button>
                </Link>
                <Link to="/isssi/filieres">
                  <Button size="sm">Filières ISSSI</Button>
                </Link>
              </div>
            </div>
          </Reveal>

          {programs.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {programs.map((prog, i) => (
                <Reveal key={prog.id} delay={0.04 * i}>
                  <Link
                    to={`/isssi/filieres/${prog.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition hover:border-brand-300"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-600">
                      {prog.level || 'Filière'}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                      {prog.title}
                    </h3>
                    {prog.summary ? (
                      <p className="mt-2 line-clamp-3 text-sm text-muted">{prog.summary}</p>
                    ) : null}
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-brand-700">
                      Découvrir{' '}
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="rounded-2xl border border-line bg-white p-8 text-center">
                <p className="text-muted">Les filières seront bientôt publiées.</p>
                <Link to="/isssi" className="mt-4 inline-block">
                  <Button>Visiter l’ISSSI</Button>
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="container-app py-14 sm:py-16 lg:py-20">
        <Reveal>
          <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-soft sm:p-9">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <SectionEyebrow>Services</SectionEyebrow>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Une offre intégrée, éthique et humaine
                </h2>
                <p className="mt-4 text-muted">
                  Prévention, formation, protection et action humanitaire — avec une tolérance
                  zéro contre les abus et la corruption.
                </p>
                <Link to="/services" className="mt-7 inline-block">
                  <Button size="lg">
                    Voir les services
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  'Soins & prévention',
                  'Formation paramédicale',
                  'Protection sociale',
                  'Urgences & WASH',
                ].map((s) => (
                  <div
                    key={s}
                    className="rounded-2xl bg-brand-50 px-4 py-5 text-sm font-semibold text-brand-800"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Valeurs — grille, sans scroll horizontal */}
      <section className="border-y border-line bg-brand-800 py-8 sm:py-10">
        <div className="container-app">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {institutional.valeurs.map((v) => (
              <span
                key={v}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-3.5 py-2 text-sm font-semibold text-white sm:px-4"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Actualités — images CMS uniquement */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="container-app">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-3">
              <div>
                <SectionEyebrow>Actualités</SectionEyebrow>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Ce qui anime le terrain
                </h2>
              </div>
              <Link to="/actualites" className="text-sm font-semibold text-brand-700">
                Tout voir
              </Link>
            </div>
          </Reveal>
          {news.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item, i) => (
                <Reveal key={item.id} delay={0.04 * i}>
                  <NewsCard item={item} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Aucune actualité publiée pour le moment.</p>
          )}
        </div>
      </section>

      {/* Documents */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container-app">
          <Reveal>
            <SectionEyebrow>Documents</SectionEyebrow>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Ressources utiles
            </h2>
            <div className="mt-5 grid gap-2.5 sm:mt-6 sm:gap-3">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface/50 px-3 py-3.5 transition hover:border-brand-300 hover:bg-white hover:shadow-soft sm:gap-4 sm:p-4"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-800 text-accent-400 sm:h-11 sm:w-11">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink sm:truncate sm:text-base">
                        {doc.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted sm:text-sm">
                        {doc.category || 'Document'}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-600 sm:opacity-0 sm:transition sm:group-hover:opacity-100" />
                  </a>
                ))
              ) : (
                <p className="text-sm text-muted">Documents bientôt disponibles.</p>
              )}
            </div>
            <Link
              to="/documents"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700"
            >
              Bibliothèque complète <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Partenaires */}
      <section className="border-t border-line bg-surface/60 py-12 sm:py-16">
        <div className="container-app">
          <Reveal>
            <SectionEyebrow>Partenaires</SectionEyebrow>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Ensemble, plus loin
            </h2>
            <p className="mt-2 text-sm text-muted sm:mt-3 sm:text-base">
              Institutions, académie, humanitaire et communautés locales.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {(partners.length > 0
                ? partners
                : institutional.partenaires.slice(0, 8).map((name, i) => ({
                    id: `fallback-${i}`,
                    name,
                    logoUrl: undefined as string | undefined,
                  }))
              ).map((p) => (
                <div
                  key={p.id}
                  className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-white px-2.5 py-3.5 text-center sm:min-h-[96px] sm:px-3 sm:py-4"
                >
                  {p.logoUrl ? (
                    <img
                      src={p.logoUrl}
                      alt=""
                      className="h-9 w-9 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                      {p.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-ink sm:text-xs">
                    {p.name}
                  </p>
                </div>
              ))}
            </div>
            <Link
              to="/partenaires"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700"
            >
              Voir les partenaires <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Galerie CMS */}
      {gallery.length > 0 ? (
        <section className="py-14 sm:py-16 lg:py-20">
          <div className="container-app">
            <Reveal>
              <div className="mb-8 flex items-end justify-between gap-3">
                <div>
                  <SectionEyebrow>Galerie</SectionEyebrow>
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                    La vie du complexe
                  </h2>
                </div>
                <Link to="/galerie" className="text-sm font-semibold text-brand-700">
                  Ouvrir la galerie
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <GallerySwipe items={gallery} layout="grid" />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ISSSI CTA — sans photo */}
      <section className="relative overflow-hidden bg-brand-800 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="container-app relative">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
              Portail ISSSI
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Votre parcours commence ici
            </h2>
            <p className="mt-4 max-w-xl text-brand-100">
              Préinscription simple, mobile-first, synchronisée avec l’administration.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/isssi/preinscription">
                <Button variant="accent" size="lg">
                  Préinscription
                </Button>
              </Link>
              <Link to="/isssi">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  Découvrir l’institut
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section className="container-app py-14 sm:py-16 lg:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-900 px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-accent-500/18 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div>
                <SectionEyebrow>
                  <span className="text-accent-400">Contact</span>
                </SectionEyebrow>
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Construisons le prochain projet ensemble
                </h2>
                <p className="mt-3 max-w-xl text-brand-100">
                  Partenariats, informations institutionnelles ou questions sur l’ISSSI.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-100">
                  <span>{site.contact.email}</span>
                  <span>{site.contact.phone}</span>
                  <span>{site.contact.address}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/contact">
                  <Button variant="accent" size="lg" fullWidth>
                    <Mail className="h-4 w-4" />
                    Écrire un message
                  </Button>
                </Link>
                <Link to="/vision-mission">
                  <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    className="border-white/15 bg-white/10 text-white hover:bg-white/15"
                  >
                    Vision & mission
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
