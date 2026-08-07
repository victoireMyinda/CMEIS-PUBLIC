# Déploiement — Firebase Hosting

Guide de déploiement du portail **cmeispublic** sur **Firebase Hosting**, avec domaine principal `https://cmeis-dg3.org` et domaine ISSSI prévu `https://isssi.cmeis-dg3.org`.

---

## 1. Prérequis

- Node.js 20+ et npm
- Compte Firebase / projet GCP (Firestore, Storage, Auth, Hosting activés)
- CLI Firebase : `npm install -g firebase-tools`
- Connexion : `firebase login`
- Initialisation projet (si absent) : à la racine `cmeispublic`, lier `.firebaserc` au `projectId`

---

## 2. Variables d’environnement

Copier `.env.example` vers `.env.local` (dev) ou `.env.production` (CI).

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Clé Web Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | `{project}.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ID projet |
| `VITE_FIREBASE_STORAGE_BUCKET` | `{project}.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | App ID Web |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics (optionnel) |
| `VITE_SITE_URL` | `https://cmeis-dg3.org` en prod |
| `VITE_WHATSAPP_NUMBER` | Numéro international sans + |
| `VITE_MAPS_EMBED_URL` | URL embed Google Maps |

**Important** : les `VITE_*` sont injectées au **build** ; modifier l’env nécessite un rebuild + redeploy.

---

## 3. Build production

```bash
cd d:\DEAL-PROJECTS\CMEIS\cmeispublic
npm ci
npm run build
```

Sortie : dossier `dist/` (SPA, assets hashés, service worker PWA si plugin actif).

Vérification locale :

```bash
npm run preview
```

---

## 4. Déploiement Firebase

### Tout (hosting + rules + indexes)

```bash
firebase deploy
```

### Ciblé

```bash
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

Configuration `firebase.json` :

- Hosting `public`: `dist`
- Rewrite `**` → `/index.html` (SPA)
- Cache long assets statiques ; `index.html` no-cache

---

## 5. Premier déploiement — checklist

1. Créer projet Firebase, activer Auth (email), Firestore, Storage, Hosting
2. Déployer rules et indexes **avant** trafic public :
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
3. Seed : `roles`, `settings/global`, premier `users/{uid}` superadmin
4. Build avec `.env.production` correct
5. `firebase deploy --only hosting`
6. Vérifier PWA, formulaires, connexion admin

---

## 6. Domaine personnalisé

### Domaine principal CMEIS

1. Console Firebase → Hosting → **Ajouter un domaine personnalisé** : `cmeis-dg3.org` (+ `www` si souhaité)
2. Enregistrer enregistrements DNS (A/AAAA ou CNAME fournis par Firebase)
3. Attendre provisionnement SSL (Let’s Encrypt automatique)
4. Mettre `VITE_SITE_URL=https://cmeis-dg3.org` et rebuild/redeploy

### Sous-domaine ISSSI (phase ultérieure)

Objectif : **`https://isssi.cmeis-dg3.org`**

Options :

**A — Même site SPA (recommandé Phase 5)**  
- Ajouter second domaine custom sur le **même** site Hosting  
- À l’entrée, détecter `window.location.hostname` → redirect ou scope ISSSI par défaut (`/isssi`)  
- Mettre à jour `sitemap.xml` et canonical URLs

**B — Second site Hosting**  
- Build identique ou variante `VITE_DEFAULT_PORTAL=isssi`  
- Deux cibles deploy (scripts npm séparés)

DNS : enregistrement CNAME `isssi` → `ghs.googlehosted.com` (valeur exacte depuis console Firebase).

---

## 7. CI/CD (exemple GitHub Actions)

Étapes typiques :

1. `npm ci`
2. Injecter secrets `VITE_FIREBASE_*` depuis GitHub Secrets
3. `npm run build`
4. `firebase deploy --only hosting --token ${{ secrets.FIREBASE_TOKEN }}`

Token CI : `firebase login:ci` (compte de service dédié recommandé en entreprise).

---

## 8. Rollback

Hosting conserve l’historique des versions :

- Console Firebase → Hosting → **Release history** → Rollback

Les rules Firestore/Storage ne rollback pas automatiquement : conserver tags Git.

---

## 9. Post-déploiement

- Soumettre `https://cmeis-dg3.org/sitemap.xml` à Google Search Console
- Tester rules avec comptes test (public, editor, admin)
- Surveiller quotas Firestore/Storage dans console GCP

---

## 10. Fichiers liés

- `firebase.json`
- `firebase/firestore.rules`
- `firebase/storage.rules`
- `firebase/firestore.indexes.json`
- `public/robots.txt`, `public/sitemap.xml`
