import type { Currency } from '../currencies/currencies.types'
import type { Universe } from './universes.types'

/**
 * Univers Tales from the Loop
 */
export const TALES_FROM_THE_LOOP: Universe = {
  id: 'tales-from-the-loop',
  name: 'Tales from the Loop',
  creator: 'Free League Publishing (Simon Stålenhag)',
  period: 'modern',
  historicalEquivalent: 'Années 1980 (histoire alternative)',
  genres: ['sci-fi', 'mystery', 'retro-futuristic'],
  type: 'sci-fi',
  gameSystem: 'Year Zero Engine',
  description:
    'Années 80 alternatives où des technologies futuristes (anti-gravité, voyage temporel, robotique) côtoient le quotidien, vues à travers les yeux d\'enfants de 10-15 ans',
  tags: [
    '80s',
    'kids',
    'mystery',
    'sci-fi',
    'retro-futuristic',
    'sweden',
    'usa',
    'robots',
    'time-travel',
    'stranger-things',
    'goonies',
    'alternate-history',
    'Loop',
    'technology',
  ],
  restrictions: {
    // Pas de magie
    forbiddenCategories: ['magic-item'],
    // Pas de magie ni de tech trop avancée (années 80)
    forbiddenProperties: [
      'enchanted',
      'cursed',
      'blessed',
      'sentient',
      'magical-focus',
      'computerized',
    ],
    // Matériaux médiévaux rares
    forbiddenMaterials: ['bone', 'obsidian'],
  },
}

/**
 * Devises de Tales from the Loop
 * Années 80 en Suède et USA - monnaies contemporaines de l'époque
 */
export const TALES_FROM_THE_LOOP_CURRENCIES = {
  SEK: {
    id: 'sek-1980s',
    name: 'Couronne suédoise (années 80)',
    symbol: 'kr',
    type: 'coin',
  },
  USD: {
    id: 'usd-1980s',
    name: 'Dollar américain (années 80)',
    symbol: '$',
    type: 'coin',
  },
} as const satisfies Record<string, Currency>
