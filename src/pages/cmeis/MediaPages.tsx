import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { Seo } from '@/components/shared/Seo'
import { GallerySwipe } from '@/components/shared/GallerySwipe'
import { PageHero, EmptyState, Spinner } from '@/components/ui/Feedback'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { getDocuments, listenGallery } from '@/services/contentService'
import type { DocumentItem, GalleryItem, PortalScope } from '@/types'
import { formatBytes } from '@/utils/cn'

export function DocumentsPage({
  scope = 'cmeis',
  path,
}: {
  scope?: PortalScope
  path?: string
}) {
  const [items, setItems] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const seoPath = path || (scope === 'isssi' ? '/isssi/documents' : '/documents')

  useEffect(() => {
    void getDocuments(scope).then((data) => {
      setItems(data)
      setLoading(false)
    })
  }, [scope])

  return (
    <>
      <Seo title="Documents" path={seoPath} />
      <PageHero
        title="Documents"
        subtitle="Téléchargez les ressources institutionnelles et académiques."
      />
      <section className="container-app py-8 sm:py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Aucun document" />
        ) : (
          <div className="grid gap-3">
            {items.map((doc) => (
              <Card key={doc.id}>
                <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                      {doc.category}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-ink">
                      {doc.title}
                    </h3>
                    {doc.description ? (
                      <p className="mt-1 text-sm text-muted">{doc.description}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-muted">{formatBytes(doc.sizeBytes)}</p>
                  </div>
                  <a href={doc.fileUrl} download={doc.fileName}>
                    <Button variant="secondary">
                      <Download className="h-4 w-4" />
                      Télécharger
                    </Button>
                  </a>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export function GalleryPage({
  scope = 'cmeis',
  path = '/galerie',
}: {
  scope?: PortalScope
  path?: string
}) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    return listenGallery(scope, (data) => {
      setItems(data)
      setLoading(false)
    })
  }, [scope])

  return (
    <>
      <Seo title="Galerie" path={path} />
      <PageHero
        title="Galerie"
        subtitle="Photos et vidéos du complexe — cliquez pour agrandir ou lire."
      />
      <section className="container-app py-8 sm:py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Galerie vide" />
        ) : (
          <GallerySwipe items={items} layout="grid" />
        )}
      </section>
    </>
  )
}
