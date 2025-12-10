# Forms & Validation

## Vue d'Ensemble

Cette ressource définit le pattern standard pour les formulaires : **React Hook Form** pour la gestion des forms et **Zod** pour la validation. Ce combo offre typage TypeScript, performance et DX optimal.

## Stack Obligatoire

**React Hook Form + Zod**

```bash
npm install react-hook-form zod @hookform/resolvers
```

## Pattern Formulaire Standard

### 1. Définir le Schéma Zod

**Fichier : `event.schemas.ts`**

```typescript
import { z } from 'zod'

export const eventSchema = z.object({
  name: z.string().min(3, 'Minimum 3 caractères').max(100),
  description: z.string().optional(),
  location: z.string().min(1, 'Lieu requis'),
  date: z.date({ required_error: 'Date requise' }),
  maxParticipants: z.number().int().positive().optional()
})

export type EventFormData = z.infer<typeof eventSchema>

// Valeurs par défaut
export const defaultEventValues: Partial<EventFormData> = {
  name: '',
  description: '',
  location: '',
  maxParticipants: undefined
}
```

### 2. Créer le Composant Form

**Fichier : `event-form.tsx`**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/shared/ui/button'
import { Input } from '~/shared/ui/input'
import { Textarea } from '~/shared/ui/textarea'
import { eventSchema, type EventFormData, defaultEventValues } from '../schemas/event.schemas'

interface EventFormProps {
  onSubmit: (data: EventFormData) => void
  isPending?: boolean
  defaultValues?: Partial<EventFormData>
  title: string
  submitLabel: string
  onCancel?: () => void
}

export const EventForm = ({
  onSubmit,
  isPending = false,
  defaultValues = defaultEventValues,
  title,
  submitLabel,
  onCancel
}: EventFormProps) => {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>

      <div>
        <label htmlFor="name">Nom de l'événement</label>
        <Input
          id="name"
          {...form.register('name')}
          error={form.formState.errors.name?.message}
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <Textarea
          id="description"
          {...form.register('description')}
        />
      </div>

      <div>
        <label htmlFor="location">Lieu</label>
        <Input
          id="location"
          {...form.register('location')}
          error={form.formState.errors.location?.message}
        />
      </div>

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'En cours...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
```

**Source : Pattern Orguin `event-form.tsx`**

### 3. Utiliser dans une Page

```typescript
export const EventCreatePage = () => {
  const navigate = useNavigate()
  const createEvent = useCreateEvent(() => navigate('/events'))

  const handleSubmit = (data: EventFormData) => {
    createEvent.mutate(data)
  }

  return (
    <Container>
      <EventForm
        onSubmit={handleSubmit}
        isPending={createEvent.isPending}
        title="Créer un événement"
        submitLabel="Créer"
        onCancel={() => navigate('/events')}
      />
    </Container>
  )
}
```

## Validation Zod Avancée

### Validations Communes

```typescript
import { z } from 'zod'

const userSchema = z.object({
  // String avec contraintes
  email: z.string().email('Email invalide'),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),

  // Nombres
  age: z.number().int().positive().min(18, 'Minimum 18 ans'),

  // Dates
  birthdate: z.date().max(new Date(), 'Date future interdite'),

  // Enum
  role: z.enum(['admin', 'member', 'guest']),

  // Union
  status: z.union([z.literal('active'), z.literal('inactive')]),

  // Optional / Nullable
  bio: z.string().optional(),
  avatar: z.string().url().nullable(),

  // Arrays
  tags: z.array(z.string()).min(1, 'Au moins un tag'),

  // Objects
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string().regex(/^\d{5}$/)
  }),

  // Refinements (validation custom)
  password: z.string().min(8).refine(
    (val) => /[A-Z]/.test(val),
    'Doit contenir une majuscule'
  ),

  // Confirm password
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  }
)
```

### Validation Conditionnelle

```typescript
const formSchema = z.object({
  userType: z.enum(['individual', 'company']),

  // Champs individuels
  firstName: z.string().optional(),
  lastName: z.string().optional(),

  // Champs entreprise
  companyName: z.string().optional(),
  siret: z.string().optional()
}).refine(
  (data) => {
    if (data.userType === 'individual') {
      return !!data.firstName && !!data.lastName
    }
    return true
  },
  {
    message: 'Prénom et nom requis pour particulier',
    path: ['firstName']
  }
).refine(
  (data) => {
    if (data.userType === 'company') {
      return !!data.companyName && !!data.siret
    }
    return true
  },
  {
    message: 'Nom et SIRET requis pour entreprise',
    path: ['companyName']
  }
)
```

## Composants Form Typés

### Typed Form Components Pattern

```typescript
// shared/ui/form/typed-form-components.ts
import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'

export function createTypedFormComponents<TFormData extends FieldValues>() {
  const InputField = ({ name, label, ...props }: {
    name: FieldPath<TFormData>
    label: string
  }) => {
    const { register, formState } = useFormContext<TFormData>()
    const error = formState.errors[name]

    return (
      <div>
        <label>{label}</label>
        <Input
          {...register(name)}
          error={error?.message as string}
          {...props}
        />
      </div>
    )
  }

  const TextareaField = ({ name, label, ...props }: {
    name: FieldPath<TFormData>
    label: string
  }) => {
    const { register, formState } = useFormContext<TFormData>()
    const error = formState.errors[name]

    return (
      <div>
        <label>{label}</label>
        <Textarea
          {...register(name)}
          error={error?.message as string}
          {...props}
        />
      </div>
    )
  }

  return { InputField, TextareaField }
}

// Usage dans EventForm
const { InputField, TextareaField } = createTypedFormComponents<EventFormData>()

export const EventForm = ({ form, onSubmit }: EventFormProps) => {
  return (
    <Form form={form} onSubmit={onSubmit}>
      <InputField name="name" label="Nom" />
      <TextareaField name="description" label="Description" />
    </Form>
  )
}
```

**Source : Pattern Orguin**

## Wizard Pattern (Multi-Step Forms)

### Setup Wizard

```typescript
enum WizardStep {
  RoleSelection = 0,
  MemberInfo = 1,
  AuthConfig = 2
}

export const MemberWizard = ({ onSubmit }: MemberWizardProps) => {
  const [currentStep, setCurrentStep] = useState(WizardStep.RoleSelection)

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: defaultMemberValues
  })

  const handleNext = async () => {
    // Valider champs du step actuel
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fieldsToValidate)

    if (isValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (data: MemberFormData) => {
    onSubmit(data)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Progress indicator */}
        <WizardProgress current={currentStep} total={3} />

        {/* Steps */}
        {currentStep === WizardStep.RoleSelection && <RoleStep />}
        {currentStep === WizardStep.MemberInfo && <InfoStep />}
        {currentStep === WizardStep.AuthConfig && <AuthStep />}

        {/* Navigation */}
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Retour
            </Button>
          )}
          {currentStep < 2 ? (
            <Button type="button" onClick={handleNext}>
              Suivant
            </Button>
          ) : (
            <Button type="submit">
              Terminer
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
```

**Source : `/Users/tomo/Dev/orguin/app/features/tribe-members/components/forms/member-wizard/`**

## Gestion des Erreurs

### Afficher les Erreurs

```typescript
// Erreur d'un champ
{form.formState.errors.email && (
  <p className="text-destructive text-sm">
    {form.formState.errors.email.message}
  </p>
)}

// Toutes les erreurs
{Object.keys(form.formState.errors).length > 0 && (
  <div className="bg-destructive/10 border border-destructive rounded p-3">
    <p className="font-semibold">Erreurs de validation :</p>
    <ul className="list-disc list-inside">
      {Object.entries(form.formState.errors).map(([key, error]) => (
        <li key={key}>{error.message}</li>
      ))}
    </ul>
  </div>
)}
```

### Erreur Serveur

```typescript
const createEvent = useCreateEvent()

const handleSubmit = async (data: EventFormData) => {
  try {
    await createEvent.mutateAsync(data)
    navigate('/events')
  } catch (error) {
    // Définir erreur sur un champ spécifique
    form.setError('name', {
      type: 'server',
      message: 'Ce nom existe déjà'
    })

    // Ou erreur globale
    form.setError('root', {
      type: 'server',
      message: 'Erreur serveur, réessayez'
    })
  }
}
```

## Props Form Standard

### Interface Props Recommandée

```typescript
interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  isPending: boolean
  onSubmit: (data: T) => void
  title: string
  submitLabel: string
  onCancel?: () => void
  showCancelButton?: boolean
}
```

**Avantages :**
- `form` : Contrôle externe du form state
- `isPending` : Disable pendant mutation
- `onSubmit` : Callback typé
- Réutilisabilité : Même form pour create/edit

## Checklist Forms

**Standards obligatoires :**

- ✅ React Hook Form + Zod toujours
- ✅ Schémas Zod dans fichiers `.schemas.ts`
- ✅ Type inference avec `z.infer<typeof schema>`
- ✅ Props form standard (`form`, `isPending`, `onSubmit`)
- ✅ Validation côté client avec Zod
- ✅ Gestion erreurs serveur avec `setError`
- ✅ Labels accessibles (for/id)
- ✅ Disable pendant soumission
- ✅ Messages d'erreur clairs

**Interdictions strictes :**

- ❌ JAMAIS formulaires sans validation
- ❌ JAMAIS validation manuelle (utiliser Zod)
- ❌ JAMAIS soumettre si form.isValid === false
- ❌ JAMAIS oublier `isPending` state
- ❌ JAMAIS validation serveur seule (valider aussi côté client)
