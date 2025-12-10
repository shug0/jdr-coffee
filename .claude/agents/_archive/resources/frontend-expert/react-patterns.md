# React Component Patterns

## Vue d'Ensemble

Cette ressource définit les patterns React obligatoires : composants fonctionnels, hooks personnalisés, props typées et conventions de code. Tous les exemples proviennent des projets Orguin et la-gallerie.

## Composants Fonctionnels

### Pattern Standard (Arrow Functions)

**✅ Pattern obligatoire :**

```typescript
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  className?: string
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-primary text-white',
        variant === 'secondary' && 'bg-secondary',
        className
      )}
    >
      {children}
    </button>
  )
}
```

**Caractéristiques obligatoires :**
- Arrow function component
- Props destructurées dans signature
- Interface `{ComponentName}Props`
- Valeurs par défaut dans destructuring
- Export named (pas default pour composants réutilisables)

### ❌ Anti-Patterns Interdits

```typescript
// ❌ Class components interdits
class Button extends React.Component {
  render() { return <button>...</button> }
}

// ❌ Function declaration (préférer arrow function)
export function Button(props: ButtonProps) {
  return <button>...</button>
}

// ❌ Props non typées
export const Button = ({ children, onClick }) => {
  return <button>...</button>
}

// ❌ Props non destructurées
export const Button = (props: ButtonProps) => {
  return <button>{props.children}</button>
}
```

## Props Patterns

### Interface Props Standard

**Convention de nommage : `{ComponentName}Props`**

```typescript
// ✅ Correct - Interface explicite
interface EventCardProps {
  event: Event
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  className?: string
}

export const EventCard = ({ event, onEdit, onDelete, className }: EventCardProps) => {
  // ...
}
```

### Props avec Union Types

```typescript
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Card = ({ variant = 'default', size = 'md', children }: CardProps) => {
  // ...
}
```

### Props avec Types Génériques

```typescript
interface SelectProps<T> {
  options: T[]
  value: T
  onChange: (value: T) => void
  getLabel: (option: T) => string
  getValue: (option: T) => string
}

export const Select = <T,>({
  options,
  value,
  onChange,
  getLabel,
  getValue
}: SelectProps<T>) => {
  // ...
}
```

### Props Children Typées

```typescript
// ✅ React.ReactNode pour children mixtes
interface ContainerProps {
  children: React.ReactNode
  className?: string
}

// ✅ Fonction render prop
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
}

// ✅ Element spécifique
interface ModalProps {
  trigger: React.ReactElement<ButtonProps>
  content: React.ReactElement
}
```

## Custom Hooks Patterns

### Hook avec Return Type Explicite

**✅ Pattern obligatoire :**

```typescript
// Définir interface de retour
interface UseArtworkGalleryResult {
  currentArtwork: Artwork | null
  nextArtwork: Artwork | null
  isLoadingArtwork: boolean
  error: string | null
  loadInitialArtwork: () => Promise<void>
  goToNextArtwork: () => void
}

export const useArtworkGallery = (): UseArtworkGalleryResult => {
  const [currentArtwork, setCurrentArtwork] = useState<Artwork | null>(null)
  const [nextArtwork, setNextArtwork] = useState<Artwork | null>(null)
  const [isLoadingArtwork, setIsLoadingArtwork] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadInitialArtwork = useCallback(async () => {
    setIsLoadingArtwork(true)
    try {
      const artwork = await fetchArtwork()
      setCurrentArtwork(artwork)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoadingArtwork(false)
    }
  }, [])

  const goToNextArtwork = useCallback(() => {
    if (nextArtwork) {
      setCurrentArtwork(nextArtwork)
      setNextArtwork(null)
    }
  }, [nextArtwork])

  return {
    currentArtwork,
    nextArtwork,
    isLoadingArtwork,
    error,
    loadInitialArtwork,
    goToNextArtwork
  }
}
```

**Source : `/Users/tomo/Dev/la-gallerie/src/hooks/useArtworkGallery.ts`**

### Hook avec useCallback

**✅ useCallback pour event handlers :**

```typescript
export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  deps: any[] = []
) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    shortcuts.forEach((shortcut) => {
      const keyMatch = shortcut.key ? e.key === shortcut.key : true
      const codeMatch = shortcut.code ? e.code === shortcut.code : true

      if (keyMatch && codeMatch) {
        if (shortcut.preventDefault) {
          e.preventDefault()
        }
        shortcut.handler()
      }
    })
  }, deps)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
```

**Source : `/Users/tomo/Dev/la-gallerie/src/hooks/useKeyboardShortcuts.ts`**

**Règles useCallback :**
- Utiliser pour event handlers passés en props
- Utiliser pour fonctions dans dependency arrays d'autres hooks
- Spécifier dependency array correctement

### SSR-Safe Hooks (Next.js)

**✅ Pattern Next.js - Vérifier window :**

```typescript
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // ✅ SSR-safe check
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
      if (savedTheme) {
        setTheme(savedTheme)
      }
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
  }, [theme])

  // Prevent hydration mismatch
  if (!mounted) {
    return { theme: 'light', toggleTheme: () => {} }
  }

  return { theme, toggleTheme }
}
```

## Séparation Queries/Mutations

### Fichiers Séparés (Pattern Orguin)

**Structure recommandée :**
```
hooks/
├── use-events.queries.ts    # Lectures (GET)
└── use-events.mutations.ts  # Écritures (POST/PUT/DELETE)
```

**use-events.queries.ts :**
```typescript
import { useQuery } from '@tanstack/react-query'

export const useEvents = (tribeId: string) => {
  return useQuery({
    queryKey: ['events', tribeId],
    queryFn: () => getEvents(tribeId),
    enabled: !!tribeId
  })
}

export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEvent(eventId),
    enabled: !!eventId
  })
}
```

**use-events.mutations.ts :**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateEvent = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      onSuccess?.()
    }
  })
}
```

**Raison de la séparation :**
- Clarté : Lectures vs Écritures
- Maintenance : Facile de trouver le code
- Réutilisation : Queries réutilisées partout

## useState Patterns

### État Typé Explicitement

```typescript
// ✅ Type explicite
const [user, setUser] = useState<User | null>(null)
const [items, setItems] = useState<Item[]>([])
const [count, setCount] = useState<number>(0)
const [isOpen, setIsOpen] = useState(false) // boolean inféré OK

// ❌ Type implicite any
const [data, setData] = useState(null) // ❌ any!

// ✅ Avec valeur initiale
const [filters, setFilters] = useState<Filters>({
  search: '',
  category: 'all',
  sortBy: 'date'
})
```

### État Complexe avec Reducer Pattern

```typescript
type State = {
  isLoading: boolean
  error: string | null
  data: Data | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Data }
  | { type: 'FETCH_ERROR'; payload: string }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, data: action.payload }
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    default:
      return state
  }
}

const useDataFetcher = () => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    error: null,
    data: null
  })

  // ...
}
```

## useEffect Patterns

### Effect avec Cleanup

```typescript
useEffect(() => {
  const controller = new AbortController()

  const fetchData = async () => {
    try {
      const data = await fetch('/api/data', {
        signal: controller.signal
      })
      setData(data)
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error)
      }
    }
  }

  fetchData()

  // Cleanup
  return () => {
    controller.abort()
  }
}, [])
```

### Effect avec Dependencies

```typescript
// ✅ Dependencies correctes
useEffect(() => {
  if (userId) {
    loadUser(userId)
  }
}, [userId]) // userId dans dependencies

// ❌ Missing dependencies
useEffect(() => {
  loadUser(userId) // ❌ userId pas dans dependencies
}, [])

// ✅ Avec fonction dans dependencies
useEffect(() => {
  handleUpdate()
}, [handleUpdate]) // handleUpdate doit être useCallback
```

## Conditional Rendering

### Pattern avec Early Return

```typescript
export const EventsList = ({ events, isLoading }: EventsListProps) => {
  // ✅ Early returns pour états spéciaux
  if (isLoading) {
    return <EventsSkeleton />
  }

  if (!events || events.length === 0) {
    return <EmptyState message="Aucun événement" />
  }

  // Rendering principal
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
```

### Pattern avec Ternaires

```typescript
// ✅ Ternaires simples OK
<div>
  {isAdmin ? <AdminPanel /> : <UserPanel />}
</div>

// ✅ && pour conditionnel simple
<div>
  {error && <ErrorMessage error={error} />}
</div>

// ❌ Ternaires complexes imbriqués
{isLoading ? <Loading /> : isError ? <Error /> : data ? <Success /> : null}

// ✅ Utiliser early returns ou variables
const renderContent = () => {
  if (isLoading) return <Loading />
  if (isError) return <Error />
  if (!data) return null
  return <Success data={data} />
}

return <div>{renderContent()}</div>
```

## Lists & Keys

### Rendu de Listes

```typescript
// ✅ Key avec ID unique
{events.map((event) => (
  <EventCard key={event.id} event={event} />
))}

// ❌ Key avec index (sauf liste statique)
{events.map((event, index) => (
  <EventCard key={index} event={event} /> // ❌
))}

// ✅ Key composée si nécessaire
{users.map((user) => (
  <UserRow key={`${user.id}-${user.updatedAt}`} user={user} />
))}
```

## Error Boundaries

### Error Boundary Component

```typescript
import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>
    }

    return this.props.children
  }
}
```

## Refs Pattern

### useRef pour DOM

```typescript
const inputRef = useRef<HTMLInputElement>(null)

const focusInput = () => {
  inputRef.current?.focus()
}

return <input ref={inputRef} type="text" />
```

### useRef pour Valeurs Mutables

```typescript
const timerRef = useRef<number | null>(null)

useEffect(() => {
  timerRef.current = window.setTimeout(() => {
    // do something
  }, 1000)

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }
}, [])
```

## Checklist React Patterns

**Standards obligatoires :**

- ✅ Composants fonctionnels uniquement (arrow functions)
- ✅ Props destructurées dans signature
- ✅ Interface `{ComponentName}Props` explicite
- ✅ Hooks personnalisés avec return type interface
- ✅ `useCallback` pour event handlers
- ✅ Séparation queries/mutations dans fichiers distincts
- ✅ État typé explicitement (`useState<Type>`)
- ✅ SSR-safe checks pour Next.js (`typeof window !== 'undefined'`)
- ✅ Keys uniques pour listes (pas index)
- ✅ Early returns pour conditional rendering

**Interdictions strictes :**

- ❌ JAMAIS de class components
- ❌ JAMAIS de props non typées
- ❌ JAMAIS d'index comme key (sauf liste statique)
- ❌ JAMAIS d'any implicite dans useState
- ❌ JAMAIS de useEffect sans dependencies array
- ❌ JAMAIS d'event handlers inline dans render (utiliser useCallback)
