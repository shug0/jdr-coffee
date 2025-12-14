import { describe, expect, it } from "vitest";
import { BRONZE, IRON, STEEL, WOOD } from "./materials.constants";
import {
  getAvailablePeriods,
  getMaterialById,
  getMaterialPrice,
  getMaterialsByCategory,
  getMaterialsByDensityRange,
  getMaterialsByMinSharpness,
  getMaterialsByProperty,
  getMaterialsForPeriod,
  getMaterialsSortedByCost,
  getMaterialsSortedByRarity,
  isMaterialAvailableInPeriod,
} from "./materials.helpers";

describe("Material Helpers", () => {
  describe("getAvailablePeriods", () => {
    it("should extract periods from priceMultiplier keys for IRON (iron-age+)", () => {
      const periods = getAvailablePeriods(IRON);

      expect(periods).toContain("iron-age");
      expect(periods).toContain("medieval");
      expect(periods).toContain("modern");
      expect(periods).not.toContain("bronze-age"); // Fer pas dispo bronze-age!
    });

    it("should extract periods from priceMultiplier keys for BRONZE (bronze-age+)", () => {
      const periods = getAvailablePeriods(BRONZE);

      expect(periods).toContain("bronze-age");
      expect(periods).toContain("iron-age");
      expect(periods).toContain("medieval");
    });

    it("should return all periods for materials available everywhere (WOOD)", () => {
      const periods = getAvailablePeriods(WOOD);

      expect(periods.length).toBeGreaterThan(0);
      expect(periods).toContain("bronze-age");
      expect(periods).toContain("medieval");
      expect(periods).toContain("future-near");
    });
  });

  describe("getMaterialsForPeriod", () => {
    it("should filter materials available in medieval period", () => {
      const medievalMaterials = getMaterialsForPeriod("medieval");

      expect(medievalMaterials.length).toBeGreaterThan(0);

      // Fer dispo depuis iron-age
      expect(medievalMaterials.some((m) => m.id === "iron")).toBe(true);

      // Acier dispo médiéval
      expect(medievalMaterials.some((m) => m.id === "steel")).toBe(true);

      // Bronze dispo depuis bronze-age
      expect(medievalMaterials.some((m) => m.id === "bronze")).toBe(true);
    });

    it("should filter materials available in bronze-age (no iron!)", () => {
      const bronzeAgeMaterials = getMaterialsForPeriod("bronze-age");

      expect(bronzeAgeMaterials.length).toBeGreaterThan(0);

      // Bronze disponible
      expect(bronzeAgeMaterials.some((m) => m.id === "bronze")).toBe(true);

      // Cuivre disponible
      expect(bronzeAgeMaterials.some((m) => m.id === "copper")).toBe(true);

      // Fer PAS disponible (commence iron-age)
      expect(bronzeAgeMaterials.some((m) => m.id === "iron")).toBe(false);

      // Acier PAS disponible
      expect(bronzeAgeMaterials.some((m) => m.id === "steel")).toBe(false);
    });

    it("should return empty array for invalid period", () => {
      const materials = getMaterialsForPeriod("invalid-period");
      expect(materials).toEqual([]);
    });
  });

  describe("isMaterialAvailableInPeriod", () => {
    it("should return true for IRON in medieval period", () => {
      const result = isMaterialAvailableInPeriod("iron", "medieval");
      expect(result).toBe(true);
    });

    it("should return false for IRON in bronze-age", () => {
      const result = isMaterialAvailableInPeriod("iron", "bronze-age");
      expect(result).toBe(false);
    });

    it("should return true for BRONZE in bronze-age", () => {
      const result = isMaterialAvailableInPeriod("bronze", "bronze-age");
      expect(result).toBe(true);
    });

    it("should return false for invalid material ID", () => {
      const result = isMaterialAvailableInPeriod(
        "invalid-material",
        "medieval",
      );
      expect(result).toBe(false);
    });

    it("should return false for valid material but invalid period", () => {
      const result = isMaterialAvailableInPeriod("iron", "invalid-period");
      expect(result).toBe(false);
    });
  });

  describe("getMaterialPrice", () => {
    it("should calculate price for IRON in medieval (baseCost × 4.0)", () => {
      const price = getMaterialPrice(IRON, "medieval", 100);

      // IRON.priceMultiplier['medieval'] = 4.0
      expect(price).toBe(400);
    });

    it("should use default baseCost of 100", () => {
      const price = getMaterialPrice(IRON, "medieval");
      expect(price).toBe(400); // 100 × 4.0
    });

    it("should calculate price for STEEL in medieval (baseCost × 8.5)", () => {
      const price = getMaterialPrice(STEEL, "medieval", 100);

      // STEEL.priceMultiplier['medieval'] = 8.5
      expect(price).toBe(850);
    });

    it("should throw error for IRON in bronze-age (unavailable)", () => {
      expect(() => getMaterialPrice(IRON, "bronze-age")).toThrow(
        'Fer is not available in period "bronze-age"',
      );
    });

    it("should include available periods in error message", () => {
      try {
        getMaterialPrice(IRON, "bronze-age");
      } catch (error) {
        expect((error as Error).message).toContain("Available periods:");
        expect((error as Error).message).toContain("iron-age");
      }
    });
  });

  describe("getMaterialById", () => {
    it("should find material by id (iron)", () => {
      const material = getMaterialById("iron");

      expect(material).toBeDefined();
      expect(material?.id).toBe("iron");
      expect(material?.name).toBe("Fer");
    });

    it("should find material by id (steel)", () => {
      const material = getMaterialById("steel");

      expect(material).toBeDefined();
      expect(material?.id).toBe("steel");
      expect(material?.name).toBe("Acier");
    });

    it("should return undefined for invalid id", () => {
      const material = getMaterialById("invalid-material-id");
      expect(material).toBeUndefined();
    });

    it("should handle case-sensitive IDs", () => {
      const material = getMaterialById("IRON"); // Uppercase
      expect(material).toBeUndefined(); // IDs sont lowercase
    });
  });

  describe("getMaterialsByCategory", () => {
    it("should filter metals", () => {
      const metals = getMaterialsByCategory("metal");

      expect(metals.length).toBeGreaterThan(0);
      expect(metals.some((m) => m.id === "iron")).toBe(true);
      expect(metals.some((m) => m.id === "steel")).toBe(true);
      expect(metals.some((m) => m.id === "bronze")).toBe(true);

      // Pas de non-métaux
      expect(metals.some((m) => m.id === "wood")).toBe(false);
    });

    it("should filter organics", () => {
      const organics = getMaterialsByCategory("organic");

      expect(organics.length).toBeGreaterThan(0);
      expect(organics.some((m) => m.id === "wood")).toBe(true);
      expect(organics.some((m) => m.id === "leather")).toBe(true);

      // Pas de métaux
      expect(organics.some((m) => m.id === "iron")).toBe(false);
    });

    it("should filter minerals", () => {
      const minerals = getMaterialsByCategory("mineral");

      expect(minerals.length).toBeGreaterThan(0);
      expect(minerals.some((m) => m.id === "obsidian")).toBe(true);
      expect(minerals.some((m) => m.id === "diamond")).toBe(true);
    });

    it("should filter composites", () => {
      const composites = getMaterialsByCategory("composite");

      expect(composites.length).toBeGreaterThan(0);
      expect(composites.some((m) => m.id === "carbon_fiber")).toBe(true);
    });
  });

  describe("getMaterialsByProperty", () => {
    it('should filter materials with "magnetic" property', () => {
      const magnetic = getMaterialsByProperty("magnetic");

      expect(magnetic.length).toBeGreaterThan(0);
      expect(magnetic.some((m) => m.id === "iron")).toBe(true);
      expect(magnetic.some((m) => m.id === "steel")).toBe(true);

      // Pas de non-magnétiques
      expect(magnetic.some((m) => m.id === "bronze")).toBe(false);
    });

    it('should filter materials with "precious" property', () => {
      const precious = getMaterialsByProperty("precious");

      expect(precious.length).toBeGreaterThan(0);
      expect(precious.some((m) => m.id === "gold")).toBe(true);
      expect(precious.some((m) => m.id === "silver")).toBe(true);

      // Pas de métaux communs
      expect(precious.some((m) => m.id === "iron")).toBe(false);
    });

    it('should filter materials with "light" property', () => {
      const light = getMaterialsByProperty("light");

      expect(light.length).toBeGreaterThan(0);
      expect(light.some((m) => m.id === "wood")).toBe(true);
      expect(light.some((m) => m.id === "aluminum")).toBe(true);
    });
  });

  describe("getMaterialsSortedByCost", () => {
    it("should sort materials by cost ascending", () => {
      const sorted = getMaterialsSortedByCost();

      expect(sorted.length).toBeGreaterThan(0);

      // Vérifier ordre croissant
      for (let i = 1; i < sorted.length; i++) {
        const prevCost = sorted[i - 1].cost ?? 0;
        const currCost = sorted[i].cost ?? 0;
        expect(currCost).toBeGreaterThanOrEqual(prevCost);
      }
    });

    it("should place materials without cost at the beginning (cost=0)", () => {
      const sorted = getMaterialsSortedByCost();

      // Premier élément devrait avoir le coût le plus bas
      const firstCost = sorted[0].cost ?? 0;
      expect(firstCost).toBe(Math.min(...sorted.map((m) => m.cost ?? 0)));
    });
  });

  describe("getMaterialsSortedByRarity", () => {
    it("should sort materials by rarity ascending", () => {
      const sorted = getMaterialsSortedByRarity();

      expect(sorted.length).toBeGreaterThan(0);

      // Vérifier ordre croissant
      for (let i = 1; i < sorted.length; i++) {
        const prevRarity = sorted[i - 1].rarity ?? 0;
        const currRarity = sorted[i].rarity ?? 0;
        expect(currRarity).toBeGreaterThanOrEqual(prevRarity);
      }
    });

    it("should place common materials before rare ones", () => {
      const sorted = getMaterialsSortedByRarity();

      // Matériaux communs (rarity=1) devraient être au début
      const commonMaterials = sorted.filter((m) => (m.rarity ?? 0) === 1);
      expect(commonMaterials.length).toBeGreaterThan(0);

      // Vérifier qu'ils sont bien au début
      const firstCommonIndex = sorted.findIndex((m) => (m.rarity ?? 0) === 1);
      expect(firstCommonIndex).toBe(0);
    });
  });

  describe("getMaterialsByMinSharpness", () => {
    it("should filter materials with sharpness >= 7.0", () => {
      const sharp = getMaterialsByMinSharpness(7.0);

      expect(sharp.length).toBeGreaterThan(0);

      // Tous devraient avoir score >= 7.0
      for (const material of sharp) {
        const score = material.sharpnessScore?.overall ?? 0;
        expect(score).toBeGreaterThanOrEqual(7.0);
      }
    });

    it("should include STEEL (sharpness 7.8)", () => {
      const sharp = getMaterialsByMinSharpness(7.0);
      expect(sharp.some((m) => m.id === "steel")).toBe(true);
    });

    it("should include OBSIDIAN (sharpness 9.2)", () => {
      const verySharp = getMaterialsByMinSharpness(9.0);
      expect(verySharp.some((m) => m.id === "obsidian")).toBe(true);
    });

    it("should exclude materials below threshold", () => {
      const sharp = getMaterialsByMinSharpness(7.0);

      // COPPER a un faible score de tranchant
      expect(sharp.some((m) => m.id === "copper")).toBe(false);
    });

    it("should handle materials without sharpnessScore (treat as 0)", () => {
      const all = getMaterialsByMinSharpness(0);
      expect(all.length).toBeGreaterThan(0);
    });
  });

  describe("getMaterialsByDensityRange", () => {
    it("should filter materials with density between 2.0 and 5.0", () => {
      const midDensity = getMaterialsByDensityRange(2.0, 5.0);

      expect(midDensity.length).toBeGreaterThan(0);

      // Tous devraient être dans la plage
      for (const material of midDensity) {
        expect(material.density).toBeGreaterThanOrEqual(2.0);
        expect(material.density).toBeLessThanOrEqual(5.0);
      }
    });

    it("should include ALUMINUM (density 2.7)", () => {
      const light = getMaterialsByDensityRange(2.0, 3.0);
      expect(light.some((m) => m.id === "aluminum")).toBe(true);
    });

    it("should include IRON (density 7.87) in heavy range", () => {
      const heavy = getMaterialsByDensityRange(7.0, 9.0);
      expect(heavy.some((m) => m.id === "iron")).toBe(true);
      expect(heavy.some((m) => m.id === "bronze")).toBe(true);
    });

    it("should exclude materials outside range", () => {
      const veryLight = getMaterialsByDensityRange(0, 1.0);

      // Fer trop lourd
      expect(veryLight.some((m) => m.id === "iron")).toBe(false);

      // Bois devrait être inclus (density ~0.6)
      expect(veryLight.some((m) => m.id === "wood")).toBe(true);
    });

    it("should handle exact boundaries (inclusive)", () => {
      // IRON a density 7.87
      const exactRange = getMaterialsByDensityRange(7.87, 7.87);
      expect(exactRange.some((m) => m.id === "iron")).toBe(true);
    });
  });
});
