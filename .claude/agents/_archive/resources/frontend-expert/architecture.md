# Architecture & File Organization

## Vue d'Ensemble

Cette ressource définit les patterns d'organisation de projet React, depuis la structure des dossiers jusqu'aux conventions de nommage des fichiers. Deux architectures principales sont couvertes : **Feature-Based** (grandes applications) et **Simple** (applications plus petites).

## Architectures Recommandées

### Feature-Based Architecture (Recommandé pour Grandes Apps)

**Référence : Orguin** (`/Users/tomo/Dev/orguin/`)

**Principe** : Organisation par domaines métier (features) avec isolation claire des responsabilités.

```
app/
├── features/                    # Domaines métier isolés
│   ├── auth/
│   │   ├── components/         # UI spécifique à l'auth
│   │   ├── hooks/              # Logique métier
│   │   │   ├── use-auth.queries.ts
│   │   │   └── use-auth.mutations.ts
│   │   ├── pages/              # Routes (/sign-in, /sign-up)
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Helpers spécifiques auth
│   ├── events/
│   │   ├── components/
│   │   │   ├── event-card.tsx
│   │   │   ├── event-form.tsx
│   │   │   └── event-list.tsx
│   │   ├── hooks/
│   │   │   ├── use-events.queries.ts
│   │   │   ├── use-events.mutations.ts
│   │   │   └── use-event-registration.ts
│   │   ├── pages/
│   │   │   ├── event-list.page.tsx
│   │   │   ├── event-details.page.tsx
│   │   │   └── event-create.page.tsx
│   │   ├── schemas/
│   │   │   └── event.schemas.ts
│   │   ├── types/
│   │   │   └── event.types.ts
│   │   └── utils/
│   ├── members/
│   └── tribes/
├── shared/                      # Code réutilisable cross-features
│   ├── ui/                     # Composants UI génériques
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── form/
│   │       ├── input.tsx
│   │       └── textarea.tsx
│   ├── components/             # Composants métier partagés
│   │   ├── layouts/
│   │   │   ├── shell-layout.tsx
│   │   │   └── container.tsx
│   │   └── navigation/
│   ├── providers/              # Context providers
│   │   ├── auth-provider.tsx
│   │   ├── query-provider.tsx
│   │   └── theme-provider.tsx
│   ├── hooks/                  # Hooks génériques
│   │   ├── use-toast.ts
│   │   ├── use-media-query.ts
│   │   └── use-local-storage.ts
│   ├── services/               # Services transverses
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   └── storage.service.ts
│   ├── utils/                  # Utilitaires
│   │   ├── cn.ts
│   │   ├── date.ts
│   │   └── format.ts
│   └── constants/
│       ├── routes.ts
│       └── config.ts
├── types/                      # Types globaux
│   ├── database.types.ts
│   └── global.d.ts
├── router.tsx                  # Configuration routing
├── main.tsx                    # Entry point
└── App.tsx                     # Root component
```

**Avantages :**
- Scalabilité : Chaque feature est isolée
- Maintenabilité : Facile de trouver le code
- Réutilisabilité : `shared/` contient tout le réutilisable
- Testabilité : Tests au niveau feature

### Simple Architecture (Petites Applications)

**Référence : needacoffee.fr, la-gallerie**

```
app/                            # Next.js App Router
├── layout.tsx
├── page.tsx
├── en/
│   └── page.tsx
└── api/                        # API routes

src/                            # ou app/ pour Vite
├── components/
│   ├── ui/                     # Composants de base
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── sections/               # Sections de page
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   └── contact.tsx
│   └── layout/
│       ├── header.tsx
│       └── footer.tsx
├── hooks/
│   ├── use-theme.ts
│   └── use-scroll.ts
├── lib/
│   ├── utils.ts
│   └── i18n.ts
├── pages/                      # Routes (React Router)
│   ├── home.tsx
│   └── about.tsx
├── services/
│   └── api.ts
└── types/
    └── index.ts
```

**Avantages :**
- Simplicité : Structure plate, facile à comprendre
- Rapidité : Pas de sur-organisation
- Adapté : Projets < 20 composants

## Conventions de Nommage

### Fichiers

| Type | Convention | Exemple |
|------|-----------|---------|
| **Composants** | kebab-case.tsx | `event-card.tsx`, `user-profile.tsx` |
| **Pages** | *.page.tsx | `event-list.page.tsx` |
| **Hooks** | use-*.ts | `use-events.queries.ts`, `use-auth.ts` |
| **Schemas** | *.schemas.ts | `event.schemas.ts` |
| **Types** | *.types.ts | `event.types.ts` |
| **Utils** | kebab-case.ts | `format-date.ts`, `cn.ts` |
| **Services** | *.service.ts | `api.service.ts` |
| **Tests** | *.test.ts | `button.test.tsx` |
| **Skeletons** | *.skeleton.tsx | `event-list.skeleton.tsx` |
| **Forms** | *.form.tsx | `event-form.tsx` |

### Dossiers

| Type | Convention | Exemple |
|------|-----------|---------|
| **Features** | kebab-case | `tribe-members/`, `event-registration/` |
| **Shared** | kebab-case | `shared/ui/`, `shared/hooks/` |
| **Domaines** | Singulier ou pluriel cohérent | `auth/`, `events/`, `members/` |

### Code

| Type | Convention | Exemple |
|------|-----------|---------|
| **Composants** | PascalCase | `EventCard`, `UserProfile` |
| **Hooks** | camelCase avec `use` | `useEvents`, `useAuth` |
| **Fonctions** | camelCase | `formatDate`, `createUser` |
| **Types/Interfaces** | PascalCase | `EventFormData`, `UserProps` |
| **Constants** | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRIES` |

## Suffixes de Fichiers Obligatoires

### Orguin - Système de Suffixes

**Source : `/Users/tomo/Dev/orguin/docs/CODE_PATTERNS.md`**

| Suffixe | Usage | Exemple |
|---------|-------|---------|
| `.page.tsx` | **Pages/Routes** | `event-list.page.tsx` |
| `.form.tsx` | **Composants de formulaire** | `event-form.tsx` |
| `.schemas.ts` | **Schémas Zod** | `event.schemas.ts` |
| `.queries.ts` | **React Query - Lectures** | `use-events.queries.ts` |
| `.mutations.ts` | **React Query - Écritures** | `use-events.mutations.ts` |
| `.skeleton.tsx` | **Composants de chargement** | `event-list.skeleton.tsx` |
| `.types.ts` | **Types TypeScript** | `event.types.ts` |
| `.service.ts` | **Services** | `auth.service.ts` |
| `.test.tsx` | **Tests unitaires** | `button.test.tsx` |

**Exemple complet d'une feature :**
```
features/events/
├── components/
│   ├── event-card.tsx
│   ├── event-form.tsx           # Formulaire
│   └── event-list.skeleton.tsx  # Loading state
├── hooks/
│   ├── use-events.queries.ts    # GET operations
│   └── use-events.mutations.ts  # POST/PUT/DELETE operations
├── pages/
│   ├── event-list.page.tsx      # Route page
│   └── event-details.page.tsx
├── schemas/
│   └── event.schemas.ts         # Zod validation
└── types/
    └── event.types.ts           # TypeScript types
```

## Import Patterns

### Path Aliases

**Vite/React Router : `~/*`**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    }
  }
}

// Usage
import { Button } from '~/shared/ui/button'
import { useEvents } from '~/features/events/hooks/use-events.queries'
```

**Next.js : `@/*`**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

// Usage
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
```

### Imports Directs (NO Barrel Files)

**❌ Incorrect - Barrel files interdits :**
```typescript
// ❌ shared/ui/index.ts
export { Button } from './button'
export { Card } from './card'

// ❌ Usage
import { Button, Card } from '~/shared/ui'
```

**✅ Correct - Imports directs :**
```typescript
// ✅ Pas de fichier index.ts

// ✅ Usage
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
```

**Raison :**
- Meilleur tree-shaking
- Imports explicites
- Pas de re-exports cachés

### Organisation des Imports

**Ordre automatique avec Biome :**
1. Types (`import type`)
2. Bibliothèques externes
3. Imports absolus (alias)
4. Imports relatifs

```typescript
// ✅ Organisé automatiquement par Biome
import type { EventFormData } from './types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '~/shared/ui/button'
import { useEvents } from '~/features/events/hooks/use-events.queries'
import { formatDate } from '../utils/date'
```

## Structure Next.js Spécifique

### App Router (Next.js 13+)

**Référence : needacoffee.fr**

```
app/
├── layout.tsx              # Layout racine
├── page.tsx                # Page accueil (/)
├── globals.css             # Styles globaux
├── error.tsx               # Error boundary
├── loading.tsx             # Loading state
├── not-found.tsx           # 404 page
├── en/                     # Route internationalisée
│   ├── layout.tsx
│   └── page.tsx            # /en
├── blog/
│   ├── page.tsx            # /blog
│   ├── [slug]/
│   │   └── page.tsx        # /blog/[slug]
│   └── loading.tsx
└── api/                    # API routes
    └── hello/
        └── route.ts        # /api/hello
```

**Conventions Next.js :**
- `page.tsx` : Route accessible
- `layout.tsx` : Layout partagé
- `loading.tsx` : Suspense boundary
- `error.tsx` : Error boundary
- `[param]/` : Route dynamique

### Métadonnées Next.js

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Mon App',
    template: '%s | Mon App'
  },
  description: 'Description de mon app',
  openGraph: {
    title: 'Mon App',
    description: 'Description',
    images: ['/og-image.jpg']
  }
}
```

## Structure Vite/React Router

### React Router v7

**Référence : Orguin**

```
app/
├── features/              # Business features
├── shared/                # Shared code
├── types/                 # Global types
├── router.tsx             # Route configuration
├── main.tsx               # Entry point
└── App.tsx                # Root component

// router.tsx
import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'

const EventListPage = lazy(() => import('~/features/events/pages/event-list.page'))
const EventDetailsPage = lazy(() => import('~/features/events/pages/event-details.page'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'events', element: <EventListPage /> },
      { path: 'events/:id', element: <EventDetailsPage /> }
    ]
  }
])
```

## Responsabilités par Dossier

### `features/[domain]/components/`
**Responsabilité** : UI spécifique au domaine métier
- Composants utilisés uniquement dans cette feature
- Pas de réutilisation cross-features
- Exemple : `EventCard` utilisé seulement dans events/

### `features/[domain]/hooks/`
**Responsabilité** : Logique métier et état du domaine
- React Query queries/mutations
- Custom hooks spécifiques
- Exemple : `useEvents`, `useCreateEvent`

### `features/[domain]/pages/`
**Responsabilité** : Routes et navigation
- Composants mappés aux URLs
- Gèrent le data fetching
- Composent les autres composants

### `features/[domain]/schemas/`
**Responsabilité** : Validation des données
- Schémas Zod pour forms
- Validation runtime
- Exemple : `eventSchema`

### `shared/ui/`
**Responsabilité** : Composants UI génériques
- Réutilisables partout
- Pas de logique métier
- Exemple : Button, Card, Dialog

### `shared/components/`
**Responsabilité** : Composants métier partagés
- Utilisés par plusieurs features
- Peuvent contenir logique
- Exemple : Layouts, Navigation

### `shared/providers/`
**Responsabilité** : Context providers globaux
- React Query Provider
- Auth Provider
- Theme Provider

### `shared/services/`
**Responsabilité** : Services transverses
- API client
- Authentication
- Storage, Cache

### `shared/utils/`
**Responsabilité** : Fonctions utilitaires pures
- Formatting (dates, nombres)
- Helpers (`cn()` pour Tailwind)
- Validation

## Exemples Concrets

### Exemple 1 : Feature Events (Orguin)

```
features/events/
├── components/
│   ├── event-card.tsx              # UI: Carte événement
│   ├── event-form.tsx              # Form: Create/Edit
│   ├── event-list.tsx              # UI: Liste d'événements
│   └── event-list.skeleton.tsx     # Loading state
├── hooks/
│   ├── use-events.queries.ts       # GET events
│   ├── use-events.mutations.ts     # POST/PUT/DELETE events
│   └── use-event-registration.ts   # Registration logic
├── pages/
│   ├── event-list.page.tsx         # Route: /events
│   ├── event-details.page.tsx      # Route: /events/:id
│   └── event-create.page.tsx       # Route: /events/new
├── schemas/
│   └── event.schemas.ts            # Zod validation
├── types/
│   └── event.types.ts              # TS interfaces
└── utils/
    └── event-helpers.ts            # Feature-specific utils
```

### Exemple 2 : Projet Simple (la-gallerie)

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── artwork/
│   │   ├── ArtworkDisplay.tsx
│   │   └── ArtworkMetadata.tsx
│   └── screens/
│       ├── ConfigurationScreen.tsx
│       └── LoadingScreen.tsx
├── hooks/
│   ├── useArtworkGallery.ts
│   └── useKeyboardShortcuts.ts
├── pages/
│   ├── Home.tsx
│   └── Gallery.tsx
├── services/
│   └── metMuseumApi.ts
└── types/
    └── artwork.types.ts
```

## Checklist Architecture

**Avant de créer un nouveau projet :**

- [ ] Choisir architecture (Feature-Based ou Simple)
- [ ] Configurer path aliases (`~/*` ou `@/*`)
- [ ] Créer structure de dossiers de base
- [ ] Définir conventions de nommage
- [ ] Mettre en place organisation des imports (Biome)
- [ ] Documenter structure dans README

**Pour chaque nouvelle feature :**

- [ ] Créer dossier feature avec sous-dossiers
- [ ] Respecter suffixes obligatoires (`.page.tsx`, `.form.tsx`, etc.)
- [ ] Séparer queries et mutations
- [ ] Créer schémas Zod si formulaires
- [ ] Pas de barrel files (imports directs)

**Standards obligatoires :**

- ✅ Imports directs (NO barrel files)
- ✅ Path aliases configurés
- ✅ Suffixes de fichiers cohérents
- ✅ Séparation queries/mutations
- ✅ kebab-case pour fichiers
- ✅ PascalCase pour composants
- ✅ Organisation automatique des imports
