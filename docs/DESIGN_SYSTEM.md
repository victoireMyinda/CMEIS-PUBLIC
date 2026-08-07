# Design system — Mobile First CMEIS-DG3 / ISSSI

Système visuel du portail **cmeispublic**, implémenté via Tailwind CSS 4 et tokens dans `src/index.css`.

---

## 1. Principes

1. **Mobile d’abord** : maquettes et CSS partent du viewport 320–428 px ; enrichissement progressif `sm` → `lg`.
2. **Institutionnel & accessible** : contrastes WCAG AA minimum, focus visible, `prefers-reduced-motion`.
3. **Deux marques, une base** : CMEIS (vert institutionnel) ; ISSSI réutilise la palette avec accents et titres orientés formation.
4. **Touch-first** : cibles tactiles ≥ 44 px, espacement généreux, pas de hover-only.

---

## 2. Couleurs

### Marque

| Token CSS | Hex | Usage |
|-----------|-----|--------|
| `--color-brand-700` | **#0B3D2E** | En-têtes, boutons primaires, PWA `theme_color` |
| `--color-accent-500` | **#D4A017** | Accents, CTA secondaires, badges |
| `--color-surface` | **#F7F5F0** | Fond page, PWA `background_color` |

### Échelle brand (extrait)

| Token | Hex |
|-------|-----|
| brand-50 | #eef6f2 |
| brand-500 | #2f7f5e |
| brand-700 | #0B3D2E |
| brand-900 | #05261c |

### Neutres & UI

| Token | Hex | Usage |
|-------|-----|--------|
| `--color-ink` | #14201b | Texte principal |
| `--color-muted` | #5c6b64 | Texte secondaire |
| `--color-surface-elevated` | #ffffff | Cartes, modales |
| `--color-line` | #e4e0d6 | Bordures, séparateurs |

### Sémantique (composants `Feedback`)

- Succès : teinte brand-600 / fond brand-50
- Erreur : rouge `#B42318` (à mapper en token `--color-danger` si extension)
- Avertissement : accent-500

---

## 3. Typographie

Polices Google (chargées dans `index.css`) :

| Rôle | Police | Tailwind |
|------|--------|----------|
| Corps | **DM Sans** | `font-sans` |
| Titres | **Fraunces** | `font-display` |

### Échelle mobile (base)

| Élément | Mobile | sm+ | Poids |
|---------|--------|-----|-------|
| H1 hero | 1.875rem (30px) | 2.25–3rem | 700 display |
| H2 section | 1.5rem | 1.875rem | 600 display |
| H3 | 1.25rem | 1.375rem | 600 display |
| Corps | 1rem (16px) | 1rem | 400 |
| Petit / meta | 0.875rem | 0.875rem | 500 muted |
| Bouton | 0.9375–1rem | idem | 600 |

`text-balance` sur titres ; line-height confortable (1.5 corps, 1.2 titres).

---

## 4. Espacement

Grille **4 px** ; échelle Tailwind standard.

| Contexte | Valeur |
|----------|--------|
| Padding page | `px-4` mobile, `sm:px-6`, `lg:px-8` (`.container-app`) |
| Gap cartes liste | `gap-4` mobile, `md:gap-6` |
| Section verticale | `py-10` mobile, `md:py-14`, `lg:py-16` |
| Carte interne | `p-4` mobile, `sm:p-6` |
| Safe area bas | `.safe-pb` = `max(1rem, env(safe-area-inset-bottom))` |

---

## 5. Cibles tactiles

- Minimum **44×44 px** : classe `.touch-target` sur boutons icône, liens nav mobile, fermeture modale.
- Espacement entre liens cliquables : ≥ 8 px.
- Champs formulaire : hauteur min **48 px** (`py-3` + texte 16px évite zoom iOS).

---

## 6. Breakpoints (Mobile First)

| Token | Min width | Usage |
|-------|-----------|--------|
| *(default)* | 0 | Layout une colonne, menu drawer |
| `sm` | 640px | Grilles 2 colonnes légères |
| `md` | 768px | Nav horizontale, sidebar admin collapsée |
| `lg` | 1024px | Contenu max-width 6xl, grilles 3–4 colonnes |

**Règle** : ne pas utiliser `max-width` media queries sauf cas exceptionnels (print, reduced-motion).

---

## 7. Rayons, ombres, conteneur

- `--radius-card`: 1rem — cartes, images hero
- `--shadow-soft`: ombre carte légère brand
- `.container-app` : `max-w-6xl`, centré

---

## 8. Inventaire des composants

### Layout (`components/layout/`)

| Composant | Rôle |
|-----------|------|
| `Header` | Logo, switch CMEIS/ISSSI, nav, menu mobile |
| `Footer` | Contact, liens, réseaux, newsletter |

### Shared (`components/shared/`)

| Composant | Rôle |
|-----------|------|
| `Seo` | Title, meta, Open Graph |
| `NewsCard` | Vignette actualité |
| `GallerySwipe` | Carrousel touch |
| `MobileSearch` | Recherche plein écran |
| `WhatsAppFloat` | FAB contact WhatsApp |

### UI (`components/ui/`)

| Composant | Variantes / notes |
|-----------|-------------------|
| `Button` | primary (brand-700), secondary (outline), ghost, accent ; full-width mobile |
| `Card` | elevated surface, padding responsive |
| `Form` | Field, Label, Error, helpers RHF |
| `Feedback` | alert success / error / info |
| `OptimizedImage` | lazy, ratio fixe, alt obligatoire |

### À prévoir (roadmap UI)

- `Stepper` (préinscription)
- `DataTable` responsive (admin : cartes empilées mobile)
- `Modal` / `Drawer` (filtres admin)
- `Skeleton` chargement Firestore

---

## 9. Patterns ISSSI vs CMEIS

| Aspect | CMEIS | ISSSI |
|--------|-------|-------|
| Hero | Institution, DG3 | Formation, filières |
| Nav | `cmeisNav` | `isssiNav` |
| CTA principal | Contact / Programmes | Préinscription |
| Scope contenu | `cmeis` ou `both` | `isssi` ou `both` |

Même tokens ; différenciation par copy, imagery et route `/isssi`.

---

## 10. Accessibilité

- Focus `:focus-visible` outline brand-500, offset 2px
- `-webkit-tap-highlight-color: transparent` + feedback visuel au tap
- Images décoratives : `alt=""` ; informatives : texte alternatif descriptif
- Formulaires : labels associés, erreurs `aria-live`

---

## 11. Références code

Tokens : `src/index.css` (`@theme`). Configuration site : `src/app/siteConfig.ts`. Wireframes : `WIREFRAMES.md`.
