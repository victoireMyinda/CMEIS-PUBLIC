import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock3, Tag, UserRound } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion, useReducedMotion } from 'framer-motion'
import { Seo } from '@/components/shared/Seo'
import { NewsCard } from '@/components/shared/NewsCard'
import { PageHero, EmptyState, Spinner } from '@/components/ui/Feedback'
import { Button } from '@/components/ui/Button'
import { listenNews, listenNewsBySlug } from '@/services/contentService'
import type { NewsItem, PortalScope } from '@/types'

export function NewsListPage({
  scope,
  basePath = '/actualites',
}: {
  scope?: PortalScope
  basePath?: string
}) {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const unsub = listenNews(
      scope,
      48,
      (data) => {
        setItems(data)
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsub
  }, [scope])

  const listTitle = scope === 'isssi' ? 'Actualités académiques' : 'Actualités'

  return (
    <>
      <Seo title={listTitle} path={basePath} />
      <PageHero
        title={listTitle}
        subtitle={
          scope === 'isssi'
            ? 'Informations et annonces du portail ISSSI.'
            : 'Informations institutionnelles et académiques — synchronisées en direct.'
        }
        eyebrow={scope === 'isssi' ? 'ISSSI' : 'CMEIS-DG3'}
      />
      <section className="container-app py-8 sm:py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Aucune actualité"
            description="Publiez une actualité depuis l’administration (statut « Publié »)."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <NewsCard key={item.id} item={item} basePath={basePath} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export function NewsDetailPage({
  basePath = '/actualites',
}: {
  basePath?: string
}) {
  const { slug } = useParams()
  const reduceMotion = useReducedMotion()
  const [item, setItem] = useState<NewsItem | null>(null)
  const [related, setRelated] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    const unsub = listenNewsBySlug(
      slug,
      (data) => {
        setItem(data)
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsub
  }, [slug])

  useEffect(() => {
    const unsub = listenNews(undefined, 8, (data) => {
      setRelated(data.filter((n) => n.slug !== slug).slice(0, 3))
    })
    return unsub
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
        <EmptyState title="Article introuvable" />
        <div className="mt-4 text-center">
          <Link to={basePath} className="font-semibold text-brand-700">
            Retour aux actualités
          </Link>
        </div>
      </section>
    )
  }

  const publishedLabel = item.publishedAt
    ? format(new Date(item.publishedAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })
    : null

  return (
    <>
      <Seo
        title={item.title}
        description={item.excerpt}
        path={`${basePath}/${item.slug}`}
        image={item.coverImage}
        type="article"
      />

      <article>
        <section className="relative min-h-[52dvh] overflow-hidden bg-brand-900 text-white sm:min-h-[58dvh]">
          {item.coverImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${item.coverImage}')` }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/75 to-brand-900/45" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(232,184,74,0.18),transparent_45%)]" />

          <div className="container-app relative flex min-h-[52dvh] flex-col justify-end pb-10 pt-24 sm:min-h-[58dvh] sm:pb-14">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-3xl"
            >
              <Link
                to={basePath}
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-accent-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux actualités
              </Link>

              <div className="mb-4 flex flex-wrap gap-2">
                {item.category ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-400">
                    <Tag className="h-3.5 w-3.5" />
                    {item.category}
                  </span>
                ) : null}
                {item.scope ? (
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                    {item.scope === 'both' ? 'CMEIS · ISSSI' : item.scope.toUpperCase()}
                  </span>
                ) : null}
              </div>

              <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {item.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                {item.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
                {publishedLabel ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-accent-400" />
                    {publishedLabel}
                  </span>
                ) : null}
                {item.author ? (
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="h-4 w-4 text-accent-400" />
                    {item.author}
                  </span>
                ) : null}
                {item.expiresAt ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4 text-accent-400" />
                    Jusqu’au{' '}
                    {format(new Date(item.expiresAt), 'd MMM yyyy', { locale: fr })}
                  </span>
                ) : null}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container-app py-10 sm:py-14">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              {item.coverImage ? (
                <figure className="mb-8 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-soft">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="max-h-[480px] w-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                </figure>
              ) : null}

              <div className="rounded-[1.5rem] border border-line bg-white p-6 shadow-soft sm:p-8">
                <div className="whitespace-pre-line text-base leading-8 text-ink sm:text-[1.05rem]">
                  {item.content}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={basePath}>
                  <Button variant="secondary">
                    <ArrowLeft className="h-4 w-4" />
                    Toutes les actualités
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button>Nous contacter</Button>
                </Link>
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-line bg-brand-50/70 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                  En bref
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {item.category ? (
                    <li>
                      <span className="font-semibold text-ink">Catégorie :</span> {item.category}
                    </li>
                  ) : null}
                  {item.author ? (
                    <li>
                      <span className="font-semibold text-ink">Auteur :</span> {item.author}
                    </li>
                  ) : null}
                  {publishedLabel ? (
                    <li>
                      <span className="font-semibold text-ink">Publication :</span> {publishedLabel}
                    </li>
                  ) : null}
                </ul>
              </div>

              {related.length > 0 ? (
                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                    À lire aussi
                  </p>
                  <div className="space-y-3">
                    {related.map((n) => (
                      <Link
                        key={n.id}
                        to={`${basePath}/${n.slug}`}
                        className="block rounded-2xl border border-line bg-white p-3 shadow-soft transition hover:border-brand-300"
                      >
                        <p className="line-clamp-2 font-display text-sm font-semibold text-ink">
                          {n.title}
                        </p>
                        {n.publishedAt ? (
                          <p className="mt-1 text-xs text-muted">
                            {format(new Date(n.publishedAt), 'd MMM yyyy', { locale: fr })}
                          </p>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="border-t border-line bg-white py-10 sm:py-14">
            <div className="container-app">
              <div className="mb-6 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                    Continuer
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    Autres actualités
                  </h2>
                </div>
                <Link to={basePath} className="text-sm font-semibold text-brand-700">
                  Voir tout
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((n) => (
                  <NewsCard key={n.id} item={n} basePath={basePath} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>
    </>
  )
}
