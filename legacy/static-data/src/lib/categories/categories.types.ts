/**
 * Types pour les catégories d'items
 */

/**
 * Catégorie d'item
 */
export interface Category {
  /** Identifiant unique (ex: 'weapon', 'armor', 'tool') */
  id: string;
  /** Nom de la catégorie */
  name: string;
  /** Description */
  description?: string;
  /** Sous-catégories possibles */
  subcategories?: string[];
}
