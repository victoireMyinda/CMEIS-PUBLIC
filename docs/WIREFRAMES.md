# Wireframes textuels — Mobile First (320–428 px)

Notation : `[ ]` zone, `( )` action, `|` séparateur. Hauteur viewport ≈ 640–800 px sauf mention.

---

## 1. Accueil CMEIS — mobile

```text
┌─────────────────────────────────────┐
│ [≡]  LOGO CMEIS-DG3          [🔍]   │  ← Header fixe, touch 44px
├─────────────────────────────────────┤
│                                     │
│  HERO IMAGE (16:9, OptimizedImage)  │
│  H1: Excellence, innovation…        │
│  [ Découvrir CMEIS ]  (primary)     │
│  [ Espace ISSSI → ]   (accent link)  │
│                                     │
├─────────────────────────────────────┤
│ H2: Nos domaines                    │
│ ┌─────────┐ ┌─────────┐             │
│ │ Card 1  │ │ Card 2  │  scroll →   │
│ └─────────┘ └─────────┘             │
├─────────────────────────────────────┤
│ H2: Actualités                      │
│ [ NewsCard ]                        │
│ [ NewsCard ]                        │
│ ( Voir toutes → )                   │
├─────────────────────────────────────┤
│ H2: Partenaires                     │
│ [logo][logo][logo] horizontal scroll│
├─────────────────────────────────────┤
│ FOOTER: contact | liens | social    │
│ [ Newsletter email________ [OK] ]   │
└─────────────────────────────────────┘
│ ( WhatsApp FAB bottom-right )       │
└─────────────────────────────────────┘
```

**Interactions** : `[≡]` ouvre drawer plein écran (liste `cmeisNav`). `[🔍]` → `MobileSearch`.

---

## 2. Accueil ISSSI — mobile (`/isssi`)

```text
┌─────────────────────────────────────┐
│ [← CMEIS]  LOGO ISSSI        [≡]    │  ← retour portail mère
├─────────────────────────────────────┤
│  HERO campus / formation            │
│  H1: Institut Supérieur…            │
│  Tagline ISSSI                      │
│  [ Préinscription ] (accent, full)  │
│  [ Nos filières ]   (outline)       │
├─────────────────────────────────────┤
│ H2: Filières phares                 │
│ [ Card filière + résumé ]           │
│ [ Card filière ]                    │
│ ( Toutes les filières → )           │
├─────────────────────────────────────┤
│ H2: Admission 2025-2026             │
│ Texte + dates clés (admissions)     │
│ [ En savoir plus → /isssi/admission]│
├─────────────────────────────────────┤
│ H2: Galerie                         │
│ [ GallerySwipe horizontal ]         │
├─────────────────────────────────────┤
│ FOOTER ISSSI (contact, isssiNav)    │
└─────────────────────────────────────┘
```

---

## 3. Wizard préinscription — 4 étapes (`/isssi/preinscription`)

Barre de progression sticky sous le header : `●──○──○──○` (1/4 … 4/4).

### Étape 1 — Identité

```text
┌─────────────────────────────────────┐
│ H1: Préinscription                  │
│ Progress: ●──○──○──○  Étape 1/4     │
├─────────────────────────────────────┤
│ Nom*          [________________]      │
│ Post-nom*     [________________]      │
│ Prénom*       [________________]      │
│ Sexe*         ( ) M  ( ) F            │
│ Date naiss.*  [____/__/____]          │
│ Province*     [ Select RDC ▼ ]        │
├─────────────────────────────────────┤
│ safe-pb                             │
│ [ Suivant → ] full width primary    │
└─────────────────────────────────────┘
```

### Étape 2 — Coordonnées

```text
│ Téléphone*    [ +243___________ ]     │
│ Email*        [________________]      │
│ [ ← Retour ]    [ Suivant → ]         │
```

### Étape 3 — Parcours

```text
│ Filière*      [ Select programs ▼ ]   │
│ Niveau études*[________________]      │
│ École*        [________________]      │
│ Année acad.*  [ 2025-2026 ▼ ]         │
│ Commentaire   [ textarea optional ]   │
│ [ ← Retour ]    [ Suivant → ]         │
```

### Étape 4 — Confirmation & preuve (optionnelle phase 1)

```text
│ Récapitulatif (lecture seule)         │
│ ☐ J’accepte le traitement des données │
│ Preuve paiement (option)              │
│ [ Choisir fichier ] PDF/JPG max 5Mo   │
│ [ Envoyer la demande ] primary        │
│ Succès → écran merci + n° dossier     │
```

Validation Zod par étape ; bouton « Suivant » désactivé si invalide.

---

## 4. Liste actualités — mobile (`/actualites` ou `/isssi/actualites`)

```text
┌─────────────────────────────────────┐
│ Header + fil d’Ariane               │
├─────────────────────────────────────┤
│ H1: Actualités                      │
│ [ Filtre tags ▼ ]  (optionnel)      │
├─────────────────────────────────────┤
│ ┌───────────────────────────────┐   │
│ │ cover │ Titre article         │   │
│ │       │ excerpt…              │   │
│ │       │ date · tag            │   │
│ └───────────────────────────────┘   │
│ ( répété NewsCard )                 │
│ [ Charger plus ] ou scroll infini   │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

Détail : hero image, H1, meta, corps HTML/Markdown, partage WhatsApp.

---

## 5. Tableau de bord admin — mobile (`/admin/dashboard`)

Utilisateur authentifié, rôle ≥ `viewer`.

```text
┌─────────────────────────────────────┐
│ [≡] Admin CMEIS    [Avatar ▼]       │
├─────────────────────────────────────┤
│ Bonjour, {displayName}              │
│ Rôle: editor                        │
├─────────────────────────────────────┤
│ KPI cards (stack vertical)          │
│ ┌─────────────────────────────┐     │
│ │ Préinscriptions en attente  │     │
│ │           12                │     │
│ └─────────────────────────────┘     │
│ ┌─────────────────────────────┐     │
│ │ Messages non lus            │     │
│ │            3                │     │
│ └─────────────────────────────┘     │
│ ┌─────────────────────────────┐     │
│ │ Brouillons actualités       │     │
│ │            2                │     │
│ └─────────────────────────────┘     │
├─────────────────────────────────────┤
│ H2: Accès rapides                   │
│ [ Préinscriptions ]                 │
│ [ Actualités ]                      │
│ [ Contacts ]                        │
│ [ Galerie ]                         │
├─────────────────────────────────────┤
│ Drawer nav admin (≡):               │
│ Dashboard | Contenu | ISSSI | …       │
│ Déconnexion                         │
└─────────────────────────────────────┘
```

`md+` : sidebar fixe gauche, KPI en grille 3 colonnes.

---

## 6. Cohérence transversale

- Header hauteur ~56–64 px + safe-area top
- Contenu scrollable entre header et footer / barre d’action sticky
- États vides : illustration légère + message + CTA
- Erreurs réseau : `Feedback` + bouton « Réessayer »

Voir `DESIGN_SYSTEM.md` pour tokens et composants.
