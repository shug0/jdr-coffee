# TypeScript Standards

## Vue d'Ensemble

Cette ressource définit les standards TypeScript stricts à appliquer dans tous les projets React. La configuration **Orguin** sert de référence principale pour sa rigueur et ses standards de qualité production.

## Principes Fondamentaux

### 1. Mode Strict Obligatoire

**TOUJOURS activer le mode strict dans `tsconfig.json` :**

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Le mode strict active automatiquement :
- `noImplicitAny` - Pas de type `any` implicite
- `strictNullChecks` - Vérification stricte des null/undefined
- `strictFunctionTypes` - Typage strict des fonctions
- `strictBindCallApply` - Typage strict de bind/call/apply
- `strictPropertyInitialization` - Init des propriétés de classe
- `noImplicitThis` - Pas de `this` implicite
- `alwaysStrict` - Mode strict JavaScript

### 2. Règles de Linting TypeScript Obligatoires

**Configuration minimale requise :**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

- **`noUnusedLocals`** : Interdit les variables locales non utilisées
- **`noUnusedParameters`** : Interdit les paramètres de fonction non utilisés
- **`noFallthroughCasesInSwitch`** : Oblige les `break` dans switch

## Configurations par Type de Projet

### Configuration Vite + React (Recommandé pour SPA)

**Référence : `/Users/tomo/Dev/la-gallerie/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Points clés :**
- `target: "ES2020"` - Cible moderne pour performance
- `moduleResolution: "bundler"` - Optimisé pour Vite
- `jsx: "react-jsx"` - JSX moderne (pas besoin d'import React)
- `allowImportingTsExtensions: true` - Import avec extensions .ts/.tsx

### Configuration Vite + React Router (Recommandé pour Apps Complètes)

**Référence : `/Users/tomo/Dev/orguin/tsconfig.json`**

```json
{
  "include": [
    "**/*",
    "**/.server/**/*",
    "**/.client/**/*",
    ".react-router/types/**/*"
  ],
  "exclude": [
    "supabase/**/*",
    "tests/**/*",
    "e2e/**/*"
  ],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "types": ["node", "vite/client"],
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "rootDirs": [".", "./.react-router/types"],
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    },
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true
  }
}
```

**Points clés :**
- `target: "ES2022"` - Cible la plus moderne
- `verbatimModuleSyntax: true` - Import types explicites (`import type`)
- `paths: { "~/*": ["./app/*"] }` - Alias pour imports absolus
- `rootDirs` - Support React Router v7
- Exclusions : tests, e2e, fichiers backend

### Configuration Next.js (Recommandé pour SSR)

**Référence : `/Users/tomo/Dev/needacoffee.fr/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Points clés :**
- `jsx: "preserve"` - Next.js gère la transformation JSX
- `plugins: [{ "name": "next" }]` - Plugin TypeScript de Next.js
- `paths: { "@/*": ["./*"] }` - Convention Next.js pour imports
- `allowJs: true` - Compatibilité JS/TS mixte
- `incremental: true` - Build incrémental pour performance

## Path Aliases Recommandés

### Alias `~/*` (Vite/React Router)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    }
  }
}
```

**Usage :**
```typescript
// Au lieu de :
import { Button } from '../../../shared/ui/button'

// Utiliser :
import { Button } from '~/shared/ui/button'
```

### Alias `@/*` (Next.js)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Usage :**
```typescript
// Next.js pattern
import { useTranslation } from '@/lib/i18n-app'
import { Card } from '@/components/ui/card'
```

## Options TypeScript Avancées

### Options Recommandées pour Production

```json
{
  "compilerOptions": {
    /* Performance */
    "skipLibCheck": true,
    "incremental": true,

    /* Sécurité */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,

    /* Code Quality */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true,

    /* Modules */
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "esModuleInterop": true,

    /* Build */
    "noEmit": true,
    "sourceMap": true
  }
}
```

### Options à Éviter

❌ **Ne PAS utiliser :**
- `"any": true` dans les options
- `"noImplicitAny": false` (désactive strict)
- `"skipLibCheck": false` (ralentit considérablement)
- Target inférieur à ES2017

## Vérification TypeScript

### Commandes de Validation

```bash
# Vérification TypeScript sans émission
tsc --noEmit

# Vérification avec watch mode
tsc --noEmit --watch

# Vérification d'un fichier spécifique
tsc --noEmit path/to/file.ts
```

### Intégration dans Scripts npm

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "check": "tsc --noEmit && biome check"
  }
}
```

## Types et Déclarations

### Import Types Explicites

**Avec `verbatimModuleSyntax: true` (Recommandé) :**

```typescript
// ✅ Correct - Import type explicite
import type { User } from './types'
import { getUser } from './api'

// ❌ Incorrect - Import mixte
import { User, getUser } from './api'
```

### Déclaration de Types Globaux

**Créer `app/types/global.d.ts` ou `src/types/global.d.ts` :**

```typescript
// Types globaux disponibles partout
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }

  type Nullable<T> = T | null
  type Optional<T> = T | undefined
}

export {}
```

### Types pour Fichiers Non-TypeScript

```typescript
// app/types/assets.d.ts
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}
```

## Résumé - Checklist TypeScript

**Avant de démarrer un projet, vérifier :**

- [ ] `strict: true` activé
- [ ] `noUnusedLocals: true` activé
- [ ] `noUnusedParameters: true` activé
- [ ] `target` minimum ES2017, recommandé ES2020+
- [ ] `moduleResolution: "bundler"` pour Vite/Next.js
- [ ] Path aliases configurés (`~/*` ou `@/*`)
- [ ] `jsx: "react-jsx"` (Vite) ou `jsx: "preserve"` (Next.js)
- [ ] `skipLibCheck: true` pour performance
- [ ] Script `type-check` dans package.json
- [ ] Types globaux définis si nécessaire

**Interdictions strictes :**

- ❌ JAMAIS utiliser `any` (utiliser `unknown` à la place)
- ❌ JAMAIS désactiver `strict`
- ❌ JAMAIS ignorer erreurs TypeScript avec `@ts-ignore` (utiliser `@ts-expect-error` avec commentaire)
- ❌ JAMAIS commiter du code avec erreurs TypeScript
