import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Query,
  type QueryConstraint,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/firebase/config'

/**
 * Collections dont la lecture publique exige `status == 'published'`
 * (voir firestore.rules : isPublished()).
 *
 * Firestore n’applique PAS les règles comme un filtre : une query trop large
 * (ex. uniquement `slug == x`) échoue entièrement dès qu’un brouillon existe.
 */
const STATUS_PUBLISHED_COLLECTIONS = new Set([
  'pages',
  'news',
  'programs',
  'documents',
  'galleries',
  'galleryImages',
  'admissions',
  'paymentInfo',
])

function ensureDb() {
  if (!db) throw new Error('Firebase Firestore non configuré')
  return db
}

/** Query liste compatible avec les règles publiques. */
export function publicCollectionQuery(
  name: string,
  extra: QueryConstraint[] = [],
): Query<DocumentData> {
  const database = ensureDb()
  if (name === 'partners') {
    return query(collection(database, name), where('visible', '==', true), ...extra)
  }
  if (STATUS_PUBLISHED_COLLECTIONS.has(name)) {
    return query(collection(database, name), where('status', '==', 'published'), ...extra)
  }
  throw new Error(
    `Lecture publique : contrainte manquante pour « ${name} ». Ajoutez-la dans firestorePublic.ts.`,
  )
}

export async function getPublicDocs(name: string, extra: QueryConstraint[] = []) {
  return getDocs(publicCollectionQuery(name, extra))
}

export function listenPublicDocs(
  name: string,
  onNext: (snap: QuerySnapshot<DocumentData>) => void,
  onError?: (error: Error) => void,
  extra: QueryConstraint[] = [],
): Unsubscribe {
  return onSnapshot(publicCollectionQuery(name, extra), onNext, (err) => {
    onError?.(err)
  })
}
