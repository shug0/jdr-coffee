import type { ItemProperty } from './item-properties.types'

/**
 * Propriétés d'items
 */

// ========================================
// STYLISTIC (apparence et finition)
// ========================================

export const CLASSIC: ItemProperty = {
  id: 'classic',
  name: 'Classique',
  category: 'stylistic',
  priceMultiplier: 1,
  description: 'Facture classique sans fioritures',
}

export const DECORATIVE: ItemProperty = {
  id: 'decorative',
  name: 'Décoratif',
  category: 'stylistic',
  priceMultiplier: 2,
  description: 'Orné de décorations et gravures',
}

export const CEREMONIAL: ItemProperty = {
  id: 'ceremonial',
  name: 'Cérémonial',
  category: 'stylistic',
  priceMultiplier: 5,
  description: 'Objet de cérémonie richement décoré',
}

export const MASTERWORK: ItemProperty = {
  id: 'masterwork',
  name: 'Chef-d\'œuvre',
  category: 'stylistic',
  priceMultiplier: 10,
  description: 'Travail d\'orfèvre, chaque détail est parfait',
}

// ========================================
// PHYSICAL (caractéristiques physiques)
// ========================================

export const HEAVY: ItemProperty = {
  id: 'heavy',
  name: 'Lourd',
  category: 'physical',
  effect: 'Pénalité de mouvement',
  description: 'Plus lourd que la normale',
}

export const LIGHT: ItemProperty = {
  id: 'light',
  name: 'Léger',
  category: 'physical',
  effect: 'Bonus de maniabilité',
  priceMultiplier: 1.5,
  description: 'Plus léger que la normale',
}

export const FRAGILE: ItemProperty = {
  id: 'fragile',
  name: 'Fragile',
  category: 'physical',
  effect: 'Risque de casse accru',
  priceMultiplier: 0.7,
  description: 'Se brise facilement',
}

export const TWO_HANDED: ItemProperty = {
  id: 'two-handed',
  name: 'À deux mains',
  category: 'physical',
  effect: 'Nécessite les deux mains',
  description: 'Doit être manié à deux mains',
}

export const VERSATILE: ItemProperty = {
  id: 'versatile',
  name: 'Polyvalent',
  category: 'physical',
  effect: 'Utilisable à une ou deux mains',
  priceMultiplier: 1.3,
  description: 'Peut être utilisé d\'une ou deux mains',
}

export const BALANCED: ItemProperty = {
  id: 'balanced',
  name: 'Équilibré',
  category: 'physical',
  effect: 'Bonus de précision',
  priceMultiplier: 1.5,
  description: 'Parfaitement équilibré pour une meilleure maniabilité',
}

// ========================================
// MAGICAL (propriétés magiques)
// ========================================

export const ENCHANTED: ItemProperty = {
  id: 'enchanted',
  name: 'Enchanté',
  category: 'magical',
  effect: 'Possède des propriétés magiques',
  priceMultiplier: 3,
  description: 'Imprégné de magie',
}

export const CURSED: ItemProperty = {
  id: 'cursed',
  name: 'Maudit',
  category: 'magical',
  effect: 'Malédiction active',
  priceMultiplier: 0.5,
  description: 'Porte une malédiction',
}

export const BLESSED: ItemProperty = {
  id: 'blessed',
  name: 'Béni',
  category: 'magical',
  effect: 'Bénédiction divine',
  priceMultiplier: 2,
  description: 'Béni par une divinité',
}

export const SENTIENT: ItemProperty = {
  id: 'sentient',
  name: 'Conscient',
  category: 'magical',
  effect: 'Possède une conscience propre',
  priceMultiplier: 10,
  description: 'Doté d\'une intelligence et d\'une volonté propres',
}

export const MAGICAL_FOCUS: ItemProperty = {
  id: 'magical-focus',
  name: 'Focus magique',
  category: 'magical',
  effect: 'Canalise la magie',
  priceMultiplier: 4,
  description: 'Aide à canaliser les énergies magiques',
}

// ========================================
// TECHNOLOGICAL (propriétés technologiques)
// ========================================

export const ELECTRONIC: ItemProperty = {
  id: 'electronic',
  name: 'Électronique',
  category: 'technological',
  effect: 'Fonctionne à l\'électricité',
  priceMultiplier: 5,
  description: 'Contient des composants électroniques',
}

export const AUTOMATED: ItemProperty = {
  id: 'automated',
  name: 'Automatisé',
  category: 'technological',
  effect: 'Fonctionne automatiquement',
  priceMultiplier: 8,
  description: 'Dispose de mécanismes automatiques',
}

export const POWERED: ItemProperty = {
  id: 'powered',
  name: 'Motorisé',
  category: 'technological',
  effect: 'Dispose d\'un moteur',
  priceMultiplier: 10,
  description: 'Équipé d\'un système de propulsion',
}

export const COMPUTERIZED: ItemProperty = {
  id: 'computerized',
  name: 'Informatisé',
  category: 'technological',
  effect: 'Contrôlé par ordinateur',
  priceMultiplier: 15,
  description: 'Dispose d\'un système informatique embarqué',
}

// ========================================
// FUNCTIONAL (fonctionnalités spéciales)
// ========================================

export const CONCEALED: ItemProperty = {
  id: 'concealed',
  name: 'Dissimulé',
  category: 'functional',
  effect: 'Facile à cacher',
  priceMultiplier: 2,
  description: 'Conçu pour être facilement dissimulé',
}

export const SILENT: ItemProperty = {
  id: 'silent',
  name: 'Silencieux',
  category: 'functional',
  effect: 'Ne fait pas de bruit',
  priceMultiplier: 3,
  description: 'Fonctionne en silence',
}

export const WATERPROOF: ItemProperty = {
  id: 'waterproof',
  name: 'Imperméable',
  category: 'functional',
  effect: 'Résistant à l\'eau',
  priceMultiplier: 1.5,
  description: 'Protégé contre l\'eau et l\'humidité',
}

export const FOLDABLE: ItemProperty = {
  id: 'foldable',
  name: 'Pliable',
  category: 'functional',
  effect: 'Peut être plié',
  priceMultiplier: 1.8,
  description: 'Peut se plier pour un transport facile',
}

export const RETURNING: ItemProperty = {
  id: 'returning',
  name: 'Retour automatique',
  category: 'functional',
  effect: 'Revient à son utilisateur',
  priceMultiplier: 5,
  description: 'Revient automatiquement en main après usage',
}

export const UNBREAKABLE: ItemProperty = {
  id: 'unbreakable',
  name: 'Incassable',
  category: 'functional',
  effect: 'Ne peut être détruit',
  priceMultiplier: 20,
  description: 'Pratiquement indestructible',
}

/**
 * Toutes les propriétés d'items
 */
export const ITEM_PROPERTIES = {
  // Stylistic
  CLASSIC,
  DECORATIVE,
  CEREMONIAL,
  MASTERWORK,
  // Physical
  HEAVY,
  LIGHT,
  FRAGILE,
  TWO_HANDED,
  VERSATILE,
  BALANCED,
  // Magical
  ENCHANTED,
  CURSED,
  BLESSED,
  SENTIENT,
  MAGICAL_FOCUS,
  // Technological
  ELECTRONIC,
  AUTOMATED,
  POWERED,
  COMPUTERIZED,
  // Functional
  CONCEALED,
  SILENT,
  WATERPROOF,
  FOLDABLE,
  RETURNING,
  UNBREAKABLE,
} as const
