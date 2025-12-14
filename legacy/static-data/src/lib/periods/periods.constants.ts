import type { Period } from "./periods.types";

/**
 * Périodes temporelles pour catégoriser les univers et items
 */

export const BRONZE_AGE: Period = {
  id: "bronze-age",
  name: "Âge du Bronze",
  description: "Antiquité avant le fer (Bronze, Cuivre, Pierre)",
  timeRange: "-3300 à -1200",
};

export const IRON_AGE: Period = {
  id: "iron-age",
  name: "Âge du Fer",
  description: "Antiquité avec le fer",
  timeRange: "-1200 à 476",
};

export const MEDIEVAL: Period = {
  id: "medieval",
  name: "Médiéval",
  description: "Moyen-Âge européen et équivalents",
  timeRange: "476 à 1492",
};

export const RENAISSANCE: Period = {
  id: "renaissance",
  name: "Renaissance",
  description: "Renaissance et exploration",
  timeRange: "1492 à 1650",
};

export const ENLIGHTENMENT: Period = {
  id: "enlightenment",
  name: "Lumières",
  description: "Siècle des Lumières et révolutions intellectuelles",
  timeRange: "1650 à 1789",
};

export const INDUSTRIAL: Period = {
  id: "industrial",
  name: "Industriel",
  description: "Révolution industrielle (Bessemer 1855, machines à vapeur)",
  timeRange: "1789 à 1920",
};

export const MODERN: Period = {
  id: "modern",
  name: "Moderne",
  description: "XXe siècle (entre-deux-guerres, Cthulhu, espionnage)",
  timeRange: "1920 à 2000",
};

export const CONTEMPORARY: Period = {
  id: "contemporary",
  name: "Contemporain",
  description: "Époque actuelle et récente",
  timeRange: "2000 à aujourd'hui",
};

export const FUTURE_NEAR: Period = {
  id: "future-near",
  name: "Futur proche",
  description:
    "Science-fiction dans un futur proche (cyberpunk, space opera récent)",
  timeRange: "2025 à 2200",
};

export const FUTURE_FAR: Period = {
  id: "future-far",
  name: "Futur lointain",
  description: "Science-fiction dans un futur lointain",
  timeRange: "2200+",
};

export const POST_APOCALYPTIC: Period = {
  id: "post-apocalyptic",
  name: "Post-apocalyptique",
  description: "Après la fin de la civilisation",
  timeRange: "Variable",
};

export const TIMELESS: Period = {
  id: "timeless",
  name: "Intemporel",
  description: "Univers sans période historique définie",
  timeRange: "N/A",
};

/**
 * Toutes les périodes (ordre chronologique)
 */
export const PERIODS = {
  BRONZE_AGE,
  IRON_AGE,
  MEDIEVAL,
  RENAISSANCE,
  ENLIGHTENMENT,
  INDUSTRIAL,
  MODERN,
  CONTEMPORARY,
  FUTURE_NEAR,
  FUTURE_FAR,
  POST_APOCALYPTIC,
  TIMELESS,
} as const;
