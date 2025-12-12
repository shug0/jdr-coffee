import type { Rarity } from './rarities.types'

/**
 * Raretés d'items (qualité de fabrication)
 */

export const MUNDANE: Rarity = {
  id: 'mundane',
  name: 'Ordinaire',
  baseMultiplier: 1,
  availability: 'common',
  description: 'Item commun de qualité standard',
}

export const QUALITY: Rarity = {
  id: 'quality',
  name: 'Bonne facture',
  baseMultiplier: 2,
  availability: 'uncommon',
  description: 'Item de bonne qualité, bien fabriqué',
}

export const SUPERIOR: Rarity = {
  id: 'superior',
  name: 'Excellente facture',
  baseMultiplier: 5,
  availability: 'rare',
  description: 'Item de qualité supérieure, travail d\'artisan expérimenté',
}

export const EXCEPTIONAL: Rarity = {
  id: 'exceptional',
  name: 'Chef-d\'œuvre',
  baseMultiplier: 10,
  availability: 'very-rare',
  description: 'Chef-d\'œuvre artisanal, pièce d\'exception',
}

export const LEGENDARY: Rarity = {
  id: 'legendary',
  name: 'Légendaire',
  baseMultiplier: 50,
  availability: 'legendary',
  description: 'Item unique ou quasi-unique, d\'une qualité incomparable',
}

/**
 * Toutes les raretés
 */
export const RARITIES = {
  MUNDANE,
  QUALITY,
  SUPERIOR,
  EXCEPTIONAL,
  LEGENDARY,
} as const
