# Performance Optimization

## Vue d'Ensemble

Cette ressource définit les techniques d'optimisation performance : lazy loading, code splitting, memoization, et optimisations spécifiques React/Next.js.

## Lazy Loading & Code Splitting

### React.lazy() + Suspense

```typescript
import { lazy, Suspense } from 'react'

// Lazy load page components
const EventListPage = lazy(() => import('~/features/events/pages/event-list.page'))
const EventDetailsPage = lazy(() => import('~/features/events/pages/event-details.page'))
const AdminPage = lazy(() => import('~/features/admin/pages/admin.page'))

// Router avec Suspense
export const router = createBrowserRouter([
  {
    path: '/events',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <EventListPage />
      </Suspense>
    )
  },
  {
    path: '/events/:id',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <EventDetailsPage />
      </Suspense>
    )
  }
])
```

**Source : `/Users/tomo/Dev/orguin/app/router.tsx`**

### Vite Code Splitting

**vite.config.ts :**

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],

          // UI chunks
          radix: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu'
          ],

          // Feature chunks (auto par directory)
          // events: ['./app/features/events/**/*']
        }
      }
    }
  }
})
```

**Source : `/Users/tomo/Dev/orguin/vite.config.ts`**

### Next.js Dynamic Imports

```typescript
import dynamic from 'next/dynamic'

// Lazy load avec loading state
const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  {
    loading: () => <Skeleton />,
    ssr: false // Disable SSR si nécessaire
  }
)

// Lazy load conditionnel
const AdminPanel = dynamic(() => import('./AdminPanel'))

export const Dashboard = () => {
  const { isAdmin } = useAuth()

  return (
    <div>
      <h1>Dashboard</h1>
      {isAdmin && <AdminPanel />}
    </div>
  )
}
```

## Memoization

### useMemo pour Calculs Coûteux

```typescript
export const EventsList = ({ events }: EventsListProps) => {
  const searchTerm = useUIStore((state) => state.filters.search)
  const category = useUIStore((state) => state.filters.category)

  // ✅ Memoize filtered list
  const filteredEvents = useMemo(() => {
    if (!events) return []

    return events.filter((event) => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = category === 'all' || event.category === category

      return matchesSearch && matchesCategory
    })
  }, [events, searchTerm, category])

  // ✅ Memoize sorted list
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [filteredEvents])

  return (
    <div>
      {sortedEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
```

**Source : Pattern Orguin**

**Quand utiliser useMemo :**
- Calculs coûteux (filtres, tris, transformations)
- Listes volumineuses (>100 items)
- Dependencies qui changent rarement

**Quand NE PAS utiliser :**
- Calculs simples (pas de gain)
- Dependencies qui changent souvent

### React.memo pour Composants

```typescript
import { memo } from 'react'

// ✅ Memo pour composants purs
export const EventCard = memo(({ event, onEdit }: EventCardProps) => {
  return (
    <Card>
      <h3>{event.name}</h3>
      <p>{event.date}</p>
      <Button onClick={() => onEdit(event.id)}>Edit</Button>
    </Card>
  )
})

// ✅ Avec custom comparison
export const ExpensiveComponent = memo(
  ({ data }: Props) => {
    // Render expensive
  },
  (prevProps, nextProps) => {
    // Return true si pas de re-render nécessaire
    return prevProps.data.id === nextProps.data.id
  }
)
```

**Quand utiliser React.memo :**
- Composants purs (même props = même render)
- Composants coûteux à render
- Props qui changent rarement

### useCallback pour Fonctions

```typescript
export const EventsList = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // ✅ useCallback pour fonction passée en prop
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    // Logique additionnelle...
  }, [])

  // ✅ useCallback avec dependencies
  const handleEdit = useCallback((id: string) => {
    navigate(`/events/${id}/edit`)
  }, [navigate])

  return (
    <div>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onSelect={handleSelect}
          onEdit={handleEdit}
        />
      ))}
    </div>
  )
}
```

## Image Optimization

### Next.js Image Component

```typescript
import Image from 'next/image'

// ✅ Optimisation automatique
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority // LCP image
/>

// ✅ Responsive avec sizes
<Image
  src="/card.jpg"
  alt="Card"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// ✅ Fill pour containers
<div className="relative w-full h-64">
  <Image
    src="/bg.jpg"
    alt="Background"
    fill
    className="object-cover"
  />
</div>

// ✅ External images
<Image
  src="https://example.com/image.jpg"
  alt="External"
  width={400}
  height={300}
  loader={({ src, width }) => `${src}?w=${width}`}
/>
```

### Preload Images

```typescript
// Service-level preloading (la-gallerie pattern)
private async preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const timeout = setTimeout(() => {
      reject(new Error('Timeout'))
    }, 30000)

    img.onload = () => {
      clearTimeout(timeout)
      resolve()
    }

    img.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('Load failed'))
    }

    img.src = url
  })
}
```

**Source : `/Users/tomo/Dev/la-gallerie/src/services/metMuseumApi.ts`**

## React Query Optimizations

### Stale Time & Cache Time

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 min - data considered fresh
      cacheTime: 1000 * 60 * 30,   // 30 min - cache retention
      refetchOnWindowFocus: false, // Disable auto-refetch
      retry: 1                      // Retry once on error
    }
  }
})
```

### Select & Data Transformation

```typescript
// ✅ Transform data in query (cache transformed result)
export const useEventNames = (tribeId: string) => {
  return useQuery({
    queryKey: ['events', tribeId],
    queryFn: () => getEvents(tribeId),
    select: (events) => events.map(e => e.name), // Cached
    enabled: !!tribeId
  })
}

// ❌ Transform in component (recalculate on every render)
const { data: events } = useEvents(tribeId)
const names = events?.map(e => e.name) // ❌ Not memoized
```

## Animations Performance

### Framer Motion Optimized

```typescript
import { motion } from 'framer-motion'

// ✅ GPU-accelerated properties (transform, opacity)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>

// ✅ Use transform instead of top/left
<motion.div
  animate={{ x: 100 }} // ✅ transform: translateX
  // NOT: { left: 100 } ❌ reflow
>

// ✅ AnimatePresence for exit animations
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

**Source : `/Users/tomo/Dev/la-gallerie/src/components/artwork/ArtworkDisplay.tsx`**

### CSS Transitions (Fallback)

```tsx
// Tailwind transitions
<div className="transform transition-transform hover:scale-105">

// Smooth color transitions
<button className="bg-primary transition-colors hover:bg-primary/90">
```

## Bundle Analysis

### Vite Bundle Analyzer

```bash
npm install --save-dev rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

### Next.js Bundle Analyzer

```bash
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  // config
})

// Usage: ANALYZE=true npm run build
```

## Web Vitals

### Mesurer Performance

```typescript
// app/main.tsx ou app/layout.tsx
export function reportWebVitals(metric: {
  id: string
  name: string
  value: number
}) {
  console.log(metric)

  // Envoyer à analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id
    })
  }
}
```

**Core Web Vitals cibles :**
- **LCP** (Largest Contentful Paint) : < 2.5s
- **FID** (First Input Delay) : < 100ms
- **CLS** (Cumulative Layout Shift) : < 0.1

## Checklist Performance

**Optimisations obligatoires :**

- ✅ Lazy load pages avec React.lazy()
- ✅ Code splitting Vite/Next.js
- ✅ useMemo pour listes filtrées/triées
- ✅ useCallback pour event handlers
- ✅ React Query staleTime configuré
- ✅ Next.js Image pour images
- ✅ Framer Motion pour animations
- ✅ Bundle analysis régulière

**À éviter :**

- ❌ JAMAIS render coûteux sans useMemo
- ❌ JAMAIS inline functions dans render
- ❌ JAMAIS images non optimisées
- ❌ JAMAIS animations sur layout properties (width, height, top, left)
- ❌ JAMAIS large bundles sans code splitting
