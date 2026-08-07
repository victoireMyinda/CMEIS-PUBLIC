import { useEffect, useState, type ReactNode } from 'react'
import { Seo } from '@/components/shared/Seo'
import { PageHero, Spinner, EmptyState } from '@/components/ui/Feedback'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { getPageBySlug } from '@/services/contentService'
import type { PageContent } from '@/types'

function formatInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-ink">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

/** Rendu simple du contenu CMS (titres ##, listes, gras). */
export function CmsProse({ content, className }: { content: string; className?: string }) {
  const nodes = content.split('\n').map((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) return <div key={index} className="h-2" />
    if (trimmed.startsWith('## ')) {
      return (
        <h3 key={index} className="font-display text-xl font-semibold text-ink">
          {trimmed.replace(/^##\s+/, '')}
        </h3>
      )
    }
    if (trimmed.startsWith('- ')) {
      return (
        <li key={index} className="ml-5 list-disc marker:text-brand-600">
          {formatInline(trimmed.slice(2))}
        </li>
      )
    }
    if (/^\d+\.\s/.test(trimmed)) {
      return (
        <li key={index} className="ml-5 list-decimal marker:text-brand-600">
          {formatInline(trimmed.replace(/^\d+\.\s/, ''))}
        </li>
      )
    }
    return (
      <p key={index} className="leading-relaxed">
        {formatInline(trimmed)}
      </p>
    )
  })

  return (
    <div className={className ?? 'prose-content max-w-3xl space-y-3 text-base text-muted'}>
      {nodes}
    </div>
  )
}

export function CmsPage({
  slug,
  eyebrow,
  path,
  fallbackTitle,
}: {
  slug: string
  eyebrow?: string
  path: string
  fallbackTitle?: string
}) {
  const [page, setPage] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void getPageBySlug(slug).then((data) => {
      setPage(data)
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

  if (!page) {
    return (
      <section className="container-app py-16">
        <EmptyState
          title="Rubrique indisponible"
          description="Cette rubrique est désactivée ou non publiée pour le moment."
        />
      </section>
    )
  }

  return (
    <>
      <Seo
        title={page.seoTitle || page.title || fallbackTitle || slug}
        description={page.seoDescription || page.excerpt}
        path={path}
        image={page.coverImage}
      />
      <PageHero
        title={page.title}
        subtitle={page.excerpt}
        eyebrow={eyebrow}
      />
      {page.coverImage ? (
        <div className="container-app -mt-2">
          <OptimizedImage
            src={page.coverImage}
            alt={page.title}
            aspect="aspect-[21/9] rounded-2xl"
          />
        </div>
      ) : null}
      <section className="container-app py-8 sm:py-12">
        <CmsProse content={page.content || ''} />
      </section>
    </>
  )
}
