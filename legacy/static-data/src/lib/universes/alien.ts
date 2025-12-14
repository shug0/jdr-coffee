import type { Currency } from "../currencies/currencies.types";
import type { Universe } from "./universes.types";

/**
 * Univers Alien
 */
export const ALIEN: Universe = {
  id: "alien",
  name: "Alien : Le Jeu de Rôle",
  creator: "Free League Publishing",
  period: "2180",
  historicalEquivalent: "Science-fiction rétro-futuriste (après Alien 3)",
  genres: ["sci-fi", "horror", "space-opera"],
  type: "sci-fi",
  gameSystem: "Year Zero Engine",
  description:
    "Univers de science-fiction horrifique où corporations et xénomorphes menacent les camionneurs de l'espace",
  tags: [
    "sci-fi",
    "horror",
    "space",
    "corporations",
    "xenomorphs",
    "2180",
    "future",
    "retro-futuristic",
    "space-truckers",
    "marines",
    "synthetics",
    "weyland-yutani",
    "frontier",
  ],
  restrictions: {
    // Pas de magie dans cet univers sci-fi
    forbiddenCategories: ["magic-item"],
    forbiddenProperties: [
      "enchanted",
      "cursed",
      "blessed",
      "sentient",
      "magical-focus",
    ],
    // Certains matériaux médiévaux peu appropriés
    forbiddenMaterials: ["bone", "obsidian"],
  },
};

/**
 * Devises d'Alien
 * Système non hiérarchique avec plusieurs monnaies nationales et corporatives
 */
export const ALIEN_CURRENCIES = {
  // Monnaies nationales (électroniques)
  UA_DOLLAR: {
    id: "ua-dollar",
    name: "Dollar des Amériques-Unies",
    symbol: "$",
    type: "electronic",
  },
  E3M_YEN: {
    id: "e3m-yen",
    name: "Yen de l'Empire des Trois Mondes",
    symbol: "¥",
    type: "electronic",
  },
  UPP_YUEN: {
    id: "upp-yuen",
    name: "Yuen de l'Union des Peuples Progressistes",
    symbol: "元",
    type: "electronic",
  },
  // Monnaies corporatistes (cash)
  WY_DOLLAR: {
    id: "wy-dollar",
    name: "Dollar Colonial Weyland-Yutani",
    symbol: "W-Y$",
    type: "corporate",
  },
  SEEG_BILL: {
    id: "seeg-bill",
    name: "Billet Seegson",
    symbol: "S$",
    type: "corporate",
  },
  BINAT_COIN: {
    id: "binat-coin",
    name: "Pièce Binat",
    type: "corporate",
  },
} as const satisfies Record<string, Currency>;
