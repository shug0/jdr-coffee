/**
 * Types pour les devises
 */

/**
 * Type de devise
 */
export type CurrencyType = "coin" | "electronic" | "corporate" | "barter";

/**
 * Devise utilisée dans un univers de jeu
 */
export interface Currency {
  /** Identifiant unique de la devise (ex: 'aria-couronne', 'dnd-gold', 'wy-dollar') */
  id: string;
  /** Nom complet de la devise */
  name: string;
  /** Symbole de la devise (uniquement si explicitement mentionné) */
  symbol?: string;
  /** Type de devise (obligatoire) */
  type: CurrencyType;
  /**
   * Valeur de base pour conversion entre devises d'un même système
   * La plus petite unité = 1
   * Ex: DND -> copper=1, silver=10, gold=100
   * Ex: Aria -> roi=1, sceptre=10, orbe=100, couronne=1000
   * Ex: Médiéval -> denier=1, sou=12, livre=240
   * Optionnel - uniquement pour les systèmes hiérarchiques (coin)
   * Absent pour les systèmes non-hiérarchiques (electronic, corporate, barter)
   */
  baseValue?: number;
}

/**
 * Résultat du formatage d'une valeur monétaire
 */
export interface FormattedCurrency {
  /** Devise utilisée */
  currency: Currency;
  /** Quantité de cette devise */
  amount: number;
}
