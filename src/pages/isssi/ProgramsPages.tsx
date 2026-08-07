import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/components/shared/Seo'
import { PageHero, EmptyState, Spinner } from '@/components/ui/Feedback'
import { Card, CardBody } from '@/components/ui/Card'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { Button } from '@/components/ui/Button'
import { getProgramBySlug, getPrograms } from '@/services/contentService'
import type { ProgramItem } from '@/types'

export function ProgramsListPage() {
  const [items, setItems] = useState<ProgramItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void getPrograms().then((data) => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <Seo title="Filières et options" path="/isssi/filieres" />
      <PageHero
        title="Filières et options"
        eyebrow="ISSSI"
        subtitle="Parcours académiques disponibles."
      />
      <section className="container-app py-8 sm:py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <Card key={p.id}>
                <OptimizedImage src={p.coverImage || ''} alt={p.title} />
                <CardBody>
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted">{p.summary || p.description}</p>
                  <p className="mt-3 text-xs font-medium text-brand-700">
                    {p.level} · {p.duration}
                  </p>
                  <Link
                    to={`/isssi/filieres/${p.slug}`}
                    className="mt-3 inline-block text-sm font-semibold text-brand-800"
                  >
                    Voir le détail
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export function ProgramDetailPage() {
  const { slug } = useParams()
  const [item, setItem] = useState<ProgramItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    void getProgramBySlug(slug).then((data) => {
      setItem(data)
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
        <EmptyState title="Filière introuvable" />
      </section>
    )
  }

  return (
    <>
      <Seo title={item.title} description={item.summary} path={`/isssi/filieres/${item.slug}`} />
      {item.coverImage ? (
        <OptimizedImage src={item.coverImage} alt={item.title} aspect="aspect-[16/9]" priority />
      ) : null}
      <section className="container-app py-8 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {item.level} · {item.duration}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{item.title}</h1>
        <p className="mt-4 max-w-3xl text-muted">{item.description}</p>
        <div className="mt-6">
          <Link to="/isssi/preinscription">
            <Button>Préinscription à cette filière</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
