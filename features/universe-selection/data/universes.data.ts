export interface UniverseRestrictions {
  forbiddenCategories?: string[];
  forbiddenProperties?: string[];
  forbiddenMaterials?: string[];
  propertyMultipliers?: Record<string, number>;
  materialMultipliers?: Record<string, number>;
}

export interface Universe {
  id: string;
  name: string;
  creator?: string;
  period: string;
  historicalEquivalent?: string;
  genres: string[];
  type:
    | "fantasy"
    | "sci-fi"
    | "horror"
    | "historical"
    | "post-apocalyptic"
    | "other";
  gameSystem?: string;
  description?: string;
  tags: string[];
  restrictions?: UniverseRestrictions;
}

export const UNIVERSES: Record<string, Universe> = {
  "medieval-generic": {
    id: "medieval-generic",
    name: "Medieval Generic",
    creator: "Default System",
    period: "Medieval Era",
    historicalEquivalent: "Medieval Europe 12th-15th Century",
    genres: ["Fantasy", "Historical"],
    type: "fantasy",
    gameSystem: "Generic RPG",
    description:
      "A standard medieval fantasy setting suitable for various adventures",
    tags: ["medieval", "fantasy", "beginner-friendly"],
    restrictions: {
      forbiddenCategories: ["high-tech"],
      forbiddenProperties: ["electricity"],
      propertyMultipliers: {
        "metal-weapon": 1.2,
        "leather-armor": 1.1,
      },
    },
  },
  dnd: {
    id: "dnd",
    name: "Dungeons & Dragons",
    creator: "Gary Gygax & Dave Arneson",
    period: "Fantasy",
    historicalEquivalent: "Mythical Medieval",
    genres: ["High Fantasy", "Adventure"],
    type: "fantasy",
    gameSystem: "D&D 5E",
    description:
      "The classic role-playing game setting with rich lore and diverse adventures",
    tags: ["rpg", "fantasy", "classic"],
    restrictions: {
      forbiddenCategories: ["sci-fi-tech"],
      forbiddenProperties: ["electricity", "gunpowder"],
      propertyMultipliers: {
        "magic-item": 2.0,
        "rare-metal": 1.5,
      },
    },
  },
  // Other universes remain the same as before, just add restrictions and gameSystem
  alien: {
    id: "alien",
    name: "Alien RPG",
    creator: "Free League Publishing",
    period: "Sci-Fi",
    historicalEquivalent: "Near Future Space",
    genres: ["Science Fiction", "Horror"],
    type: "sci-fi",
    gameSystem: "Alien RPG",
    description:
      "Space exploration and survival in a dangerous cosmic environment",
    tags: ["sci-fi", "horror", "space"],
    restrictions: {
      forbiddenCategories: ["medieval-weapons"],
      forbiddenProperties: ["magic"],
      propertyMultipliers: {
        "advanced-tech": 1.5,
        "energy-weapon": 2.0,
      },
    },
  },
  // Similar updates for other universes...
  cthulhu: {
    id: "cthulhu",
    name: "Call of Cthulhu",
    creator: "Chaosium Inc.",
    period: "Early 20th Century",
    historicalEquivalent: "1920s America",
    genres: ["Horror", "Cosmic Horror"],
    type: "horror",
    gameSystem: "Call of Cthulhu",
    description: "Investigate eldritch horrors and cosmic mysteries",
    tags: ["horror", "lovecraft", "investigation"],
    restrictions: {
      forbiddenProperties: ["supernatural-power"],
      forbiddenMaterials: ["magical-artifact"],
      propertyMultipliers: {
        "investigation-tool": 1.3,
        "rare-book": 2.0,
      },
    },
  },
  // Other universes would follow the same pattern
};

export const getAllUniverses = (): Universe[] => Object.values(UNIVERSES);
export const getUniverseById = (id: string): Universe | undefined =>
  UNIVERSES[id];
export const getDefaultUniverse = (): Universe => UNIVERSES["medieval-generic"];
