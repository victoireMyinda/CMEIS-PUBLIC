import type { DocumentItem, GalleryItem, NewsItem, Partner, ProgramItem } from '@/types'

export const mockNews: NewsItem[] = [
  {
    id: 'n1',
    title: 'Présentation officielle du CMEIS-DG3',
    slug: 'presentation-officielle-cmeis-dg3',
    excerpt:
      'Le Complexe Médico-Éducatif et d’Innovation en Santé – Dynamique G3 renforce les systèmes de santé, d’éducation et de développement communautaire.',
    content:
      'Le CMEIS-DG3 / RDC est une ASBL basée à Kinshasa. Il ambitionne de devenir une plateforme de référence en formation en sciences de santé, soins médicaux, recherche, innovation biomédicale, santé communautaire, protection sociale, action humanitaire et développement communautaire durable.',
    coverImage:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=70',
    scope: 'cmeis',
    tags: ['Institution', 'Santé'],
    publishedAt: '2026-07-20T09:00:00.000Z',
    status: 'published',
    featured: true,
    createdAt: '2026-07-20T09:00:00.000Z',
    updatedAt: '2026-07-20T09:00:00.000Z',
  },
  {
    id: 'n2',
    title: 'Ouverture des préinscriptions ISSSI 2026-2027',
    slug: 'preinscriptions-isssi-2026-2027',
    excerpt:
      'Les candidats peuvent désormais déposer leur dossier en ligne, étape par étape, depuis leur téléphone.',
    content:
      'L’ISSSI ouvre les préinscriptions pour l’année académique 2026-2027. Le parcours mobile guide le candidat en moins de cinq minutes.',
    coverImage:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=70',
    scope: 'isssi',
    tags: ['Admission', 'ISSSI'],
    publishedAt: '2026-07-28T10:00:00.000Z',
    status: 'published',
    featured: true,
    createdAt: '2026-07-28T10:00:00.000Z',
    updatedAt: '2026-07-28T10:00:00.000Z',
  },
  {
    id: 'n3',
    title: 'Priorité à la santé communautaire et à la formation',
    slug: 'sante-communautaire-formation',
    excerpt:
      'Le CMEIS-DG3 intensifie ses actions en santé préventive, formation paramédicale et protection des groupes vulnérables.',
    content:
      'Dans le cadre de ses objectifs stratégiques, le CMEIS-DG3 renforce l’accès aux soins de qualité, la formation des professionnels de santé et les interventions humanitaires au service des communautés.',
    coverImage:
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1200&q=70',
    scope: 'cmeis',
    tags: ['Santé', 'Communauté'],
    publishedAt: '2026-06-12T14:00:00.000Z',
    status: 'published',
    createdAt: '2026-06-12T14:00:00.000Z',
    updatedAt: '2026-06-12T14:00:00.000Z',
  },
]

export const mockPrograms: ProgramItem[] = [
  {
    id: 'p1',
    title: 'Sciences Infirmières',
    slug: 'sciences-infirmieres',
    summary: 'Formation aux soins infirmiers généraux et spécialisés.',
    description:
      'Cette filière forme des infirmiers capables d’assurer des soins de qualité au service des patients et des communautés.',
    level: 'Licence',
    duration: '3 ans',
    tuition: 'Sur demande',
    coverImage:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=70',
    scope: 'isssi',
    status: 'published',
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'p2',
    title: 'Santé Communautaire',
    slug: 'sante-communautaire',
    summary: 'Promotion de la santé et interventions communautaires.',
    description:
      'Parcours orienté vers la santé publique de proximité, la prévention et la mobilisation sociale.',
    level: 'Licence',
    duration: '3 ans',
    tuition: 'Sur demande',
    coverImage:
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1000&q=70',
    scope: 'isssi',
    status: 'published',
    order: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'p3',
    title: 'Techniques de Laboratoire Biomédical',
    slug: 'techniques-laboratoire-biomedical',
    summary: 'Analyses biomédicales et soutien au diagnostic.',
    description:
      'Formation pratique aux analyses de laboratoire et à la qualité des résultats.',
    level: 'Licence',
    duration: '3 ans',
    tuition: 'Sur demande',
    coverImage:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=70',
    scope: 'isssi',
    status: 'published',
    order: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'p4',
    title: 'Nutrition et Diététique',
    slug: 'nutrition-dietetique',
    summary: 'Nutrition clinique et communautaire.',
    description:
      'Former des professionnels capables de prévenir et traiter la malnutrition.',
    level: 'Licence',
    duration: '3 ans',
    tuition: 'Sur demande',
    coverImage:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=70',
    scope: 'isssi',
    status: 'published',
    order: 4,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]

export const mockDocuments: DocumentItem[] = [
  {
    id: 'd1',
    title: 'Présentation institutionnelle CMEIS-DG3',
    description:
      'Document officiel : identité, vision, mission, domaines et gouvernance.',
    category: 'Institutionnel',
    fileUrl: '#',
    fileName: 'presentation-cmeis-dg3.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 840_000,
    scope: 'cmeis',
    status: 'published',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  },
  {
    id: 'd2',
    title: 'Guide d’admission ISSSI',
    description: 'Procédures, pièces à fournir et calendrier.',
    category: 'Admission',
    fileUrl: '#',
    fileName: 'guide-admission-isssi.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 620_000,
    scope: 'isssi',
    status: 'published',
    createdAt: '2026-05-10T00:00:00.000Z',
    updatedAt: '2026-05-10T00:00:00.000Z',
  },
]

export const mockGallery: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Campus ISSSI',
    imageUrl:
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=70',
    scope: 'isssi',
    album: 'Campus',
    order: 1,
    status: 'published',
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'g2',
    title: 'Cérémonie officielle',
    imageUrl:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=70',
    scope: 'cmeis',
    album: 'Événements',
    order: 2,
    status: 'published',
    createdAt: '2026-03-02T00:00:00.000Z',
    updatedAt: '2026-03-02T00:00:00.000Z',
  },
  {
    id: 'g3',
    title: 'Salle de cours',
    imageUrl:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=70',
    scope: 'isssi',
    album: 'Campus',
    order: 3,
    status: 'published',
    createdAt: '2026-03-03T00:00:00.000Z',
    updatedAt: '2026-03-03T00:00:00.000Z',
  },
  {
    id: 'g4',
    title: 'Partenariats',
    imageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70',
    scope: 'both',
    album: 'Institution',
    order: 4,
    status: 'published',
    createdAt: '2026-03-04T00:00:00.000Z',
    updatedAt: '2026-03-04T00:00:00.000Z',
  },
]

export const mockPartners: Partner[] = [
  {
    id: 'pt1',
    name: 'Institutions publiques',
    description: 'Partenariats avec les autorités et structures publiques.',
    order: 1,
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'pt2',
    name: 'Universités et instituts',
    description: 'Coopération académique, formation et recherche.',
    order: 2,
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'pt3',
    name: 'Agences humanitaires',
    description: 'Coordination des réponses d’urgence et de protection.',
    order: 3,
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'pt4',
    name: 'Structures sanitaires',
    description: 'Collaboration technique pour les soins et la prévention.',
    order: 4,
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]
