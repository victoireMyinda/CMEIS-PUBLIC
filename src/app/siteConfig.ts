export const siteConfig = {
  name: 'CMEIS-DG3',
  fullName:
    'Complexe Médico-Éducatif et d’Innovation en Santé – Dynamique G3',
  sigle: 'CMEIS-DG3 / RDC',
  formeJuridique: 'ASBL',
  tagline:
    'Santé, formation, recherche, innovation et action humanitaire au service des communautés',
  contact: {
    email: 'contact@cmeis-dg3.org',
    phone: '+243 900 000 000',
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '243900000000',
    address: 'Kinshasa, République Démocratique du Congo',
  },
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: '',
    linkedin: '',
  },
  mapsEmbedUrl:
    import.meta.env.VITE_MAPS_EMBED_URL ||
    'https://maps.google.com/maps?q=Kinshasa&t=&z=13&ie=UTF8&iwloc=&output=embed',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://cmeis-dg3.org',
  isssi: {
    name: 'ISSSI',
    fullName: "Institut Supérieur des Sciences de Sécurité et d'Intelligence",
    tagline: 'Former les professionnels de demain',
    contact: {
      email: 'admission@isssi.org',
      phone: '+243 900 000 001',
      whatsapp: import.meta.env.VITE_ISSSI_WHATSAPP_NUMBER || '243900000001',
      address: 'Kinshasa, République Démocratique du Congo',
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      tiktok: '',
      linkedin: '',
    },
    mapsEmbedUrl:
      import.meta.env.VITE_MAPS_EMBED_URL ||
      'https://maps.google.com/maps?q=Kinshasa&t=&z=13&ie=UTF8&iwloc=&output=embed',
  },
}

export const cmeisNav = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Vision & Mission', to: '/vision-mission' },
  { label: 'Domaines', to: '/domaines' },
  { label: 'Programmes', to: '/programmes' },
  { label: 'Services', to: '/services' },
  { label: 'Actualités', to: '/actualites' },
  { label: 'Galerie', to: '/galerie' },
  { label: 'Documents', to: '/documents' },
  { label: 'Partenaires', to: '/partenaires' },
  { label: 'Contact', to: '/contact' },
]

/** Menu ISSSI — `label` = libellé officiel ; `shortLabel` = barre desktop. */
export const isssiNav = [
  {
    label: 'Présentation de l’ISSSI',
    shortLabel: 'Présentation',
    to: '/isssi',
  },
  {
    label: 'Mot de la Direction générale',
    shortLabel: 'Direction',
    to: '/isssi/mot-direction',
  },
  {
    label: 'Vision et mission',
    shortLabel: 'Vision',
    to: '/isssi/vision-mission',
  },
  { label: 'Campus', to: '/isssi/campus' },
  {
    label: 'Filières et options',
    shortLabel: 'Filières',
    to: '/isssi/filieres',
  },
  {
    label: 'Formations courtes et certifiées',
    shortLabel: 'Academy',
    to: '/isssi/formations-courtes',
  },
  {
    label: 'Conditions d’admission',
    shortLabel: 'Admission',
    to: '/isssi/admission',
  },
  {
    label: 'Frais académiques',
    shortLabel: 'Frais',
    to: '/isssi/frais',
  },
  { label: 'Préinscription', to: '/isssi/preinscription' },
  {
    label: 'Actualités académiques',
    shortLabel: 'Actualités',
    to: '/isssi/actualites',
  },
  { label: 'Galerie', to: '/isssi/galerie' },
  { label: 'Contact', to: '/isssi/contact' },
]

/** Chemins de menu liés à une rubrique CMS (slug). */
export const navPathToSlug: Record<string, string> = {
  '/a-propos': 'a-propos',
  '/vision-mission': 'vision-mission',
  '/domaines': 'domaines',
  '/programmes': 'programmes',
  '/services': 'services',
  '/isssi': 'isssi',
  '/isssi/mot-direction': 'isssi-mot-direction',
  '/isssi/vision-mission': 'isssi-vision-mission',
  '/isssi/campus': 'isssi-campus',
  '/isssi/admission': 'isssi-admission',
  // /isssi/frais → module Paiements admin (pas une rubrique CMS)
}

export function filterNavByDisabledPages<T extends { to: string }>(
  items: T[],
  disabledSlugs: string[],
): T[] {
  if (!disabledSlugs.length) return items
  const disabled = new Set(disabledSlugs)
  return items.filter((item) => {
    const slug = navPathToSlug[item.to]
    if (!slug) return true
    return !disabled.has(slug)
  })
}

export const provincesRdc = [
  'Kinshasa',
  'Kongo-Central',
  'Kwango',
  'Kwilu',
  'Mai-Ndombe',
  'Kasaï',
  'Kasaï-Central',
  'Kasaï-Oriental',
  'Lomami',
  'Sankuru',
  'Maniema',
  'Sud-Kivu',
  'Nord-Kivu',
  'Ituri',
  'Haut-Uélé',
  'Bas-Uélé',
  'Tshopo',
  'Mongala',
  'Nord-Ubangi',
  'Sud-Ubangi',
  'Équateur',
  'Tshuapa',
  'Haut-Lomami',
  'Lualaba',
  'Haut-Katanga',
  'Tanganyika',
]
