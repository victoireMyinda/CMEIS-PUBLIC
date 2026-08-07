import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { NewsItem } from '@/types'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Feedback'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { truncate } from '@/utils/cn'

export function NewsCard({
  item,
  basePath = '/actualites',
}: {
  item: NewsItem
  basePath?: string
}) {
  return (
    <Card as="article" className="h-full overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link to={`${basePath}/${item.slug}`} className="block h-full">
        <OptimizedImage src={item.coverImage || ''} alt={item.title} aspect="aspect-[16/10]" />
        <CardBody>
          <div className="mb-2 flex flex-wrap gap-2">
            {item.category ? <Badge>{item.category}</Badge> : null}
            {item.tags
              ?.filter((tag) => tag !== item.category)
              .slice(0, 1)
              .map((tag) => (
                <Badge key={tag} tone="muted">
                  {tag}
                </Badge>
              ))}
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {truncate(item.excerpt, 110)}
          </p>
          {item.publishedAt ? (
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand-600">
              {format(new Date(item.publishedAt), 'd MMM yyyy', { locale: fr })}
            </p>
          ) : null}
        </CardBody>
      </Link>
    </Card>
  )
}
