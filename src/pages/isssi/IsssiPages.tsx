import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, GraduationCap, Newspaper } from 'lucide-react'
import { Seo } from '@/components/shared/Seo'
import { CmsPage, CmsProse } from '@/components/shared/CmsPage'
import { GallerySwipe } from '@/components/shared/GallerySwipe'
import { HeroBanner, resolveBannerSlides } from '@/components/shared/HeroBanner'
import { Spinner } from '@/components/ui/Feedback'
import { Button } from '@/components/ui/Button'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import {
  getPageBySlug,
  getPrograms,
  getShortCourses,
  listenGallery,
  listenHomepage,
  listenNews,
  listenPaymentInfo,
  listenPrograms,
  listenShortCourses,
} from '@/services/contentService'
import type {
  GalleryItem,
  HomepageConfig,
  NewsItem,
  PageContent,
  PaymentInfo,
  ProgramItem,
  ShortCourseItem,
} from '@/types'
import { useSite } from '@/app/SiteProvider'
import { resolvePresentationBlocks } from '@/utils/presentationBlocks'

const quickNav = [
  { label: 'Filières', to: '/isssi/filieres' },
  { label: 'Academy', to: '/isssi/formations-courtes' },
  { label: 'Admission', to: '/isssi/admission' },
  { label: 'Préinscription', to: '/isssi/preinscription' },
  { label: 'Frais', to: '/isssi/frais' },
  { label: 'Actualités', to: '/isssi/actualites' },
  { label: 'Galerie', to: '/isssi/galerie' },
  { label: 'Contact', to: '/isssi/contact' },
] as const

const academicPillars = [
  {
    title: 'Excellence',
    text: 'Programmes structurés et professionnalisants.',
  },
  {
    title: 'Terrain',
    text: 'Formation liée aux besoins des communautés.',
  },
  {
    title: 'Éthique',
    text: 'Intégrité et sens du service public.',
  },
  {
    title: 'Emploi',
    text: 'Compétences concrètes pour le marché.',
  },
] as const

const admissionSteps = [
  {
    step: '1',
    title: 'S’informer',
    text: 'Admission, filières et frais.',
    to: '/isssi/admission',
  },
  {
    step: '2',
    title: 'Choisir',
    text: 'Sélectionnez votre filière.',
    to: '/isssi/filieres',
  },
  {
    step: '3',
    title: 'Préinscription',
    text: 'Dossier en ligne, sur mobile.',
    to: '/isssi/preinscription',
  },
  {
    step: '4',
    title: 'Suivi',
    text: 'L’admin vous recontacte.',
    to: '/isssi/contact',
  },
] as const

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  )
}

function IsssiEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700 sm:mb-3 sm:gap-3">
      <span className="h-px w-6 bg-accent-500 sm:w-8" aria-hidden />
      {children}
    </p>
  )
}

export function IsssiHomePage() {
  const site = useSite()
  const reduceMotion = useReducedMotion()
  const [programs, setPrograms] = useState<ProgramItem[]>([])
  const [shortCourses, setShortCourses] = useState<ShortCourseItem[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [home, setHome] = useState<HomepageConfig | null>(null)
  const [page, setPage] = useState<PageContent | null>(null)
  const [vision, setVision] = useState<PageContent | null>(null)
  const [campus, setCampus] = useState<PageContent | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const [payment, setPayment] = useState<PaymentInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void Promise.all([
      getPageBySlug('isssi'),
      getPageBySlug('isssi-vision-mission'),
      getPageBySlug('isssi-campus'),
      getPrograms(),
      getShortCourses(),
    ]).then(([p, v, c, prog, courses]) => {
      setPage(p)
      setVision(v)
      setCampus(c)
      setPrograms(prog)
      setShortCourses(courses)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const unsubNews = listenNews('isssi', 3, setNews)
    const unsubGallery = listenGallery('isssi', (items) => setGallery(items.slice(0, 12)))
    const unsubPayment = listenPaymentInfo('isssi', setPayment)
    const unsubHome = listenHomepage('isssi', setHome)
    const unsubCourses = listenShortCourses(setShortCourses)
    const unsubPrograms = listenPrograms(setPrograms)
    return () => {
      unsubNews()
      unsubGallery()
      unsubPayment()
      unsubHome()
      unsubCourses()
      unsubPrograms()
    }
  }, [])

  const titlePrimary = home?.titlePrimary || site.isssi.name
  const titleSecondary = home?.titleSecondary || site.isssi.fullName
  const titleTertiary = home?.titleTertiary || home?.slogan || site.isssi.tagline
  const bannerSlides = resolveBannerSlides(home)
  const presentation = useMemo(
    () =>
      resolvePresentationBlocks({
        content: page?.content,
        sectionOffers: page?.sectionOffers,
        sectionAxes: page?.sectionAxes,
        sectionAcademicLife: page?.sectionAcademicLife,
      }),
    [page],
  )
  const featuredPrograms = programs.slice(0, 6)
  const featuredShortCourses = shortCourses.slice(0, 6)

  return (
    <>
      <Seo
        title={page?.seoTitle || page?.title || 'Présentation de l’ISSSI'}
        description={page?.seoDescription || page?.excerpt || titleTertiary}
        path="/isssi"
      />

      <HeroBanner slides={bannerSlides} align="end">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
        >
          <div className="mb-5 flex items-center gap-3">
            <img
              src={site.isssi.logoUrl}
              alt=""
              className="h-12 w-12 rounded-lg object-cover ring-1 ring-white/30 sm:h-14 sm:w-14"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-400 sm:text-[11px]">
                Institut académique
              </p>
              <p className="truncate text-xs text-white/70 sm:text-sm">CMEIS-DG3 · Kinshasa</p>
            </div>
          </div>
          <p className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {titlePrimary}
          </p>
          <h1 className="mt-3 max-w-2xl text-base font-medium leading-snug text-white/90 sm:mt-4 sm:text-xl">
            {titleSecondary}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-base">
            {titleTertiary}
          </p>
          <div className="mt-7 grid grid-cols-1 gap-2.5 sm:mt-9 sm:flex sm:flex-row sm:gap-3">
            <Link to="/isssi/preinscription" className="sm:flex-none">
              <Button variant="accent" size="lg" fullWidth className="sm:w-auto">
                Préinscription
              </Button>
            </Link>
            <Link to="/isssi/filieres" className="sm:flex-none">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                className="border-white/25 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                Voir les filières
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </HeroBanner>

      {/* Sommaire — navigation verticale, sans scroll horizontal */}
      <section className="border-b border-brand-100 bg-white">
        <div className="container-app py-5 sm:py-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
            Accès rapide
          </p>
          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" aria-label="Accès rapide ISSSI">
            {quickNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex min-h-12 items-center justify-between gap-2 border border-brand-100 bg-[#f3f6f4] px-3 py-3 text-sm font-semibold text-brand-900 transition active:bg-brand-50 sm:hover:border-accent-500"
              >
                <span>{item.label}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-brand-600" />
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Piliers — grille 2×2 */}
      <section className="bg-[#f3f6f4] py-6 sm:py-8">
        <div className="container-app">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {academicPillars.map((item) => (
              <div
                key={item.title}
                className="border border-brand-100 bg-white p-3.5 sm:p-5"
              >
                <p className="font-display text-sm font-semibold text-brand-900 sm:text-lg">
                  {item.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Présentation — sync 1:1 avec admin (titre, description, 3 sections) */}
      <section id="presentation" className="scroll-mt-20 bg-white py-10 sm:py-16 lg:py-20">
        <div className="container-app">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
              <Reveal>
                <IsssiEyebrow>Présentation</IsssiEyebrow>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-900 sm:text-3xl lg:text-4xl">
                  {page?.title || 'Présentation de l’ISSSI'}
                </h2>
                {page?.excerpt ? (
                  <p className="mt-3 border-l-2 border-accent-500 pl-3 text-sm leading-relaxed text-brand-800/90 sm:mt-4 sm:pl-4 sm:text-base lg:text-lg">
                    {page.excerpt}
                  </p>
                ) : null}

                {presentation.intro ? (
                  <div className="mt-5 sm:mt-7">
                    <CmsProse
                      content={presentation.intro}
                      className="max-w-3xl space-y-2.5 text-sm leading-relaxed text-muted sm:space-y-3 sm:text-base"
                    />
                  </div>
                ) : null}

                <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                  {presentation.offers ? (
                    <div className="rounded-xl border border-brand-100 bg-[#f7faf8] p-4 sm:p-5">
                      <h3 className="font-display text-lg font-semibold text-brand-900">
                        Ce que propose l’institut
                      </h3>
                      <CmsProse
                        content={presentation.offers}
                        className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted sm:text-base"
                      />
                    </div>
                  ) : null}
                  {presentation.axes ? (
                    <div className="rounded-xl border border-brand-100 bg-white p-4 sm:p-5">
                      <h3 className="font-display text-lg font-semibold text-brand-900">
                        Axes de formation
                      </h3>
                      <CmsProse
                        content={presentation.axes}
                        className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted sm:text-base"
                      />
                    </div>
                  ) : null}
                  {presentation.academicLife ? (
                    <div className="rounded-xl border border-brand-100 bg-[#f7faf8] p-4 sm:p-5">
                      <h3 className="font-display text-lg font-semibold text-brand-900">
                        Vie académique
                      </h3>
                      <CmsProse
                        content={presentation.academicLife}
                        className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted sm:text-base"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
                  <Link
                    to="/isssi/vision-mission"
                    className="inline-flex min-h-11 items-center justify-between border border-brand-100 px-3 text-sm font-semibold text-brand-700 sm:border-0 sm:px-0"
                  >
                    Vision et mission <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/isssi/mot-direction"
                    className="inline-flex min-h-11 items-center justify-between border border-brand-100 px-3 text-sm font-semibold text-brand-700 sm:border-0 sm:px-0"
                  >
                    Direction générale <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.06} className="space-y-4">
                {page?.coverImage ? (
                  <div className="overflow-hidden rounded-lg ring-1 ring-brand-100">
                    <OptimizedImage
                      src={page.coverImage}
                      alt={page.title || 'ISSSI'}
                      aspect="aspect-[16/11] lg:aspect-[4/5]"
                    />
                  </div>
                ) : null}
                <div className="rounded-lg border border-brand-100 bg-white p-4 sm:p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
                    Contact ISSSI
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted">
                    <li>{site.isssi.contact.address}</li>
                    <li>
                      <a
                        href={`mailto:${site.isssi.contact.email}`}
                        className="font-medium text-brand-800"
                      >
                        {site.isssi.contact.email}
                      </a>
                    </li>
                    <li>
                      <a href={`tel:${site.isssi.contact.phone}`} className="font-medium text-brand-800">
                        {site.isssi.contact.phone}
                      </a>
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* Vision + campus */}
      <section className="bg-[#f3f6f4] py-10 sm:py-16">
        <div className="container-app grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="h-full border border-brand-100 bg-white p-5 sm:p-7">
              <IsssiEyebrow>Vision et mission</IsssiEyebrow>
              <h2 className="font-display text-xl font-semibold text-brand-900 sm:text-2xl">
                {vision?.title || 'Notre cap académique'}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {vision?.excerpt ||
                  'Former des professionnels compétents, éthiques et utiles aux communautés.'}
              </p>
              <Link
                to="/isssi/vision-mission"
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700"
              >
                Lire la page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </Reveal>
          <Reveal delay={0.06}>
            <article className="flex h-full flex-col border border-brand-100 bg-brand-900 p-5 text-white sm:p-7">
              <p className="mb-2 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-400">
                <span className="h-px w-6 bg-accent-500" aria-hidden />
                Campus
              </p>
              <h2 className="font-display text-xl font-semibold sm:text-2xl">
                {campus?.title || 'Un cadre pour apprendre'}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/75">
                {campus?.excerpt ||
                  'Espaces de cours, travaux pratiques et vie étudiante à Kinshasa.'}
              </p>
              <Link
                to="/isssi/campus"
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-400"
              >
                Voir le campus
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </Reveal>
        </div>
      </section>

      {/* Étapes — liste verticale claire */}
      <section id="candidature" className="scroll-mt-20 bg-white py-10 sm:py-16">
        <div className="container-app">
          <Reveal>
            <IsssiEyebrow>Candidature</IsssiEyebrow>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-900 sm:text-3xl">
              4 étapes pour postuler
            </h2>
            <p className="mt-2 text-sm text-muted sm:text-base">
              Suivez le parcours, du premier renseignement à la préinscription.
            </p>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
            {admissionSteps.map((item) => (
              <Link
                key={item.step}
                to={item.to}
                className="flex items-start gap-3 border border-brand-100 bg-[#f3f6f4] p-4 transition active:border-accent-500 sm:flex-col sm:hover:border-accent-500"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-accent-500 font-display text-lg font-semibold text-ink">
                  {item.step}
                </span>
                <span>
                  <h3 className="font-display text-base font-semibold text-brand-900 sm:mt-1 sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{item.text}</p>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filières */}
      {featuredPrograms.length > 0 ? (
        <section id="filieres" className="scroll-mt-20 bg-white py-10 sm:py-16">
          <div className="container-app">
            <Reveal>
              <div className="mb-5 flex items-end justify-between gap-3 sm:mb-7">
                <div>
                  <IsssiEyebrow>Formation</IsssiEyebrow>
                  <h2 className="font-display text-2xl font-semibold text-brand-900 sm:text-3xl">
                    Filières et options
                  </h2>
                </div>
                <Link
                  to="/isssi/filieres"
                  className="text-sm font-semibold text-brand-700"
                >
                  Tout voir
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPrograms.map((p) => (
                <Link
                  key={p.id}
                  to={`/isssi/filieres/${p.slug}`}
                  className="flex flex-col overflow-hidden border border-brand-100 bg-[#f3f6f4] sm:bg-white sm:hover:border-brand-300"
                >
                  <OptimizedImage
                    src={p.coverImage || ''}
                    alt={p.title}
                    aspect="aspect-[16/10]"
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-brand-700">
                      {[p.level, p.duration].filter(Boolean).join(' · ')}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-semibold text-brand-900">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted">
                      {p.summary || p.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                      <GraduationCap className="h-4 w-4" />
                      Détails
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {featuredShortCourses.length > 0 ? (
        <section className="scroll-mt-20 border-t border-brand-100 bg-[#f3f6f4] py-10 sm:py-16">
          <div className="container-app">
            <Reveal>
              <div className="mb-5 flex items-end justify-between gap-3 sm:mb-7">
                <div>
                  <IsssiEyebrow>ISSSI Academy</IsssiEyebrow>
                  <h2 className="font-display text-2xl font-semibold text-brand-900 sm:text-3xl">
                    Formations courtes et certifiées
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                    Deux académies spécialisées : urgences et santé humanitaire, leadership
                    communautaire et protection sociale en santé.
                  </p>
                </div>
                <Link
                  to="/isssi/formations-courtes"
                  className="text-sm font-semibold text-brand-700"
                >
                  Tout voir
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredShortCourses.map((item) => (
                <Link
                  key={item.id}
                  to={`/isssi/formations-courtes/${item.slug}`}
                  className="flex flex-col overflow-hidden border border-brand-100 bg-white sm:hover:border-brand-300"
                >
                  <OptimizedImage
                    src={item.coverImage || ''}
                    alt={item.title}
                    aspect="aspect-[16/10]"
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-brand-700">
                      {[item.duration || 'Formation courte', item.tuition?.trim() || 'Sur demande']
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-semibold text-brand-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted">
                      {item.summary || item.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                      <GraduationCap className="h-4 w-4" />
                      Détails
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Actualités */}
      {news.length > 0 ? (
        <section id="actualites" className="scroll-mt-20 border-t border-brand-100 bg-[#f3f6f4] py-10 sm:py-14">
          <div className="container-app">
            <Reveal>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <IsssiEyebrow>Actualités</IsssiEyebrow>
                  <h2 className="font-display text-2xl font-semibold text-brand-900 sm:text-3xl">
                    Actualités académiques
                  </h2>
                </div>
                <Link to="/isssi/actualites" className="text-sm font-semibold text-brand-700">
                  Toutes
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-3">
              {news.map((item) => (
                <Link
                  key={item.id}
                  to={`/isssi/actualites/${item.slug}`}
                  className="border border-brand-100 bg-white p-4 transition active:border-accent-500 sm:hover:border-accent-500"
                >
                  <div className="flex items-start gap-2">
                    <Newspaper className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-brand-700">
                        {item.category || 'ISSSI'}
                      </p>
                      <h3 className="mt-1 font-display text-base font-semibold leading-snug text-brand-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{item.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Galerie — après les actualités */}
      {gallery.length > 0 ? (
        <section id="galerie" className="scroll-mt-20 border-t border-brand-100 bg-white py-10 sm:py-14">
          <div className="container-app">
            <Reveal>
              <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <IsssiEyebrow>Galerie</IsssiEyebrow>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-900 sm:text-3xl">
                    La vie de l’institut
                  </h2>
                  <p className="mt-2 max-w-lg text-sm text-muted sm:text-base">
                    Photos et vidéos du campus et des activités.
                  </p>
                </div>
                <Link
                  to="/isssi/galerie"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-700"
                >
                  Toute la galerie
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <GallerySwipe items={gallery.slice(0, 6)} layout="grid" />
          </div>
        </section>
      ) : null}

      {/* Paiements — données admin « Paiements » */}
      {payment ? (
        <section id="frais" className="scroll-mt-20 border-t border-brand-100 bg-[#f3f6f4] py-10 sm:py-14">
          <div className="container-app">
            <Reveal>
              <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <IsssiEyebrow>Paiements</IsssiEyebrow>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-900 sm:text-3xl">
                    {payment.title || 'Frais et modalités de paiement'}
                  </h2>
                  {payment.intro ? (
                    <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">{payment.intro}</p>
                  ) : null}
                </div>
                <Link
                  to="/isssi/frais"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-700"
                >
                  Voir le détail
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <article className="border border-brand-100 bg-white p-5">
                <h3 className="font-display text-lg font-semibold text-brand-900">
                  Frais d’inscription
                </h3>
                <p className="mt-3 text-lg font-semibold text-ink sm:text-xl">
                  {payment.registrationFee || 'Sur demande'}
                </p>
              </article>
              <article className="border border-brand-100 bg-white p-5">
                <h3 className="font-display text-lg font-semibold text-brand-900">
                  Frais académiques / an
                </h3>
                <p className="mt-3 text-lg font-semibold text-ink sm:text-xl">
                  {payment.annualFee || 'Sur demande'}
                </p>
              </article>
              <article className="border border-brand-100 bg-white p-5">
                <h3 className="font-display text-lg font-semibold text-brand-900">Bancaire</h3>
                {payment.bankName || payment.bankAccountNumber ? (
                  <dl className="mt-3 space-y-2 text-sm text-muted">
                    {payment.bankName ? (
                      <div>
                        <dt className="font-semibold text-brand-800">Banque</dt>
                        <dd>{payment.bankName}</dd>
                      </div>
                    ) : null}
                    {payment.bankAccountNumber ? (
                      <div>
                        <dt className="font-semibold text-brand-800">Compte</dt>
                        <dd className="font-medium text-ink">{payment.bankAccountNumber}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : (
                  <p className="mt-3 text-sm text-muted">Détails sur la page frais.</p>
                )}
              </article>
              <article className="border border-brand-100 bg-white p-5">
                <h3 className="font-display text-lg font-semibold text-brand-900">Mobile Money</h3>
                {(payment.mobileMoney || []).filter((m) => m.label || m.number).length ? (
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {payment.mobileMoney
                      .filter((m) => m.label || m.number)
                      .slice(0, 3)
                      .map((m) => (
                        <li key={`${m.label}-${m.number}`} className="flex justify-between gap-2">
                          <span className="font-semibold text-brand-800">{m.label}</span>
                          <span className="font-medium text-ink">{m.number}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">Détails sur la page frais.</p>
                )}
              </article>
            </div>
            <div className="mt-5">
              <Link to="/isssi/frais">
                <Button variant="secondary" size="lg">
                  Frais académiques et paiements
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="border-t-4 border-accent-500 bg-brand-900 py-10 text-white sm:py-14">
        <div className="container-app">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-400">
              Préinscription
            </p>
            <h2 className="mt-2 max-w-xl font-display text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Déposez votre dossier maintenant
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
              Formulaire guidé sur mobile. Conservez votre numéro de référence pour le suivi.
            </p>
            <div className="mt-6 grid gap-2.5 sm:flex sm:flex-row sm:gap-3">
              <Link to="/isssi/preinscription">
                <Button variant="accent" size="lg" fullWidth className="sm:w-auto">
                  Démarrer
                </Button>
              </Link>
              <Link to="/isssi/frais">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                >
                  Voir les frais
                </Button>
              </Link>
              <Link to="/isssi/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                >
                  Contact
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export function IsssiDirectorPage() {
  return (
    <CmsPage
      slug="isssi-mot-direction"
      eyebrow="ISSSI"
      path="/isssi/mot-direction"
    />
  )
}

export function IsssiVisionPage() {
  return (
    <CmsPage
      slug="isssi-vision-mission"
      eyebrow="ISSSI"
      path="/isssi/vision-mission"
    />
  )
}

export function IsssiCampusPage() {
  return <CmsPage slug="isssi-campus" eyebrow="ISSSI" path="/isssi/campus" />
}

export function IsssiAdmissionPage() {
  return <CmsPage slug="isssi-admission" eyebrow="ISSSI" path="/isssi/admission" />
}

export function IsssiFeesPage() {
  const [info, setInfo] = useState<PaymentInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = listenPaymentInfo('isssi', (data) => {
      setInfo(data)
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    )
  }

  if (!info) {
    // Secours CMS uniquement si rien n’est publié dans Admin → Paiements
    return (
      <>
        <CmsPage slug="isssi-frais" eyebrow="ISSSI" path="/isssi/frais" />
        <section className="border-t border-brand-100 bg-[#f3f6f4] py-8">
          <div className="container-app">
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Les frais et moyens de paiement se configurent dans l’admin (espace ISSSI →{' '}
              <strong>Frais & paiements</strong>), statut <strong>Publié</strong>.
            </p>
          </div>
        </section>
      </>
    )
  }

  const mobileLines = (info.mobileMoney || []).filter((m) => m.label || m.number)
  const hasBank = Boolean(
    info.bankName || info.bankAccountName || info.bankAccountNumber || info.bankSwift,
  )

  return (
    <>
      <Seo
        title={info.title || 'Frais académiques'}
        description={info.intro}
        path="/isssi/frais"
      />
      <section className="border-b border-brand-100 bg-[#f3f6f4]">
        <div className="container-app py-10 sm:py-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700">
            ISSSI
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-900 sm:text-4xl">
            {info.title}
          </h1>
          {info.intro ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {info.intro}
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-8 sm:py-12">
        <div className="container-app grid gap-4 lg:grid-cols-2">
          <article className="border border-brand-100 bg-[#f3f6f4] p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-brand-900">
              Frais d’inscription
            </h2>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-brand-900">
              {info.registrationFee || 'Communiqué par l’administration'}
            </p>
          </article>

          <article className="border border-brand-100 bg-[#f3f6f4] p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-brand-900">
              Frais académiques par an
            </h2>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-brand-900">
              {info.annualFee || 'Communiqué par l’administration'}
            </p>
          </article>

          {!info.registrationFee && !info.annualFee && info.feesOverview ? (
            <article className="border border-brand-100 bg-[#f3f6f4] p-5 sm:p-6 lg:col-span-2">
              <h2 className="font-display text-xl font-semibold text-brand-900">
                Frais officiels
              </h2>
              <CmsProse
                content={info.feesOverview}
                className="mt-4 max-w-none space-y-2 text-sm leading-relaxed text-muted sm:text-base"
              />
            </article>
          ) : null}

          {hasBank ? (
            <article className="border border-brand-100 bg-white p-5 sm:p-6">
              <h2 className="font-display text-xl font-semibold text-brand-900">
                Paiement bancaire
              </h2>
              <dl className="mt-4 space-y-2 text-sm text-muted sm:text-base">
                {info.bankName ? (
                  <div>
                    <dt className="font-semibold text-brand-800">Banque</dt>
                    <dd>{info.bankName}</dd>
                  </div>
                ) : null}
                {info.bankAccountName ? (
                  <div>
                    <dt className="font-semibold text-brand-800">Titulaire</dt>
                    <dd>{info.bankAccountName}</dd>
                  </div>
                ) : null}
                {info.bankAccountNumber ? (
                  <div>
                    <dt className="font-semibold text-brand-800">Numéro de compte</dt>
                    <dd className="font-medium text-ink">{info.bankAccountNumber}</dd>
                  </div>
                ) : null}
                {info.bankSwift ? (
                  <div>
                    <dt className="font-semibold text-brand-800">SWIFT / code</dt>
                    <dd>{info.bankSwift}</dd>
                  </div>
                ) : null}
              </dl>
            </article>
          ) : null}

          {mobileLines.length ? (
            <article className="border border-brand-100 bg-white p-5 sm:p-6">
              <h2 className="font-display text-xl font-semibold text-brand-900">
                Paiement Mobile Money
              </h2>
              <ul className="mt-4 space-y-3">
                {mobileLines.map((m) => (
                  <li
                    key={`${m.label}-${m.number}`}
                    className="flex flex-col border border-brand-100 bg-[#f3f6f4] px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm font-semibold text-brand-800">{m.label}</span>
                    <span className="text-sm font-medium text-ink">{m.number || '—'}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {info.instructions ? (
            <article className="border border-brand-100 bg-[#f3f6f4] p-5 sm:p-6 lg:col-span-2">
              <h2 className="font-display text-xl font-semibold text-brand-900">
                Instructions de paiement
              </h2>
              <CmsProse
                content={info.instructions}
                className="mt-4 max-w-none space-y-2 text-sm leading-relaxed text-muted sm:text-base"
              />
            </article>
          ) : null}
        </div>

        <div className="container-app mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/isssi/preinscription">
            <Button variant="accent" size="lg" fullWidth className="sm:w-auto">
              Préinscription
            </Button>
          </Link>
          <Link to="/isssi/contact">
            <Button variant="secondary" size="lg" fullWidth className="sm:w-auto">
              Contacter l’administration
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
