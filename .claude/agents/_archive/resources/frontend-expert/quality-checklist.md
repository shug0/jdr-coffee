# Quality Standards & Checklist

## Vue d'Ensemble

Cette ressource définit les standards de qualité **OBLIGATOIRES** et les anti-patterns **INTERDITS**. Liste de vérification systématique avant commit.

## Standards Obligatoires

### TypeScript

**✅ Obligatoire :**
- `strict: true` activé
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- Tous les types explicites (pas d'`any`)
- Interfaces pour toutes les props
- Path aliases configurés

**❌ Interdit :**
- Type `any` (utiliser `unknown`)
- `@ts-ignore` (utiliser `@ts-expect-error` avec commentaire)
- Types implicites
- Ignorer erreurs TypeScript

### Linting & Formatting

**✅ Obligatoire :**
- Biome check passe sans erreurs
- Organisation automatique des imports
- `noExplicitAny: error`
- `noUnusedVariables: error`
- `noUnusedImports: error`
- `useSelfClosingElements: error`
- Formatting: 2 spaces, line width 120

**❌ Interdit :**
- Variables inutilisées
- Imports inutilisés
- Préfixer variables par `_` (les supprimer)
- Ignorer règles Biome

### React Patterns

**✅ Obligatoire :**
- Composants fonctionnels uniquement (arrow functions)
- Props destructurées dans signature
- Interface `{ComponentName}Props`
- Hooks personnalisés avec return type
- `useCallback` pour event handlers
- `useMemo` pour listes filtrées
- Keys uniques pour listes (pas index)
- SSR-safe checks Next.js

**❌ Interdit :**
- Class components
- Props non typées
- Index comme key (sauf liste statique)
- `any` dans useState
- useEffect sans dependency array
- Event handlers inline dans render

### State Management

**✅ Obligatoire :**
- React Query pour TOUTES les données API
- Zustand pour état UI uniquement
- Séparation `.queries.ts` / `.mutations.ts`
- Query keys organisées
- Invalidation cache après mutations
- Toast notifications pour feedback

**❌ Interdit :**
- Dupliquer état entre React Query et useState
- Dupliquer état entre React Query et Zustand
- Fetch manuel avec useEffect
- useState pour données API
- Zustand pour données serveur
- Oublier `enabled` dans useQuery
- Oublier invalidation après mutation

### Styling

**✅ Obligatoire :**
- Design tokens shadcn/ui uniquement
- Helper `cn()` pour combiner classes
- CVA pour variants de composants
- Prop `className` pour override
- Responsive design (mobile-first)
- Transitions pour interactions

**❌ Interdit :**
- Couleurs Tailwind arbitraires (`blue-600`, `gray-800`)
- Couleurs hex (`#3b82f6`, `#1f2937`)
- RGB inline
- Styles inline
- Classes CSS custom (utiliser Tailwind)
- Combiner classes sans `cn()`

### Architecture

**✅ Obligatoire :**
- Feature-based structure (grandes apps)
- Imports directs (NO barrel files)
- Path aliases utilisés
- Suffixes de fichiers (`.page.tsx`, `.form.tsx`, etc.)
- kebab-case pour fichiers
- PascalCase pour composants
- Organisation automatique imports

**❌ Interdit :**
- Barrel files (`index.ts` avec re-exports)
- Imports relatifs profonds (`../../../`)
- Structure plate sans organisation
- Mélanger conventions de nommage

### Forms & Validation

**✅ Obligatoire :**
- React Hook Form + Zod toujours
- Schémas dans `.schemas.ts`
- Type inference avec `z.infer`
- Props standard (`form`, `isPending`, `onSubmit`)
- Validation côté client
- Gestion erreurs serveur
- Labels accessibles
- Disable pendant soumission

**❌ Interdit :**
- Formulaires sans validation
- Validation manuelle (utiliser Zod)
- Soumettre si form.isValid === false
- Oublier isPending state
- Validation serveur seule

### Performance

**✅ Obligatoire :**
- Lazy load pages avec React.lazy()
- Code splitting configuré
- useMemo pour listes filtrées
- useCallback pour event handlers
- React Query staleTime configuré
- Next.js Image pour images
- Bundle analysis régulière

**❌ Interdit :**
- Render coûteux sans useMemo
- Inline functions dans render
- Images non optimisées
- Animations sur layout properties
- Large bundles sans splitting

### Testing

**✅ Obligatoire :**
- Vitest pour tests unitaires
- Playwright pour E2E critiques
- Coverage 70% minimum business logic
- Tests pour fonctions critiques
- Tests isolés et rapides

**❌ Interdit :**
- Tester détails d'implémentation
- Snapshot tests
- Tests dépendant d'ordre
- Skip tests en CI
- Ignorer tests failing

## Anti-Patterns Interdits

### Code Quality

```typescript
// ❌ Type any
function process(data: any) { }

// ✅ Type unknown avec narrowing
function process(data: unknown) {
  if (typeof data === 'string') {
    // Type safe
  }
}

// ❌ Variables inutilisées avec _
function onClick(_event: MouseEvent) { }

// ✅ Supprimer paramètre
function onClick() { }

// ❌ Imports inutilisés
import { useState, useEffect } from 'react'
// useEffect pas utilisé

// ✅ Biome supprime automatiquement
import { useState } from 'react'
```

### React Patterns

```typescript
// ❌ Class component
class Button extends React.Component {
  render() { return <button>...</button> }
}

// ✅ Functional component
export const Button = ({ children }: ButtonProps) => {
  return <button>{children}</button>
}

// ❌ Props non destructurées
export const Button = (props: ButtonProps) => {
  return <button>{props.children}</button>
}

// ✅ Props destructurées
export const Button = ({ children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>
}

// ❌ Index comme key
{items.map((item, index) => (
  <Item key={index} item={item} />
))}

// ✅ ID unique comme key
{items.map((item) => (
  <Item key={item.id} item={item} />
))}
```

### Styling

```typescript
// ❌ Couleurs arbitraires
<div className="bg-blue-600 text-gray-800">

// ✅ Design tokens
<div className="bg-primary text-primary-foreground">

// ❌ Classes directement combinées
<div className={'base-class ' + (isActive ? 'active' : '')}>

// ✅ Utiliser cn()
<div className={cn('base-class', isActive && 'active')}>

// ❌ Styles inline
<div style={{ backgroundColor: '#3b82f6' }}>

// ✅ Tailwind classes
<div className="bg-primary">
```

### State Management

```typescript
// ❌ Duplication d'état
const [users, setUsers] = useState([])
const { data: users } = useQuery(['users'])

// ✅ Une seule source (React Query)
const { data: users } = useQuery(['users'])

// ❌ Fetch manuel
useEffect(() => {
  fetch('/api/users').then(setUsers)
}, [])

// ✅ React Query
const { data: users } = useQuery(['users'], fetchUsers)

// ❌ Oublier invalidation
const createUser = useMutation({
  mutationFn: createUserAPI
  // ❌ Pas d'invalidation
})

// ✅ Invalidation après mutation
const createUser = useMutation({
  mutationFn: createUserAPI,
  onSuccess: () => {
    queryClient.invalidateQueries(['users'])
  }
})
```

## Checklist Pré-Commit

**Avant chaque commit, vérifier :**

- [ ] `tsc --noEmit` passe (pas d'erreurs TypeScript)
- [ ] `biome check .` passe (linting + formatting)
- [ ] `npm run test` passe (tests unitaires)
- [ ] Pas de variables inutilisées
- [ ] Pas d'imports inutilisés
- [ ] Pas de type `any`
- [ ] Pas de `console.log` (sauf logging intentionnel)
- [ ] Pas de commentaires TODO sans ticket
- [ ] Props typées explicitement
- [ ] Keys uniques sur listes
- [ ] Design tokens shadcn/ui utilisés
- [ ] Queries invalidées après mutations
- [ ] Loading states gérés
- [ ] Error handling implémenté

## Checklist Pré-PR

**Avant pull request, vérifier :**

- [ ] Tous les critères pré-commit ✅
- [ ] `npm run build` passe
- [ ] Tests E2E critiques passent
- [ ] Coverage maintenu ou amélioré
- [ ] Bundle size acceptable (analyse)
- [ ] Pas de breaking changes non documentées
- [ ] README à jour si nécessaire
- [ ] Documentation inline pour code complexe
- [ ] Revue personnelle du diff complet
- [ ] Branch à jour avec main/master

## Commandes de Vérification

```bash
# Vérification complète (CI-like)
npm run check  # ou pnpm check

# Détail par outil
tsc --noEmit                # TypeScript
biome check .               # Linting + Formatting
npm run test                # Tests unitaires
npm run test:coverage       # Coverage
npm run e2e:test            # E2E (si disponible)
npm run build               # Build production
```

## Métriques Qualité Cibles

**Code Quality :**
- TypeScript strict: ✅ 100%
- Biome errors: 0
- Biome warnings: 0
- Coverage business logic: ≥ 70%

**Performance :**
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Bundle size: Monitoring

**DX (Developer Experience) :**
- Build time: < 30s
- Test time: < 10s (unit)
- Hot reload: < 1s
- Type check: < 5s

## Résumé - Standards Non-Négociables

**TOUJOURS :**
- TypeScript strict mode
- Biome check passe
- React Query pour API
- Design tokens uniquement
- Props typées
- Tests pour code critique
- Performance optimisée

**JAMAIS :**
- Type `any`
- Variables/imports inutilisés
- Couleurs arbitraires
- État dupliqué
- Barrel files
- Class components
- Ignorer erreurs TS/lint
