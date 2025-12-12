import type { Currency } from '../currencies/currencies.types'
import type { Universe } from './universes.types'

/**
 * Univers Donjons & Chatons
 */
export const DONJONS_CHATONS: Universe = {
  id: 'donjons-chatons',
  name: 'Donjons & Chatons',
  creator: 'Studio Deadcrows',
  period: 'post-apocalyptic-medieval',
  historicalEquivalent: 'Moyen-Âge réinterprété par les animaux',
  genres: ['fantasy', 'humor', 'post-apocalyptic'],
  type: 'post-apocalyptic',
  gameSystem: '3D6 (Costaud, Malin, Mignon)',
  description:
    'Monde post-apocalyptique où les animaux ont évolué et recréé un Moyen-Âge empreint de magie',
  tags: [
    'animals',
    'cats',
    'post-apocalyptic',
    'post-human',
    'medieval',
    'magic',
    'miagie',
    'humor',
    'fantasy-animals',
    'ruins',
    'nature-reclaimed',
  ],
  restrictions: {
    // Pas de technologie (monde post-apocalyptique médiéval)
    forbiddenCategories: ['technology'],
    forbiddenProperties: ['electronic', 'automated', 'powered', 'computerized'],
  },
}

/**
 * Système monétaire de Donjons & Chatons
 * Système de troc avec valeur abstraite (1-10)
 */
export const DONJONS_CHATONS_CURRENCIES = {
  VALEUR: {
    id: 'donjons-chatons-valeur',
    name: 'Valeur',
    type: 'barter',
    // Pas de baseValue - système de troc non hiérarchique
  },
} as const satisfies Record<string, Currency>
