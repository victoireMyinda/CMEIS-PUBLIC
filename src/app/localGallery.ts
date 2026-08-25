import presentationJpeg from '@/assets/Presentation.jpeg'
import filiereJpeg from '@/assets/filiere.jpeg'
import brancheJpeg from '@/assets/branche.jpeg'
import vueJpeg from '@/assets/vue.jpeg'
import type { GalleryItem, PortalScope } from '@/types'

/** Affiches locales — uniquement dans la galerie ISSSI. */
export const localGalleryItems: GalleryItem[] = [
  {
    id: 'local-asset-presentation',
    title: 'Présentation de l’ISSSI',
    imageUrl: presentationJpeg,
    scope: 'isssi',
    album: 'Affiches',
    order: -40,
    status: 'published',
  },
  {
    id: 'local-asset-filieres',
    title: 'Filières de formation',
    imageUrl: filiereJpeg,
    scope: 'isssi',
    album: 'Affiches',
    order: -30,
    status: 'published',
  },
  {
    id: 'local-asset-branche',
    title: 'Branche ISSSI – Haut-Uélé',
    imageUrl: brancheJpeg,
    scope: 'isssi',
    album: 'Affiches',
    order: -20,
    status: 'published',
  },
  {
    id: 'local-asset-campus',
    title: 'Plan du campus ISSSI Isiro',
    imageUrl: vueJpeg,
    scope: 'isssi',
    album: 'Affiches',
    order: -10,
    status: 'published',
  },
]

export function withLocalGallery(
  items: GalleryItem[],
  scope?: PortalScope,
): GalleryItem[] {
  const extras = localGalleryItems.filter(
    (item) => !scope || scope === 'both' || item.scope === scope || item.scope === 'both',
  )
  const seen = new Set(items.map((item) => item.id))
  return [...extras.filter((item) => !seen.has(item.id)), ...items]
}
