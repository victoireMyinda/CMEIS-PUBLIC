import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/firebase/config'
import {
  mockDocuments,
  mockGallery,
  mockNews,
  mockPartners,
  mockPrograms,
} from '@/services/mockData'
import { institutional } from '@/app/institutionalContent'
import type {
  AdmissionInfo,
  ContactMessage,
  DocumentItem,
  GalleryItem,
  HomepageConfig,
  NewsItem,
  PageContent,
  Partner,
  PortalScope,
  ProgramItem,
  PaymentInfo,
  Registration,
  SiteSettings,
} from '@/types'
import { getVideoPosterUrl, getYouTubeId } from '@/utils/videoEmbed'

function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') {
    const t = new Date(value).getTime()
    return Number.isNaN(t) ? value : new Date(t).toISOString()
  }
  if (typeof value === 'object' && value !== null) {
    const v = value as { toDate?: () => Date; seconds?: number }
    if (typeof v.toDate === 'function') return v.toDate().toISOString()
    if (typeof v.seconds === 'number') return new Date(v.seconds * 1000).toISOString()
  }
  return undefined
}

function mapDoc<T>(id: string, data: DocumentData): T {
  return { id, ...data } as T
}

function mapNewsDoc(id: string, data: DocumentData): NewsItem {
  const item = mapDoc<NewsItem>(id, data)
  return {
    ...item,
    publishedAt: toIsoDate(data.publishedAt) || item.publishedAt,
    expiresAt: toIsoDate(data.expiresAt) || (item.expiresAt ?? null),
    createdAt: toIsoDate(data.createdAt) || item.createdAt,
    updatedAt: toIsoDate(data.updatedAt) || item.updatedAt,
  }
}

function notDeleted<T extends { deletedAt?: string | null }>(items: T[]) {
  return items.filter((item) => !item.deletedAt)
}

function publishedScope<T extends { status?: string; scope?: string }>(
  items: T[],
  scope?: PortalScope,
) {
  return items.filter((item) => {
    if (item.status && item.status !== 'published') return false
    if (!scope || scope === 'both') return true
    return !item.scope || item.scope === scope || item.scope === 'both'
  })
}

function isNewsVisible(item: {
  publishedAt?: string
  expiresAt?: string | null
}) {
  // Seule une expiration valide ET postérieure à la publication retire l’actu.
  if (!item.expiresAt) return true
  const end = new Date(item.expiresAt).getTime()
  if (Number.isNaN(end)) return true
  if (item.publishedAt) {
    const start = new Date(item.publishedAt).getTime()
    // Donnée incohérente (expire ≤ publie) → on ignore l’expiration
    if (!Number.isNaN(start) && end <= start) return true
  }
  return end > Date.now()
}

function filterNewsList(items: NewsItem[], scope?: PortalScope, take = 48) {
  // scope undefined / 'both' => toutes les actualités publiées
  const scoped =
    !scope || scope === 'both'
      ? notDeleted(items).filter((item) => !item.status || item.status === 'published')
      : publishedScope(notDeleted(items), scope)

  return scoped
    .filter(isNewsVisible)
    .sort((a, b) =>
      String(b.publishedAt || b.updatedAt || '').localeCompare(
        String(a.publishedAt || a.updatedAt || ''),
      ),
    )
    .slice(0, take)
}

/** Fallback pages CMS (contenu institutionnel) si Firestore vide */
export const defaultPages: Record<string, Omit<PageContent, 'id'>> = {
  'a-propos': {
    slug: 'a-propos',
    scope: 'cmeis',
    title: 'À propos',
    content: [
      `**Dénomination :** ${institutional.denomination}`,
      `**Sigle :** ${institutional.sigle}`,
      `**Forme juridique :** ${institutional.formeJuridique}`,
      `**Siège :** ${institutional.siege}`,
      `**Zone :** ${institutional.zone}`,
      '',
      '## Contexte',
      institutional.contexte,
      '',
      '## Plateforme de référence',
      ...institutional.ambitionPlateforme.map((i) => `- ${i}`),
      '',
      '## Gouvernance',
      ...institutional.gouvernance.map((g) => `- **${g.titre}** : ${g.description}`),
      '',
      '## Perspectives',
      ...institutional.perspectives.map((i) => `- ${i}`),
      '',
      '## Conclusion',
      institutional.conclusion,
    ].join('\n'),
    status: 'published',
  },
  'vision-mission': {
    slug: 'vision-mission',
    scope: 'cmeis',
    title: 'Vision, mission et valeurs',
    content: [
      '## Vision',
      institutional.vision,
      '',
      '## Mission',
      institutional.missionIntro,
      ...institutional.mission.map((i) => `- ${i}`),
      '',
      '## Valeurs',
      ...institutional.valeurs.map((i) => `- ${i}`),
    ].join('\n'),
    status: 'published',
  },
  domaines: {
    slug: 'domaines',
    scope: 'cmeis',
    title: 'Domaines d’intervention',
    content: [
      ...institutional.domaines.map((i) => `- ${i}`),
      '',
      '## Approche',
      ...institutional.approche.map((i) => `- ${i}`),
      '',
      'L’organisation favorise également :',
      ...institutional.approcheFavorise.map((i) => `- ${i}`),
    ].join('\n'),
    status: 'published',
  },
  programmes: {
    slug: 'programmes',
    scope: 'cmeis',
    title: 'Programmes et projets',
    content: [
      '## Santé',
      ...institutional.objectifs.sante.map((i) => `- ${i}`),
      '',
      '## Formation et Éducation',
      ...institutional.objectifs.formation.map((i) => `- ${i}`),
      '',
      '## Recherche et Innovation',
      ...institutional.objectifs.recherche.map((i) => `- ${i}`),
      '',
      '## Action Humanitaire et Protection',
      ...institutional.objectifs.humanitaire.map((i) => `- ${i}`),
      '',
      '## Développement Communautaire',
      ...institutional.objectifs.developpement.map((i) => `- ${i}`),
    ].join('\n'),
    status: 'published',
  },
  services: {
    slug: 'services',
    scope: 'cmeis',
    title: 'Services',
    content: [
      'Services intégrés en santé, formation, recherche, innovation, protection sociale et action humanitaire.',
      '',
      '## Éthique et protection — tolérance zéro contre :',
      ...institutional.ethiqueZero.map((i) => `- ${i}`),
      '',
      '## Engagements',
      ...institutional.ethiqueGaranties.map((i) => `- ${i}`),
    ].join('\n'),
    status: 'published',
  },
  isssi: {
    slug: 'isssi',
    scope: 'isssi',
    title: 'Présentation de l’ISSSI',
    excerpt:
      'Un institut académique engagé pour former des professionnels compétents, éthiques et utiles aux communautés.',
    content: [
      'L’**ISSSI** est le bras académique du CMEIS-DG3. Il propose un environnement d’enseignement structuré, exigeant et tourné vers la pratique professionnelle.',
      '',
      'Notre ambition est de préparer des diplômés capables d’intervenir avec rigueur dans les structures de santé, les programmes communautaires et les organisations partenaires.',
      '',
      '## Ce que propose l’institut',
      '- Des filières et options adaptées aux besoins du secteur',
      '- Un accompagnement des candidats de la préinscription à l’admission',
      '- Une information claire sur le campus, les frais et le calendrier académique',
      '- Une communication régulière via les actualités académiques',
      '',
      '## Axes de formation',
      '- Sciences infirmières et soins',
      '- Santé communautaire et santé publique',
      '- Techniques de laboratoire biomédical',
      '- Nutrition et diététique',
      '',
      '## Vie académique',
      'Les étudiants trouvent sur ce portail les rubriques essentielles : Mot de la Direction générale, Vision et mission, Campus, Conditions d’admission, Frais académiques, Préinscription, Actualités et Contact.',
    ].join('\n'),
    status: 'published',
  },
  'isssi-mot-direction': {
    slug: 'isssi-mot-direction',
    scope: 'isssi',
    title: 'Mot de la Direction générale',
    content: [
      'Chers étudiants, partenaires et visiteurs,',
      '',
      'L’ISSSI s’engage à offrir une formation rigoureuse, moderne et ancrée dans les réalités du terrain sanitaire congolais.',
      '',
      '**La Direction**',
    ].join('\n'),
    status: 'published',
  },
  'isssi-vision-mission': {
    slug: 'isssi-vision-mission',
    scope: 'isssi',
    title: 'Vision et mission',
    content: [
      '## Vision',
      'Être un pôle d’excellence en formation aux sciences de santé intégrées.',
      '',
      '## Mission',
      '- Former des professionnels de santé compétents et éthiques',
      '- Promouvoir la recherche appliquée',
      '- Renforcer la santé communautaire par la formation',
    ].join('\n'),
    status: 'published',
  },
  'isssi-campus': {
    slug: 'isssi-campus',
    scope: 'isssi',
    title: 'Campus',
    content:
      'Le campus ISSSI à Kinshasa offre des salles de cours, des espaces de travaux pratiques et un cadre propice à la formation professionnelle.',
    status: 'published',
  },
  'isssi-admission': {
    slug: 'isssi-admission',
    scope: 'isssi',
    title: 'Conditions d’admission',
    content: [
      '1. Remplir le formulaire de préinscription en ligne',
      '2. Joindre les pièces demandées',
      '3. Attendre la confirmation et les instructions de paiement',
      '4. Finaliser l’inscription administrative',
    ].join('\n'),
    status: 'published',
  },
  'isssi-frais': {
    slug: 'isssi-frais',
    scope: 'isssi',
    title: 'Frais académiques',
    content: [
      '- Frais de dossier',
      '- Frais d’inscription',
      '- Frais de scolarité',
      '',
      'Contactez l’administration pour le barème officiel.',
    ].join('\n'),
    status: 'published',
  },
}

export async function getSettings(
  portal: 'cmeis' | 'isssi' = 'cmeis',
): Promise<SiteSettings | null> {
  if (!isFirebaseConfigured || !db) return null
  try {
    const snap = await getDoc(doc(db, 'settings', portal))
    if (snap.exists()) return mapDoc<SiteSettings>(snap.id, snap.data())
    // Ancien document unique (migration)
    if (portal === 'cmeis') {
      const legacy = await getDoc(doc(db, 'settings', 'general'))
      return legacy.exists() ? mapDoc<SiteSettings>(legacy.id, legacy.data()) : null
    }
    return null
  } catch {
    return null
  }
}

export async function getHomepage(
  portal: 'cmeis' | 'isssi' = 'cmeis',
): Promise<HomepageConfig | null> {
  if (!isFirebaseConfigured || !db) return null
  try {
    const id = portal === 'isssi' ? 'isssi' : 'main'
    const snap = await getDoc(doc(db, 'homepage', id))
    return snap.exists() ? mapDoc<HomepageConfig>(snap.id, snap.data()) : null
  } catch {
    return null
  }
}

function isPagePubliclyVisible(page: PageContent) {
  return !page.deletedAt && page.status === 'published' && page.enabled !== false
}

export async function getPageBySlug(slug: string): Promise<PageContent | null> {
  if (!isFirebaseConfigured || !db) {
    const fallback = defaultPages[slug]
    return fallback ? { id: slug, ...fallback } : null
  }
  try {
    const snap = await getDocs(
      query(collection(db, 'pages'), where('slug', '==', slug), limit(1)),
    )
    const first = snap.docs[0]
    if (first) {
      const page = mapDoc<PageContent>(first.id, first.data())
      // Page existante mais désactivée / non publiée : pas de fallback mock
      if (!isPagePubliclyVisible(page)) return null
      return page
    }
  } catch {
    // fall through
  }
  const fallback = defaultPages[slug]
  return fallback ? { id: slug, ...fallback } : null
}

/** Slugs de rubriques masquées (désactivées ou non publiées). */
export async function getDisabledPageSlugs(): Promise<string[]> {
  if (!isFirebaseConfigured || !db) return []
  try {
    const snap = await getDocs(collection(db, 'pages'))
    return snap.docs
      .map((d) => mapDoc<PageContent>(d.id, d.data()))
      .filter((page) => page.slug && !isPagePubliclyVisible(page))
      .map((page) => page.slug)
  } catch {
    return []
  }
}

export async function getNews(scope?: PortalScope, take = 12): Promise<NewsItem[]> {
  if (!isFirebaseConfigured || !db) {
    return filterNewsList(mockNews, scope, take)
  }
  try {
    // Filtrer par status côté requête : requis pour les règles Firestore publiques
    const snap = await getDocs(
      query(collection(db, 'news'), where('status', '==', 'published')),
    )
    const items = snap.docs.map((d) => mapNewsDoc(d.id, d.data()))
    return filterNewsList(items, scope, take)
  } catch (e) {
    console.error('getNews failed', e)
    return []
  }
}

/** Écoute temps réel des actualités publiées (admin → site). */
export function listenNews(
  scope: PortalScope | undefined,
  take: number,
  onData: (items: NewsItem[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    onData(filterNewsList(mockNews, scope, take))
    return () => undefined
  }

  const q = query(collection(db, 'news'), where('status', '==', 'published'))
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => mapNewsDoc(d.id, d.data()))
      onData(filterNewsList(items, scope, take))
    },
    (err) => {
      console.error('listenNews failed', err)
      onError?.(err)
      onData([])
    },
  )
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  if (!isFirebaseConfigured || !db) {
    const item = mockNews.find((n) => n.slug === slug) ?? null
    return item && item.status === 'published' && isNewsVisible(item) ? item : null
  }
  try {
    const snap = await getDocs(
      query(collection(db, 'news'), where('slug', '==', slug), limit(1)),
    )
    const first = snap.docs[0]
    if (!first) return null
    const item = mapNewsDoc(first.id, first.data())
    if (item.deletedAt || item.status !== 'published' || !isNewsVisible(item)) return null
    return item
  } catch (e) {
    console.error('getNewsBySlug failed', e)
    return null
  }
}

export function listenNewsBySlug(
  slug: string,
  onData: (item: NewsItem | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    const item = mockNews.find((n) => n.slug === slug) ?? null
    onData(item && item.status === 'published' && isNewsVisible(item) ? item : null)
    return () => undefined
  }

  const q = query(collection(db, 'news'), where('slug', '==', slug), limit(1))
  return onSnapshot(
    q,
    (snap) => {
      const first = snap.docs[0]
      if (!first) {
        onData(null)
        return
      }
      const item = mapNewsDoc(first.id, first.data())
      onData(
        item.deletedAt || item.status !== 'published' || !isNewsVisible(item) ? null : item,
      )
    },
    (err) => {
      console.error('listenNewsBySlug failed', err)
      onError?.(err)
      onData(null)
    },
  )
}

export async function getPrograms(): Promise<ProgramItem[]> {
  if (!isFirebaseConfigured || !db) return mockPrograms
  try {
    const snap = await getDocs(collection(db, 'programs'))
    return publishedScope(notDeleted(snap.docs.map((d) => mapDoc<ProgramItem>(d.id, d.data())))).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    )
  } catch {
    return mockPrograms
  }
}

export async function getProgramBySlug(slug: string): Promise<ProgramItem | null> {
  const all = await getPrograms()
  return all.find((p) => p.slug === slug) ?? null
}

export async function getDocuments(scope?: PortalScope): Promise<DocumentItem[]> {
  if (!isFirebaseConfigured || !db) {
    return mockDocuments.filter((d) => !scope || d.scope === scope || d.scope === 'both')
  }
  try {
    const snap = await getDocs(collection(db, 'documents'))
    return publishedScope(
      notDeleted(snap.docs.map((d) => mapDoc<DocumentItem>(d.id, d.data()))),
      scope,
    )
  } catch {
    return mockDocuments
  }
}

type GalleryAlbumRow = {
  id: string
  title: string
  scope?: PortalScope
  status?: string
  deletedAt?: string | null
}

type GalleryMediaRow = {
  id: string
  title: string
  mediaType?: 'image' | 'video'
  imageUrl?: string
  thumbUrl?: string
  videoUrl?: string
  albumId: string
  order?: number
  status?: string
  deletedAt?: string | null
}

function buildGalleryItems(
  albums: GalleryAlbumRow[],
  images: GalleryMediaRow[],
  scope?: PortalScope,
): GalleryItem[] {
  const albumMap = new Map(
    notDeleted(albums)
      .filter((a) => a.status === 'published' || !a.status)
      .map((a) => [a.id, a]),
  )

  return notDeleted(images)
    .filter((img) => img.status === 'published' || !img.status)
    .map((img) => {
      const album = albumMap.get(img.albumId)
      if (!album) return null
      if (
        scope &&
        scope !== 'both' &&
        album.scope &&
        album.scope !== scope &&
        album.scope !== 'both'
      ) {
        return null
      }
      const mediaType = img.mediaType || (img.videoUrl ? 'video' : 'image')
      const videoUrl = img.videoUrl || ''
      const poster =
        getVideoPosterUrl(videoUrl) ||
        (img.imageUrl && getYouTubeId(img.imageUrl) ? getVideoPosterUrl(img.imageUrl) : undefined) ||
        (img.thumbUrl && getYouTubeId(img.thumbUrl) ? getVideoPosterUrl(img.thumbUrl) : undefined)
      const thumbUrl = poster || img.thumbUrl || undefined
      const imageUrl =
        (img.imageUrl && !getYouTubeId(img.imageUrl) ? img.imageUrl : '') ||
        thumbUrl ||
        poster ||
        ''

      return {
        id: img.id,
        title: img.title,
        mediaType,
        imageUrl,
        thumbUrl,
        videoUrl,
        scope: (album.scope || 'both') as PortalScope,
        album: album.title,
        albumId: album.id,
        order: img.order ?? 0,
        status: 'published' as const,
      } satisfies GalleryItem
    })
    .filter(Boolean)
    .sort((a, b) => (a!.order ?? 0) - (b!.order ?? 0)) as GalleryItem[]
}

export async function getGallery(scope?: PortalScope): Promise<GalleryItem[]> {
  if (!isFirebaseConfigured || !db) {
    return mockGallery.filter((g) => !scope || g.scope === scope || g.scope === 'both')
  }
  try {
    // status == published requis pour les règles Firestore publiques
    const [albumsSnap, imagesSnap] = await Promise.all([
      getDocs(query(collection(db, 'galleries'), where('status', '==', 'published'))),
      getDocs(query(collection(db, 'galleryImages'), where('status', '==', 'published'))),
    ])
    return buildGalleryItems(
      albumsSnap.docs.map((d) => mapDoc<GalleryAlbumRow>(d.id, d.data())),
      imagesSnap.docs.map((d) => mapDoc<GalleryMediaRow>(d.id, d.data())),
      scope,
    )
  } catch (e) {
    console.error('getGallery failed', e)
    return []
  }
}

/** Écoute temps réel albums + médias (admin → site). */
export function listenGallery(
  scope: PortalScope | undefined,
  onData: (items: GalleryItem[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    onData(mockGallery.filter((g) => !scope || g.scope === scope || g.scope === 'both'))
    return () => undefined
  }

  let albums: GalleryAlbumRow[] = []
  let images: GalleryMediaRow[] = []

  const emit = () => onData(buildGalleryItems(albums, images, scope))

  const unsubAlbums = onSnapshot(
    query(collection(db, 'galleries'), where('status', '==', 'published')),
    (snap) => {
      albums = snap.docs.map((d) => mapDoc<GalleryAlbumRow>(d.id, d.data()))
      emit()
    },
    (err) => {
      console.error('listenGallery albums failed', err)
      onError?.(err)
      onData([])
    },
  )

  const unsubImages = onSnapshot(
    query(collection(db, 'galleryImages'), where('status', '==', 'published')),
    (snap) => {
      images = snap.docs.map((d) => mapDoc<GalleryMediaRow>(d.id, d.data()))
      emit()
    },
    (err) => {
      console.error('listenGallery images failed', err)
      onError?.(err)
      onData([])
    },
  )

  return () => {
    unsubAlbums()
    unsubImages()
  }
}

export async function getPartners(): Promise<Partner[]> {
  if (!isFirebaseConfigured || !db) return mockPartners
  try {
    const snap = await getDocs(collection(db, 'partners'))
    return notDeleted(snap.docs.map((d) => mapDoc<Partner>(d.id, d.data())))
      .filter((p) => (p.status === 'published' || !p.status) && p.visible !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  } catch {
    return mockPartners
  }
}

export async function getAdmissions(): Promise<AdmissionInfo[]> {
  if (!isFirebaseConfigured || !db) return []
  try {
    const snap = await getDocs(
      query(collection(db, 'admissions'), orderBy('updatedAt', 'desc')),
    )
    return publishedScope(notDeleted(snap.docs.map((d) => mapDoc<AdmissionInfo>(d.id, d.data()))))
  } catch {
    return []
  }
}

export async function getPaymentInfo(
  portal: 'isssi' = 'isssi',
): Promise<PaymentInfo | null> {
  if (!isFirebaseConfigured || !db) return null
  try {
    const snap = await getDoc(doc(db, 'paymentInfo', portal))
    if (!snap.exists()) return null
    const data = mapDoc<PaymentInfo>(snap.id, snap.data())
    // Brouillon = masqué ; absence de statut = publié (docs anciens)
    if (data.status === 'draft' || data.status === 'archived') return null
    return {
      ...data,
      mobileMoney: Array.isArray(data.mobileMoney) ? data.mobileMoney : [],
    }
  } catch (e) {
    console.error('getPaymentInfo failed', e)
    return null
  }
}

export async function submitRegistration(
  data: Omit<Registration, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'source'>,
) {
  if (!isFirebaseConfigured || !db) {
    await new Promise((r) => setTimeout(r, 600))
    return { id: `local-${Date.now()}`, mode: 'mock' as const }
  }
  const ref = await addDoc(collection(db, 'registrations'), {
    ...data,
    status: 'nouvelle',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: ref.id, mode: 'firestore' as const }
}

export async function submitContact(
  data: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
) {
  if (!isFirebaseConfigured || !db) {
    await new Promise((r) => setTimeout(r, 500))
    return { id: `local-${Date.now()}`, mode: 'mock' as const }
  }
  const ref = await addDoc(collection(db, 'contacts'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: ref.id, mode: 'firestore' as const }
}

export async function subscribeNewsletter(email: string, scope: PortalScope = 'both') {
  if (!isFirebaseConfigured || !db) {
    await new Promise((r) => setTimeout(r, 400))
    return { id: `local-${Date.now()}`, mode: 'mock' as const }
  }
  const ref = await addDoc(collection(db, 'newsletter'), {
    email,
    scope,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: ref.id, mode: 'firestore' as const }
}
