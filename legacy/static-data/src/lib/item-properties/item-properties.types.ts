/**
 * Types pour les propriétés d'items
 */

/**
 * Catégorie de propriété d'item
 */
export type ItemPropertyCategory =
  | "physical"
  | "magical"
  | "technological"
  | "stylistic"
  | "functional";

/**
 * Propriété spéciale d'un item
 * Les propriétés peuvent affecter le prix, les mécaniques de jeu, ou l'apparence
 */
export interface ItemProperty {
  /** Identifiant unique (ex: 'enchanted', 'heavy', 'ceremonial') */
  id: string;
  /** Nom de la propriété */
  name: string;
  /** Catégorie de propriété */
  category: ItemPropertyCategory;
  /** Effet ou description de la propriété */
  effect?: string;
  /** Multiplicateur de prix (optionnel, 1 = pas de changement) */
  priceMultiplier?: number;
  /** Description */
  description?: string;
}
