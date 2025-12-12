/**
 * Types pour les raretés d'items
 */

/**
 * Niveau de disponibilité d'un item
 */
export type RarityAvailability =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'very-rare'
  | 'legendary'

/**
 * Rareté d'un item (affecte le prix et la disponibilité)
 */
export interface Rarity {
  /** Identifiant unique (ex: 'mundane', 'quality', 'legendary') */
  id: string
  /** Nom de la rareté */
  name: string
  /** Multiplicateur de prix de base (1 = prix normal) */
  baseMultiplier: number
  /** Niveau de disponibilité dans le monde */
  availability: RarityAvailability
  /** Description */
  description?: string
}
