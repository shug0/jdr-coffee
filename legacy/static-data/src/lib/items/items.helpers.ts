/**
 * Fonctions utilitaires pour manipuler les items
 */

import type { ItemProperty } from "../item-properties/item-properties.types";
import type { Material } from "../materials/materials.types";
import type { Rarity } from "../rarities/rarities.types";
import type { Universe } from "../universes/universes.types";
import type { AbsoluteWeight, Item, ItemWeight } from "./items.types";

/**
 * Vérifie si un item est disponible dans un univers donné
 *
 * Logique :
 * - Un item est disponible si sa période correspond (via tags)
 * - ET s'il n'est pas interdit par les restrictions de l'univers
 *
 * @param item - L'item à vérifier
 * @param universe - L'univers de jeu
 * @param materials - Map des matériaux disponibles (id -> Material)
 * @returns true si l'item est disponible, false sinon
 */
export function isItemAvailable(
  item: Item,
  universe: Universe,
  _materials: Record<string, Material>,
): boolean {
  const restrictions = universe.restrictions;

  // Si pas de restrictions, l'item est disponible
  if (!restrictions) {
    return true;
  }

  // Vérifier si la catégorie est interdite
  if (restrictions.forbiddenCategories?.includes(item.category)) {
    return false;
  }

  // Vérifier si tous les matériaux disponibles sont interdits
  if (restrictions.forbiddenMaterials) {
    const hasAvailableMaterial = item.availableMaterials.some(
      (matId) => !restrictions.forbiddenMaterials?.includes(matId),
    );
    if (!hasAvailableMaterial) {
      return false;
    }
  }

  // Vérifier si une des propriétés est interdite
  if (restrictions.forbiddenProperties) {
    for (const prop of item.properties) {
      if (restrictions.forbiddenProperties.includes(prop)) {
        return false;
      }
    }
  }

  // Vérifier la disponibilité explicite par univers
  if (item.availability?.universes) {
    return item.availability.universes.includes(universe.id);
  }

  return true;
}

/**
 * Calcule le prix final d'un item en appliquant tous les multiplicateurs
 *
 * Formule :
 * Prix final = basePrice
 *   × rarity.baseMultiplier
 *   × material.priceMultiplier[period]
 *   × Σ properties.priceMultipliers
 *   × universe.propertyMultipliers (si applicable)
 *   × universe.materialMultipliers (si applicable)
 *
 * @param item - L'item dont on calcule le prix
 * @param materialId - ID du matériau choisi (doit être dans item.availableMaterials)
 * @param period - Période historique pour le prix du matériau
 * @param rarity - La rareté de l'item
 * @param materials - Map des matériaux disponibles (id -> Material)
 * @param properties - Les propriétés de l'item (id -> ItemProperty)
 * @param universe - L'univers de jeu (optionnel, pour multiplicateurs spécifiques)
 * @returns Le prix final calculé en cuivre (pc)
 */
export function calculateItemPrice(
  item: Item,
  materialId: string,
  period: string,
  rarity: Rarity,
  materials: Record<string, Material>,
  properties: Record<string, ItemProperty>,
  universe?: Universe,
): number {
  let price = item.basePrice.value;

  // Appliquer le multiplicateur de rareté
  price *= rarity.baseMultiplier;

  // Appliquer le multiplicateur du matériau pour la période
  const material = materials[materialId];
  if (material) {
    let materialMultiplier = material.priceMultiplier[period];

    if (materialMultiplier === undefined) {
      throw new Error(
        `Material ${material.name} is not available in period ${period}`,
      );
    }

    // Appliquer le multiplicateur d'univers si applicable
    const universeMaterialMultiplier =
      universe?.restrictions?.materialMultipliers?.[material.id];
    if (universeMaterialMultiplier !== undefined) {
      materialMultiplier *= universeMaterialMultiplier;
    }

    price *= materialMultiplier;
  }

  // Appliquer les multiplicateurs de propriétés
  for (const propId of item.properties) {
    const property = properties[propId];
    if (property?.priceMultiplier) {
      let propMultiplier = property.priceMultiplier;

      // Appliquer le multiplicateur d'univers pour la propriété si applicable
      if (universe?.restrictions?.propertyMultipliers?.[propId]) {
        propMultiplier = universe.restrictions.propertyMultipliers[propId];
      }

      price *= propMultiplier;
    }
  }

  return Math.round(price);
}

/**
 * Calcule le poids total d'un item à partir de son volume et de la densité de son matériau
 *
 * Formule : poids (kg) = baseVolume (dm³) × material.density (kg/dm³)
 *
 * @param item - L'item dont on calcule le poids
 * @param materialId - ID du matériau choisi (doit être dans item.availableMaterials)
 * @param materials - Map des matériaux disponibles (id -> Material)
 * @returns Poids total en kg
 */
export function calculateItemWeight(
  item: Item,
  materialId: string,
  materials: Record<string, Material>,
): number {
  const material = materials[materialId];
  if (!material) {
    return 0;
  }

  const weight = item.baseVolume * material.density;
  return Math.round(weight * 100) / 100; // Arrondi à 2 décimales
}

/**
 * Filtre une liste d'items pour ne garder que ceux disponibles dans un univers
 *
 * @param items - Liste des items à filtrer
 * @param universe - L'univers de jeu
 * @param materials - Map des matériaux disponibles (id -> Material)
 * @returns Liste des items disponibles
 */
export function filterItemsByUniverse(
  items: Item[],
  universe: Universe,
  materials: Record<string, Material>,
): Item[] {
  return items.filter((item) => isItemAvailable(item, universe, materials));
}

/**
 * Filtre une liste d'items par période temporelle
 *
 * @param items - Liste des items à filtrer
 * @param periodId - ID de la période
 * @returns Liste des items de cette période
 */
export function filterItemsByPeriod(items: Item[], periodId: string): Item[] {
  return items.filter((item) => {
    // Si l'item spécifie des périodes, vérifier si la période demandée est incluse
    if (item.availability?.periods) {
      return item.availability.periods.includes(periodId);
    }
    // Sinon, vérifier dans les tags
    return item.tags.includes(periodId);
  });
}

/**
 * Calcule le poids total d'une liste d'items
 *
 * Note : Cette fonction fonctionne uniquement si tous les items utilisent
 * le même système de poids (absolu ou encombrement)
 *
 * @param items - Liste des items
 * @returns Poids total (absolu ou encombrement)
 */
export function calculateTotalWeight(items: Item[]): ItemWeight {
  if (items.length === 0) {
    return {
      absolute: { value: 0, unit: "kg" },
    };
  }

  // Détecter le type de système utilisé (absolu ou encombrement)
  const firstItem = items[0];
  if (!firstItem) {
    return {
      absolute: { value: 0, unit: "kg" },
    };
  }

  const usesAbsolute = !!firstItem.weight.absolute;
  const usesEncumbrance = !!firstItem.weight.encumbrance;

  if (usesAbsolute) {
    // Calculer le poids absolu total
    let totalKg = 0;

    for (const item of items) {
      if (item.weight.absolute) {
        const weight = item.weight.absolute;
        // Convertir en kg si nécessaire
        if (weight.unit === "lb") {
          totalKg += weight.value * 0.453592; // 1 lb = 0.453592 kg
        } else {
          totalKg += weight.value;
        }
      }
    }

    return {
      absolute: {
        value: Math.round(totalKg * 100) / 100, // Arrondir à 2 décimales
        unit: "kg",
      },
    };
  }

  if (usesEncumbrance) {
    // Calculer l'encombrement total en slots
    let totalSlots = 0;

    for (const item of items) {
      if (item.weight.encumbrance?.slots) {
        totalSlots += item.weight.encumbrance.slots;
      }
    }

    return {
      encumbrance: {
        level: getEncumbranceLevelFromSlots(totalSlots),
        slots: totalSlots,
      },
    };
  }

  // Par défaut, retourner un poids nul
  return {
    absolute: { value: 0, unit: "kg" },
  };
}

/**
 * Convertit un nombre de slots en niveau d'encombrement
 * (Fonction auxiliaire pour calculateTotalWeight)
 *
 * @param slots - Nombre de slots occupés
 * @returns Niveau d'encombrement correspondant
 */
function getEncumbranceLevelFromSlots(slots: number) {
  if (slots === 0) return "negligible";
  if (slots <= 3) return "light";
  if (slots <= 6) return "normal";
  if (slots <= 10) return "cumbersome";
  if (slots <= 15) return "heavy";
  return "very-heavy";
}

/**
 * Convertit un poids absolu d'une unité à une autre
 *
 * @param weight - Poids absolu à convertir
 * @param targetUnit - Unité cible ('kg' ou 'lb')
 * @returns Nouveau poids dans l'unité cible
 */
export function convertWeight(
  weight: AbsoluteWeight,
  targetUnit: "kg" | "lb",
): AbsoluteWeight {
  if (weight.unit === targetUnit) {
    return weight;
  }

  if (targetUnit === "kg") {
    // lb -> kg
    return {
      value: Math.round(weight.value * 0.453592 * 100) / 100,
      unit: "kg",
    };
  }

  // kg -> lb
  return {
    value: Math.round((weight.value / 0.453592) * 100) / 100,
    unit: "lb",
  };
}

/**
 * Filtre les matériaux disponibles d'un item pour une période donnée
 *
 * @param item - L'item dont on veut filtrer les matériaux
 * @param periodId - ID de la période
 * @param materials - Map des matériaux disponibles (id -> Material)
 * @returns Liste des IDs de matériaux disponibles pour cette période
 */
export function getAvailableMaterialsForPeriod(
  item: Item,
  periodId: string,
  materials: Record<string, Material>,
): string[] {
  return item.availableMaterials.filter((materialId) => {
    const material = materials[materialId];
    return material && material.priceMultiplier[periodId] !== undefined;
  });
}

/**
 * Vérifie si un item peut être fabriqué dans une période donnée
 * (vérifie qu'au moins un matériau disponible existe)
 *
 * @param item - L'item à vérifier
 * @param periodId - ID de la période
 * @param materials - Map des matériaux disponibles (id -> Material)
 * @returns true si l'item peut être fabriqué dans cette période
 */
export function canItemBeCraftedInPeriod(
  item: Item,
  periodId: string,
  materials: Record<string, Material>,
): boolean {
  const availableMaterials = getAvailableMaterialsForPeriod(
    item,
    periodId,
    materials,
  );
  return availableMaterials.length > 0;
}

/**
 * Vérifie si un matériau spécifique est disponible pour un item dans une période
 *
 * @param item - L'item
 * @param materialId - ID du matériau
 * @param periodId - ID de la période
 * @param materials - Map des matériaux disponibles (id -> Material)
 * @returns true si le matériau est disponible
 */
export function isItemMaterialAvailableInPeriod(
  item: Item,
  materialId: string,
  periodId: string,
  materials: Record<string, Material>,
): boolean {
  // Vérifier que le matériau est dans la liste des matériaux disponibles de l'item
  if (!item.availableMaterials.includes(materialId)) {
    return false;
  }

  // Vérifier que le matériau est disponible dans la période
  const material = materials[materialId];
  return material ? material.priceMultiplier[periodId] !== undefined : false;
}
