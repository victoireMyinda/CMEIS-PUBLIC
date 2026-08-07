# Architecture — Portail institutionnel CMEIS-DG3 / ISSSI

Document de référence pour l’application **cmeispublic** : React 19, Vite 8, TypeScript, Tailwind CSS 4, Firebase, déploiement Firebase Hosting. Approche **Mobile First**, **Clean Architecture** légère et préparation **PWA**.

---

## 1. Objectifs produit

- Un seul dépôt SPA pour le portail **CMEIS-DG3** (`/`) et l’espace **ISSSI** (`/isssi/*`).
- Contenu éditorial et formulaires publics (contact, newsletter, préinscription) avec persistance Firestore.
- Back-office responsive (`/admin/*`) pour rôles `editor`, `admin`, `superadmin`.
- Performance mobile (RDC), mode hors-ligne partiel via PWA, évolution possible vers Flutter sans refonte du modèle de données.

---

## 2. Stack technique

| Couche | Technologie |
|--------|-------------|
| UI | React 19, React Compiler (Babel), Framer Motion |
| Routing | React Router DOM 7 |
| Styles | Tailwind CSS 4 (`@theme`, `@import 'tailwindcss'`) |
| État global | Zustand |
| Formulaires | React Hook Form + Zod |
| Backend | Firebase Auth, Firestore, Storage |
| Build | Vite 8, code splitting manuel (`vendor`, `firebase`, `motion`) |
| PWA | `vite-plugin-pwa` (manifest, Workbox, cache fonts + Storage) |

Variables d’environnement : voir `.env.example` (`VITE_FIREBASE_*`, `VITE_SITE_URL`, etc.).

---

## 3. Structure des dossiers (cible)

```
cmeispublic/
├── docs/                    # Documentation projet (ce dossier)
├── firebase/                # Règles Firestore/Storage, indexes
├── public/                  # Assets statiques, robots.txt, sitemap.xml
├── src/
│   ├── app/                 # Configuration applicative (siteConfig, routes meta)
│   │   └── siteConfig.ts    # Nav CMEIS / ISSSI, contact, URLs
│   ├── components/
│   │   ├── layout/          # Header, Footer, shells
│   │   ├── shared/          # Seo, NewsCard, GallerySwipe, MobileSearch, WhatsAppFloat
│   │   └── ui/              # Button, Card, Form, Feedback, OptimizedImage
│   ├── features/            # (à venir) modules par domaine métier
│   │   ├── cmeis/           # Pages institution CMEIS
│   │   ├── isssi/           # Pages ISSSI + préinscription
│   │   └── admin/           # Écrans back-office
│   ├── hooks/               # useAuth, useMediaQuery, usePortalScope
│   ├── layouts/
│   │   ├── PublicLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── pages/               # Composants page liés au routeur (lazy)
│   ├── routes/
│   │   ├── index.tsx        # Définition des routes + React.lazy
│   │   └── guards/          # RequireAuth, RequireRole
│   ├── services/            # Accès données (Firestore + fallback mock)
│   │   ├── contentService.ts
│   │   └── mockData.ts
│   ├── store/               # Zustand (session, UI, brouillons admin)
│   ├── firebase/
│   │   └── config.ts        # App, Auth, Firestore persistant, Storage
│   ├── types/
│   │   └── index.ts         # Contrats Firestore / UI
│   ├── utils/
│   │   └── cn.ts
│   ├── index.css            # Design tokens Tailwind
│   ├── main.tsx             # Bootstrap + Router + providers
│   └── App.tsx              # Point d’entrée routes (ou délégué à routes/)
├── firebase.json
├── vite.config.ts
└── package.json
```

**Alias Vite** : `@/` → `src/`.

---

## 4. Clean Architecture (adaptée au frontend)

Séparation en anneaux, dépendances **vers l’intérieur** uniquement :

1. **Domaine** (`src/types/`) — entités et enums (`UserRole`, `NewsItem`, `Registration`, etc.). Aucune dépendance React/Firebase.
2. **Application / cas d’usage** (`src/services/`, futurs `src/features/*/api.ts`) — orchestration : requêtes Firestore, validation Zod, mapping documents.
3. **Présentation** (`src/pages/`, `src/components/`, `src/features/*/components/`) — UI, hooks locaux, appels aux services.
4. **Infrastructure** (`src/firebase/`) — initialisation SDK, configuration cache Firestore.

Règle : les composants UI **ne** importent **pas** `firebase/firestore` directement ; ils passent par `services/`.

---

## 5. Principes SOLID (application concrète)

| Principe | Application |
|----------|-------------|
| **S** — Single Responsibility | Un service par agrégat (`contentService` → scinder en `newsService`, `registrationService` si le fichier grossit). Un composant = une responsabilité visuelle. |
| **O** — Open/Closed | Extension via `siteConfig` (nav, scopes) et types `PortalScope` sans modifier les composants génériques (`NewsCard`, `Seo`). |
| **L** — Liskov | Interfaces TypeScript communes (`BaseDoc`, `ContentStatus`) pour tout contenu éditorial publiable. |
| **I** — Interface Segregation | Props minimales sur `ui/*` ; pas de props « fourre-tout » admin dans les composants publics. |
| **D** — Dependency Inversion | `isFirebaseConfigured` + mocks dans `mockData` : la UI dépend d’abstractions async, pas du SDK en dur. |

---

## 6. Mobile First

- **CSS** : styles de base pour viewport mobile ; enrichissement `@media (min-width: …)` via breakpoints Tailwind `sm`, `md`, `lg`.
- **Touch** : classe utilitaire `.touch-target` (min 44×44 px), `safe-area-inset` pour barres système.
- **Navigation** : menu hamburger plein écran sur mobile ; barre horizontale à partir de `md`.
- **Images** : `OptimizedImage`, lazy loading, formats adaptés (WebP côté Storage).
- **Formulaires** : champs pleine largeur, claviers adaptés (`type="email"`, `inputmode="tel"`), étapes wizard ISSSI sur une colonne.

---

## 7. Routage CMEIS + ISSSI

Configuration centralisée dans `siteConfig.ts` (`cmeisNav`, `isssiNav`).

### Portail public CMEIS

| Chemin | Page |
|--------|------|
| `/` | Accueil |
| `/a-propos` | À propos |
| `/vision-mission` | Vision & Mission |
| `/domaines` | Domaines |
| `/programmes` | Programmes |
| `/services` | Services |
| `/actualites` | Liste actualités |
| `/actualites/:slug` | Détail |
| `/galerie` | Galerie |
| `/documents` | Documents |
| `/partenaires` | Partenaires |
| `/contact` | Contact |

### Espace ISSSI

Préfixe **`/isssi`** (même SPA, scope Firestore `isssi` ou `both`) :

| Chemin | Page |
|--------|------|
| `/isssi` | Accueil ISSSI |
| `/isssi/mot-direction` | Mot de la Direction |
| `/isssi/vision-mission` | Vision & Mission |
| `/isssi/campus` | Campus |
| `/isssi/filieres` | Filières |
| `/isssi/filieres/:slug` | Détail filière |
| `/isssi/admission` | Admission |
| `/isssi/frais` | Frais |
| `/isssi/preinscription` | Wizard préinscription |
| `/isssi/actualites` | Actualités ISSSI |
| `/isssi/galerie` | Galerie ISSSI |
| `/isssi/contact` | Contact ISSSI |

### Administration

| Chemin | Accès |
|--------|--------|
| `/admin/login` | Public |
| `/admin` | Authentifié |
| `/admin/dashboard` | `viewer`+ |
| `/admin/news`, `/admin/registrations`, etc. | Selon rôle (voir `ADMIN.md`) |

**Layout** : `PublicLayout` pour `/` et `/isssi/*` ; `AdminLayout` pour `/admin/*`. Détection du scope : chemin commence par `/isssi` → branding ISSSI.

---

## 8. Code splitting

Configuré dans `vite.config.ts` :

- **Chunks manuels** : `vendor` (React, Router), `firebase`, `motion`.
- **Routes** : `React.lazy()` + `Suspense` par feature (`features/cmeis`, `features/isssi`, `features/admin`) pour réduire le bundle initial mobile.
- **CSS** : `cssCodeSplit: true`.

Ordre de chargement recommandé : shell layout → page → données Firestore (avec skeletons).

---

## 9. PWA

- Plugin **VitePWA** : `registerType: 'autoUpdate'`, manifest (nom, `theme_color` `#0B3D2E`, `background_color` `#F7F5F0`).
- **Workbox** : fallback SPA `index.html` ; cache Google Fonts ; cache stale-while-revalidate Firebase Storage.
- Fichiers publics : `robots.txt`, `sitemap.xml`, icônes (`favicon.svg`).

Critères « production PWA » : HTTPS (Hosting), manifest valide, service worker actif, Lighthouse PWA ≥ 90 sur mobile.

---

## 10. Flux de données (lecture publique)

```
Page → service (ex. getNews) → Firestore query [status=published]
                             → fallback mockData si Firebase non configuré
                             → types NewsItem[] → composants
```

Écriture publique : `submitRegistration`, `submitContact`, `subscribeNewsletter` → collections dédiées, statuts initiaux imposés côté client **et** règles Firestore.

---

## 11. Évolution vers Flutter

Le contrat stable pour une app mobile native est **Firestore + Storage + Auth** (schéma dans `FIRESTORE.md`), pas la couche React.

| Élément web | Équivalent Flutter |
|-------------|-------------------|
| Types TS | Modèles Dart + `freezed` / `json_serializable` |
| `contentService` | Repository + `cloud_firestore` |
| Routes | `go_router` avec mêmes chemins logiques |
| PWA cache | Cache images + offline Firestore |
| Admin web | Conserver React admin ou Flutter interne selon phase |

Phase recommandée : Flutter **lecture + préinscription + upload preuve** ; admin reste web responsive jusqu’à Phase 5 (voir `ROADMAP.md`).

---

## 12. Qualité et CI (recommandé)

- `npm run build` : `tsc -b && vite build` (bloquant en CI).
- `npm run lint` : ESLint 10.
- Déploiement : `firebase deploy` (voir `DEPLOYMENT.md`).
- Tests : Vitest + Testing Library (Phase 2+) sur services et formulaires critiques.

---

## 13. Références internes

- Schéma données : `FIRESTORE.md`
- Design : `DESIGN_SYSTEM.md`
- Sécurité : `SECURITY.md`, `firebase/firestore.rules`
- Back-office : `ADMIN.md`
