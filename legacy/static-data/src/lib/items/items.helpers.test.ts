import { describe, expect, it } from "vitest";
import type { ItemProperty } from "../item-properties/item-properties.types";
import type { Material } from "../materials/materials.types";
import type { Rarity } from "../rarities/rarities.types";
import type { Universe } from "../universes/universes.types";
import {
  calculateItemPrice,
  calculateItemWeight,
  calculateTotalWeight,
  canItemBeCraftedInPeriod,
  convertWeight,
  filterItemsByPeriod,
  filterItemsByUniverse,
  getAvailableMaterialsForPeriod,
  isItemAvailable,
  isItemMaterialAvailableInPeriod,
} from "./items.helpers";
import type { Item } from "./items.types";

// ====== TEST DATA ======

// Materials
const IRON: Material = {
  id: "iron",
  name: "Fer",
  category: "metal",
  density: 7.87,
  hardness: { type: "mohs", value: 4 },
  mechanical: { tensileStrength: 250 },
  priceMultiplier: {
    "iron-age": 4.0,
    medieval: 4.0,
    modern: 1.2,
  },
  weightFactor: 0.95,
  durabilityFactor: 0.7,
  effectivenessFactor: 0.85,
  specialProperties: ["magnetic"],
  cost: 120,
  rarity: 1,
};

const STEEL: Material = {
  id: "steel",
  name: "Acier",
  category: "metal",
  density: 7.85,
  hardness: { type: "hrc", value: 52 },
  mechanical: { tensileStrength: 500 },
  priceMultiplier: {
    medieval: 8.5,
    modern: 1.8,
  },
  weightFactor: 0.98,
  durabilityFactor: 0.8,
  effectivenessFactor: 0.9,
  specialProperties: ["magnetic"],
  cost: 180,
  rarity: 2,
};

const WOOD: Material = {
  id: "wood",
  name: "Bois",
  category: "organic",
  density: 0.6,
  hardness: { type: "mohs", value: 2 },
  mechanical: { tensileStrength: 40 },
  priceMultiplier: {
    "bronze-age": 0.5,
    "iron-age": 0.5,
    medieval: 0.4,
    modern: 0.15,
  },
  weightFactor: 0.3,
  durabilityFactor: 0.4,
  effectivenessFactor: 0.7,
  specialProperties: ["light", "abundant"],
  cost: 10,
  rarity: 0,
};

const MATERIALS: Record<string, Material> = {
  iron: IRON,
  steel: STEEL,
  wood: WOOD,
};

// Universes
const DND_UNIVERSE: Universe = {
  id: "dnd",
  name: "Donjons & Dragons",
  creator: "Wizards of the Coast",
  period: "timeless",
  historicalEquivalent: "Médiéval-fantastique",
  genres: ["fantasy"],
  type: "fantasy",
  gameSystem: "D&D 5e",
  description: "Univers fantasy",
  tags: ["fantasy", "medieval"],
  restrictions: {
    forbiddenProperties: ["electronic", "powered"],
  },
};

const CYBERPUNK_UNIVERSE: Universe = {
  id: "cyberpunk",
  name: "Cyberpunk",
  creator: "R. Talsorian Games",
  period: "future-near",
  historicalEquivalent: "Futuriste",
  genres: ["sci-fi"],
  type: "sci-fi",
  gameSystem: "Cyberpunk 2020",
  description: "Univers cyberpunk",
  tags: ["sci-fi", "future"],
  restrictions: {
    forbiddenCategories: ["simple-weapons"],
    forbiddenMaterials: ["wood"],
  },
};

// Rarities
const COMMON_RARITY: Rarity = {
  id: "common",
  name: "Commun",
  baseMultiplier: 1.0,
  description: "Objet commun",
  color: "gray",
};

const RARE_RARITY: Rarity = {
  id: "rare",
  name: "Rare",
  baseMultiplier: 5.0,
  description: "Objet rare",
  color: "blue",
};

// Properties
const MASTERWORK_PROPERTY: ItemProperty = {
  id: "masterwork",
  name: "Chef-d'œuvre",
  priceMultiplier: 2.0,
  description: "Objet de qualité supérieure",
  tags: ["quality"],
};

const ENCHANTED_PROPERTY: ItemProperty = {
  id: "enchanted",
  name: "Enchanté",
  priceMultiplier: 10.0,
  description: "Objet magique",
  tags: ["magic"],
};

const PROPERTIES: Record<string, ItemProperty> = {
  masterwork: MASTERWORK_PROPERTY,
  enchanted: ENCHANTED_PROPERTY,
};

// Items
const LONGSWORD: Item = {
  id: "longsword",
  name: "Épée longue",
  category: "martial-weapons",
  basePrice: { value: 150, unit: "copper" },
  baseVolume: 0.5,
  weight: { absolute: { value: 1.5, unit: "kg" } },
  availableMaterials: ["iron", "steel"],
  properties: [],
  tags: ["medieval", "weapon"],
};

const BOW: Item = {
  id: "bow",
  name: "Arc",
  category: "simple-weapons",
  basePrice: { value: 50, unit: "copper" },
  baseVolume: 0.3,
  weight: { absolute: { value: 0.9, unit: "kg" } },
  availableMaterials: ["wood"],
  properties: [],
  tags: ["medieval", "weapon"],
};

const LASER_GUN: Item = {
  id: "laser-gun",
  name: "Pistolet laser",
  category: "firearms",
  basePrice: { value: 5000, unit: "copper" },
  baseVolume: 0.2,
  weight: { absolute: { value: 1.2, unit: "kg" } },
  availableMaterials: ["steel"],
  properties: ["electronic", "powered"],
  tags: ["future", "weapon"],
  availability: {
    periods: ["future-near", "future-far"],
  },
};

// ====== TESTS ======

describe("Item Helpers", () => {
  describe("isItemAvailable", () => {
    it("should return true when no restrictions", () => {
      const universeNoRestrictions: Universe = {
        ...DND_UNIVERSE,
        restrictions: undefined,
      };

      const result = isItemAvailable(
        LONGSWORD,
        universeNoRestrictions,
        MATERIALS,
      );
      expect(result).toBe(true);
    });

    it("should return false when category is forbidden", () => {
      const result = isItemAvailable(BOW, CYBERPUNK_UNIVERSE, MATERIALS);
      expect(result).toBe(false); // simple-weapons forbidden in cyberpunk
    });

    it("should return false when all materials are forbidden", () => {
      const result = isItemAvailable(BOW, CYBERPUNK_UNIVERSE, MATERIALS);
      expect(result).toBe(false); // wood is forbidden
    });

    it("should return true when some materials are available", () => {
      const result = isItemAvailable(LONGSWORD, CYBERPUNK_UNIVERSE, MATERIALS);
      expect(result).toBe(true); // steel and iron not forbidden
    });

    it("should return false when property is forbidden", () => {
      const result = isItemAvailable(LASER_GUN, DND_UNIVERSE, MATERIALS);
      expect(result).toBe(false); // electronic and powered forbidden
    });

    it("should check explicit universe availability", () => {
      const itemWithAvailability: Item = {
        ...LONGSWORD,
        availability: {
          universes: ["dnd"],
        },
      };

      const resultDND = isItemAvailable(
        itemWithAvailability,
        DND_UNIVERSE,
        MATERIALS,
      );
      expect(resultDND).toBe(true);

      const resultCyberpunk = isItemAvailable(
        itemWithAvailability,
        CYBERPUNK_UNIVERSE,
        MATERIALS,
      );
      expect(resultCyberpunk).toBe(false);
    });
  });

  describe("calculateItemPrice", () => {
    it("should calculate basic price (basePrice × rarity × material)", () => {
      const price = calculateItemPrice(
        LONGSWORD,
        "iron",
        "medieval",
        COMMON_RARITY,
        MATERIALS,
        PROPERTIES,
      );

      // 150 × 1.0 (rarity) × 4.0 (iron medieval) = 600
      expect(price).toBe(600);
    });

    it("should apply rarity multiplier", () => {
      const price = calculateItemPrice(
        LONGSWORD,
        "iron",
        "medieval",
        RARE_RARITY,
        MATERIALS,
        PROPERTIES,
      );

      // 150 × 5.0 (rare) × 4.0 (iron medieval) = 3000
      expect(price).toBe(3000);
    });

    it("should apply property multipliers", () => {
      const itemWithProperty: Item = {
        ...LONGSWORD,
        properties: ["masterwork"],
      };

      const price = calculateItemPrice(
        itemWithProperty,
        "iron",
        "medieval",
        COMMON_RARITY,
        MATERIALS,
        PROPERTIES,
      );

      // 150 × 1.0 × 4.0 × 2.0 (masterwork) = 1200
      expect(price).toBe(1200);
    });

    it("should apply multiple property multipliers", () => {
      const itemWithProperties: Item = {
        ...LONGSWORD,
        properties: ["masterwork", "enchanted"],
      };

      const price = calculateItemPrice(
        itemWithProperties,
        "iron",
        "medieval",
        COMMON_RARITY,
        MATERIALS,
        PROPERTIES,
      );

      // 150 × 1.0 × 4.0 × 2.0 (masterwork) × 10.0 (enchanted) = 12000
      expect(price).toBe(12000);
    });

    it("should throw error for unavailable material in period", () => {
      expect(() =>
        calculateItemPrice(
          LONGSWORD,
          "steel",
          "bronze-age",
          COMMON_RARITY,
          MATERIALS,
          PROPERTIES,
        ),
      ).toThrow("Acier is not available in period bronze-age");
    });

    it("should apply universe material multiplier", () => {
      const universeWithMultiplier: Universe = {
        ...DND_UNIVERSE,
        restrictions: {
          ...DND_UNIVERSE.restrictions,
          materialMultipliers: {
            iron: 0.5, // Iron half price in this universe
          },
        },
      };

      const price = calculateItemPrice(
        LONGSWORD,
        "iron",
        "medieval",
        COMMON_RARITY,
        MATERIALS,
        PROPERTIES,
        universeWithMultiplier,
      );

      // 150 × 1.0 × (4.0 × 0.5) = 300
      expect(price).toBe(300);
    });

    it("should apply universe property multiplier", () => {
      const itemWithProperty: Item = {
        ...LONGSWORD,
        properties: ["masterwork"],
      };

      const universeWithMultiplier: Universe = {
        ...DND_UNIVERSE,
        restrictions: {
          ...DND_UNIVERSE.restrictions,
          propertyMultipliers: {
            masterwork: 3.0, // Override property multiplier
          },
        },
      };

      const price = calculateItemPrice(
        itemWithProperty,
        "iron",
        "medieval",
        COMMON_RARITY,
        MATERIALS,
        PROPERTIES,
        universeWithMultiplier,
      );

      // 150 × 1.0 × 4.0 × 3.0 (universe override) = 1800
      expect(price).toBe(1800);
    });
  });

  describe("calculateItemWeight", () => {
    it("should calculate weight = volume × density", () => {
      const weight = calculateItemWeight(LONGSWORD, "iron", MATERIALS);

      // 0.5 dm³ × 7.87 kg/dm³ = 3.935 kg → 3.94 kg (rounded)
      expect(weight).toBeCloseTo(3.94, 2);
    });

    it("should work with different materials", () => {
      const weight = calculateItemWeight(BOW, "wood", MATERIALS);

      // 0.3 dm³ × 0.6 kg/dm³ = 0.18 kg
      expect(weight).toBe(0.18);
    });

    it("should return 0 for invalid material", () => {
      const weight = calculateItemWeight(
        LONGSWORD,
        "invalid-material",
        MATERIALS,
      );
      expect(weight).toBe(0);
    });

    it("should round to 2 decimals", () => {
      const weight = calculateItemWeight(LONGSWORD, "steel", MATERIALS);

      // 0.5 × 7.85 = 3.925 → 3.93
      expect(weight).toBe(3.93);
    });
  });

  describe("filterItemsByUniverse", () => {
    it("should filter items by universe restrictions", () => {
      const items = [LONGSWORD, BOW, LASER_GUN];

      const dndItems = filterItemsByUniverse(items, DND_UNIVERSE, MATERIALS);

      expect(dndItems).toHaveLength(2);
      expect(dndItems.some((i) => i.id === "longsword")).toBe(true);
      expect(dndItems.some((i) => i.id === "bow")).toBe(true);
      expect(dndItems.some((i) => i.id === "laser-gun")).toBe(false);
    });

    it("should filter out forbidden categories", () => {
      const items = [LONGSWORD, BOW];

      const cyberpunkItems = filterItemsByUniverse(
        items,
        CYBERPUNK_UNIVERSE,
        MATERIALS,
      );

      expect(cyberpunkItems).toHaveLength(1);
      expect(cyberpunkItems[0].id).toBe("longsword"); // martial weapons OK
    });
  });

  describe("filterItemsByPeriod", () => {
    it("should filter by period in tags", () => {
      const items = [LONGSWORD, BOW, LASER_GUN];

      const medievalItems = filterItemsByPeriod(items, "medieval");

      expect(medievalItems).toHaveLength(2);
      expect(medievalItems.some((i) => i.id === "longsword")).toBe(true);
      expect(medievalItems.some((i) => i.id === "bow")).toBe(true);
    });

    it("should use explicit availability.periods if present", () => {
      const items = [LONGSWORD, BOW, LASER_GUN];

      const futureItems = filterItemsByPeriod(items, "future-near");

      expect(futureItems).toHaveLength(1);
      expect(futureItems[0].id).toBe("laser-gun");
    });

    it("should return empty array if no items match", () => {
      const items = [LONGSWORD, BOW];

      const ancientItems = filterItemsByPeriod(items, "stone-age");

      expect(ancientItems).toEqual([]);
    });
  });

  describe("calculateTotalWeight", () => {
    it("should return zero for empty array", () => {
      const total = calculateTotalWeight([]);

      expect(total.absolute?.value).toBe(0);
      expect(total.absolute?.unit).toBe("kg");
    });

    it("should sum absolute weights in kg", () => {
      const items = [
        { ...LONGSWORD, weight: { absolute: { value: 1.5, unit: "kg" } } },
        { ...BOW, weight: { absolute: { value: 0.9, unit: "kg" } } },
      ];

      const total = calculateTotalWeight(items as Item[]);

      expect(total.absolute?.value).toBe(2.4);
      expect(total.absolute?.unit).toBe("kg");
    });

    it("should convert lb to kg when summing", () => {
      const items = [
        { ...LONGSWORD, weight: { absolute: { value: 1.5, unit: "kg" } } },
        { ...BOW, weight: { absolute: { value: 2, unit: "lb" } } },
      ];

      const total = calculateTotalWeight(items as Item[]);

      // 1.5 kg + 2 lb (0.907 kg) = 2.41 kg
      expect(total.absolute?.value).toBeCloseTo(2.41, 2);
    });

    it("should sum encumbrance slots", () => {
      const items = [
        {
          ...LONGSWORD,
          weight: { encumbrance: { level: "normal", slots: 2 } },
        },
        { ...BOW, weight: { encumbrance: { level: "light", slots: 1 } } },
      ];

      const total = calculateTotalWeight(items as Item[]);

      expect(total.encumbrance?.slots).toBe(3);
      expect(total.encumbrance?.level).toBe("light");
    });

    it("should determine encumbrance level from slots (heavy)", () => {
      const items = [
        {
          ...LONGSWORD,
          weight: { encumbrance: { level: "normal", slots: 6 } },
        },
        { ...BOW, weight: { encumbrance: { level: "normal", slots: 6 } } },
      ];

      const total = calculateTotalWeight(items as Item[]);

      expect(total.encumbrance?.slots).toBe(12);
      expect(total.encumbrance?.level).toBe("heavy"); // 10-15 slots
    });
  });

  describe("convertWeight", () => {
    it("should return same weight if already in target unit", () => {
      const weight = { value: 5, unit: "kg" as const };

      const converted = convertWeight(weight, "kg");

      expect(converted).toEqual(weight);
    });

    it("should convert lb to kg", () => {
      const weight = { value: 10, unit: "lb" as const };

      const converted = convertWeight(weight, "kg");

      // 10 lb = 4.54 kg
      expect(converted.value).toBeCloseTo(4.54, 2);
      expect(converted.unit).toBe("kg");
    });

    it("should convert kg to lb", () => {
      const weight = { value: 5, unit: "kg" as const };

      const converted = convertWeight(weight, "lb");

      // 5 kg = 11.02 lb
      expect(converted.value).toBeCloseTo(11.02, 2);
      expect(converted.unit).toBe("lb");
    });

    it("should round to 2 decimals", () => {
      const weight = { value: Math.PI, unit: "kg" as const };

      const converted = convertWeight(weight, "lb");

      expect(converted.value).toBe(6.93); // Rounded
    });
  });

  describe("getAvailableMaterialsForPeriod", () => {
    it("should return materials available in period", () => {
      const materials = getAvailableMaterialsForPeriod(
        LONGSWORD,
        "medieval",
        MATERIALS,
      );

      expect(materials).toContain("iron");
      expect(materials).toContain("steel");
    });

    it("should exclude materials unavailable in period", () => {
      const materials = getAvailableMaterialsForPeriod(
        LONGSWORD,
        "bronze-age",
        MATERIALS,
      );

      expect(materials).not.toContain("steel"); // Steel not available in bronze-age
    });

    it("should return empty array if no materials available", () => {
      const materials = getAvailableMaterialsForPeriod(
        LONGSWORD,
        "stone-age",
        MATERIALS,
      );

      expect(materials).toEqual([]);
    });

    it("should work with single material items", () => {
      const materials = getAvailableMaterialsForPeriod(
        BOW,
        "medieval",
        MATERIALS,
      );

      expect(materials).toEqual(["wood"]);
    });
  });

  describe("canItemBeCraftedInPeriod", () => {
    it("should return true if at least one material is available", () => {
      const canCraft = canItemBeCraftedInPeriod(
        LONGSWORD,
        "medieval",
        MATERIALS,
      );
      expect(canCraft).toBe(true);
    });

    it("should return false if no materials are available", () => {
      const canCraft = canItemBeCraftedInPeriod(
        LONGSWORD,
        "stone-age",
        MATERIALS,
      );
      expect(canCraft).toBe(false);
    });

    it("should work with items that lose materials over time", () => {
      const canCraftMedieval = canItemBeCraftedInPeriod(
        LONGSWORD,
        "medieval",
        MATERIALS,
      );
      const canCraftBronze = canItemBeCraftedInPeriod(
        LONGSWORD,
        "bronze-age",
        MATERIALS,
      );

      expect(canCraftMedieval).toBe(true); // Iron + steel
      expect(canCraftBronze).toBe(false); // Neither available
    });
  });

  describe("isItemMaterialAvailableInPeriod", () => {
    it("should return true if material is available", () => {
      const isAvailable = isItemMaterialAvailableInPeriod(
        LONGSWORD,
        "iron",
        "medieval",
        MATERIALS,
      );
      expect(isAvailable).toBe(true);
    });

    it("should return false if material not in item availableMaterials", () => {
      const isAvailable = isItemMaterialAvailableInPeriod(
        LONGSWORD,
        "wood",
        "medieval",
        MATERIALS,
      );
      expect(isAvailable).toBe(false);
    });

    it("should return false if material not available in period", () => {
      const isAvailable = isItemMaterialAvailableInPeriod(
        LONGSWORD,
        "steel",
        "bronze-age",
        MATERIALS,
      );
      expect(isAvailable).toBe(false);
    });

    it("should return false for invalid material ID", () => {
      const isAvailable = isItemMaterialAvailableInPeriod(
        LONGSWORD,
        "invalid-material",
        "medieval",
        MATERIALS,
      );
      expect(isAvailable).toBe(false);
    });

    it("should work across different periods", () => {
      const medievalAvailable = isItemMaterialAvailableInPeriod(
        LONGSWORD,
        "steel",
        "medieval",
        MATERIALS,
      );
      const modernAvailable = isItemMaterialAvailableInPeriod(
        LONGSWORD,
        "steel",
        "modern",
        MATERIALS,
      );

      expect(medievalAvailable).toBe(true);
      expect(modernAvailable).toBe(true);
    });
  });
});
