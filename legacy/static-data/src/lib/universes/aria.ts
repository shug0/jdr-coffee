import type { Currency } from "../currencies/currencies.types";
import type { Universe } from "./universes.types";

/**
 * Univers Aria
 */
export const ARIA: Universe = {
  id: "aria",
  name: "Aria",
  creator: "FibreTigre",
  period: "medieval",
  historicalEquivalent: "Moyen-Âge européen avec influences multiculturelles",
  genres: ["low-fantasy", "medieval"],
  type: "fantasy",
  gameSystem: "Custom (Elder-Craft)",
  description:
    "Univers médiéval low-fantasy divisé en royaumes représentant différents archétypes culturels",
  tags: [
    "medieval",
    "low-fantasy",
    "multi-kingdoms",
    "pirates",
    "sultanate",
    "scientific-city",
    "realistic-magic",
    "medieval-europe",
    "cultural-diversity",
  ],
  restrictions: {
    // Pas de technologie moderne ou futuriste
    forbiddenCategories: ["technology"],
    forbiddenProperties: ["electronic", "automated", "powered", "computerized"],
    // Magie rare et coûteuse (low-fantasy)
    propertyMultipliers: {
      enchanted: 5, // x5 au lieu de x3
      "magical-focus": 8, // x8 au lieu de x4
      sentient: 20, // x20 au lieu de x10
    },
  },
};

/**
 * Devises d'Aria
 * Système monétaire : 1:10 à chaque niveau
 * 1 couronne = 10 orbes = 100 sceptres = 1000 rois
 */
export const ARIA_CURRENCIES = {
  ROI: {
    id: "aria-roi",
    name: "Roi",
    type: "coin",
    baseValue: 1, // Unité de base (pièce de fer)
  },
  SCEPTRE: {
    id: "aria-sceptre",
    name: "Sceptre",
    type: "coin",
    baseValue: 10, // 1 sceptre = 10 rois (pièce de cuivre)
  },
  ORBE: {
    id: "aria-orbe",
    name: "Orbe",
    type: "coin",
    baseValue: 100, // 1 orbe = 100 rois (pièce d'argent)
  },
  COURONNE: {
    id: "aria-couronne",
    name: "Couronne",
    type: "coin",
    baseValue: 1000, // 1 couronne = 1000 rois (pièce d'or)
  },
} as const satisfies Record<string, Currency>;
