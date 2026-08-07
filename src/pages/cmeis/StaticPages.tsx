import { CmsPage } from '@/components/shared/CmsPage'
import { useEffect, useState } from 'react'
import { Seo } from '@/components/shared/Seo'
import { PageHero, Spinner, EmptyState } from '@/components/ui/Feedback'
import { getPartners } from '@/services/contentService'
import type { Partner } from '@/types'
import { Card, CardBody } from '@/components/ui/Card'

export function AboutPage() {
  return <CmsPage slug="a-propos" eyebrow="CMEIS-DG3" path="/a-propos" />
}

export function VisionMissionPage() {
  return (
    <CmsPage
      slug="vision-mission"
      eyebrow="Orientation stratégique"
      path="/vision-mission"
    />
  )
}

export function DomainsPage() {
  return <CmsPage slug="domaines" path="/domaines" />
}

export function ProgramsPage() {
  return <CmsPage slug="programmes" path="/programmes" />
}

export function ServicesPage() {
  return <CmsPage slug="services" path="/services" />
}

export function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void getPartners().then((data) => {
      setPartners(data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <Seo title="Partenaires" path="/partenaires" />
      <PageHero
        title="Partenaires"
        subtitle="Réseau de coopération institutionnelle, académique et humanitaire."
      />
      <section className="container-app py-8 sm:py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : partners.length === 0 ? (
          <EmptyState
            title="Aucun partenaire publié"
            description="Ajoutez des partenaires depuis l’administration."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <Card key={p.id}>
                <CardBody className="flex items-center gap-4">
                  {p.logoUrl ? (
                    <img
                      src={p.logoUrl}
                      alt={p.name}
                      className="h-14 w-14 rounded-xl object-contain"
                      loading="lazy"
                    />
                  ) : null}
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{p.name}</h3>
                    {p.description ? (
                      <p className="mt-1 text-sm text-muted">{p.description}</p>
                    ) : null}
                    {p.website ? (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm font-semibold text-brand-700"
                      >
                        Site web
                      </a>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
