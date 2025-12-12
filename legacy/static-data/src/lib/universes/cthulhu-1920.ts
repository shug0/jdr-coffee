import type { Currency } from '../currencies/currencies.types'
import type { Universe } from './universes.types'

/**
 * Univers L'Appel de Cthulhu 1920
 */
export const CTHULHU_1920: Universe = {
  id: 'cthulhu-1920',
  name: "L'Appel de Cthulhu 1920",
  creator: 'Sandy Petersen (Chaosium)',
  period: '1920s',
  historicalEquivalent: '1920-1930 (Années Folles)',
  genres: ['horror', 'investigation', 'historical'],
  type: 'horror',
  gameSystem: 'Basic Role-Playing (BRP)',
  description:
    'Horreur lovecraftienne dans les années 1920, enquêtes contre les Grands Anciens',
  tags: [
    'horror',
    'lovecraft',
    'investigation',
    '1920s',
    'roaring-twenties',
    'cosmic-horror',
    'great-old-ones',
    'mythos',
    'historical',
    'usa',
    'investigators',
  ],
  restrictions: {
    // Pas de magie fantasy classique (seulement horreur cosmique)
    forbiddenCategories: ['magic-item'],
    // Pas de magie fantasy ni de technologie futuriste (années 1920)
    forbiddenProperties: [
      'enchanted',
      'blessed',
      'magical-focus',
      'automated',
      'powered',
      'computerized',
    ],
    // Matériaux médiévaux peu probables
    forbiddenMaterials: ['obsidian', 'bone'],
  },
}

/**
 * Devises de Cthulhu 1920
 */
export const CTHULHU_CURRENCIES = {
  USD: {
    id: 'usd-1920',
    name: 'Dollar américain (1920)',
    symbol: '$',
    type: 'coin',
  },
} as const satisfies Record<string, Currency>
