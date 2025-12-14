import type { Item } from "../../lib/items/items.types";

/**
 * Armes de référence - Fantasy médiéval
 *
 * IMPORTANT: Tous les prix sont en CUIVRE (pc) - unité de base
 * Conversion: 1 po = 10 pa = 100 pc
 */

export const LONGSWORD: Item = {
  id: "longsword",
  name: "Épée longue",
  description:
    "Épée à une main classique, lame droite de 90cm. Arme polyvalente du guerrier médiéval.",

  category: "weapon",
  subcategory: "melee",

  availableMaterials: [
    "iron",
    "steel",
    "bronze",
    "wood",
    "bone",
    "stone",
    "obsidian",
  ],
  baseVolume: 0.192, // dm³

  rarity: "mundane",
  properties: ["versatile"],

  weight: {
    absolute: { value: 0, unit: "kg" },
    encumbrance: { level: "normal", slots: 2 },
  },
  equipmentSlot: ["main-hand", "both-hands"],

  basePrice: { value: 1500 },
  tags: ["medieval", "melee", "blade", "common"],
};

/**
 * Toutes les armes de référence
 */
export const WEAPONS = {
  LONGSWORD,
} as const;
