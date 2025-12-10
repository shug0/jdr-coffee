# State Management

## Vue d'Ensemble

Cette ressource définit l'approche de gestion d'état recommandée : **React Query pour server state** + **Zustand pour client state**. Ce pattern sépare clairement les responsabilités et évite la duplication d'état.

## Principe Fondamental

### Séparation Server State vs Client State

**Server State** (données backend) :
- Données provenant d'APIs
- Cache et synchronisation
- **Outil : React Query (TanStack Query)**

**Client State** (données UI) :
- État UI local (modals, tabs, filtres)
- Navigation state
- **Outil : Zustand**

**❌ Règle d'or : JAMAIS dupliquer l'état entre les deux couches**

```typescript
// ❌ INCORRECT - État dupliqué
const [users, setUsers] = useState([]) // ❌ Client state
const { data: users } = useQuery(['users']) // ❌ Aussi en server state

// ✅ CORRECT - Une seule source de vérité
const { data: users } = useQuery(['users']) // ✅ Server state uniquement

// ✅ CORRECT - UI state séparé
const activeTab = useStore((state) => state.activeTab) // ✅ Client state uniquement
```

## React Query (Server State)

### Installation

```bash
npm install @tanstack/react-query
```

### Setup Provider

```typescript
// app/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Query Pattern (Lectures)

**Fichier : `use-events.queries.ts`**

```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Event } from '../types/event.types'
import { getEvents, getEvent } from '../api/events.api'

// Query keys organization
export const EVENT_KEYS = {
  all: ['events'] as const,
  lists: () => [...EVENT_KEYS.all, 'list'] as const,
  list: (filters: string) => [...EVENT_KEYS.lists(), { filters }] as const,
  details: () => [...EVENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...EVENT_KEYS.details(), id] as const
}

// Liste d'événements
export const useEvents = (tribeId: string) => {
  return useQuery({
    queryKey: EVENT_KEYS.list(tribeId),
    queryFn: () => getEvents(tribeId),
    enabled: !!tribeId, // Ne pas exécuter si tribeId vide
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}

// Détail d'un événement
export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: EVENT_KEYS.detail(eventId),
    queryFn: () => getEvent(eventId),
    enabled: !!eventId
  })
}

// Avec sélecteur
export const useEventNames = (tribeId: string) => {
  return useQuery({
    queryKey: EVENT_KEYS.list(tribeId),
    queryFn: () => getEvents(tribeId),
    select: (events) => events.map(e => e.name),
    enabled: !!tribeId
  })
}
```

**Source : `/Users/tomo/Dev/orguin/app/features/tribe-members/hooks/use-tribe-members.queries.ts`**

### Mutation Pattern (Écritures)

**Fichier : `use-events.mutations.ts`**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { EventFormData } from '../schemas/event.schemas'
import { createEvent, updateEvent, deleteEvent } from '../api/events.api'
import { EVENT_KEYS } from './use-events.queries'

// Création
export const useCreateEvent = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EventFormData) => createEvent(data),
    onSuccess: (newEvent) => {
      // Invalidate queries pour forcer re-fetch
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.lists() })

      toast.success('Événement créé avec succès')
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`)
      onSuccess?.() // Callback même en cas d'erreur
    }
  })
}

// Mise à jour
export const useUpdateEvent = (eventId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<EventFormData>) => updateEvent(eventId, data),
    onSuccess: () => {
      // Invalidate liste et détail
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.detail(eventId) })

      toast.success('Événement mis à jour')
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`)
    }
  })
}

// Suppression
export const useDeleteEvent = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.lists() })
      toast.success('Événement supprimé')
      onSuccess?.()
    }
  })
}
```

**Source : `/Users/tomo/Dev/orguin/app/features/tribe-members/hooks/use-tribe-members.mutations.ts`**

### Optimistic Updates

**Pattern avancé pour UX instantanée :**

```typescript
export const useUpdateEvent = (eventId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<EventFormData>) => updateEvent(eventId, data),

    // 1. Avant mutation : sauvegarder état actuel
    onMutate: async (newData) => {
      // Annuler les refetch en cours
      await queryClient.cancelQueries({ queryKey: EVENT_KEYS.detail(eventId) })

      // Sauvegarder snapshot
      const previousEvent = queryClient.getQueryData(EVENT_KEYS.detail(eventId))

      // Mettre à jour optimistiquement
      queryClient.setQueryData(EVENT_KEYS.detail(eventId), (old: Event) => ({
        ...old,
        ...newData
      }))

      // Retourner context pour rollback
      return { previousEvent }
    },

    // 2. Si erreur : rollback
    onError: (err, variables, context) => {
      if (context?.previousEvent) {
        queryClient.setQueryData(
          EVENT_KEYS.detail(eventId),
          context.previousEvent
        )
      }
      toast.error('Erreur lors de la mise à jour')
    },

    // 3. Toujours : refetch pour confirmer
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.detail(eventId) })
    }
  })
}
```

**Source : Orguin optimistic updates pattern**

### Cache Invalidation

```typescript
// Invalider toutes les queries d'une clé
queryClient.invalidateQueries({ queryKey: ['events'] })

// Invalider queries spécifiques
queryClient.invalidateQueries({ queryKey: ['events', tribeId] })

// Invalider et refetch immédiatement
queryClient.invalidateQueries({
  queryKey: ['events'],
  refetchType: 'active' // Seulement queries actives
})

// Reset query à l'état initial
queryClient.resetQueries({ queryKey: ['events'] })

// Supprimer du cache
queryClient.removeQueries({ queryKey: ['events', eventId] })
```

### Prefetching

```typescript
const queryClient = useQueryClient()

// Prefetch au hover
const handleMouseEnter = (eventId: string) => {
  queryClient.prefetchQuery({
    queryKey: EVENT_KEYS.detail(eventId),
    queryFn: () => getEvent(eventId),
    staleTime: 1000 * 60 // 1 minute
  })
}

return (
  <Link
    to={`/events/${event.id}`}
    onMouseEnter={() => handleMouseEnter(event.id)}
  >
    {event.name}
  </Link>
)
```

## Zustand (Client State)

### Installation

```bash
npm install zustand
```

### Store Simple

```typescript
// stores/ui-store.ts
import { create } from 'zustand'

interface UIState {
  // État
  sidebarOpen: boolean
  activeTab: string
  filters: {
    search: string
    category: string
  }

  // Actions
  toggleSidebar: () => void
  setActiveTab: (tab: string) => void
  setFilters: (filters: Partial<UIState['filters']>) => void
  resetFilters: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // État initial
  sidebarOpen: true,
  activeTab: 'overview',
  filters: {
    search: '',
    category: 'all'
  },

  // Actions
  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen
  })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  resetFilters: () => set({
    filters: { search: '', category: 'all' }
  })
}))
```

### Usage dans Composants

```typescript
// Sélectionner une propriété spécifique (optimisé)
const sidebarOpen = useUIStore((state) => state.sidebarOpen)
const toggleSidebar = useUIStore((state) => state.toggleSidebar)

// Sélectionner plusieurs propriétés
const { activeTab, setActiveTab } = useUIStore((state) => ({
  activeTab: state.activeTab,
  setActiveTab: state.setActiveTab
}))

// Utiliser dans composant
export const Sidebar = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <aside className={cn('sidebar', !sidebarOpen && 'closed')}>
      <button onClick={toggleSidebar}>Toggle</button>
    </aside>
  )
}
```

### Store avec Persistence

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: ThemeState['theme']) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'theme-storage', // localStorage key
      version: 1
    }
  )
)
```

### Store avec Actions Async

```typescript
interface NotificationState {
  notifications: Notification[]
  isLoading: boolean

  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true })
    try {
      const notifications = await fetchNotifications()
      set({ notifications, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      toast.error('Erreur de chargement')
    }
  },

  markAsRead: async (id) => {
    await markNotificationAsRead(id)

    // Mettre à jour état local
    set((state) => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    }))
  }
}))
```

## Patterns Anti-Duplication

### ❌ INCORRECT - État dupliqué

```typescript
// ❌ Mauvais : données API dans useState
const [users, setUsers] = useState([])

useEffect(() => {
  fetchUsers().then(setUsers)
}, [])

// ❌ ET dans React Query
const { data: users } = useQuery(['users'], fetchUsers)
```

### ✅ CORRECT - Une seule source

```typescript
// ✅ Server state dans React Query uniquement
const { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers
})

// ✅ UI state dans Zustand uniquement
const selectedUserId = useStore((state) => state.selectedUserId)
const setSelectedUser = useStore((state) => state.setSelectedUser)
```

### ✅ CORRECT - Dérivation du state

```typescript
// ✅ État dérivé avec useMemo (pas duplication)
const { data: events } = useQuery(['events'], fetchEvents)
const searchTerm = useUIStore((state) => state.filters.search)

const filteredEvents = useMemo(() => {
  if (!events) return []
  return events.filter(e => e.name.includes(searchTerm))
}, [events, searchTerm])
```

## Combinaison React Query + Zustand

### Exemple : Liste avec Filtres

```typescript
// Store Zustand pour filtres UI
interface EventFiltersState {
  search: string
  category: string
  dateRange: [Date, Date] | null

  setSearch: (search: string) => void
  setCategory: (category: string) => void
  setDateRange: (range: [Date, Date] | null) => void
  reset: () => void
}

export const useEventFilters = create<EventFiltersState>((set) => ({
  search: '',
  category: 'all',
  dateRange: null,

  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setDateRange: (dateRange) => set({ dateRange }),
  reset: () => set({ search: '', category: 'all', dateRange: null })
}))

// React Query pour données
export const useEvents = (tribeId: string) => {
  const { search, category, dateRange } = useEventFilters()

  return useQuery({
    queryKey: ['events', tribeId, { search, category, dateRange }],
    queryFn: () => getEvents(tribeId, { search, category, dateRange }),
    enabled: !!tribeId
  })
}

// Composant
export const EventsList = () => {
  const { search, setSearch } = useEventFilters()
  const { data: events, isLoading } = useEvents(tribeId)

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <EventsSkeleton />
      ) : (
        <EventCards events={events} />
      )}
    </>
  )
}
```

## Checklist State Management

**Standards obligatoires :**

- ✅ React Query pour TOUTES les données API
- ✅ Zustand pour état UI uniquement
- ✅ Séparation queries (`.queries.ts`) et mutations (`.mutations.ts`)
- ✅ Query keys organisées (pattern `ENTITY_KEYS`)
- ✅ Invalidation de cache après mutations
- ✅ Toast notifications pour feedback utilisateur
- ✅ Optimistic updates pour meilleure UX (optionnel)
- ✅ Sélecteurs Zustand optimisés (une propriété à la fois)

**Interdictions strictes :**

- ❌ JAMAIS dupliquer état entre React Query et useState
- ❌ JAMAIS dupliquer état entre React Query et Zustand
- ❌ JAMAIS fetch manuel avec useEffect (utiliser React Query)
- ❌ JAMAIS useState pour données API
- ❌ JAMAIS Zustand pour données serveur
- ❌ JAMAIS oublier `enabled` dans useQuery si condition
- ❌ JAMAIS oublier d'invalider cache après mutation
