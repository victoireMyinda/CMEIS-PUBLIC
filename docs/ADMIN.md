# Back-office admin — architecture responsive Mobile First

Interface **`/admin/*`** du portail **cmeispublic** : gestion contenu CMEIS/ISSSI, dossiers préinscription, messages et paramètres.

---

## 1. Objectifs

- Permettre aux équipes DG3 / ISSSI de travailler **depuis mobile** (contrôle, validation dossiers) et **bureau** (rédaction longue).
- Réutiliser le même design system (`DESIGN_SYSTEM.md`) avec densité légèrement accrue en `lg`.
- Respecter les rôles Firebase (`users/{uid}.role`) et permissions (`roles`).

---

## 2. Architecture front admin

```text
src/features/admin/
├── components/
│   ├── AdminShell.tsx      # Sidebar / drawer + top bar
│   ├── RoleGate.tsx        # Masque UI selon permission
│   └── StatCard.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── news/
│   ├── registrations/
│   ├── contacts/
│   ├── content/            # pages CMS, galerie, documents
│   └── settings/
└── hooks/
    ├── useAdminAuth.ts
    └── usePermissions.ts
```

**Routing** : sous-arbre `/admin` protégé par `RequireAuth` + vérification `users.active == true`.

**Données** : services dédiés (extension de `contentService`) avec requêtes **sans** filtre `published` ; écriture réservée aux rôles autorisés (aligné Firestore rules).

**État** : Zustand pour session admin (filtres liste, brouillons) ; pas de duplication du profil Auth (source : Firestore `users`).

---

## 3. Layout responsive

| Viewport | Navigation | Contenu |
|----------|------------|---------|
| Mobile | Drawer `[≡]`, overlay | Liste en cartes empilées |
| `md` | Rail icônes ou drawer | Table → cartes hybrides |
| `lg` | Sidebar texte 240px | Tables multi-colonnes, éditeur split |

Barre supérieure : titre page, actions contextuelles (Publier, Exporter), menu utilisateur (profil, déconnexion).

---

## 4. Rôles et écrans

| Rôle | Description | Écrans |
|------|-------------|--------|
| **viewer** | Lecture tableaux de bord et listes | Dashboard, listes (sans édition) |
| **editor** | Contenu éditorial | Actualités, pages, galerie, documents, programmes, partenaires, admissions |
| **admin** | + exploitation | Tout editor + préinscriptions, contacts, newsletter, preuves paiement, utilisateurs (sauf superadmin) |
| **superadmin** | Contrôle total | + paramètres globaux, gestion superadmin, suppression sensible |

Matrice permission → UI : masquer boutons « Créer », « Supprimer », « Publier » si permission absente (`RoleGate`).

---

## 5. Écrans fonctionnels

### Authentification

- `/admin/login` : email/mot de passe Firebase Auth ; message si `active == false`.
- Redirection post-login vers `from` ou `/admin/dashboard`.

### Dashboard

- KPI : préinscriptions `pending`, contacts `new`, brouillons contenu.
- Liens rapides vers files de travail.

### Contenu (`editor+`)

| Module | Actions |
|--------|---------|
| Actualités | CRUD, scope, statut, `publishedAt`, slug |
| Pages CMS | Édition body, SEO |
| Galerie | Upload Storage, ordre, album |
| Documents | Fichier + métadonnées |
| Programmes / filières | Ordre, tarifs affichés |
| Partenaires | Logo, ordre |
| Admissions | Année, délais |

Éditeur : formulaire mobile une colonne ; preview optionnelle `md+`.

### Préinscriptions (`admin+`)

- Liste filtrable par `status`, tri `createdAt` desc.
- Détail dossier : données candidat, historique, changement statut, lien preuves `paymentProofs`.
- Export CSV (Phase 3+).

### Contacts & newsletter

- Contacts : workflow `new` → `read` → `replied` → `archived`.
- Newsletter : liste abonnés, désactivation (`active: false`).

### Utilisateurs (`admin+`, création superadmin `superadmin` only)

- Invitation par email (création Auth + doc `users`).
- Attribution rôle, activation/désactivation.

### Paramètres (`superadmin`)

- Document `settings/global` : coordonnées, réseaux, carte.

---

## 6. Uploads & Storage

- Médias publiés : `media/{scope}/{collection}/{id}/...`
- Preuves : `registrations/{registrationId}/proofs/...` (auth requise, voir `storage.rules`)
- UI : progression upload, taille max, types MIME autorisés.

---

## 7. Sécurité UI

- Timeout session : déconnexion Auth après inactivité (configurable).
- Pas d’affichage de champs interdits par rôle (defense in depth avec rules).
- Journalisation actions sensibles : Cloud Functions (Phase 4).

---

## 8. Références

- Modèle données : `FIRESTORE.md`
- Auth & rules : `SECURITY.md`
- Wireframe dashboard mobile : `WIREFRAMES.md` §5
