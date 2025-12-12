/**
 * Types pour les items
 */

/**
 * Unité de poids absolu
 */
export type WeightUnit = 'kg' | 'lb'

/**
 * Niveau d'encombrement relatif
 */
export type EncumbranceLevel =
  | 'negligible'
  | 'light'
  | 'normal'
  | 'cumbersome'
  | 'heavy'
  | 'very-heavy'

/**
 * Poids absolu (pour systèmes réalistes)
 */
export interface AbsoluteWeight {
  value: number
  unit: WeightUnit
}

/**
 * Encombrement relatif (pour systèmes abstraits)
 */
export interface RelativeEncumbrance {
  /** Niveau d'encombrement */
  level: EncumbranceLevel
  /** Nombre d'emplacements d'inventaire (optionnel) */
  slots?: number
}

/**
 * Système de poids/encombrement d'un item
 * Peut utiliser soit un poids absolu, soit un encombrement relatif
 */
export interface ItemWeight {
  /** Poids absolu (pour systèmes réalistes comme D&D, Alien) */
  absolute?: AbsoluteWeight
  /** Encombrement relatif (pour systèmes abstraits comme Root, Donjons et Chatons) */
  encumbrance?: RelativeEncumbrance
}

/**
 * Prix de base d'un item (avant multiplicateurs)
 */
export interface ItemBasePrice {
  /** Valeur numérique du prix de base */
  value: number
}

/**
 * Disponibilité d'un item par univers et période
 */
export interface ItemAvailability {
  /** IDs des univers où cet item est disponible (si vide/undefined = tous) */
  universes?: string[]
  /** IDs des périodes où cet item est disponible (si vide/undefined = toutes) */
  periods?: string[]
}


/**
 * Item complet avec toutes ses propriétés
 */
export interface Item {
  // ========================================
  // IDENTITÉ
  // ========================================

  /** Identifiant unique de l'item */
  id: string
  /** Nom de l'item */
  name: string
  /** Description détaillée */
  description: string

  // ========================================
  // CLASSIFICATION
  // ========================================

  /** ID de la catégorie principale (ex: 'weapon', 'armor', 'tool') */
  category: string
  /** ID de sous-catégorie optionnel (ex: 'melee', 'ranged') */
  subcategory?: string

  // ========================================
  // QUALITÉ ET COMPOSITION
  // ========================================

  /** ID de la rareté (ex: 'mundane', 'exceptional', 'legendary') */
  rarity: string
  /**
   * Liste des IDs des matériaux disponibles pour cet item (références à lib/materials)
   * Lors de l'instanciation dans l'app, un matériau sera choisi parmi cette liste
   * Le matériau affecte à la fois le prix (via priceMultiplier) et le poids (via density)
   */
  availableMaterials: string[]
  /**
   * Volume de base de l'item en dm³ (décimètres cubes)
   * Utilisé avec la densité du matériau pour calculer le poids : poids = baseVolume × material.density
   * Ce volume reste constant quel que soit le matériau choisi
   */
  baseVolume: number

  // ========================================
  // PROPRIÉTÉS SPÉCIALES
  // ========================================

  /** IDs des propriétés de l'item (ex: ['enchanted', 'heavy', 'ceremonial']) */
  properties: string[]

  // ========================================
  // CARACTÉRISTIQUES PHYSIQUES
  // ========================================

  /** Système de poids/encombrement */
  weight: ItemWeight
  /** Emplacement(s) d'équipement (un seul ID ou array d'IDs) */
  equipmentSlot?: string | string[]

  // ========================================
  // ÉCONOMIE
  // ========================================

  /** Prix de base (avant application des multiplicateurs) */
  basePrice: ItemBasePrice

  // ========================================
  // DISPONIBILITÉ
  // ========================================

  /** Disponibilité par univers et période (optionnel) */
  availability?: ItemAvailability

  // ========================================
  // MÉTADONNÉES
  // ========================================

  /** Tags sémantiques pour recherche et filtrage */
  tags: string[]
}
