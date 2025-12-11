---
name: Frontend Development Standards - Quick Reference
---

# Frontend Development Standards - Quick Reference

## Core Principles (Orguin Standards)

### File Naming
- **kebab-case**: `event-card.tsx`, `use-events.queries.ts`
- **Suffixes**: `.page.tsx`, `.form.tsx`, `.queries.ts`, `.mutations.ts`, `.schemas.ts`, `.types.ts`

### Component Pattern
```typescript
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export const Button = ({ children, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button onClick={onClick} className={cn(...)}>
      {children}
    </button>
  )
}
```

### Hook Pattern
```typescript
interface UseDataResult {
  data: Data | null
  isLoading: boolean
  error: Error | null
}

export const useData = (): UseDataResult => {
  const [data, setData] = useState<Data | null>(null)
  // ... logic
  return { data, isLoading, error }
}
```

### Styling (Tailwind + shadcn/ui)
- ✅ Design tokens: `bg-primary`, `text-secondary`, `border-accent`
- ❌ Arbitrary colors: `bg-blue-600`, `text-[#3b82f6]`
- Use `cn()` helper for combining classes

### State Management
- **Server state**: React Query (`useQuery`, `useMutation`)
- **Client state**: Zustand stores
- NEVER duplicate state between React Query and useState

### TypeScript
- **Strict mode**: enabled
- NO `any` types (use `unknown` with type narrowing)
- Explicit return types for hooks
- Props interfaces named `{ComponentName}Props`

### Imports
- Direct imports only (NO barrel files)
- Use path aliases: `~/` (Vite) or `@/` (Next.js)
- Auto-organized by Biome

## Architecture

### Feature-Based (Large Apps)
```
app/features/
  events/
    components/
    hooks/
    pages/
    schemas/
```

### Simple (Small Apps)
```
src/
  components/
  hooks/
  pages/
```

## Quick Checks

Before committing:
- [ ] `tsc --noEmit` passes
- [ ] `biome check .` passes
- [ ] NO `any` types
- [ ] Props explicitly typed
- [ ] Design tokens used (no arbitrary colors)
- [ ] React Query for API data
- [ ] Unique keys on lists

## Reference Projects

- **Orguin** (`/Users/tomo/Dev/orguin/`) - Strictest standards
- **la-gallerie** (`/Users/tomo/Dev/la-gallerie/`) - Vite patterns
- **needacoffee.fr** (`/Users/tomo/Dev/needacoffee.fr/`) - Next.js patterns
