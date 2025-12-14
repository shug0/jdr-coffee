import type { Category } from "./categories.types";

/**
 * Catégories d'items
 */

export const WEAPON: Category = {
  id: "weapon",
  name: "Arme",
  description: "Armes de mêlée et à distance",
  subcategories: ["melee", "ranged", "thrown", "ammunition"],
};

export const ARMOR: Category = {
  id: "armor",
  name: "Armure",
  description: "Protections et armures",
  subcategories: ["light", "medium", "heavy", "shield"],
};

export const TOOL: Category = {
  id: "tool",
  name: "Outil",
  description: "Outils et équipements",
  subcategories: [
    "crafting",
    "exploration",
    "climbing",
    "investigation",
    "survival",
  ],
};

export const CONSUMABLE: Category = {
  id: "consumable",
  name: "Consommable",
  description: "Items consommables",
  subcategories: ["potion", "food", "poison", "scroll"],
};

export const CONTAINER: Category = {
  id: "container",
  name: "Conteneur",
  description: "Sacs, coffres et conteneurs",
  subcategories: ["bag", "chest", "pouch", "backpack"],
};

export const CLOTHING: Category = {
  id: "clothing",
  name: "Vêtement",
  description: "Vêtements et accessoires",
  subcategories: ["outfit", "accessory", "jewelry"],
};

export const MAGIC_ITEM: Category = {
  id: "magic-item",
  name: "Objet magique",
  description: "Items magiques et enchantés",
  subcategories: ["wand", "ring", "amulet", "artifact"],
};

export const TECHNOLOGY: Category = {
  id: "technology",
  name: "Technologie",
  description: "Équipements technologiques",
  subcategories: ["electronics", "computer", "communication", "medical"],
};

export const VEHICLE: Category = {
  id: "vehicle",
  name: "Véhicule",
  description: "Véhicules et montures",
  subcategories: ["mount", "land", "water", "air", "space"],
};

export const MISC: Category = {
  id: "misc",
  name: "Divers",
  description: "Items divers",
  subcategories: ["material", "component", "treasure", "quest-item"],
};

/**
 * Toutes les catégories
 */
export const CATEGORIES = {
  WEAPON,
  ARMOR,
  TOOL,
  CONSUMABLE,
  CONTAINER,
  CLOTHING,
  MAGIC_ITEM,
  TECHNOLOGY,
  VEHICLE,
  MISC,
} as const;
