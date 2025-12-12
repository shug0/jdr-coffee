/**
 * Types pour les univers de JDR
 */

/**
 * Restrictions d'items pour un univers
 * Définit ce qui est interdit et les multiplicateurs de prix spécifiques
 */
export interface UniverseRestrictions {
  /** Catégories d'items complètement interdites */
  forbiddenCategories?: string[]
  /** Propriétés d'items interdites */
  forbiddenProperties?: string[]
  /** Matériaux interdits */
  forbiddenMaterials?: string[]

  /** Multiplicateurs de prix pour certaines propriétés (si autorisées) */
  propertyMultipliers?: Record<string, number>
  /** Multiplicateurs de prix pour certains matériaux (si autorisés) */
  materialMultipliers?: Record<string, number>
}

/**
 * Univers de jeu de rôle
 */
export interface Universe {
  /** Identifiant unique (ex: 'aria', 'cthulhu-1920', 'alien') */
  id: string
  /** Nom complet de l'univers */
  name: string
  /** Créateur/éditeur de l'univers */
  creator?: string

  /** Période temporelle (ex: 'medieval', '1920s', '2180') */
  period: string
  /** Équivalent historique si applicable */
  historicalEquivalent?: string

  /** Genres/saveurs de l'univers */
  genres: string[]
  /** Type principal d'univers */
  type: 'fantasy' | 'sci-fi' | 'horror' | 'historical' | 'post-apocalyptic' | 'other'

  /** Système de jeu utilisé */
  gameSystem?: string
  /** Description courte */
  description?: string

  /** Tags sémantiques pour recherche/filtrage */
  tags: string[]

  /** Restrictions d'items pour cet univers */
  restrictions?: UniverseRestrictions
}
