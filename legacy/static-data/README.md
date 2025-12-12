# @workspace/static-data

Package de données statiques pour les applications JDR Coffee.

## Architecture

**TypeScript pour les constantes** (rarement modifiées) :
- ✅ Univers de JDR
- ✅ Monnaies
- ✅ Périodes temporelles
- ✅ Genres
- ✅ Catégories d'items

**CSV pour les données volumineuses** (à venir) :
- 🔄 Items
- 🔄 Traits de personnages
- 🔄 Rencontres aléatoires

## Structure

```
packages/static-data/
├── src/
│   ├── types.ts                    # Types TypeScript
│   ├── constants/
│   │   ├── universes.ts            # Univers de JDR (Aria, Cthulhu, Alien, etc.)
│   │   ├── currencies.ts           # Devises (écu, dollar, crédits, etc.)
│   │   ├── periods.ts              # Périodes temporelles
│   │   ├── genres.ts               # Genres (fantasy, horror, sci-fi, etc.)
│   │   ├── categories.ts           # Catégories d'items
│   │   └── index.ts                # Export de toutes les constantes
│   └── index.ts                    # Export principal
├── universes.md                    # Documentation des univers
├── package.json
├── tsconfig.json
└── README.md
```

## Usage dans les apps

### Import des constantes

```typescript
// Import de tout
import { UNIVERSES, CURRENCIES, PERIODS, GENRES, CATEGORIES } from '@workspace/static-data'

// Import sélectif
import { ARIA, CTHULHU_1920, ALIEN } from '@workspace/static-data/constants/universes'
import { ARIA_ECU, USD_1920, WY_DOLLAR } from '@workspace/static-data/constants/currencies'
import { MEDIEVAL, MODERN_1920S, FUTURE_NEAR } from '@workspace/static-data/constants/periods'

// Import des types
import type { Universe, Currency, Period, Genre, Category } from '@workspace/static-data/types'
```

### Exemples d'utilisation

```typescript
import { ARIA, ARIA_ECU, MEDIEVAL } from '@workspace/static-data'

// Afficher un univers
console.log(ARIA.name) // "Aria"
console.log(ARIA.type) // "fantasy"
console.log(ARIA.period) // "medieval"

// Utiliser une devise
const price = {
  currency: ARIA_ECU,
  value: 10
}

// Filtrer par période
const medievalUniverses = UNIVERSES.filter(u => u.period === MEDIEVAL.id)
```

### Accès rapide par ID

```typescript
import { UNIVERSES_BY_ID, CURRENCIES_BY_ID } from '@workspace/static-data'

const aria = UNIVERSES_BY_ID.aria
const ecu = CURRENCIES_BY_ID['aria-ecu']
```

## Univers disponibles

- **Aria** - Médiéval low-fantasy (Game of Rôles)
- **Donjons & Chatons** - Post-apocalypse animalier médiéval
- **Root** - Fantasy animalière narrative
- **L'Appel de Cthulhu 1920** - Horreur lovecraftienne (années 1920)
- **Alien** - Science-fiction horrifique (2180)

Voir [universes.md](./universes.md) pour plus de détails sur chaque univers.

## Devises disponibles

### Aria
- `aria-ecu` - Écu (₤)
- `aria-denier` - Denier (d)
- `aria-sou` - Sou (s)

### D&D / Generic Fantasy
- `dnd-gold` - Pièce d'or (po)
- `dnd-silver` - Pièce d'argent (pa)
- `dnd-copper` - Pièce de cuivre (pc)

### Cthulhu 1920
- `usd-1920` - Dollar américain ($)

### Alien
- `ua-dollar` - UA Dollar ($)
- `3we-yen` - 3WE Yen (¥)
- `upp-yuen` - UPP Yuen (¥)
- `wy-dollar` - W-Y Colony Dollar (W-Y$)
- `seeg-bill` - SEEG Bill (S$)
- `binat-coin` - Binat Coin

## Périodes temporelles

- `bronze-age` - Âge du Bronze (-3300 à -1200)
- `iron-age` - Âge du Fer (-1200 à 476)
- `medieval` - Médiéval (476 à 1492)
- `renaissance` - Renaissance (1492 à 1650)
- `enlightenment` - Lumières (1650 à 1789)
- `industrial` - Industriel (1789 à 1920)
- `modern` - Moderne (1920 à 2000)
- `contemporary` - Contemporain (2000 à aujourd'hui)
- `future-near` - Futur proche (2025 à 2200)
- `future-far` - Futur lointain (2200+)
- `post-apocalyptic` - Post-apocalyptique
- `timeless` - Intemporel

## Genres

- `fantasy`, `low-fantasy`, `high-fantasy`
- `horror`, `cosmic-horror`
- `sci-fi`, `space-opera`, `cyberpunk`, `steampunk`
- `historical`, `realistic`
- `humor`, `investigation`, `war`, `narrative`

## Catégories d'items

- `weapon` - Armes (melee, ranged, thrown, ammunition)
- `armor` - Armures (light, medium, heavy, shield)
- `tool` - Outils (crafting, exploration, climbing, investigation, survival)
- `consumable` - Consommables (potion, food, poison, scroll)
- `container` - Conteneurs (bag, chest, pouch, backpack)
- `clothing` - Vêtements (outfit, accessory, jewelry)
- `magic-item` - Objets magiques (wand, ring, amulet, artifact)
- `technology` - Technologie (electronics, computer, communication, medical)
- `vehicle` - Véhicules (mount, land, water, air, space)
- `misc` - Divers (material, component, treasure, quest-item)

## Type Safety

Toutes les constantes sont fortement typées avec TypeScript :

```typescript
import type { Universe } from '@workspace/static-data/types'

const myUniverse: Universe = {
  id: 'custom',
  name: 'Mon Univers',
  period: 'medieval',
  genres: ['fantasy'],
  type: 'fantasy',
  tags: ['custom', 'homebrew']
}
```

## Prochaines étapes

- [ ] Créer la structure CSV pour les items
- [ ] Parser CSV → JSON au build (optionnel)
- [ ] Créer des utilitaires de query/filtrage
- [ ] Ajouter d'autres univers (Chroniques Oubliées, Cyberpunk 2077, etc.)

---

**Package status** : ✅ Constantes TypeScript prêtes | 🔄 CSV items à venir
