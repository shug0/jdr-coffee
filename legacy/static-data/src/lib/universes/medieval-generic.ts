import type { Currency } from "../currencies/currencies.types";
import type { Universe } from "./universes.types";

/**
 * Univers Médiéval Générique
 */
export const MEDIEVAL_GENERIC: Universe = {
  id: "medieval-generic",
  name: "Médiéval Générique",
  period: "medieval",
  historicalEquivalent: "Moyen-Âge européen historique",
  genres: ["historical", "realistic"],
  type: "historical",
  description:
    "Système monétaire médiéval historique français (denier-sou-livre)",
  tags: ["medieval", "historical", "realistic", "european", "france"],
  restrictions: {
    // Univers historique réaliste - pas de magie ni de technologie moderne
    forbiddenCategories: ["magic-item", "technology"],
    forbiddenProperties: [
      "enchanted",
      "cursed",
      "blessed",
      "sentient",
      "magical-focus",
      "electronic",
      "automated",
      "powered",
      "computerized",
    ],
  },
};

/**
 * Devises médiévales génériques
 * Système médiéval historique français : 1 livre = 20 sous = 240 deniers
 */
export const MEDIEVAL_CURRENCIES = {
  DENIER: {
    id: "medieval-denier",
    name: "Denier",
    type: "coin",
    baseValue: 1, // Unité de base
  },
  SOU: {
    id: "medieval-sou",
    name: "Sou",
    type: "coin",
    baseValue: 12, // 1 sou = 12 deniers
  },
  LIVRE: {
    id: "medieval-livre",
    name: "Livre",
    symbol: "₤",
    type: "coin",
    baseValue: 240, // 1 livre = 240 deniers = 20 sous
  },
} as const satisfies Record<string, Currency>;
