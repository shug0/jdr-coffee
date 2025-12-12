/**
 * Types pour les matériaux
 */

/**
 * Catégorie de matériau
 */
export type MaterialCategory = 'metal' | 'organic' | 'mineral' | 'composite'

/**
 * Durabilité d'un matériau (DÉPRÉCIÉ - utiliser hardness + mechanical)
 */
export type MaterialDurability =
  | 'very-low'
  | 'low'
  | 'medium'
  | 'high'
  | 'very-high'

/**
 * Tranchant d'un matériau pour armes (DÉPRÉCIÉ - utiliser sharpnessScore)
 */
export type MaterialSharpness = 'blunt' | 'sharp' | 'very-sharp'

/**
 * Flexibilité d'un matériau
 */
export type MaterialFlexibility = 'rigid' | 'flexible' | 'very-flexible'

/**
 * Type de mesure de dureté
 */
export type HardnessType = 'mohs' | 'hrc' | 'hv'

/**
 * Dureté d'un matériau avec échelle scientifique
 */
export interface MaterialHardness {
  /** Type de mesure (Mohs pour minéraux, HRC pour métaux, HV pour Vickers) */
  type: HardnessType
  /** Valeur de dureté */
  value: number
  /** Plage de valeurs (optionnel) */
  range?: [number, number]
}

/**
 * Géométrie du bord tranchant
 */
export interface EdgeGeometry {
  /** Score de géométrie (0-1, plus proche de 1 = meilleur) */
  score: number
  /** Rayon du bord en micromètres */
  radiusMicrometers: number
}

/**
 * Score de tranchance scientifique (0-10)
 */
export interface SharpnessScore {
  /** Score global de tranchance (0-10) */
  overall: number
  /** Géométrie du bord (optionnel) */
  edgeGeometry?: EdgeGeometry
  /** Ténacité / résistance à la casse (0-1, optionnel) */
  toughness?: number
}

/**
 * Propriétés thermiques d'un matériau
 */
export interface ThermalProperties {
  /** Conductivité thermique en W/m·K */
  thermalConductivity: number
  /** Point de fusion en °C (optionnel) */
  meltingPoint?: number
}

/**
 * Propriétés mécaniques d'un matériau
 */
export interface MechanicalProperties {
  /** Résistance à la traction en MPa */
  tensileStrength: number
  /** Plage de résistance (optionnel) */
  tensileStrengthRange?: [number, number]
  /** Module d'élasticité en GPa (optionnel) */
  elasticModulus?: number
}

/**
 * Propriétés spéciales d'un matériau
 */
export type MaterialSpecialProperty =
  | 'magnetic'
  | 'corrosion_resistant'
  | 'biocompatible'
  | 'fireproof'
  | 'conductive'
  | 'insulator'
  | 'transparent'
  | 'brittle'
  | 'flexible'
  | 'antimicrobial'
  | 'ultra_sharp'
  | 'fragile'
  | 'heavy'
  | 'light'
  | 'abundant'
  | 'rare'
  | 'precious'
  | 'experimental'
  | 'theoretical'

/**
 * Matériau utilisé pour fabriquer des items
 */
export interface Material {
  // IDENTITÉ
  /** Identifiant unique (ex: 'iron', 'wood', 'leather') */
  id: string
  /** Nom du matériau */
  name: string
  /** Catégorie principale */
  category: MaterialCategory

  // PROPRIÉTÉS PHYSIQUES SCIENTIFIQUES
  /** Densité en g/cm³ (= kg/dm³) */
  density: number
  /** Dureté scientifique (Mohs/HRC/HV) */
  hardness: MaterialHardness
  /** Propriétés mécaniques (résistance, élasticité) */
  mechanical: MechanicalProperties
  /** Propriétés thermiques (optionnel) */
  thermal?: ThermalProperties

  // TRANCHANCE
  /** Score de tranchance scientifique 0-10 (optionnel) */
  sharpnessScore?: SharpnessScore
  /** Tranchant simple (DÉPRÉCIÉ, garder pour compatibilité) */
  sharpness?: MaterialSharpness

  // FLEXIBILITÉ & DURABILITÉ
  /** Flexibilité du matériau (optionnel) */
  flexibility?: MaterialFlexibility
  /** Durabilité simple (DÉPRÉCIÉ, calculé depuis hardness+strength) */
  durability: MaterialDurability

  // FACTEURS DE JEU
  /**
   * Multiplicateur de prix par période historique
   * Les périodes disponibles sont déduites des clés présentes
   * Exemple: { 'medieval': 4.0, 'renaissance': 3.0, 'modern': 0.7 }
   */
  priceMultiplier: Record<string, number>
  /** Facteur de poids pour calculs */
  weightFactor: number
  /** Facteur de durabilité pour calculs */
  durabilityFactor: number
  /** Facteur d'efficacité pour calculs */
  effectivenessFactor: number

  // DISPONIBILITÉ HISTORIQUE
  /** Date/époque de découverte historique (optionnel) */
  historicalDiscovery?: string

  // PROPRIÉTÉS SPÉCIALES
  /** Liste des propriétés spéciales du matériau */
  specialProperties: MaterialSpecialProperty[]

  // MÉTADONNÉES
  /** Description du matériau */
  description?: string
  /** Coût pour le jeu (1-1000, optionnel) */
  cost?: number
  /** Rareté pour le jeu (1-10, optionnel) */
  rarity?: number
}
