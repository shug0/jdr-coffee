import type { Currency } from '../currencies/currencies.types'
import type { Universe } from './universes.types'

/**
 * Univers Root
 */
export const ROOT: Universe = {
  id: 'root',
  name: 'Root : Le Jeu de Rôle',
  creator: 'Magpie Games',
  period: 'timeless',
  historicalEquivalent: 'Aucun',
  genres: ['fantasy', 'war', 'narrative'],
  type: 'fantasy',
  gameSystem: 'Powered by the Apocalypse',
  description:
    'Univers de fantasy animalière dans une forêt en guerre entre factions rivales',
  tags: [
    'animals',
    'anthropomorphic',
    'woodland',
    'war',
    'factions',
    'narrative',
    'pbta',
    'forest',
    'rebellion',
    'cats',
    'birds',
    'vagabonds',
  ],
  restrictions: {
    // Pas de technologie (univers médiéval-fantastique animalier)
    forbiddenCategories: ['technology'],
    forbiddenProperties: ['electronic', 'automated', 'powered', 'computerized'],
    // Système abstrait - certains matériaux complexes inappropriés
    forbiddenMaterials: ['steel', 'glass', 'crystal'],
  },
}

/**
 * Système monétaire de Root
 * Système de troc avec Valeur abstraite (1-10)
 * La Jauge de Dénuement représente les ressources courantes
 */
export const ROOT_CURRENCIES = {
  VALEUR: {
    id: 'root-valeur',
    name: 'Valeur',
    type: 'barter',
    // Pas de baseValue - système de troc non hiérarchique
  },
  TITRE_FLUVIAL: {
    id: 'root-titre-fluvial',
    name: 'Titre Fluvial',
    type: 'barter',
    // Monnaie spécifique de la Compagnie de la Rivière
  },
} as const satisfies Record<string, Currency>
