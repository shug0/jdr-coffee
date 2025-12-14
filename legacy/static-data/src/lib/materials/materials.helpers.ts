import { MATERIALS } from "./materials.constants";
import type { Material } from "./materials.types";

/**
 * Périodes historiques disponibles (mises à jour avec les nouvelles périodes)
 */
export const HISTORICAL_PERIODS = [
  "bronze-age",
  "iron-age",
  "medieval",
  "renaissance",
  "enlightenment",
  "industrial",
  "modern",
  "contemporary",
  "future-near",
  "future-far",
] as const;

export type HistoricalPeriod = (typeof HISTORICAL_PERIODS)[number];

/**
 * Récupère les périodes disponibles pour un matériau
 * Les périodes sont déduites des clés présentes dans priceMultiplier
 */
export function getAvailablePeriods(material: Material): string[] {
  return Object.keys(material.priceMultiplier);
}

/**
 * Filtre les matériaux disponibles pour une période donnée
 */
export function getMaterialsForPeriod(period: string): Material[] {
  return Object.values(MATERIALS).filter((material) =>
    getAvailablePeriods(material).includes(period),
  );
}

/**
 * Vérifie si un matériau est disponible pour une période donnée
 */
export function isMaterialAvailableInPeriod(
  materialId: string,
  period: string,
): boolean {
  const material = Object.values(MATERIALS).find((m) => m.id === materialId);
  return material ? getAvailablePeriods(material).includes(period) : false;
}

/**
 * Calcule le prix d'un matériau pour une période donnée
 * @throws {Error} Si le matériau n'est pas disponible dans la période
 */
export function getMaterialPrice(
  material: Material,
  period: string,
  baseCost = 100,
): number {
  const multiplier = material.priceMultiplier[period];

  if (multiplier === undefined) {
    const availablePeriods = getAvailablePeriods(material).join(", ");
    throw new Error(
      `${material.name} is not available in period "${period}". ` +
        `Available periods: ${availablePeriods}`,
    );
  }

  return baseCost * multiplier;
}

/**
 * Récupère un matériau par son ID
 */
export function getMaterialById(id: string): Material | undefined {
  return Object.values(MATERIALS).find((material) => material.id === id);
}

/**
 * Filtre les matériaux par catégorie
 */
export function getMaterialsByCategory(
  category: Material["category"],
): Material[] {
  return Object.values(MATERIALS).filter(
    (material) => material.category === category,
  );
}

/**
 * Filtre les matériaux par propriété spéciale
 */
export function getMaterialsByProperty(
  property: Material["specialProperties"][number],
): Material[] {
  return Object.values(MATERIALS).filter((material) =>
    material.specialProperties.includes(property),
  );
}

/**
 * Récupère tous les matériaux triés par coût
 */
export function getMaterialsSortedByCost(): Material[] {
  return Object.values(MATERIALS).sort((a, b) => {
    const costA = a.cost ?? 0;
    const costB = b.cost ?? 0;
    return costA - costB;
  });
}

/**
 * Récupère tous les matériaux triés par rareté
 */
export function getMaterialsSortedByRarity(): Material[] {
  return Object.values(MATERIALS).sort((a, b) => {
    const rarityA = a.rarity ?? 0;
    const rarityB = b.rarity ?? 0;
    return rarityA - rarityB;
  });
}

/**
 * Récupère tous les matériaux avec un score de tranchance minimum
 */
export function getMaterialsByMinSharpness(minScore: number): Material[] {
  return Object.values(MATERIALS).filter((material) => {
    const score = material.sharpnessScore?.overall ?? 0;
    return score >= minScore;
  });
}

/**
 * Récupère tous les matériaux avec une densité dans une plage donnée
 */
export function getMaterialsByDensityRange(
  minDensity: number,
  maxDensity: number,
): Material[] {
  return Object.values(MATERIALS).filter(
    (material) =>
      material.density >= minDensity && material.density <= maxDensity,
  );
}
