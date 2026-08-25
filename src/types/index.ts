export type ContentStatus = 'draft' | 'published' | 'archived' | 'scheduled'
export type PortalScope = 'cmeis' | 'isssi' | 'both'

export interface BaseDoc {
  id: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  deletedAt?: string | null
}

export interface PageContent extends BaseDoc {
  slug: string
  scope: PortalScope
  title: string
  excerpt?: string
  content: string
  coverImage?: string
  seoTitle?: string
  seoDescription?: string
  status: ContentStatus
  /** Si false, la rubrique est masquée sur le site public */
  enabled?: boolean
  author?: string
  /** Présentation ISSSI — sections structurées (admin → site) */
  sectionOffers?: string
  sectionAxes?: string
  sectionAcademicLife?: string
}

export interface HomepageBlock {
  id: string
  type: 'hero' | 'stats' | 'cta' | 'partners' | 'testimonials' | 'custom'
  title?: string
  subtitle?: string
  imageUrl?: string
  ctaLabel?: string
  ctaUrl?: string
  enabled: boolean
  order: number
  data?: Record<string, unknown>
}

export interface HomepageConfig extends BaseDoc {
  /** @deprecated Prefer titleTertiary */
  slogan?: string
  titlePrimary?: string
  titleSecondary?: string
  titleTertiary?: string
  bannerUrl?: string
  /** @deprecated Kept for legacy docs */
  blocks?: HomepageBlock[]
}

export interface SiteSettings extends BaseDoc {
  portal?: PortalScope
  siteName: string
  fullName?: string
  tagline: string
  logoUrl?: string
  faviconUrl?: string
  email: string
  phone: string
  whatsapp: string
  address: string
  social: {
    facebook?: string
    twitter?: string
    linkedin?: string
    youtube?: string
    instagram?: string
  }
  mapsEmbedUrl?: string
  seoDefaultTitle?: string
  seoDefaultDescription?: string
  /** false = site public en maintenance (défaut true) */
  siteEnabled?: boolean
  /** Message affiché pendant la maintenance */
  maintenanceMessage?: string
}

export interface NewsItem extends BaseDoc {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  category?: string
  author?: string
  scope: PortalScope
  tags: string[]
  publishedAt?: string
  /** Fin de diffusion publique (optionnel) */
  expiresAt?: string | null
  status: ContentStatus
  featured?: boolean
}

export interface GalleryItem extends BaseDoc {
  title: string
  description?: string
  mediaType?: 'image' | 'video'
  imageUrl: string
  thumbUrl?: string
  videoUrl?: string
  scope: PortalScope
  album: string
  albumId?: string
  order: number
  status: ContentStatus
}

export interface DocumentItem extends BaseDoc {
  title: string
  description?: string
  category: string
  fileUrl: string
  fileName: string
  mimeType: string
  sizeBytes: number
  scope: PortalScope
  status: ContentStatus
}

export interface ProgramItem extends BaseDoc {
  title: string
  slug: string
  summary?: string
  description: string
  level?: string
  duration?: string
  conditions?: string
  tuition?: string
  coverImage?: string
  scope?: 'isssi' | 'cmeis'
  status: ContentStatus
  order: number
}

export interface AdmissionInfo extends BaseDoc {
  academicYear: string
  title: string
  requirements: string[]
  deadlines?: { label: string; date: string }[]
  feesOverview?: string
  status: ContentStatus
}

export type RegistrationStatus =
  | 'nouvelle'
  | 'en_traitement'
  | 'acceptee'
  | 'refusee'
  | 'archivee'
  | 'pending'

export interface Registration extends BaseDoc {
  nom: string
  postnom: string
  prenom: string
  sexe: 'M' | 'F'
  dateNaissance: string
  province: string
  telephone: string
  email: string
  filiereId: string
  filiereLabel: string
  niveauEtudes: string
  ecoleProvenance: string
  anneeAcademique: string
  commentaire?: string
  status: RegistrationStatus
  source: 'web' | 'mobile' | 'admin'
}

export interface ContactMessage extends BaseDoc {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  scope: PortalScope
  status: 'new' | 'read' | 'replied' | 'archived'
}

export interface NewsletterSubscriber extends BaseDoc {
  email: string
  scope: PortalScope
  active: boolean
}

export interface Partner extends BaseDoc {
  name: string
  logoUrl?: string
  website?: string
  description?: string
  order: number
  status: ContentStatus
  visible?: boolean
}

export interface PaymentInfo extends BaseDoc {
  portal?: 'isssi'
  title: string
  intro?: string
  /** @deprecated remplacé par registrationFee + annualFee */
  feesOverview?: string
  registrationFee?: string
  annualFee?: string
  bankName?: string
  bankAccountName?: string
  bankAccountNumber?: string
  bankSwift?: string
  mobileMoney: { label: string; number: string }[]
  instructions?: string
  status: ContentStatus
}
