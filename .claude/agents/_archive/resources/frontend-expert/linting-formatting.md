# Linting & Formatting Standards

## Vue d'Ensemble

Cette ressource définit les standards de linting et formatting pour tous les projets React. **Biome** est l'outil préféré pour sa rapidité et son approche all-in-one. La configuration **Orguin** sert de référence pour son niveau de rigueur maximal.

## Biome : Outil Recommandé

### Pourquoi Biome ?

- **Rapidité** : 100x plus rapide qu'ESLint
- **All-in-one** : Linter + Formatter intégré
- **Zero-config** : Fonctionne out-of-the-box avec `recommended`
- **Imports auto-organisés** : Tri automatique des imports
- **TypeScript natif** : Support TypeScript sans plugin

### Installation

```bash
npm install --save-dev @biomejs/biome

# ou
pnpm add -D @biomejs/biome
```

### Scripts npm Recommandés

```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "check": "tsc --noEmit && biome check ."
  }
}
```

## Configuration Biome - Niveau Production

### Configuration Stricte (Référence Orguin)

**Fichier : `biome.json`**
**Source : `/Users/tomo/Dev/orguin/biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.6/schema.json",
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noParameterAssign": "error",
        "useAsConstAssertion": "error",
        "useDefaultParameterLast": "error",
        "useEnumInitializers": "error",
        "useSelfClosingElements": "error",
        "useSingleVarDeclarator": "error",
        "noUnusedTemplateLiteral": "error",
        "useNumberNamespace": "error",
        "noInferrableTypes": "error",
        "noUselessElse": "error"
      },
      "suspicious": {
        "noExplicitAny": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error",
        "noUnusedFunctionParameters": "warn"
      },
      "complexity": {
        "noExtraBooleanCast": "error",
        "noUselessCatch": "error",
        "noUselessConstructor": "error",
        "noUselessLoneBlockStatements": "error",
        "noUselessRename": "error",
        "noUselessSwitchCase": "error",
        "noUselessTernary": "error",
        "noUselessTypeConstraint": "error"
      },
      "performance": {
        "noAccumulatingSpread": "error",
        "noDelete": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 120
  },
  "javascript": {
    "formatter": {
      "semicolons": "asNeeded",
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "all"
    }
  },
  "files": {
    "includes": ["app/**/*", "*.ts", "*.tsx", "*.js", "*.jsx"]
  }
}
```

### Configuration Next.js (Variante Kanzai)

**Source : `/Users/tomo/Dev/kanzai/biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": ["**", "!node_modules", "!.next", "!dist", "!build"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noUnknownAtRules": "off"
      }
    },
    "domains": {
      "next": "recommended",
      "react": "recommended"
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

**Points clés Next.js :**
- `domains.next: "recommended"` - Règles spécifiques Next.js
- `domains.react: "recommended"` - Règles React intégrées
- `noUnknownAtRules: "off"` - Pour compatibilité Tailwind CSS
- `vcs.enabled: true` - Intégration Git

### Configuration Minimaliste (needacoffee.fr)

**Source : `/Users/tomo/Dev/needacoffee.fr/biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.1.2/schema.json",
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "useImportType": "error"
      },
      "correctness": {
        "noUnusedVariables": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5",
      "semicolons": "always"
    }
  }
}
```

**Points clés minimaliste :**
- `lineWidth: 80` - Lignes plus courtes
- `semicolons: "always"` - Semicolons systématiques
- `trailingCommas: "es5"` - Trailing commas ES5 uniquement
- `useImportType: "error"` - Force `import type` pour types TypeScript

## Règles de Linting Obligatoires

### Catégorie : Style

| Règle | Niveau | Description |
|-------|--------|-------------|
| `useSelfClosingElements` | **error** | Obligatoire pour éléments sans enfants (`<div />`) |
| `noParameterAssign` | **error** | Interdit réassignation de paramètres |
| `useAsConstAssertion` | error | Force `as const` pour constantes |
| `noUnusedTemplateLiteral` | error | Pas de template literals inutiles |
| `noUselessElse` | error | Supprime else inutiles |

**Exemples :**

```typescript
// ❌ Incorrect
<div></div>
function foo(x) { x = 5 }
const arr = [1, 2, 3]

// ✅ Correct
<div />
function foo(x) { const y = x + 5 }
const arr = [1, 2, 3] as const
```

### Catégorie : Suspicious

| Règle | Niveau | Description |
|-------|--------|-------------|
| `noExplicitAny` | **error** | **INTERDICTION STRICTE du type `any`** |

```typescript
// ❌ INTERDIT - Erreur de compilation
function process(data: any) { }

// ✅ Correct - Utiliser unknown
function process(data: unknown) {
  if (typeof data === 'string') {
    // Type narrowing
  }
}
```

### Catégorie : Correctness

| Règle | Niveau | Description |
|-------|--------|-------------|
| `noUnusedVariables` | **error** | Variables inutilisées interdites |
| `noUnusedImports` | **error** | Imports inutilisés interdits |
| `noUnusedFunctionParameters` | warn | Paramètres inutilisés (warning) |

**Anti-pattern à éviter :**

```typescript
// ❌ Incorrect - Ne PAS préfixer par underscore
function onClick(_event: MouseEvent) { }

// ✅ Correct - Supprimer le paramètre
function onClick() { }

// ✅ Correct - Si vraiment nécessaire pour signature
function onClick(event: MouseEvent) {
  console.log(event.target)
}
```

### Catégorie : Complexity

Suppression du code mort et inutile :

- `noUselessCatch` - Try-catch qui ne fait que re-throw
- `noUselessConstructor` - Constructeurs vides
- `noUselessTernary` - Ternaires redondants
- `noUselessElse` - Else après return

### Catégorie : Performance

- `noAccumulatingSpread` - Éviter `...spread` dans boucles
- `noDelete` - Utiliser `Map` au lieu de `delete obj.key`

## Formatting Standards

### Indentation & Largeur de Ligne

**Standard Orguin (Recommandé) :**
```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 120
  }
}
```

**Standard needacoffee.fr (Alternatif) :**
```json
{
  "formatter": {
    "lineWidth": 80
  }
}
```

**Choix recommandé :**
- `lineWidth: 120` pour projets modernes avec grands écrans
- `lineWidth: 80` pour projets open-source ou revue de code stricte

### Semicolons

**Deux approches valides :**

```json
// Orguin - Modern (Recommandé)
{
  "javascript": {
    "formatter": {
      "semicolons": "asNeeded"
    }
  }
}
```

```json
// needacoffee.fr - Classic
{
  "javascript": {
    "formatter": {
      "semicolons": "always"
    }
  }
}
```

**Impact :**
```typescript
// asNeeded
const foo = 'bar'
export default foo

// always
const foo = 'bar';
export default foo;
```

### Quotes

**Standard uniforme :**
```json
{
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double"
    }
  }
}
```

**Résultat :**
```typescript
const str = 'string avec single quotes'
const component = <Button label="JSX avec double quotes" />
```

### Trailing Commas

**Orguin - Modern (Recommandé) :**
```json
{
  "javascript": {
    "formatter": {
      "trailingCommas": "all"
    }
  }
}
```

```typescript
const obj = {
  foo: 1,
  bar: 2,  // ← trailing comma
}

function fn(
  a: string,
  b: number,  // ← trailing comma
) {}
```

**needacoffee.fr - ES5 :**
```json
{
  "javascript": {
    "formatter": {
      "trailingCommas": "es5"
    }
  }
}
```

## Organisation Automatique des Imports

**Configuration (obligatoire) :**
```json
{
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

**Effet :**
```typescript
// Avant
import { useState } from 'react'
import { cn } from '~/shared/utils/cn'
import type { User } from './types'
import { Button } from '~/shared/ui/button'

// Après (auto-organisé par Biome)
import type { User } from './types'
import { useState } from 'react'
import { Button } from '~/shared/ui/button'
import { cn } from '~/shared/utils/cn'
```

**Ordre des imports :**
1. Types (`import type`)
2. Bibliothèques externes (`react`, `next`, etc.)
3. Imports internes absolus (`~/` ou `@/`)
4. Imports relatifs (`./`, `../`)

## Commandes Biome

### Vérification (Check)

```bash
# Vérifier tous les fichiers
biome check .

# Vérifier avec auto-fix
biome check --write .

# Vérifier fichier spécifique
biome check src/components/button.tsx

# Mode unsafe (corrections agressives)
biome check --write --unsafe .
```

### Formatting Seul

```bash
# Formater tous les fichiers
biome format --write .

# Formater fichier spécifique
biome format --write src/components/button.tsx

# Vérifier formatting sans modifier
biome format .
```

### Linting Seul

```bash
# Linter uniquement
biome lint .

# Linter avec auto-fix
biome lint --write .
```

### CI/CD Integration

```bash
# Script CI - Échec si erreurs
biome check . && tsc --noEmit

# ou dans package.json
{
  "scripts": {
    "ci": "biome check . && tsc --noEmit"
  }
}
```

## Alternative : ESLint (Si Nécessaire)

### Quand Utiliser ESLint ?

- Projet existant avec ESLint configuré
- Besoin de plugins spécifiques non disponibles dans Biome
- Équipe familière avec ESLint

### Configuration ESLint Minimale

**Source : `/Users/tomo/Dev/la-gallerie/.eslintrc.cjs`**

```javascript
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
}
```

**Installation :**
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

## Fichiers à Ignorer

### Biome - files.includes

```json
{
  "files": {
    "includes": ["app/**/*", "src/**/*", "*.ts", "*.tsx"],
    "ignoreUnknown": true
  }
}
```

### Exclusions Courantes

Créer `.biomeignore` :
```
node_modules/
.next/
dist/
build/
coverage/
.turbo/
*.config.js
*.config.ts
```

## Checklist Linting & Formatting

**Avant de commencer un projet :**

- [ ] Installer Biome : `npm install -D @biomejs/biome`
- [ ] Créer `biome.json` avec config stricte Orguin
- [ ] Ajouter scripts npm : `lint`, `format`, `check`
- [ ] Configurer `organizeImports: "on"`
- [ ] Activer règles obligatoires : `noExplicitAny`, `noUnusedVariables`, `noUnusedImports`
- [ ] Configurer formatter : indentWidth 2, lineWidth 120
- [ ] Tester : `npm run lint` et `npm run format`

**Standards obligatoires :**

- ✅ `noExplicitAny: "error"` - Pas de type `any`
- ✅ `noUnusedVariables: "error"` - Pas de variables inutilisées
- ✅ `noUnusedImports: "error"` - Pas d'imports inutilisés
- ✅ `useSelfClosingElements: "error"` - Self-closing obligatoire
- ✅ Organisation automatique des imports activée
- ✅ Formatting cohérent : single quotes, 2 spaces, lineWidth 120

**Interdictions strictes :**

- ❌ JAMAIS ignorer règles avec commentaires (`// biome-ignore`)
- ❌ JAMAIS commiter du code avec erreurs de linting
- ❌ JAMAIS désactiver `noExplicitAny`
- ❌ JAMAIS préfixer variables inutilisées par `_` (les supprimer)
