import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { Seo } from '@/components/shared/Seo'
import { PageHero, EmptyState, Spinner } from '@/components/ui/Feedback'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import {
  getAcademyInfo,
  getShortCourseBySlug,
  listenShortCourses,
} from '@/services/contentService'
import type { AcademyId, AcademyInfo, ShortCourseItem } from '@/types'

const DEFAULT_INFO: AcademyInfo = {
  id: 'isssi',
  umbrellaName: 'ISSSI Academy',
  umbrellaTagline: 'Professional Development & Continuing Education',
  intro:
    'Marque ombrelle de la formation continue de l’ISSSI : deux académies spécialisées pour les professionnels, ONG, zones de santé, églises, mutuelles et partenaires techniques et financiers.',
  healthName: 'ISSSI Health & Emergency Academy',
  healthSubtitle: 'Académie des formations en santé, urgences et action humanitaire',
  healthAudience:
    'Professionnels de santé, agents communautaires, ONG et acteurs humanitaires.',
  communityName: 'ISSSI Community Leadership & Health Insurance Academy',
  communitySubtitle: 'Académie du leadership communautaire et de la protection sociale en santé',
  communityAudience:
    'Agents communautaires, leaders communautaires et religieux, associations et responsables des mutuelles de santé.',
}

function coursesOf(items: ShortCourseItem[], academy: AcademyId) {
  return items
    .filter((item) => item.academy === academy)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title, 'fr'))
}

function priceLabel(item: ShortCourseItem) {
  return item.tuition?.trim() || 'Sur demande'
}

function CourseCard({ item }: { item: ShortCourseItem }) {
  return (
    <Card as="article">
      <OptimizedImage src={item.coverImage || ''} alt={item.title} />
      <CardBody>
        <h3 className="font-display text-lg font-semibold leading-snug">{item.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{item.summary || item.description}</p>
        <p className="mt-3 text-xs font-medium text-brand-700">
          {item.duration || 'Formation courte'} · {priceLabel(item)}
        </p>
        <Link
          to={`/isssi/formations-courtes/${item.slug}`}
          className="mt-3 inline-block text-sm font-semibold text-brand-800"
        >
          Voir le détail
        </Link>
      </CardBody>
    </Card>
  )
}

function AcademySection({
  name,
  subtitle,
  audience,
  items,
}: {
  name: string
  subtitle: string
  audience: string
  items: ShortCourseItem[]
}) {
  if (items.length === 0) return null
  return (
    <section className="mt-12 first:mt-0 sm:mt-16">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">Academy</p>
      <h2 className="mt-2 max-w-3xl font-display text-2xl font-semibold text-ink sm:text-3xl">
        {name}
      </h2>
      <p className="mt-2 max-w-3xl text-sm font-medium text-brand-800 sm:text-base">{subtitle}</p>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{audience}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <CourseCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

export function ShortCoursesPage() {
  const [info, setInfo] = useState<AcademyInfo>(DEFAULT_INFO)
  const [courses, setCourses] = useState<ShortCourseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    void getAcademyInfo().then((data) => {
      if (data) setInfo({ ...DEFAULT_INFO, ...data })
    })
    return listenShortCourses((items) => {
      setCourses(items)
      setLoading(false)
    })
  }, [])

  const matched = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return courses
    return courses.filter((item) => item.title.toLowerCase().includes(q))
  }, [courses, query])

  const health = useMemo(() => coursesOf(matched, 'health-emergency'), [matched])
  const community = useMemo(() => coursesOf(matched, 'community-leadership'), [matched])
  const searching = query.trim().length > 0

  return (
    <>
      <Seo
        title="Formations courtes et certifiées"
        description={info.intro}
        path="/isssi/formations-courtes"
      />
      <PageHero
        eyebrow="ISSSI Academy"
        title="Formations courtes et certifiées"
        subtitle={info.umbrellaTagline}
      />

      <section className="container-app py-8 sm:py-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
          {info.umbrellaName}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{info.intro}</p>

        <div className="relative mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une formation par son titre…"
            aria-label="Rechercher une formation par son titre"
            className="h-12 w-full rounded-2xl border border-line bg-white pl-11 pr-11 text-[15px] text-ink shadow-soft outline-none placeholder:text-muted/70 focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
          />
          {searching ? (
            <button
              type="button"
              aria-label="Effacer la recherche"
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
        {searching ? (
          <p className="mt-3 text-sm text-muted">
            {matched.length} formation{matched.length > 1 ? 's' : ''} pour « {query.trim()} »
          </p>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : matched.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title={searching ? 'Aucune formation trouvée' : 'Aucune formation publiée'}
              description={
                searching
                  ? 'Essayez un autre titre, ou effacez la recherche pour voir toutes les formations.'
                  : 'Les formations publiées depuis l’admin apparaîtront ici.'
              }
            />
          </div>
        ) : (
          <>
            <AcademySection
              name={info.healthName}
              subtitle={info.healthSubtitle}
              audience={info.healthAudience}
              items={health}
            />
            <AcademySection
              name={info.communityName}
              subtitle={info.communitySubtitle}
              audience={info.communityAudience}
              items={community}
            />
          </>
        )}
      </section>
    </>
  )
}

export function ShortCourseDetailPage() {
  const { slug } = useParams()
  const [item, setItem] = useState<ShortCourseItem | null>(null)
  const [info, setInfo] = useState<AcademyInfo>(DEFAULT_INFO)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    void Promise.all([getShortCourseBySlug(slug), getAcademyInfo()]).then(([course, academy]) => {
      setItem(course)
      if (academy) setInfo({ ...DEFAULT_INFO, ...academy })
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    )
  }

  if (!item) {
    return (
      <section className="container-app py-16">
        <EmptyState title="Formation introuvable" />
      </section>
    )
  }

  const academyName =
    item.academy === 'health-emergency' ? info.healthName : info.communityName

  return (
    <>
      <Seo
        title={item.title}
        description={item.summary || item.description}
        path={`/isssi/formations-courtes/${item.slug}`}
      />
      {item.coverImage ? (
        <OptimizedImage src={item.coverImage} alt={item.title} aspect="aspect-[16/9]" priority />
      ) : null}
      <section className="container-app py-8 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {academyName} · {item.duration || 'Formation courte'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{item.title}</h1>
        {item.summary ? <p className="mt-3 max-w-3xl text-lg text-brand-800">{item.summary}</p> : null}
        <p className="mt-4 max-w-3xl whitespace-pre-line text-muted">{item.description}</p>
        {item.audience ? (
          <div className="mt-6 max-w-3xl rounded-2xl border border-line bg-brand-50/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Public cible</p>
            <p className="mt-1 text-sm whitespace-pre-line text-ink">{item.audience}</p>
          </div>
        ) : null}
        {item.certification ? (
          <p className="mt-4 text-sm text-ink">
            Certification : <span className="font-medium text-brand-800">{item.certification}</span>
          </p>
        ) : null}
        <p className="mt-4 text-sm font-medium text-ink">
          Scolarité : <span className="text-brand-800">{priceLabel(item)}</span>
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link to={`/isssi/preinscription?formation=${encodeURIComponent(item.id)}`}>
            <Button>Préinscription à cette formation</Button>
          </Link>
          <Link to="/isssi/formations-courtes" className="text-sm font-semibold text-brand-700">
            Toutes les formations courtes
          </Link>
        </div>
      </section>
    </>
  )
}
