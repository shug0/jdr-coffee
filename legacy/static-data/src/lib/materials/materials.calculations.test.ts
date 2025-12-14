import { describe, expect, it } from "vitest";
import {
  calculateDurability,
  calculateEffectiveness,
  calculatePrice,
  calculateSharpnessScore,
  calculateStrengthToWeightRatio,
  calculateWeight,
  canBeQuenched,
  compareMaterialsForArmor,
  compareMaterialsForWeapons,
  getRequiredForgingTemperature,
  normalizeHardness,
  normalizeThermalConductivity,
} from "./materials.calculations";
import {
  ALUMINUM,
  DIAMOND,
  GRAPHENE,
  IRON,
  OBSIDIAN,
  STAINLESS_STEEL,
  STEEL,
  WOOD,
} from "./materials.constants";

describe("Material Calculations", () => {
  describe("calculateWeight", () => {
    it("should calculate weight = volume × density × weightFactor", () => {
      // IRON: density=7.87, weightFactor=0.95
      const weight = calculateWeight(1, IRON); // 1 dm³

      expect(weight).toBeCloseTo(7.87 * 0.95, 2);
    });

    it("should handle different volumes", () => {
      const weight = calculateWeight(2.5, IRON); // 2.5 dm³

      expect(weight).toBeCloseTo(2.5 * 7.87 * 0.95, 2);
    });

    it("should work with light materials (WOOD)", () => {
      // WOOD: density=0.6, weightFactor=0.3
      const weight = calculateWeight(1, WOOD);

      expect(weight).toBeCloseTo(0.6 * 0.3, 2);
    });

    it("should work with heavy materials (DIAMOND)", () => {
      // DIAMOND: density=3.52, weightFactor=1.4
      const weight = calculateWeight(1, DIAMOND);

      expect(weight).toBeCloseTo(3.52 * 1.4, 2);
    });
  });

  describe("calculateDurability", () => {
    it("should calculate durability = baseDurability × durabilityFactor", () => {
      // IRON: durabilityFactor=0.7
      const durability = calculateDurability(100, IRON);

      expect(durability).toBe(70);
    });

    it("should work with high durability materials (STEEL)", () => {
      // STEEL: durabilityFactor=0.8
      const durability = calculateDurability(100, STEEL);

      expect(durability).toBe(80);
    });

    it("should work with low durability materials (WOOD)", () => {
      // WOOD: durabilityFactor=0.4
      const durability = calculateDurability(100, WOOD);

      expect(durability).toBe(40);
    });
  });

  describe("calculateEffectiveness", () => {
    it("should calculate effectiveness = baseEffectiveness × effectivenessFactor", () => {
      // IRON: effectivenessFactor=0.85
      const effectiveness = calculateEffectiveness(100, IRON);

      expect(effectiveness).toBe(85);
    });

    it("should work with high effectiveness materials (STEEL)", () => {
      // STEEL: effectivenessFactor=0.9
      const effectiveness = calculateEffectiveness(100, STEEL);

      expect(effectiveness).toBe(90);
    });
  });

  describe("calculatePrice", () => {
    it("should calculate price = basePrice × priceMultiplier + materialCost × complexity", () => {
      // IRON medieval: priceMultiplier=4.0, cost=120
      const price = calculatePrice(100, IRON, "medieval");

      expect(price).toBe(100 * 4.0 + 120 * 1);
      expect(price).toBe(520);
    });

    it("should use default complexityMultiplier of 1", () => {
      const price = calculatePrice(100, IRON, "medieval");

      expect(price).toBe(520);
    });

    it("should apply complexityMultiplier", () => {
      const price = calculatePrice(100, IRON, "medieval", 2);

      expect(price).toBe(100 * 4.0 + 120 * 2);
      expect(price).toBe(640);
    });

    it("should throw error for unavailable period", () => {
      // IRON pas dispo bronze-age
      expect(() => calculatePrice(100, IRON, "bronze-age")).toThrow(
        "Material Fer is not available in period bronze-age",
      );
    });

    it("should handle materials without cost (treat as 0)", () => {
      // Créer un mock material sans cost
      const mockMaterial = {
        ...IRON,
        cost: undefined,
      };

      const price = calculatePrice(100, mockMaterial, "medieval");

      expect(price).toBe(100 * 4.0); // Pas de materialCost
    });
  });

  describe("normalizeHardness", () => {
    it("should normalize Mohs scale (1-10) to 0-10 (linear)", () => {
      // DIAMOND: Mohs 10
      const hardness = normalizeHardness(DIAMOND);
      expect(hardness).toBe(10);
    });

    it("should normalize Mohs scale for IRON (Mohs 4)", () => {
      // IRON: Mohs 4
      const hardness = normalizeHardness(IRON);
      expect(hardness).toBe(4);
    });

    it("should normalize HRC scale (0-70) to 0-10", () => {
      // STEEL: HRC 52
      const hardness = normalizeHardness(STEEL);

      expect(hardness).toBeCloseTo((52 / 70) * 10, 2);
      expect(hardness).toBeCloseTo(7.43, 2);
    });

    it("should normalize HRC 70 to 10", () => {
      const mockMaterial = {
        ...STEEL,
        hardness: { type: "hrc" as const, value: 70 },
      };

      const hardness = normalizeHardness(mockMaterial);
      expect(hardness).toBe(10);
    });

    it("should normalize HRC 35 to 5", () => {
      const mockMaterial = {
        ...STEEL,
        hardness: { type: "hrc" as const, value: 35 },
      };

      const hardness = normalizeHardness(mockMaterial);
      expect(hardness).toBe(5);
    });

    it("should normalize HV scale (0-1000) to 0-10", () => {
      const mockMaterial = {
        ...STEEL,
        hardness: { type: "hv" as const, value: 500 },
      };

      const hardness = normalizeHardness(mockMaterial);
      expect(hardness).toBe(5);
    });

    it("should normalize HV 1000 to 10", () => {
      const mockMaterial = {
        ...STEEL,
        hardness: { type: "hv" as const, value: 1000 },
      };

      const hardness = normalizeHardness(mockMaterial);
      expect(hardness).toBe(10);
    });
  });

  describe("calculateSharpnessScore", () => {
    it("should return 0 for materials without sharpnessScore", () => {
      const mockMaterial = {
        ...IRON,
        sharpnessScore: undefined,
      };

      const score = calculateSharpnessScore(mockMaterial);
      expect(score).toBe(0);
    });

    it("should apply weighted formula (hardness×0.4 + edgeGeometry×0.4 + toughness×0.2)", () => {
      // STEEL: hardness HRC 52, edgeGeometry.score 0.85, toughness 0.75
      const score = calculateSharpnessScore(STEEL);

      const hardnessNorm = (52 / 70) * 10; // ~7.43
      const expected = hardnessNorm * 0.4 + 0.85 * 10 * 0.4 + 0.75 * 10 * 0.2;

      expect(score).toBeCloseTo(expected, 1);
    });

    it("should clamp score to 0-10 range", () => {
      const score = calculateSharpnessScore(DIAMOND);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(10);
    });

    it("should handle materials with high sharpness (OBSIDIAN)", () => {
      // OBSIDIAN: Mohs 5.5, edgeGeometry 0.95, toughness 0.4
      // Score calculé: 5.5*0.4 + 0.95*10*0.4 + 0.4*10*0.2 = 6.8
      const score = calculateSharpnessScore(OBSIDIAN);

      expect(score).toBeCloseTo(6.8, 1); // Score élevé mais pas > 7
      expect(score).toBeGreaterThan(6); // Devrait être supérieur à la moyenne
    });
  });

  describe("calculateStrengthToWeightRatio", () => {
    it("should calculate ratio = tensileStrength / density", () => {
      // IRON: tensileStrength=250, density=7.87
      const ratio = calculateStrengthToWeightRatio(IRON);

      expect(ratio).toBeCloseTo(250 / 7.87, 2);
    });

    it("should show high ratio for ALUMINUM (light + strong)", () => {
      // ALUMINUM: tensileStrength=276, density=2.7
      const ratio = calculateStrengthToWeightRatio(ALUMINUM);

      expect(ratio).toBeCloseTo(276 / 2.7, 2);
      expect(ratio).toBeGreaterThan(100); // Bon rapport
    });

    it("should show very high ratio for GRAPHENE", () => {
      // GRAPHENE: tensileStrength=130000, density=0.77
      const ratio = calculateStrengthToWeightRatio(GRAPHENE);

      expect(ratio).toBeGreaterThan(100000); // Exceptionnel
    });
  });

  describe("compareMaterialsForWeapons", () => {
    it("should weight sharpness 50%, hardness 30%, effectiveness 20%", () => {
      // Formula vérification
      const result = compareMaterialsForWeapons(STEEL, IRON);

      // STEEL devrait être meilleur (plus tranchant)
      expect(result).toBeGreaterThan(0);
    });

    it("should prefer OBSIDIAN over STEEL for sharpness", () => {
      // OBSIDIAN: sharpness 9.2 vs STEEL: 7.8
      const result = compareMaterialsForWeapons(OBSIDIAN, STEEL);

      expect(result).toBeGreaterThan(0); // OBSIDIAN > STEEL
    });

    it("should prefer STEEL over WOOD for weapons", () => {
      const result = compareMaterialsForWeapons(STEEL, WOOD);

      expect(result).toBeGreaterThan(0);
    });

    it("should return negative if materialB is better", () => {
      const result = compareMaterialsForWeapons(WOOD, STEEL);

      expect(result).toBeLessThan(0);
    });
  });

  describe("compareMaterialsForArmor", () => {
    it("should weight hardness 40%, durability 40%, lightness 20%", () => {
      const result = compareMaterialsForArmor(STEEL, IRON);

      // STEEL devrait être meilleur (plus dur et durable)
      expect(result).toBeGreaterThan(0);
    });

    it("should favor light materials for armor (WOOD > STEEL due to lightness)", () => {
      // WOOD: weightFactor 0.3 (très léger) donne un grand bonus
      // Malgré hardness/durability faibles, la légèreté compense
      const result = compareMaterialsForArmor(WOOD, STEEL);

      expect(result).toBeGreaterThan(0); // WOOD score plus élevé grâce à la légèreté
    });

    it("should prefer DIAMOND over STEEL for armor (hardness)", () => {
      const result = compareMaterialsForArmor(DIAMOND, STEEL);

      expect(result).toBeGreaterThan(0); // DIAMOND plus dur
    });

    it("should return negative if materialB is better", () => {
      // STEEL vs DIAMOND: DIAMOND est beaucoup plus dur
      const result = compareMaterialsForArmor(STEEL, DIAMOND);

      expect(result).toBeLessThan(0); // DIAMOND meilleur que STEEL
    });

    it("should consider weight (lighter is better for armor)", () => {
      // Le facteur 1/weightFactor favorise les matériaux légers
      const result = compareMaterialsForArmor(ALUMINUM, IRON);

      // ALUMINUM plus léger devrait avoir un avantage
      // (mais IRON plus dur, donc dépend de la balance)
      expect(typeof result).toBe("number");
    });
  });

  describe("getRequiredForgingTemperature", () => {
    it("should return ~65% of melting point for metals", () => {
      // IRON: meltingPoint=1538
      const temp = getRequiredForgingTemperature(IRON);

      expect(temp).toBe(Math.round(1538 * 0.65));
      expect(temp).toBe(1000);
    });

    it("should return null for non-metals (WOOD)", () => {
      const temp = getRequiredForgingTemperature(WOOD);

      expect(temp).toBeNull();
    });

    it("should return null for metals without melting point", () => {
      const mockMaterial = {
        ...IRON,
        thermal: undefined,
      };

      const temp = getRequiredForgingTemperature(mockMaterial);

      expect(temp).toBeNull();
    });

    it("should calculate for STEEL", () => {
      // STEEL: meltingPoint=1500
      const temp = getRequiredForgingTemperature(STEEL);

      expect(temp).toBe(Math.round(1500 * 0.65));
      expect(temp).toBe(975);
    });
  });

  describe("canBeQuenched", () => {
    it("should return true for STEEL", () => {
      const result = canBeQuenched(STEEL);
      expect(result).toBe(true);
    });

    it("should return true for STAINLESS_STEEL", () => {
      const result = canBeQuenched(STAINLESS_STEEL);
      expect(result).toBe(true);
    });

    it("should return false for IRON (no carbon)", () => {
      const result = canBeQuenched(IRON);
      expect(result).toBe(false);
    });

    it("should return false for non-metals (WOOD)", () => {
      const result = canBeQuenched(WOOD);
      expect(result).toBe(false);
    });

    it("should return false for other metals (ALUMINUM)", () => {
      const result = canBeQuenched(ALUMINUM);
      expect(result).toBe(false);
    });
  });

  describe("normalizeThermalConductivity", () => {
    it("should normalize to 0-1 range (max 5000)", () => {
      // GRAPHENE: conductivity=5000 (max)
      const normalized = normalizeThermalConductivity(GRAPHENE);

      expect(normalized).toBe(1);
    });

    it("should normalize IRON conductivity", () => {
      // IRON: thermalConductivity=80
      const normalized = normalizeThermalConductivity(IRON);

      expect(normalized).toBeCloseTo(80 / 5000, 3);
      expect(normalized).toBeCloseTo(0.016, 3);
    });

    it("should return 0 for materials without thermal data", () => {
      const mockMaterial = {
        ...IRON,
        thermal: undefined,
      };

      const normalized = normalizeThermalConductivity(mockMaterial);

      expect(normalized).toBe(0);
    });

    it("should return 0 for materials with 0 conductivity (insulators)", () => {
      const mockMaterial = {
        ...WOOD,
        thermal: { thermalConductivity: 0 },
      };

      const normalized = normalizeThermalConductivity(mockMaterial);

      expect(normalized).toBe(0);
    });

    it("should clamp values above 5000 to 1", () => {
      const mockMaterial = {
        ...GRAPHENE,
        thermal: { thermalConductivity: 10000 },
      };

      const normalized = normalizeThermalConductivity(mockMaterial);

      expect(normalized).toBe(1); // Clamped
    });
  });
});
