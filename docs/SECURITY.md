# Sécurité — Firebase Auth & modèle d’accès

Vue d’ensemble de la sécurité du portail **CMEIS-DG3 / ISSSI** (Firestore, Storage, Auth). Implémentation : `firebase/firestore.rules`, `firebase/storage.rules`.

---

## 1. Périmètre

| Surface | Menaces principales | Mitigation |
|---------|---------------------|------------|
| Site public | Scraping, spam formulaires | Rules création limitée, validation champs, rate limit Functions |
| Admin | Élévation privilèges, compte partagé | Rôles Firestore, `active`, Auth email |
| Storage | Upload malware, hotlink | MIME/taille, chemins séparés, auth write |
| Données personnelles | Fuite dossiers étudiants | Pas de lecture publique registrations |

---

## 2. Firebase Authentication

### Méthodes

- **Email / mot de passe** : staff admin uniquement.
- **Anonyme** (option Phase 2) : upload preuve paiement après création dossier, UID lié côté app.
- Pas de login social public en Phase 1.

### Cycle de vie compte staff

1. `superadmin` crée utilisateur Auth + document `users/{uid}` avec `role`, `active: true`.
2. À chaque requête admin, rules lisent `users/{request.auth.uid}`.
3. Révocation : `active: false` (rules refusent même si token valide).

### Custom claims (optionnel)

Les règles actuelles utilisent **Firestore `users.role`** (pas de claims). Migration possible vers claims + sync Function pour réduire les `get()` en rules.

---

## 3. Rôles

| Rôle | Firestore | Storage | Admin UI |
|------|-----------|---------|----------|
| **superadmin** | Lecture/écriture totale collections métier + users + settings | Écriture tous chemins admin | Tous écrans |
| **admin** | Idem sauf modification rôle superadmin | Écriture media + registrations admin | Exploitation + users |
| **editor** | CRUD contenu publiable (pages, news, …) | Écriture `media/**` | Contenu |
| **viewer** | Lecture collections admin (non publiques) | Lecture media admin | Lecture seule |

Visiteur non authentifié :

- **Lecture** : documents `status == published` (collections contenu), `settings/global`.
- **Création** : `registrations`, `contacts`, `newsletter` (champs contrôlés).
- **Interdit** : lecture listes registrations/contacts/newsletter, écriture contenu.

---

## 4. Helpers rules (Firestore)

| Helper | Rôle |
|--------|------|
| `isAuth()` | `request.auth != null` |
| `userData()` | `get(users/{uid}).data` |
| `isActiveStaff()` | Auth + `active == true` + rôle staff |
| `isAdmin()` | Rôles `admin`, `superadmin`, `editor` (accès back-office contenu) |
| `isManager()` | `admin`, `superadmin` (registrations, users, settings) |
| `isSuperAdmin()` | `superadmin` seul |
| `isPublished()` | `resource.data.status == 'published'` |

Permissions fines :

- **editor** : pas de `update/delete` sur `users`, `settings`, `registrations` (sauf lecture si étendu).
- **admin** : gestion registrations/contacts ; **superadmin** : users + settings.

---

## 5. Collections — résumé ACL

| Collection | Read public | Create public | Update/Delete |
|------------|-------------|---------------|---------------|
| users | Self only | — | manager+ ; role superadmin pour promouvoir superadmin |
| roles | staff | superadmin | superadmin |
| pages, news, galleries, documents, programs, partners, admissions | published | — | isAdmin() |
| registrations | — | oui (validé) | manager+ |
| paymentProofs | — | auth (create validé) | manager+ |
| contacts | — | oui | manager+ |
| newsletter | — | oui | manager+ |
| settings/global | oui | — | superadmin |

---

## 6. Storage

| Chemin | Read | Write |
|--------|------|-------|
| `media/public/**` | Public | isAdmin() staff actif |
| `media/draft/**` | Staff | isAdmin() |
| `registrations/{id}/proofs/**` | Staff + auth owner pattern | Auth + contraintes taille/type ; manager read all |

Détails : `firebase/storage.rules`.

---

## 7. Bonnes pratiques production

- Activer **App Check** (reCAPTCHA Enterprise / Play Integrity) Phase 2.
- **Règles** : tester avec Emulator Suite (`firebase emulators:start`).
- Secrets : uniquement `VITE_*` publics côté client ; clés Admin SDK jamais dans le repo.
- CSP headers via Hosting (Phase 3) : restreindre scripts, autoriser Firebase domains.
- RGPD / loi congolaise : consentement préinscription, durée conservation registrations, export/suppression sur demande.
- Audit : logs Cloud Logging sur Auth anomalies, exports admin.

---

## 8. Incident response (résumé)

1. Désactiver compte compromis (`active: false`).
2. Déployer rules renforcées si faille.
3. Rotation mots de passe staff ; revue indexes et accès GCP IAM.

---

## 9. Fichiers associés

- `firebase/firestore.rules`
- `firebase/storage.rules`
- `docs/FIRESTORE.md`
- `docs/ADMIN.md`
