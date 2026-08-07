# CMEIS-DG3 Public Portal

Portail institutionnel **CMEIS-DG3** + espace **ISSSI**, conçu **Mobile First** (React + Vite + TypeScript + Tailwind + Firebase).

## Démarrage rapide

```bash
cd cmeispublic
cp .env.example .env
npm install
npm run dev
```

Sans clés Firebase, l’app tourne en **mode démo** (données mock + admin démo).

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | ESLint |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Firestore](docs/FIRESTORE.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Wireframes](docs/WIREFRAMES.md)
- [Admin](docs/ADMIN.md)
- [Sécurité](docs/SECURITY.md)
- [Roadmap](docs/ROADMAP.md)
- [Déploiement Firebase Hosting](docs/DEPLOYMENT.md)

## Routes principales

- `/` — Accueil CMEIS-DG3
- `/isssi` — Espace ISSSI
- `/isssi/preinscription` — Wizard préinscription mobile
- `/admin` — Back-office (login `/admin/login`)

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · React Router · Firebase · React Hook Form · Zod · Zustand · Framer Motion · PWA Ready
