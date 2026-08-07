import { useEffect } from 'react'
import { useSite } from '@/app/SiteProvider'

interface SeoProps {
  title: string
  description?: string
  path?: string
  image?: string
  type?: string
  noIndex?: boolean
}

export function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noIndex = false,
}: SeoProps) {
  const site = useSite()
  const portal = path.startsWith('/isssi') ? site.isssi : site
  const fullTitle = `${title} | ${portal.name}`
  const url = `${site.siteUrl}${path}`
  const desc = description || portal.tagline || site.tagline

  const ogImage = image || portal.logoUrl || site.logoUrl

  useEffect(() => {
    document.title = fullTitle

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.content = content
    }

    setMeta('name', 'description', desc)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', ogImage)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', ogImage)
  }, [fullTitle, desc, url, ogImage, type, noIndex])

  return null
}
