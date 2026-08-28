import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { siteConfig as defaults } from '@/app/siteConfig'
import { brandLogoUrl } from '@/app/brandAssets'
import { getDisabledPageSlugs, getSettings } from '@/services/contentService'
import type { SiteSettings } from '@/types'

export type PortalRuntime = {
  name: string
  fullName: string
  tagline: string
  logoUrl: string
  contact: {
    email: string
    phone: string
    whatsapp: string
    address: string
  }
  social: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    tiktok?: string
    linkedin?: string
  }
  mapsEmbedUrl: string
  seoDefaultTitle?: string
  seoDefaultDescription?: string
  siteEnabled: boolean
  maintenanceMessage: string
}

export type RuntimeSiteConfig = PortalRuntime & {
  siteUrl: string
  isssi: PortalRuntime
  /** Slugs CMS désactivés / non publiés */
  disabledPageSlugs: string[]
  ready: boolean
}

const DEFAULT_MAINTENANCE = 'Site en maintenance'

const SiteContext = createContext<RuntimeSiteConfig>({
  name: defaults.name,
  fullName: defaults.fullName,
  tagline: defaults.tagline,
  logoUrl: brandLogoUrl,
  contact: defaults.contact,
  social: defaults.social,
  mapsEmbedUrl: defaults.mapsEmbedUrl,
  siteUrl: defaults.siteUrl,
  siteEnabled: true,
  maintenanceMessage: DEFAULT_MAINTENANCE,
  disabledPageSlugs: [],
  ready: false,
  isssi: {
    name: defaults.isssi.name,
    fullName: defaults.isssi.fullName,
    tagline: defaults.isssi.tagline,
    logoUrl: brandLogoUrl,
    contact: defaults.isssi.contact,
    social: defaults.isssi.social,
    mapsEmbedUrl: defaults.isssi.mapsEmbedUrl,
    siteEnabled: true,
    maintenanceMessage: DEFAULT_MAINTENANCE,
  },
})

function mergePortal(
  settings: SiteSettings | null,
  fallback: Omit<PortalRuntime, 'siteEnabled' | 'maintenanceMessage'>,
): PortalRuntime {
  if (!settings) {
    return {
      ...fallback,
      siteEnabled: true,
      maintenanceMessage: DEFAULT_MAINTENANCE,
    }
  }
  return {
    name: settings.siteName || fallback.name,
    fullName: settings.fullName || fallback.fullName,
    tagline: settings.tagline || fallback.tagline,
    logoUrl: settings.logoUrl || fallback.logoUrl,
    contact: {
      email: settings.email || fallback.contact.email,
      phone: settings.phone || fallback.contact.phone,
      whatsapp: settings.whatsapp || fallback.contact.whatsapp,
      address: settings.address || fallback.contact.address,
    },
    social: {
      facebook: settings.social?.facebook || fallback.social.facebook,
      instagram: settings.social?.instagram || fallback.social.instagram,
      twitter: settings.social?.twitter || fallback.social.twitter,
      youtube: settings.social?.youtube || fallback.social.youtube,
      tiktok: settings.social?.tiktok || fallback.social.tiktok,
      linkedin: settings.social?.linkedin || fallback.social.linkedin,
    },
    mapsEmbedUrl: settings.mapsEmbedUrl || fallback.mapsEmbedUrl,
    seoDefaultTitle: settings.seoDefaultTitle || fallback.seoDefaultTitle,
    seoDefaultDescription:
      settings.seoDefaultDescription || fallback.seoDefaultDescription,
    siteEnabled: settings.siteEnabled !== false,
    maintenanceMessage: settings.maintenanceMessage?.trim() || DEFAULT_MAINTENANCE,
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [cmeisSettings, setCmeisSettings] = useState<SiteSettings | null>(null)
  const [isssiSettings, setIsssiSettings] = useState<SiteSettings | null>(null)
  const [disabledPageSlugs, setDisabledPageSlugs] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    void Promise.all([
      getSettings('cmeis'),
      getSettings('isssi'),
      getDisabledPageSlugs(),
    ]).then(([cmeis, isssi, disabled]) => {
      setCmeisSettings(cmeis)
      setIsssiSettings(isssi)
      setDisabledPageSlugs(disabled)
      setReady(true)
    })
  }, [])

  const value = useMemo(() => {
    const cmeisFallback = {
      name: defaults.name,
      fullName: defaults.fullName,
      tagline: defaults.tagline,
      logoUrl: brandLogoUrl,
      contact: defaults.contact,
      social: defaults.social,
      mapsEmbedUrl: defaults.mapsEmbedUrl,
    }
    const isssiFallback = {
      name: defaults.isssi.name,
      fullName: defaults.isssi.fullName,
      tagline: defaults.isssi.tagline,
      logoUrl: brandLogoUrl,
      contact: defaults.isssi.contact,
      social: defaults.isssi.social,
      mapsEmbedUrl: defaults.isssi.mapsEmbedUrl,
    }
    const cmeis = mergePortal(cmeisSettings, cmeisFallback)
    return {
      ...cmeis,
      siteUrl: defaults.siteUrl,
      isssi: mergePortal(isssiSettings, isssiFallback),
      disabledPageSlugs,
      ready,
    }
  }, [cmeisSettings, isssiSettings, disabledPageSlugs, ready])

  useEffect(() => {
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
    if (link) link.href = value.logoUrl
    const apple = document.querySelector(
      "link[rel='apple-touch-icon']",
    ) as HTMLLinkElement | null
    if (apple) apple.href = value.logoUrl
  }, [value.logoUrl])

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  return useContext(SiteContext)
}

/** Infos du portail courant (CMEIS ou ISSSI). */
export function usePortal(variant: 'cmeis' | 'isssi' = 'cmeis'): PortalRuntime {
  const site = useSite()
  return variant === 'isssi' ? site.isssi : site
}
