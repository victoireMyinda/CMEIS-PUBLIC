import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { getDocuments, getNews, getPrograms, getShortCourses } from '@/services/contentService'
import { useUiStore } from '@/store'
import { Button } from '@/components/ui/Button'
import type { DocumentItem, NewsItem, ProgramItem, ShortCourseItem } from '@/types'

export function MobileSearch() {
  const { searchOpen, setSearchOpen } = useUiStore()
  const [q, setQ] = useState('')
  const [news, setNews] = useState<NewsItem[]>([])
  const [programs, setPrograms] = useState<ProgramItem[]>([])
  const [docs, setDocs] = useState<DocumentItem[]>([])
  const [courses, setCourses] = useState<ShortCourseItem[]>([])

  useEffect(() => {
    if (!searchOpen) return
    void Promise.all([getNews(undefined, 30), getPrograms(), getDocuments(), getShortCourses()]).then(
      ([n, p, d, c]) => {
        setNews(n)
        setPrograms(p)
        setDocs(d)
        setCourses(c)
      },
    )
  }, [searchOpen])

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return []
    return [
      ...news
        .filter((n) => n.title.toLowerCase().includes(query))
        .map((n) => ({
          id: n.id,
          label: n.title,
          to: n.scope === 'isssi' ? `/isssi/actualites/${n.slug}` : `/actualites/${n.slug}`,
          type: 'Actualité',
        })),
      ...programs
        .filter((p) => p.title.toLowerCase().includes(query))
        .map((p) => ({
          id: p.id,
          label: p.title,
          to: `/isssi/filieres/${p.slug}`,
          type: 'Filière',
        })),
      ...courses
        .filter((item) => item.title.toLowerCase().includes(query))
        .map((item) => ({
          id: item.id,
          label: item.title,
          to: `/isssi/formations-courtes/${item.slug}`,
          type: 'Formation courte',
        })),
      ...docs
        .filter((d) => d.title.toLowerCase().includes(query))
        .map((d) => ({
          id: d.id,
          label: d.title,
          to: '/documents',
          type: 'Document',
        })),
    ].slice(0, 8)
  }, [q, news, programs, courses, docs])

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm">
      <div className="container-app pt-4">
        <div className="rounded-2xl bg-white p-3 shadow-soft">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher actualités, filières…"
              className="h-12 w-full bg-transparent text-base outline-none"
              aria-label="Recherche"
            />
            <Button
              variant="ghost"
              size="sm"
              aria-label="Fermer la recherche"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ul className="mt-2 max-h-[60vh] overflow-y-auto divide-y divide-line">
            {results.map((r) => (
              <li key={r.id}>
                <Link
                  to={r.to}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <span className="font-medium text-ink">{r.label}</span>
                  <span className="text-xs text-muted">{r.type}</span>
                </Link>
              </li>
            ))}
            {q && results.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted">Aucun résultat</li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  )
}
