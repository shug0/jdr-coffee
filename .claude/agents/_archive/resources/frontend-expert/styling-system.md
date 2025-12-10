# Styling System - Tailwind CSS + shadcn/ui

## Vue d'Ensemble

Cette ressource définit le système de styling basé sur **Tailwind CSS** et **shadcn/ui**. L'approche privilégie les design tokens, le helper `cn()` et CVA pour les variants de composants.

## Principes Fondamentaux

### Design Tokens Uniquement

**❌ INTERDICTION STRICTE : Couleurs arbitraires**

```tsx
// ❌ INTERDIT - Couleurs Tailwind arbitraires
<div className="bg-blue-600 text-gray-800">

// ❌ INTERDIT - Couleurs hex
<div className="bg-[#3b82f6] text-[#1f2937]">

// ✅ CORRECT - Design tokens shadcn/ui
<div className="bg-primary text-primary-foreground">
<div className="bg-secondary text-secondary-foreground">
<div className="bg-destructive text-destructive-foreground">
```

### Design Tokens shadcn/ui

**Tokens obligatoires :**

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;

    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 47.4% 11.2%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode values */
  }
}
```

**Usage des tokens :**

```tsx
// ✅ Backgrounds
<div className="bg-background">
<div className="bg-card">
<div className="bg-primary">
<div className="bg-secondary">
<div className="bg-muted">

// ✅ Text
<p className="text-foreground">
<p className="text-primary">
<p className="text-muted-foreground">

// ✅ Borders
<div className="border border-border">
<div className="border-primary">

// ✅ Combinations
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
<div className="bg-card text-card-foreground border">
```

## Helper `cn()` - Class Combiner

### Implémentation

```typescript
// lib/utils.ts ou shared/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Installation :**
```bash
npm install clsx tailwind-merge
```

### Usage

```tsx
import { cn } from '~/shared/utils/cn'

// ✅ Combiner classes statiques
<div className={cn('rounded-lg p-4', 'bg-card border')}>

// ✅ Classes conditionnelles
<div className={cn(
  'rounded-lg p-4',
  isActive && 'bg-primary text-primary-foreground',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>

// ✅ Override avec className prop
interface CardProps {
  className?: string
}

const Card = ({ className }: CardProps) => (
  <div className={cn(
    'rounded-lg p-4 bg-card', // Base
    className // Override externe
  )}>
)

// Usage
<Card className="shadow-lg" /> // Ajoute shadow sans supprimer base
```

**Raison d'utiliser `cn()` :**
- **clsx** : Combine classes conditionnelles
- **tailwind-merge** : Résout conflits Tailwind (dernier gagne)

```tsx
// Sans twMerge
cn('p-4', 'p-6') // → 'p-4 p-6' ❌ (conflit)

// Avec twMerge
cn('p-4', 'p-6') // → 'p-6' ✅ (dernier gagne)
```

## CVA - Class Variance Authority

### Installation

```bash
npm install class-variance-authority
```

### Button avec Variants

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/shared/utils/cn'

const buttonVariants = cva(
  // Base classes (toujours appliquées)
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = ({
  className,
  variant,
  size,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

**Source : `/Users/tomo/Dev/jdr-coffee/packages/ui/src/components/button.tsx`**

**Usage :**
```tsx
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Small Outline</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
```

### Card avec Variants

```tsx
const cardVariants = cva(
  'rounded-lg border',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        elevated: 'bg-card shadow-lg',
        outlined: 'border-2'
      },
      padding: {
        none: '',
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default'
    }
  }
)

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = ({ className, variant, padding, ...props }: CardProps) => {
  return (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  )
}
```

## Responsive Design

### Breakpoints Tailwind

```tsx
// Mobile-first approach
<div className="
  w-full           /* Mobile: full width */
  md:w-1/2         /* Tablet: 50% */
  lg:w-1/3         /* Desktop: 33% */
  xl:w-1/4         /* Large: 25% */
">

// Hide/Show par breakpoint
<div className="
  block            /* Mobile: visible */
  md:hidden        /* Tablet+: hidden */
">

<div className="
  hidden           /* Mobile: hidden */
  md:block         /* Tablet+: visible */
">
```

### Pattern Responsive Components

```tsx
// Desktop Table / Mobile Cards
export const UsersList = ({ users }: UsersListProps) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          {/* Table content */}
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {users.map((user) => (
          <Card key={user.id}>
            {/* Card content */}
          </Card>
        ))}
      </div>
    </>
  )
}
```

**Source : `/Users/tomo/Dev/orguin/app/features/tribe-members/components/tribe-members-table.tsx`**

## Dark Mode

### Setup avec CSS Variables

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body>{children}</body>
    </html>
  )
}

// Toggle class "dark" sur <html> pour activer dark mode
```

### Dark Mode Classes

```tsx
// Classes dark mode
<div className="bg-white dark:bg-gray-900">
<p className="text-gray-900 dark:text-gray-100">

// Avec design tokens (préféré)
<div className="bg-background text-foreground">
  {/* Tokens s'adaptent automatiquement au mode */}
</div>
```

### Theme Provider

```tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: 'system',
  setTheme: () => null
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

## Animations avec Tailwind

### Transitions

```tsx
// Hover transitions
<button className="bg-primary hover:bg-primary/90 transition-colors">

// All properties
<div className="opacity-0 hover:opacity-100 transition-all duration-300">

// Transform
<div className="transform hover:scale-105 transition-transform">
```

### Animations Personnalisées

```typescript
// tailwind.config.js
export default {
  theme: {
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  }
}
```

**Usage :**
```tsx
<div className="animate-accordion-down">
```

## Spacing & Layout

### Spacing Scale

```tsx
// Tailwind spacing (1 = 0.25rem = 4px)
<div className="p-4">        {/* padding: 1rem (16px) */}
<div className="m-8">        {/* margin: 2rem (32px) */}
<div className="gap-2">      {/* gap: 0.5rem (8px) */}
<div className="space-y-4">  {/* > * + * { margin-top: 1rem } */}
```

### Layout Patterns

```tsx
// Flexbox
<div className="flex items-center justify-between gap-4">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Container
<div className="container mx-auto max-w-7xl px-4">

// Sticky Header
<header className="sticky top-0 z-50 bg-background border-b">
```

## Tailwind Configuration

### Config Minimal

```javascript
// tailwind.config.js
export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: []
}
```

**Source : `/Users/tomo/Dev/orguin/tailwind.config.js`**

## Checklist Styling

**Standards obligatoires :**

- ✅ Design tokens shadcn/ui uniquement
- ✅ Helper `cn()` pour combiner classes
- ✅ CVA pour variants de composants
- ✅ Mobile-first responsive design
- ✅ Dark mode avec CSS variables
- ✅ Prop `className` pour override
- ✅ Transitions pour interactions

**Interdictions strictes :**

- ❌ JAMAIS couleurs Tailwind arbitraires (`blue-600`, `gray-800`)
- ❌ JAMAIS couleurs hex (`#3b82f6`, `#1f2937`)
- ❌ JAMAIS RGB inline (`rgb(59, 130, 246)`)
- ❌ JAMAIS styles inline (utiliser Tailwind)
- ❌ JAMAIS classes CSS custom (utiliser Tailwind utilities)
- ❌ JAMAIS combiner classes sans `cn()` helper
