import type { Genre } from "./genres.types";

/**
 * Genres et saveurs d'univers
 */

export const FANTASY: Genre = {
  id: "fantasy",
  name: "Fantasy",
  description:
    "Univers de fantasy classique avec magie et créatures fantastiques",
};

export const LOW_FANTASY: Genre = {
  id: "low-fantasy",
  name: "Low Fantasy",
  description: "Fantasy avec peu de magie, approche plus réaliste",
};

export const HIGH_FANTASY: Genre = {
  id: "high-fantasy",
  name: "High Fantasy",
  description: "Fantasy épique avec magie omniprésente",
};

export const HORROR: Genre = {
  id: "horror",
  name: "Horreur",
  description: "Univers d'horreur et d'épouvante",
};

export const COSMIC_HORROR: Genre = {
  id: "cosmic-horror",
  name: "Horreur cosmique",
  description: "Horreur lovecraftienne face à l'incompréhensible",
};

export const SCI_FI: Genre = {
  id: "sci-fi",
  name: "Science-fiction",
  description: "Univers de science-fiction",
};

export const SPACE_OPERA: Genre = {
  id: "space-opera",
  name: "Space Opera",
  description: "Science-fiction spatiale épique",
};

export const CYBERPUNK: Genre = {
  id: "cyberpunk",
  name: "Cyberpunk",
  description: "Science-fiction dystopique avec technologie avancée",
};

export const STEAMPUNK: Genre = {
  id: "steampunk",
  name: "Steampunk",
  description: "Technologie à vapeur dans un contexte rétro-futuriste",
};

export const HISTORICAL: Genre = {
  id: "historical",
  name: "Historique",
  description: "Univers basé sur des périodes historiques réelles",
};

export const REALISTIC: Genre = {
  id: "realistic",
  name: "Réaliste",
  description: "Approche réaliste sans éléments surnaturels",
};

export const HUMOR: Genre = {
  id: "humor",
  name: "Humour",
  description: "Univers léger et humoristique",
};

export const INVESTIGATION: Genre = {
  id: "investigation",
  name: "Investigation",
  description: "Axé sur l'enquête et la résolution d'énigmes",
};

export const WAR: Genre = {
  id: "war",
  name: "Guerre",
  description: "Conflits militaires et stratégiques",
};

export const NARRATIVE: Genre = {
  id: "narrative",
  name: "Narratif",
  description: "Accent sur la narration et le roleplay",
};

/**
 * Tous les genres
 */
export const GENRES = {
  FANTASY,
  LOW_FANTASY,
  HIGH_FANTASY,
  HORROR,
  COSMIC_HORROR,
  SCI_FI,
  SPACE_OPERA,
  CYBERPUNK,
  STEAMPUNK,
  HISTORICAL,
  REALISTIC,
  HUMOR,
  INVESTIGATION,
  WAR,
  NARRATIVE,
} as const;
