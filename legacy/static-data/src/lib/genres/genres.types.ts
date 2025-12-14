/**
 * Types pour les genres d'univers
 */

/**
 * Genre/saveur d'univers
 */
export interface Genre {
  /** Identifiant unique (ex: 'fantasy', 'horror', 'realistic') */
  id: string;
  /** Nom du genre */
  name: string;
  /** Description */
  description?: string;
}
