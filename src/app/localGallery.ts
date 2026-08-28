import presentationJpeg from '@/assets/Presentation.jpeg'
import filiereJpeg from '@/assets/filiere.jpeg'
import brancheJpeg from '@/assets/branche.jpeg'
import vueJpeg from '@/assets/vue.jpeg'
import soutenancePcaJpeg from '@/assets/Soutenance PCA.jpeg'
import wa232758 from '@/assets/WhatsApp Image 2026-08-25 at 23.27.58.jpeg'
import wa232759 from '@/assets/WhatsApp Image 2026-08-25 at 23.27.59.jpeg'
import wa232809 from '@/assets/WhatsApp Image 2026-08-25 at 23.28.09.jpeg'
import wa232810 from '@/assets/WhatsApp Image 2026-08-25 at 23.28.10.jpeg'
import wa232811 from '@/assets/WhatsApp Image 2026-08-25 at 23.28.11.jpeg'
import wa232812 from '@/assets/WhatsApp Image 2026-08-25 at 23.28.12.jpeg'
import wa232813 from '@/assets/WhatsApp Image 2026-08-25 at 23.28.13.jpeg'
import wa232813b from '@/assets/WhatsApp Image 2026-08-25 at 23.28.13 (1).jpeg'
import wa232814 from '@/assets/WhatsApp Image 2026-08-25 at 23.28.14.jpeg'
import wa232814b from '@/assets/WhatsApp Image 2026-08-25 at 23.28.14 (1).jpeg'
import type { GalleryItem, PortalScope } from '@/types'

function photo(
  id: string,
  title: string,
  imageUrl: string,
  scope: PortalScope,
  album: string,
  order: number,
): GalleryItem {
  return {
    id,
    title,
    imageUrl,
    scope,
    album,
    order,
    status: 'published',
  }
}

/** Affiches ISSSI + photos locales CMEIS — uniquement en galerie. */
export const localGalleryItems: GalleryItem[] = [
  photo('local-asset-presentation', 'Présentation de l’ISSSI', presentationJpeg, 'isssi', 'Affiches', -40),
  photo('local-asset-filieres', 'Filières de formation', filiereJpeg, 'isssi', 'Affiches', -30),
  photo('local-asset-branche', 'Branche ISSSI – Haut-Uélé', brancheJpeg, 'isssi', 'Affiches', -20),
  photo('local-asset-campus', 'Plan du campus ISSSI Isiro', vueJpeg, 'isssi', 'Affiches', -10),
  photo('local-asset-soutenance-pca', 'Soutenance PCA', soutenancePcaJpeg, 'both', 'Événements', -50),
  photo('local-asset-wa-58', 'Équipe CMEIS-DG3', wa232758, 'both', 'Vie institutionnelle', -49),
  photo('local-asset-wa-59', 'Délégation sur site', wa232759, 'both', 'Vie institutionnelle', -48),
  photo('local-asset-wa-09', 'Visite de terrain', wa232809, 'both', 'Vie institutionnelle', -47),
  photo('local-asset-wa-10', 'Rencontre d’équipe', wa232810, 'both', 'Vie institutionnelle', -46),
  photo('local-asset-wa-11', 'Séance de travail', wa232811, 'both', 'Vie institutionnelle', -45),
  photo('local-asset-wa-12', 'Réunion de travail', wa232812, 'both', 'Vie institutionnelle', -44),
  photo('local-asset-wa-13', 'Concertation', wa232813, 'both', 'Vie institutionnelle', -43),
  photo('local-asset-wa-13b', 'Atelier collaboratif', wa232813b, 'both', 'Vie institutionnelle', -42),
  photo('local-asset-wa-14', 'Devant l’institution', wa232814, 'both', 'Vie institutionnelle', -41),
  photo('local-asset-wa-14b', 'Visite institutionnelle', wa232814b, 'both', 'Vie institutionnelle', -40),
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
