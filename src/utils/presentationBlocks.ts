/** Découpe / reconstitue les sections de la rubrique Présentation ISSSI. */

export type PresentationBlocks = {
  intro: string
  offers: string
  axes: string
  academicLife: string
}

const HEADING_ALIASES: Record<string, keyof Omit<PresentationBlocks, 'intro'>> = {
  'ce que propose l’institut': 'offers',
  "ce que propose l'institut": 'offers',
  'ce que propose l institut': 'offers',
  'axes de formation': 'axes',
  'vie académique': 'academicLife',
  'vie academique': 'academicLife',
}

function normalizeHeading(h: string) {
  return h
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/['’]/g, "'")
}

export function parsePresentationFromContent(content: string): PresentationBlocks {
  const blocks: PresentationBlocks = {
    intro: '',
    offers: '',
    axes: '',
    academicLife: '',
  }
  if (!content?.trim()) return blocks

  const lines = content.split('\n')
  let current: keyof PresentationBlocks = 'intro'
  const buckets: Record<keyof PresentationBlocks, string[]> = {
    intro: [],
    offers: [],
    axes: [],
    academicLife: [],
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('## ')) {
      const key = HEADING_ALIASES[normalizeHeading(trimmed.slice(3))]
      current = key || 'intro'
      continue
    }
    buckets[current].push(line)
  }

  for (const key of Object.keys(buckets) as (keyof PresentationBlocks)[]) {
    blocks[key] = buckets[key].join('\n').trim()
  }
  return blocks
}

export function resolvePresentationBlocks(input: {
  content?: string
  sectionOffers?: string
  sectionAxes?: string
  sectionAcademicLife?: string
}): PresentationBlocks {
  const parsed = parsePresentationFromContent(input.content || '')
  const offers = (input.sectionOffers || '').trim()
  const axes = (input.sectionAxes || '').trim()
  const academicLife = (input.sectionAcademicLife || '').trim()
  const hasStructured = Boolean(offers || axes || academicLife)

  if (hasStructured) {
    return {
      intro: parsed.intro || (input.content || '').trim(),
      offers: offers || parsed.offers,
      axes: axes || parsed.axes,
      academicLife: academicLife || parsed.academicLife,
    }
  }

  return parsed
}
