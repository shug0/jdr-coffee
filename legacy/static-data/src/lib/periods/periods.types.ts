/**
 * Types pour les périodes temporelles
 */

/**
 * Période temporelle
 */
export interface Period {
  /** Identifiant unique (ex: 'ancient', 'medieval', 'modern-1920s') */
  id: string
  /** Nom de la période */
  name: string
  /** Description */
  description?: string
  /** Intervalle temporel approximatif */
  timeRange?: string
}
