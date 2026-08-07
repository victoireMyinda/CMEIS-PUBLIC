# Roadmap — Portail CMEIS-DG3 / ISSSI

Plan de développement par phases. Durées indicatives ; ajuster selon ressources DG3.

---

## Phase 0 — Fondations (en cours)

**Objectif** : socle technique, documentation, Firebase, design tokens.

- [x] Projet Vite + React + TypeScript + Tailwind 4
- [x] Types domaine (`src/types`), `siteConfig`, services + mocks
- [x] Config Firebase (Auth, Firestore persistant, Storage)
- [x] PWA (manifest, Workbox) dans `vite.config.ts`
- [x] Documentation `docs/*`, rules Firestore/Storage, indexes
- [ ] Routes lazy + layouts publics CMEIS / ISSSI
- [ ] Remplacement template `App.tsx` par routeur production

**Livrable** : build déployable avec contenu mock si Firebase absent.

---

## Phase 1 — Portail public MVP

**Objectif** : site institutionnel mobile utilisable en production (contenu statique/mock ou Firestore seed).

- Pages CMEIS : accueil, à propos, vision, domaines, programmes, services, contact
- Pages ISSSI : accueil, présentation, filières (liste + détail), admission, frais
- Actualités, galerie, documents, partenaires (lecture Firestore `published`)
- Formulaires : contact, newsletter → Firestore
- SEO : `Seo`, `sitemap.xml`, `robots.txt`
- Analytics : Firebase Analytics / GA4 (opt-in cookies si requis)

**Critère de succès** : Lighthouse Performance ≥ 85 mobile ; formulaires fonctionnels avec rules.

---

## Phase 2 — Préinscription ISSSI

**Objectif** : parcours candidat complet.

- Wizard 4 étapes (`/isssi/preinscription`) + validation Zod
- Collection `registrations`, notifications email (Cloud Functions)
- Upload preuve paiement (Storage + `paymentProofs`)
- Auth anonyme ou lien magique pour reprise dossier (option)
- Admin : liste/filtre dossiers, changement statut

**Critère de succès** : zero fuite données candidats en test rules ; parcours ≤ 5 min mobile 3G.

---

## Phase 3 — Back-office admin

**Objectif** : autonomie éditoriale DG3 / ISSSI.

- Auth staff, dashboard mobile-first
- CRUD actualités, pages, galerie, documents, programmes, partenaires, admissions
- Gestion contacts, newsletter, export CSV registrations
- Rôles `editor` / `admin` / `superadmin` opérationnels
- Paramètres globaux `settings/global`

**Critère de succès** : editor publie une actualité sans déploiement code.

---

## Phase 4 — Durcissement & observabilité

**Objectif** : production grade.

- App Check, rate limiting Functions sur créations publiques
- CSP, headers sécurité Hosting
- Tests E2E (Playwright) parcours critique
- Monitoring (Sentry ou Crashlytics web), alertes quotas Firebase
- Sauvegardes Firestore planifiées
- i18n secondaire (EN) si requis

---

## Phase 5 — Mobile natif & domaines

**Objectif** : extension audience et marque.

- Application **Flutter** (lecture + préinscription + notifications FCM) partageant Firestore
- Domaine personnalisé **ISSSI** : `https://isssi.cmeis-dg3.org` (voir `DEPLOYMENT.md`)
- SSO staff optionnel (Google Workspace) si politique DG3
- Intégration paiement en ligne (si partenaire local)

**Critère de succès** : parité fonctionnelle préinscription web/mobile ; admin reste web responsive.

---

## Jalons transverses

| Jalon | Phase |
|-------|-------|
| Premier déploiement Firebase Hosting | 0–1 |
| Contenu réel ISSSI en ligne | 1 |
| Ouverture campagne préinscription | 2 |
| Formation équipe admin | 3 |
| Audit sécurité externe | 4 |

---

## Dette technique acceptée (temporaire)

- Contenu filtré `scope` côté client pour certaines requêtes (optimiser indexes Phase 3).
- Admin et public dans même bundle jusqu’à split route admin (Phase 3).

Voir `ARCHITECTURE.md` pour stack et évolution Flutter.
