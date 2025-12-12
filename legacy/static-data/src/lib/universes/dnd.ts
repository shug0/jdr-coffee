import type { Currency } from '../currencies/currencies.types'
import type { Universe } from './universes.types'

/**
 * Univers Donjons & Dragons
 */
export const DND: Universe = {
  id: 'dnd',
  name: 'Donjons & Dragons',
  creator: 'Wizards of the Coast',
  period: 'timeless',
  historicalEquivalent: 'Médiéval-fantastique',
  genres: ['fantasy', 'high-fantasy'],
  type: 'fantasy',
  gameSystem: 'D&D 5e',
  description:
    'Le jeu de rôle fantasy le plus célèbre au monde, avec ses donjons, dragons et système d20.',
  tags: [
    'fantasy',
    'high-fantasy',
    'dungeons',
    'dragons',
    'magic',
    'medieval-fantasy',
    'd20',
    'dnd',
    'classic',
  ],
  restrictions: {
    // Technologie moderne/futuriste inappropriée
    forbiddenProperties: ['electronic', 'automated', 'powered', 'computerized'],
    // Tout le reste est autorisé (high-fantasy)
  },
}

/**
 * Devises de Donjons & Dragons
 * Système monétaire standard : 1 or = 10 argent = 100 cuivre
 */
export const DND_CURRENCIES = {
  COPPER: {
    id: 'dnd-copper',
    name: 'Pièce de cuivre',
    symbol: 'pc',
    type: 'coin',
    baseValue: 1, // Unité de base
  },
  SILVER: {
    id: 'dnd-silver',
    name: 'Pièce d\'argent',
    symbol: 'pa',
    type: 'coin',
    baseValue: 10, // 1 pa = 10 pc
  },
  GOLD: {
    id: 'dnd-gold',
    name: 'Pièce d\'or',
    symbol: 'po',
    type: 'coin',
    baseValue: 100, // 1 po = 100 pc = 10 pa
  },
} as const satisfies Record<string, Currency>
