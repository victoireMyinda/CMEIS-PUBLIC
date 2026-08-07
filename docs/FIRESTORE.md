# Schéma Firestore — CMEIS-DG3 / ISSSI

Convention globale :

- **Horodatages** : champs `createdAt`, `updatedAt` en `Timestamp` Firestore (côté client : conversion ISO en lecture via mappers).
- **Statuts contenu** : `draft` | `published` | `archived`.
- **Scope portail** : `cmeis` | `isssi` | `both`.
- **IDs** : document ID auto sauf `users/{uid}` (= Firebase Auth UID), `settings/global`, `roles/{roleKey}`.

Types alignés sur `src/types/index.ts`.

---

## Collection `users`

Profil back-office lié à Firebase Auth.

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `uid` | string | oui | = ID document |
| `email` | string | oui | |
| `displayName` | string | oui | |
| `role` | string | oui | `superadmin` \| `admin` \| `editor` \| `viewer` |
| `photoURL` | string | non | URL Storage ou Auth |
| `active` | boolean | oui | `false` = accès révoqué |
| `createdAt` | timestamp | oui | |
| `updatedAt` | timestamp | oui | |
| `createdBy` | string | non | UID admin créateur |
| `updatedBy` | string | non | |

**Relations** : `users.role` → document `roles/{role}` (permissions logiques côté app).

**Index** : aucun composite obligatoire (lecture par ID).

---

## Collection `roles`

Catalogue des rôles (seed initial).

| Champ | Type | Requis |
|-------|------|--------|
| `key` | string | oui (`superadmin`, …) |
| `label` | string | oui |
| `permissions` | array\<string\> | oui |
| `createdAt`, `updatedAt` | timestamp | oui |

Exemples de permissions : `content:write`, `users:manage`, `registrations:manage`, `settings:write`.

---

## Collection `pages`

Pages CMS (À propos, Mot direction, etc.).

| Champ | Type | Requis |
|-------|------|--------|
| `slug` | string | oui | unique par `scope` |
| `scope` | string | oui | `cmeis` \| `isssi` \| `both` |
| `title` | string | oui |
| `excerpt` | string | non |
| `body` | string | oui | Markdown ou HTML sanitisé |
| `coverImage` | string | non | URL Storage |
| `seoTitle` | string | non |
| `seoDescription` | string | non |
| `status` | string | oui |
| `createdAt`, `updatedAt` | timestamp | oui |
| `createdBy`, `updatedBy` | string | non |

**Requêtes** : `where('slug','==', slug)` + filtre `scope` en app ; publication `where('status','==','published')`.

**Index composite recommandé** : `scope` ASC, `slug` ASC (admin / résolution page).

---

## Collection `news`

| Champ | Type | Requis |
|-------|------|--------|
| `title` | string | oui |
| `slug` | string | oui | unique global |
| `excerpt` | string | oui |
| `content` | string | oui |
| `coverImage` | string | non |
| `scope` | string | oui |
| `tags` | array\<string\> | oui |
| `publishedAt` | timestamp | non | requis si `published` |
| `status` | string | oui |
| `featured` | boolean | non |
| `createdAt`, `updatedAt` | timestamp | oui |
| `createdBy`, `updatedBy` | string | non |

**Requêtes publiques** (`contentService.getNews`) :

```text
where('scope', 'in', [scope, 'both'])
where('status', '==', 'published')
orderBy('publishedAt', 'desc')
```

**Index composite requis** : voir `firebase/firestore.indexes.json` — `scope`, `status`, `publishedAt`.

**Requête slug** : `where('slug','==', slug)` + index simple ou composite selon filtres additionnels.

---

## Collection `galleries`

| Champ | Type | Requis |
|-------|------|--------|
| `title` | string | oui |
| `description` | string | non |
| `imageUrl` | string | oui |
| `thumbUrl` | string | non |
| `scope` | string | oui |
| `album` | string | oui | regroupement UI |
| `order` | number | oui |
| `status` | string | oui |
| `createdAt`, `updatedAt` | timestamp | oui |

**Requête** : `status == published`, `orderBy('order','asc')`, filtre `scope` côté client.

**Index composite requis** : `status`, `order`.

---

## Collection `documents`

| Champ | Type | Requis |
|-------|------|--------|
| `title` | string | oui |
| `description` | string | non |
| `category` | string | oui |
| `fileUrl` | string | oui |
| `fileName` | string | oui |
| `mimeType` | string | oui |
| `sizeBytes` | number | oui |
| `scope` | string | oui |
| `status` | string | oui |
| `createdAt`, `updatedAt` | timestamp | oui |

**Requête** : `status == published`, `orderBy('createdAt','desc')`.

**Index composite requis** : `status`, `createdAt`.

---

## Collection `programs`

Filières / programmes (ISSSI prioritaire, extensible CMEIS).

| Champ | Type | Requis |
|-------|------|--------|
| `title` | string | oui |
| `slug` | string | oui |
| `summary` | string | oui |
| `description` | string | oui |
| `level` | string | non |
| `duration` | string | non |
| `tuition` | string | non |
| `coverImage` | string | non |
| `scope` | string | oui | `isssi` \| `cmeis` |
| `status` | string | oui |
| `order` | number | oui |
| `createdAt`, `updatedAt` | timestamp | oui |

**Requête** : `status == published`, `orderBy('order','asc')`.

**Index composite requis** : `status`, `order`.

**Relation** : `registrations.filiereId` → `programs/{id}`.

---

## Collection `admissions`

Contenu éditorial admission (année académique, délais).

| Champ | Type | Requis |
|-------|------|--------|
| `academicYear` | string | oui | ex. `2025-2026` |
| `title` | string | oui |
| `requirements` | array\<string\> | oui |
| `deadlines` | array\<map\> | oui | `{ label, date }` |
| `feesOverview` | string | non |
| `status` | string | oui |
| `createdAt`, `updatedAt` | timestamp | oui |

**Requête typique** : dernière admission publiée `where('status','==','published')`, `orderBy('academicYear','desc')` (index à ajouter si utilisé).

---

## Collection `registrations`

Préinscriptions ISSSI (création publique).

| Champ | Type | Requis |
|-------|------|--------|
| `nom`, `postnom`, `prenom` | string | oui |
| `sexe` | string | oui | `M` \| `F` |
| `dateNaissance` | string | oui | ISO date |
| `province` | string | oui |
| `telephone` | string | oui |
| `email` | string | oui |
| `filiereId` | string | oui |
| `filiereLabel` | string | oui | dénormalisé |
| `niveauEtudes` | string | oui |
| `ecoleProvenance` | string | oui |
| `anneeAcademique` | string | oui |
| `commentaire` | string | non |
| `status` | string | oui | `pending` \| `reviewed` \| `accepted` \| `rejected` \| `archived` |
| `source` | string | oui | `web` \| `mobile` |
| `createdAt`, `updatedAt` | timestamp | oui |

**Admin** : `where('status','==', …)`, `orderBy('createdAt','desc')`.

**Index composite requis** : `status`, `createdAt`.

---

## Collection `paymentProofs`

Preuves de paiement liées à une préinscription.

| Champ | Type | Requis |
|-------|------|--------|
| `registrationId` | string | oui | → `registrations/{id}` |
| `amount` | number | oui |
| `currency` | string | oui | ex. `USD`, `CDF` |
| `proofUrl` | string | oui | Storage |
| `note` | string | non |
| `status` | string | oui | `pending` \| `verified` \| `rejected` |
| `createdAt`, `updatedAt` | timestamp | oui |

**Index recommandé** : `registrationId` ASC, `createdAt` DESC (liste par dossier).

---

## Collection `contacts`

Messages formulaire contact.

| Champ | Type | Requis |
|-------|------|--------|
| `name` | string | oui |
| `email` | string | oui |
| `phone` | string | non |
| `subject` | string | oui |
| `message` | string | oui |
| `scope` | string | oui |
| `status` | string | oui | `new` \| `read` \| `replied` \| `archived` |
| `createdAt`, `updatedAt` | timestamp | oui |

**Index composite requis** : `status`, `createdAt`.

---

## Collection `newsletter`

Abonnés newsletter.

| Champ | Type | Requis |
|-------|------|--------|
| `email` | string | oui |
| `scope` | string | oui |
| `active` | boolean | oui |
| `createdAt`, `updatedAt` | timestamp | oui |

**Unicité** : enforced côté Cloud Function ou requête admin ; création publique sans lecture liste.

**Index optionnel** : `email` ASC (dédoublonnage admin).

---

## Collection `partners`

| Champ | Type | Requis |
|-------|------|--------|
| `name` | string | oui |
| `logoUrl` | string | non |
| `website` | string | non |
| `description` | string | non |
| `order` | number | oui |
| `status` | string | oui |
| `createdAt`, `updatedAt` | timestamp | oui |

**Requête** : `status == published`, `orderBy('order','asc')` (index `status` + `order` — ajouter à indexes si requête admin/partenaires identique à programs).

---

## Document `settings/global`

Paramètres site (singleton).

| Champ | Type | Requis |
|-------|------|--------|
| `siteName` | string | oui |
| `tagline` | string | oui |
| `whatsapp` | string | oui |
| `email` | string | oui |
| `phone` | string | oui |
| `address` | string | oui |
| `social` | map | non | facebook, linkedin, youtube, … |
| `mapsEmbedUrl` | string | non |
| `updatedAt` | timestamp | oui |

Lecture publique autorisée (règles) pour hydrater le footer ; écriture admin uniquement.

---

## Diagramme des relations

```text
users ──role──> roles (logique)

programs <── filiereId ── registrations ──> paymentProofs
                                              └── proofUrl → Storage

pages, news, galleries, documents, programs, partners, admissions
  └── scope: cmeis | isssi | both

contacts, newsletter ── scope
```

---

## Indexes composites déployés

Fichier source : `firebase/firestore.indexes.json`.

| Collection | Champs | Usage |
|------------|--------|--------|
| `news` | `scope`, `status`, `publishedAt` | Liste actualités par portail |
| `documents` | `status`, `createdAt` | Documents publiés récents |
| `programs` | `status`, `order` | Filières ordonnées |
| `galleries` | `status`, `order` | Galerie ordonnée |
| `registrations` | `status`, `createdAt` | File admin préinscriptions |
| `contacts` | `status`, `createdAt` | Boîte de réception admin |

Déploiement : `firebase deploy --only firestore:indexes`.

---

## Bonnes pratiques production

- Seed `roles` + premier `users/{superadminUid}` via console ou script Admin SDK.
- Règles strictes : voir `firebase/firestore.rules` et `SECURITY.md`.
- Pas de données sensibles (numéros complets, pièces d’identité) dans Firestore sans chiffrement et politique de rétention.
- Sauvegardes : export planifié Firestore (GCP) + rétention Storage preuves.
