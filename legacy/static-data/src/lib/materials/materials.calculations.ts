import type { Material } from "./materials.types";

/**
 * Calcule le poids final d'un item basé sur son volume et le matériau
 * @param baseVolume Volume de base en dm³
 * @param material Matériau utilisé
 * @returns Poids final en kg
 */
export function calculateWeight(
  baseVolume: number,
  material: Material,
): number {
  // poids (kg) = volume (dm³) × densité (kg/dm³) × weightFactor
  // Note: densité en g/cm³ = densité en kg/dm³
  return baseVolume * material.density * material.weightFactor;
}

/**
 * Calcule la durabilité finale d'un item
 * @param baseDurability Durabilité de base
 * @param material Matériau utilisé
 * @returns Durabilité finale
 */
export function calculateDurability(
  baseDurability: number,
  material: Material,
): number {
  return baseDurability * material.durabilityFactor;
}

/**
 * Calcule l'effectivité finale d'un item
 * @param baseEffectiveness Effectivité de base
 * @param material Matériau utilisé
 * @returns Effectivité finale
 */
export function calculateEffectiveness(
  baseEffectiveness: number,
  material: Material,
): number {
  return baseEffectiveness * material.effectivenessFactor;
}

/**
 * Calcule le prix final d'un item
 * @param basePrice Prix de base
 * @param material Matériau utilisé
 * @param period Période historique
 * @param complexityMultiplier Multiplicateur de complexité (défaut: 1)
 * @returns Prix final
 */
export function calculatePrice(
  basePrice: number,
  material: Material,
  period: string,
  complexityMultiplier = 1,
): number {
  const materialCost = material.cost ?? 0;
  const priceMultiplier = material.priceMultiplier[period];

  if (priceMultiplier === undefined) {
    throw new Error(
      `Material ${material.name} is not available in period ${period}`,
    );
  }

  return basePrice * priceMultiplier + materialCost * complexityMultiplier;
}

/**
 * Normalise la dureté sur une échelle 0-10
 * @param material Matériau
 * @returns Dureté normalisée (0-10)
 */
export function normalizeHardness(material: Material): number {
  const { hardness } = material;

  switch (hardness.type) {
    case "mohs":
      // Échelle Mohs: 1-10 → 0-10 (linéaire)
      return hardness.value;

    case "hrc":
      // Échelle HRC: 0-70 → 0-10
      return (hardness.value / 70) * 10;

    case "hv":
      // Échelle Vickers: 0-1000 → 0-10
      return (hardness.value / 1000) * 10;

    default:
      return 0;
  }
}

/**
 * Calcule le score de tranchance scientifique
 * Formule: (hardness × 0.40) + (edgeGeometry × 0.40) + (toughness × 0.20)
 * @param material Matériau
 * @returns Score de tranchance (0-10)
 */
export function calculateSharpnessScore(material: Material): number {
  if (!material.sharpnessScore) {
    return 0;
  }

  const hardnessNorm = normalizeHardness(material);
  const edgeGeometryScore = material.sharpnessScore.edgeGeometry?.score ?? 0;
  const toughnessScore = material.sharpnessScore.toughness ?? 0;

  const rawScore =
    hardnessNorm * 0.4 +
    edgeGeometryScore * 10 * 0.4 +
    toughnessScore * 10 * 0.2;

  return Math.min(10, Math.max(0, rawScore));
}

/**
 * Calcule le rapport résistance/poids (strength-to-weight ratio)
 * @param material Matériau
 * @returns Rapport résistance/poids en MPa/(g/cm³)
 */
export function calculateStrengthToWeightRatio(material: Material): number {
  return material.mechanical.tensileStrength / material.density;
}

/**
 * Compare deux matériaux pour déterminer lequel est meilleur pour une arme tranchante
 * @param materialA Premier matériau
 * @param materialB Deuxième matériau
 * @returns Score de comparaison positif si A > B, négatif si B > A
 */
export function compareMaterialsForWeapons(
  materialA: Material,
  materialB: Material,
): number {
  const scoreA =
    (materialA.sharpnessScore?.overall ?? 0) * 0.5 +
    normalizeHardness(materialA) * 0.3 +
    materialA.effectivenessFactor * 10 * 0.2;

  const scoreB =
    (materialB.sharpnessScore?.overall ?? 0) * 0.5 +
    normalizeHardness(materialB) * 0.3 +
    materialB.effectivenessFactor * 10 * 0.2;

  return scoreA - scoreB;
}

/**
 * Compare deux matériaux pour déterminer lequel est meilleur pour une armure
 * @param materialA Premier matériau
 * @param materialB Deuxième matériau
 * @returns Score de comparaison positif si A > B, négatif si B > A
 */
export function compareMaterialsForArmor(
  materialA: Material,
  materialB: Material,
): number {
  const scoreA =
    normalizeHardness(materialA) * 0.4 +
    materialA.durabilityFactor * 10 * 0.4 +
    (1 / materialA.weightFactor) * 10 * 0.2;

  const scoreB =
    normalizeHardness(materialB) * 0.4 +
    materialB.durabilityFactor * 10 * 0.4 +
    (1 / materialB.weightFactor) * 10 * 0.2;

  return scoreA - scoreB;
}

/**
 * Estime la température de forge requise pour travailler un matériau
 * @param material Matériau
 * @returns Température en °C, ou null si non applicable
 */
export function getRequiredForgingTemperature(
  material: Material,
): number | null {
  if (material.category !== "metal") {
    return null;
  }

  const meltingPoint = material.thermal?.meltingPoint;
  if (!meltingPoint) {
    return null;
  }

  // Température de forge = ~60-70% du point de fusion
  return Math.round(meltingPoint * 0.65);
}

/**
 * Vérifie si un matériau peut être trempé (quenched)
 * @param material Matériau
 * @returns true si le matériau peut être trempé
 */
export function canBeQuenched(material: Material): boolean {
  // Seuls les métaux avec du carbone (acier) peuvent être trempés
  return (
    material.category === "metal" &&
    (material.id === "steel" || material.id === "stainless_steel")
  );
}

/**
 * Calcule la conductivité thermique normalisée (0-1)
 * @param material Matériau
 * @returns Conductivité normalisée (0 = isolant parfait, 1 = conducteur parfait)
 */
export function normalizeThermalConductivity(material: Material): number {
  const conductivity = material.thermal?.thermalConductivity ?? 0;
  // Graphène a la conductivité la plus élevée (5000 W/m·K)
  return Math.min(1, conductivity / 5000);
}
