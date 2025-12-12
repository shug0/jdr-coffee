/**
 * Types pour les emplacements d'équipement
 */

/**
 * Emplacement d'équipement sur un personnage
 */
export interface EquipmentSlot {
  /** Identifiant unique (ex: 'head', 'main-hand', 'finger') */
  id: string
  /** Nom de l'emplacement */
  name: string
  /** Si true, un seul item peut occuper cet emplacement à la fois */
  exclusive: boolean
  /** Description */
  description?: string
}
