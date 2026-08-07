import { Seo } from '@/components/shared/Seo'
import { PageHero } from '@/components/ui/Feedback'
import type { ReactNode } from 'react'

export function ContentPage({
  title,
  subtitle,
  eyebrow,
  path,
  children,
}: {
  title: string
  subtitle?: string
  eyebrow?: string
  path: string
  children: ReactNode
}) {
  return (
    <>
      <Seo title={title} description={subtitle} path={path} />
      <PageHero title={title} subtitle={subtitle} eyebrow={eyebrow} />
      <section className="container-app py-8 sm:py-12">
        <div className="prose-content max-w-3xl space-y-4 text-base leading-relaxed text-muted">
          {children}
        </div>
      </section>
    </>
  )
}
