# Items de Référence

Collection d'items pré-définis utilisant le **système sémantique** de `@workspace/static-data`.

## 📊 Système de Prix

### ⚠️ IMPORTANT: Prix en Unité de Base (Cuivre)

**Tous les prix (`basePrice`) sont stockés en CUIVRE (pc) - l'unité de base.**

```typescript
// ✅ Bon - Prix en cuivre
basePrice: { value: 1500 }  // 15 po = 1500 pc

// ❌ Mauvais - N'utilisez jamais d'autres unités
basePrice: { value: 15 }  // Ambiguë !
```

### Pourquoi le Cuivre ?

1. **Uniformité** - Tous les prix dans la même unité
2. **Précision** - Pas de perte lors des conversions
3. **Flexibilité** - L'affichage s'adapte à l'univers
4. **Calculs simples** - Pas de conversion nécessaire

### Monnaie (D&D / Medieval Fantasy)

```
1 pièce d'or (po) = 10 pièces d'argent (pa) = 100 pièces de cuivre (pc)
```

| Devise | Symbole | Valeur en cuivre | Exemple |
|--------|---------|------------------|---------|
| Cuivre | pc | 1 | 1 pc |
| Argent | pa | 10 | 1 pa = 10 pc |
| Or | po | 100 | 1 po = 100 pc |

### Calcul du Prix Final

Le prix final d'un item est calculé selon la formule :

```
Prix Final (en cuivre) = basePrice.value
  × rarity.baseMultiplier
  × material.priceMultiplier
  × Σ properties.priceMultipliers
```

### Exemple de Calcul

**Épée longue en acier** (`STEEL_LONGSWORD`) :
```typescript
{
  basePrice: { value: 1500 },   // 15 po en cuivre
  rarity: 'quality',            // × 2
  material: 'steel',            // × 3
  properties: [
    'versatile',                // × 1.3
    'balanced'                  // × 1.5
  ]
}

Prix Final = 1500 × 2 × 3 × 1.3 × 1.5 = 17550 pc (175.5 po)
```

## 🎨 Formatage des Prix

### Helpers de Formatage

```typescript
import {
  formatCurrencyText,
  formatCurrencySymbols,
  formatCurrencySimple
} from '@workspace/static-data/lib/currencies'
import { DND_CURRENCIES } from '@workspace/static-data/lib/universes/dnd'

// Format complet avec noms
formatCurrencyText(1565, DND_CURRENCIES)
// → "15 Pièces d'or, 6 Pièces d'argent, 5 Pièces de cuivre"

// Format avec symboles (recommandé)
formatCurrencySymbols(1565, DND_CURRENCIES)
// → "15 po, 6 pa, 5 pc"

// Format simple (devise la plus haute)
formatCurrencySimple(1565, DND_CURRENCIES)
// → "15.7 po"

formatCurrencySimple(150, DND_CURRENCIES)
// → "1.5 po"

formatCurrencySimple(15, DND_CURRENCIES)
// → "15 pc"
```

### Affichage par Univers

Le formatage s'adapte automatiquement à l'univers :

```typescript
import { CTHULHU_1920_CURRENCIES } from '@workspace/static-data/lib/universes/cthulhu-1920'

formatCurrencySymbols(1500, CTHULHU_1920_CURRENCIES)
// → "$15" (si dollars configurés)
```

## 📦 Items Disponibles (16 total)

### Armes (6 items)

| Item | Prix (cuivre) | Prix (affiché) | Description |
|------|---------------|----------------|-------------|
| **Épée longue en fer** | 1950 pc | 19.5 po | Arme polyvalente basique |
| **Épée longue en acier** | 17550 pc | 175.5 po | Version améliorée, équilibrée |
| **Arc en bois** | 500 pc | 5 po | Arme à distance simple |
| **Dague en bronze** | 1800 pc | 18 po | Légère et dissimulable |
| **Masse cérémoniale** | 200000 pc | 2000 po | Argent, usage cérémonial |
| **Bâton enchanté** | 30000 pc | 300 po | Focus magique |

### Armures (4 items)

| Item | Prix (cuivre) | Prix (affiché) | Description |
|------|---------------|----------------|-------------|
| **Armure de cuir** | 1500 pc | 15 po | Protection légère |
| **Cotte de mailles en fer** | 10000 pc | 100 po | Armure intermédiaire |
| **Armure de plaques en acier** | 337500 pc | 3375 po | Protection maximale |
| **Plastron doré cérémonial** | 28000000 pc | 280000 po | Pièce de luxe |

### Outils (6 items)

| Item | Prix (cuivre) | Prix (affiché) | Description |
|------|---------------|----------------|-------------|
| **Corde de chanvre** | 60 pc | 0.6 po | Équipement d'exploration |
| **Pioche en fer** | 500 pc | 5 po | Outil de mineur |
| **Lanterne en verre** | 525 pc | 5.25 po | Source de lumière |
| **Crochets de maître** | 1350000 pc | 13500 po | Outils d'expert |
| **Boussole enchantée** | 168750 pc | 1687.5 po | Navigation magique |
| **Sac à dos en cuir** | 2250 pc | 22.5 po | Stockage imperméable |

## 🎯 Utilisation

### Import des Items

```typescript
import { WEAPONS, ARMORS, TOOLS } from '@workspace/static-data/data/items'

// Armes
const sword = WEAPONS.STEEL_LONGSWORD
console.log(sword.basePrice.value) // 1500 (en cuivre)

// Armures
const armor = ARMORS.LEATHER_ARMOR

// Outils
const rope = TOOLS.ROPE_HEMP
```

### Calcul du Prix Final

```typescript
import { calculateItemPrice } from '@workspace/static-data/lib/items'
import { STEEL_LONGSWORD } from '@workspace/static-data/data/items'

const finalPrice = calculateItemPrice(STEEL_LONGSWORD)
// → 17550 pc (en cuivre)
```

### Afficher le Prix

```typescript
import { formatCurrencySymbols } from '@workspace/static-data/lib/currencies'
import { DND_CURRENCIES } from '@workspace/static-data/lib/universes/dnd'
import { calculateItemPrice } from '@workspace/static-data/lib/items'
import { STEEL_LONGSWORD } from '@workspace/static-data/data/items'

const priceInCopper = calculateItemPrice(STEEL_LONGSWORD)
const displayPrice = formatCurrencySymbols(priceInCopper, DND_CURRENCIES)
// → "175 po, 5 pa"
```

### Filtrage par Univers

```typescript
import { filterItemsByUniverse } from '@workspace/static-data/lib/items'
import { DND } from '@workspace/static-data/lib/universes'
import { WEAPONS } from '@workspace/static-data/data/items'

const allWeapons = Object.values(WEAPONS)
const dndWeapons = filterItemsByUniverse(allWeapons, DND)
```

## 🏗️ Structure des Items

Tous les items suivent le schéma `Item` défini dans `lib/items/items.types.ts` :

```typescript
interface Item {
  // Identité
  id: string
  name: string
  description: string

  // Classification
  category: string          // 'weapon', 'armor', 'tool'...
  subcategory?: string      // 'melee', 'ranged', 'light'...

  // Composition
  material: string          // 'iron', 'steel', 'wood'...
  rarity: string           // 'mundane', 'quality', 'exceptional'...

  // Propriétés
  properties: string[]     // ['versatile', 'balanced']...

  // Physique
  weight: ItemWeight
  equipmentSlot?: string | string[]

  // Économie (⚠️ TOUJOURS EN CUIVRE)
  basePrice: { value: number }  // En cuivre (pc)

  // Métadonnées
  tags: string[]
}
```

## 📚 Ressources Liées

- **Materials** : `lib/materials/` - 17 matériaux disponibles
- **Rarities** : `lib/rarities/` - 5 niveaux de rareté
- **Properties** : `lib/item-properties/` - 24 propriétés
- **Categories** : `lib/categories/` - 10 catégories
- **Equipment Slots** : `lib/equipment-slots/` - 15 emplacements
- **Currencies** : `lib/currencies/` - Systèmes monétaires par univers

## 🎨 Gamme de Prix (Référence en po)

| Catégorie | Prix Min | Prix Max | Exemple |
|-----------|----------|----------|---------|
| **Basique** | < 10 po | - | Arc en bois (5 po / 500 pc) |
| **Commun** | 10-50 po | - | Épée en fer (19.5 po / 1950 pc) |
| **Qualité** | 50-500 po | - | Épée en acier (175.5 po / 17550 pc) |
| **Rare** | 500-5000 po | - | Boussole enchantée (1687.5 po / 168750 pc) |
| **Exceptionnel** | 5000-50000 po | - | Crochets de maître (13500 po / 1350000 pc) |
| **Légendaire** | > 50000 po | - | Plastron doré (280000 po / 28000000 pc) |

---

## 💡 Bonnes Pratiques

### ✅ À Faire

```typescript
// Stocker en cuivre
const item = {
  basePrice: { value: 1500 }  // 15 po
}

// Formater pour l'affichage
const displayPrice = formatCurrencySymbols(
  calculateItemPrice(item),
  DND_CURRENCIES
)
```

### ❌ À Éviter

```typescript
// Ne jamais stocker en or ou argent
const item = {
  basePrice: { value: 15, unit: 'gold' }  // ❌ Mauvais !
}

// Ne jamais afficher le prix brut
console.log(item.basePrice.value + ' po')  // ❌ Mauvais !
```
