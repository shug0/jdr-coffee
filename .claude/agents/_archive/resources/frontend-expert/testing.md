# Testing Strategy

## Vue d'Ensemble

Cette ressource définit la stratégie de test : **Vitest** pour tests unitaires/sécurité et **Playwright** pour tests E2E. Approche pragmatique centrée sur la valeur et la fiabilité.

## Stack Recommandée

- **Tests Unitaires** : Vitest + React Testing Library
- **Tests E2E** : Playwright
- **Coverage** : Vitest coverage (v8)

## Vitest - Tests Unitaires

### Installation

```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Configuration

**vite.config.ts :**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.tsx',
        '**/*.test.ts'
      ]
    }
  }
})
```

**tests/setup.ts :**

```typescript
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup après chaque test
afterEach(() => {
  cleanup()
})
```

**Source : `/Users/tomo/Dev/la-gallerie/vite.config.ts`**

### Test Composant Basique

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Test avec User Interactions

```typescript
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { EventForm } from './event-form'

describe('EventForm', () => {
  it('calls onSubmit with form data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <EventForm
        onSubmit={onSubmit}
        title="Create Event"
        submitLabel="Create"
      />
    )

    // Fill form
    await user.type(screen.getByLabelText('Nom'), 'Test Event')
    await user.type(screen.getByLabelText('Lieu'), 'Paris')

    // Submit
    await user.click(screen.getByRole('button', { name: 'Create' }))

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Test Event',
      location: 'Paris'
    })
  })

  it('shows validation errors', async () => {
    const user = userEvent.setup()

    render(<EventForm onSubmit={() => {}} title="Test" submitLabel="Submit" />)

    // Submit sans remplir
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    // Vérifier erreurs
    expect(screen.getByText(/minimum 3 caractères/i)).toBeInTheDocument()
  })
})
```

### Test Custom Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useCounter } from './use-counter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter())

    expect(result.current.count).toBe(0)
  })

  it('increments count', () => {
    const { result } = renderHook(() => useCounter())

    result.current.increment()

    expect(result.current.count).toBe(1)
  })

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10))

    expect(result.current.count).toBe(10)
  })
})
```

### Test React Query

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi } from 'vitest'
import { useEvents } from './use-events.queries'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useEvents', () => {
  it('fetches events successfully', async () => {
    const mockEvents = [
      { id: '1', name: 'Event 1' },
      { id: '2', name: 'Event 2' }
    ]

    vi.mock('../api/events.api', () => ({
      getEvents: vi.fn().mockResolvedValue(mockEvents)
    }))

    const { result } = renderHook(
      () => useEvents('tribe-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockEvents)
  })
})
```

### Scripts npm

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## Playwright - Tests E2E

### Installation

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Configuration

**playwright.config.ts :**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

### Test E2E Basique

```typescript
import { test, expect } from '@playwright/test'

test.describe('Event Management', () => {
  test('user can create an event', async ({ page }) => {
    // Navigate
    await page.goto('/events')

    // Click create button
    await page.click('text=Créer un événement')

    // Fill form
    await page.fill('[name="name"]', 'Team Building')
    await page.fill('[name="location"]', 'Paris')
    await page.fill('[name="description"]', 'Annual team event')

    // Submit
    await page.click('button[type="submit"]')

    // Verify success
    await expect(page.locator('text=Team Building')).toBeVisible()
    await expect(page).toHaveURL(/\/events/)
  })

  test('shows validation errors', async ({ page }) => {
    await page.goto('/events/new')

    // Submit empty form
    await page.click('button[type="submit"]')

    // Verify errors
    await expect(page.locator('text=Minimum 3 caractères')).toBeVisible()
    await expect(page.locator('text=Lieu requis')).toBeVisible()
  })
})
```

### Test avec Authentification

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authenticated flows', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/sign-in')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Wait for redirect
    await page.waitForURL('/dashboard')
  })

  test('user can access protected page', async ({ page }) => {
    await page.goto('/admin')

    await expect(page.locator('h1:text("Admin Panel")')).toBeVisible()
  })
})
```

### Structure E2E Orguin

**Référence : `/Users/tomo/Dev/orguin/e2e/`**

```
e2e/
├── core/                  # Infrastructure
│   ├── database/         # SQL queries
│   ├── fixtures/         # Playwright fixtures
│   └── types/            # TypeScript types
├── data/                 # Test data
│   ├── generators/       # Data generation
│   ├── providers/        # Dataset providers
│   └── strategies/       # Data isolation
├── helpers/              # Business actions
│   ├── auth/            # Auth helpers
│   ├── tribe/           # Tribe operations
│   ├── events/          # Event operations
│   └── infrastructure/
└── specs/               # Test files
    ├── onboarding.spec.ts
    ├── events.spec.ts
    └── members.spec.ts
```

### Fixtures Pattern

```typescript
// fixtures/auth.fixture.ts
import { test as base } from '@playwright/test'

type AuthFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Login
    await page.goto('/sign-in')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // Use fixture
    await use(page)

    // Teardown: Logout
    await page.click('[aria-label="User menu"]')
    await page.click('text=Déconnexion')
  }
})

// Usage
test('can create event when authenticated', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/events/new')
  // ... test logic
})
```

### Scripts E2E

```json
{
  "scripts": {
    "e2e:test": "playwright test",
    "e2e:test:ui": "playwright test --ui",
    "e2e:test:debug": "playwright test --debug",
    "e2e:test:headed": "playwright test --headed",
    "e2e:report": "playwright show-report"
  }
}
```

## Stratégie de Test

### Pyramide de Tests

```
        E2E (Playwright)
       /    Slow, comprehensive
      /     Critical user flows
     /
    Integration (Vitest)
   /        Medium speed
  /         Component interactions
 /
Unit (Vitest)
Wide base, fast
Business logic, utils
```

### Quoi Tester ?

**✅ Tests Unitaires (Vitest) :**
- Fonctions utilitaires pures
- Custom hooks
- Validation Zod schemas
- Composants UI isolés
- Logique métier

**✅ Tests E2E (Playwright) :**
- Workflows utilisateur critiques
- Authentification / onboarding
- Création/édition/suppression d'entités
- Navigation entre pages
- Formulaires multi-étapes

**❌ NE PAS Tester :**
- Détails d'implémentation
- Styles CSS (sauf fonctionnels)
- Code tiers (React, libraries)
- Composants triviaux (wrappers simples)

## Checklist Testing

**Standards obligatoires :**

- ✅ Vitest pour tests unitaires
- ✅ Playwright pour tests E2E
- ✅ React Testing Library pour composants
- ✅ Coverage minimum 70% pour business logic
- ✅ Tests pour fonctions critiques (auth, payment, data manipulation)
- ✅ E2E pour user flows principaux
- ✅ Fixtures/helpers pour réutilisabilité
- ✅ CI/CD integration

**Best practices :**

- ✅ Tests lisibles (describe/it clairs)
- ✅ Arrange-Act-Assert pattern
- ✅ Mock external dependencies
- ✅ Tests isolés (pas de dépendances entre tests)
- ✅ Fast feedback (tests rapides)

**À éviter :**

- ❌ JAMAIS tester détails d'implémentation
- ❌ JAMAIS snapshot tests (fragiles)
- ❌ JAMAIS tests qui dépendent d'ordre d'exécution
- ❌ JAMAIS skip tests (fix ou delete)
- ❌ JAMAIS ignorer tests failing en CI
