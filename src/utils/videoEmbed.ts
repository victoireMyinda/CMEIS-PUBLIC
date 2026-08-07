/** Normalise les liens vidéo (YouTube, Vimeo, fichiers) pour lecture et vignettes. */

export function getYouTubeId(url: string): string | null {
  const raw = url.trim()
  if (!raw) return null

  try {
    const u = new URL(raw.startsWith('//') ? `https:${raw}` : raw)
    const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '')

    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0]?.split('?')[0]
      return id && /^[\w-]{11}$/.test(id) ? id : null
    }

    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const v = u.searchParams.get('v')
      if (v && /^[\w-]{11}$/.test(v)) return v

      const parts = u.pathname.split('/').filter(Boolean)
      if (parts[0] && ['embed', 'shorts', 'live', 'v'].includes(parts[0])) {
        const id = parts[1]?.split('?')[0]
        return id && /^[\w-]{11}$/.test(id) ? id : null
      }
    }
  } catch {
    // fallback regex below
  }

  const m = raw.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/,
  )
  return m?.[1] || null
}

export function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url.trim())
}

/** URL utilisable dans un <iframe>. Null = utiliser <video src>. */
export function getVideoEmbedUrl(url: string): string | null {
  const raw = url.trim()
  if (!raw) return null
  if (isDirectVideoFile(raw)) return null

  const yt = getYouTubeId(raw)
  if (yt) return `https://www.youtube.com/embed/${yt}?rel=0`

  try {
    const u = new URL(raw.startsWith('//') ? `https:${raw}` : raw)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'player.vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean).pop()
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`
    }
  } catch {
    // ignore
  }

  const vimeo = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`

  // déjà une URL d’embed ou autre lecteur
  return raw
}

/** Vignette automatique (YouTube). */
export function getVideoPosterUrl(url: string): string | undefined {
  const yt = getYouTubeId(url)
  if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`
  return undefined
}

export function resolveVideoCover(opts: {
  thumbUrl?: string
  imageUrl?: string
  videoUrl?: string
}): string {
  const thumb = opts.thumbUrl?.trim()
  const image = opts.imageUrl?.trim()
  const video = opts.videoUrl?.trim()

  // éviter d’utiliser une URL YouTube comme src d’image
  const looksLikePage =
    (u?: string) =>
      !!u &&
      !/\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i.test(u) &&
      !/i\.ytimg\.com|img\.youtube/i.test(u) &&
      !!(getYouTubeId(u) || /vimeo\.com/i.test(u))

  if (thumb && !looksLikePage(thumb)) return thumb
  if (image && !looksLikePage(image)) return image
  if (video) {
    const poster = getVideoPosterUrl(video)
    if (poster) return poster
  }
  if (image && getYouTubeId(image)) return getVideoPosterUrl(image)!
  return thumb || image || ''
}
