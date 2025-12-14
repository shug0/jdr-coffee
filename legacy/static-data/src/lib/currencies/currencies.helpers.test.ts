import { describe, expect, it } from "vitest";
import { DND_CURRENCIES } from "../universes/dnd";
import {
  formatCurrency,
  formatCurrencySimple,
  formatCurrencySymbols,
  formatCurrencyText,
  fromBaseValue,
  getCurrencyHierarchy,
  isHierarchical,
  toBaseValue,
} from "./currencies.helpers";
import type { Currency } from "./currencies.types";

describe("Currency Helpers", () => {
  describe("isHierarchical", () => {
    it("should return true for hierarchical systems (DND)", () => {
      const result = isHierarchical(DND_CURRENCIES);
      expect(result).toBe(true);
    });

    it("should return false for non-hierarchical systems", () => {
      const singleCurrency = {
        DOLLAR: {
          id: "usd",
          name: "Dollar",
          symbol: "$",
          type: "coin" as const,
          // Pas de baseValue = non-hiérarchique
        },
      };
      const result = isHierarchical(singleCurrency);
      expect(result).toBe(false);
    });

    it("should return false for empty currency system", () => {
      const result = isHierarchical({});
      expect(result).toBe(false);
    });
  });

  describe("getCurrencyHierarchy", () => {
    it("should sort currencies by baseValue descending (po > pa > pc)", () => {
      const hierarchy = getCurrencyHierarchy(DND_CURRENCIES);

      expect(hierarchy).toHaveLength(3);
      expect(hierarchy[0].id).toBe("dnd-gold"); // 100
      expect(hierarchy[1].id).toBe("dnd-silver"); // 10
      expect(hierarchy[2].id).toBe("dnd-copper"); // 1
    });

    it("should filter out currencies without baseValue", () => {
      const mixed = {
        ...DND_CURRENCIES,
        TOKEN: {
          id: "token",
          name: "Token",
          symbol: "T",
          type: "token" as const,
          // Pas de baseValue
        },
      };

      const hierarchy = getCurrencyHierarchy(mixed);
      expect(hierarchy).toHaveLength(3); // Seulement les 3 devises DND
    });
  });

  describe("formatCurrency", () => {
    it("should convert 0 copper to empty array", () => {
      const result = formatCurrency(0, DND_CURRENCIES);
      expect(result).toEqual([]);
    });

    it("should convert 1 copper correctly", () => {
      const result = formatCurrency(1, DND_CURRENCIES);

      expect(result).toHaveLength(1);
      expect(result[0].currency.id).toBe("dnd-copper");
      expect(result[0].amount).toBe(1);
    });

    it("should convert 100 copper to 1 gold (exact conversion)", () => {
      const result = formatCurrency(100, DND_CURRENCIES);

      expect(result).toHaveLength(1);
      expect(result[0].currency.id).toBe("dnd-gold");
      expect(result[0].amount).toBe(1);
    });

    it("should convert 150 copper to mixed currencies (1 po, 5 pa)", () => {
      const result = formatCurrency(150, DND_CURRENCIES);

      expect(result).toHaveLength(2);
      expect(result[0].currency.id).toBe("dnd-gold");
      expect(result[0].amount).toBe(1); // 100 pc = 1 po
      expect(result[1].currency.id).toBe("dnd-silver");
      expect(result[1].amount).toBe(5); // 50 pc = 5 pa
    });

    it("should convert 156 copper to 1 po, 5 pa, 6 pc", () => {
      const result = formatCurrency(156, DND_CURRENCIES);

      expect(result).toHaveLength(3);
      expect(result[0].currency.id).toBe("dnd-gold");
      expect(result[0].amount).toBe(1);
      expect(result[1].currency.id).toBe("dnd-silver");
      expect(result[1].amount).toBe(5);
      expect(result[2].currency.id).toBe("dnd-copper");
      expect(result[2].amount).toBe(6);
    });

    it("should throw error for non-hierarchical system", () => {
      const nonHierarchical = {
        USD: {
          id: "usd",
          name: "Dollar",
          symbol: "$",
          type: "coin" as const,
        },
      };

      expect(() => formatCurrency(100, nonHierarchical)).toThrow(
        "Cannot format non-hierarchical currency system",
      );
    });
  });

  describe("toBaseValue", () => {
    it("should convert 1 gold to 100 copper", () => {
      const result = toBaseValue(1, DND_CURRENCIES.GOLD);
      expect(result).toBe(100);
    });

    it("should convert 5 silver to 50 copper", () => {
      const result = toBaseValue(5, DND_CURRENCIES.SILVER);
      expect(result).toBe(50);
    });

    it("should convert 10 copper to 10 copper (base unit)", () => {
      const result = toBaseValue(10, DND_CURRENCIES.COPPER);
      expect(result).toBe(10);
    });

    it("should throw error for currency without baseValue", () => {
      const invalidCurrency: Currency = {
        id: "invalid",
        name: "Invalid",
        symbol: "X",
        type: "coin",
      };

      expect(() => toBaseValue(10, invalidCurrency)).toThrow(
        "Currency invalid has no baseValue",
      );
    });
  });

  describe("fromBaseValue", () => {
    it("should convert 100 copper to 1 gold", () => {
      const result = fromBaseValue(100, DND_CURRENCIES.GOLD);
      expect(result).toBe(1);
    });

    it("should convert 50 copper to 5 silver", () => {
      const result = fromBaseValue(50, DND_CURRENCIES.SILVER);
      expect(result).toBe(5);
    });

    it("should handle fractional conversions (15 pc → 0.15 po)", () => {
      const result = fromBaseValue(15, DND_CURRENCIES.GOLD);
      expect(result).toBe(0.15);
    });

    it("should convert 10 copper to 1 silver (exact)", () => {
      const result = fromBaseValue(10, DND_CURRENCIES.SILVER);
      expect(result).toBe(1);
    });

    it("should throw error for currency without baseValue", () => {
      const invalidCurrency: Currency = {
        id: "invalid",
        name: "Invalid",
        symbol: "X",
        type: "coin",
      };

      expect(() => fromBaseValue(100, invalidCurrency)).toThrow(
        "Currency invalid has no baseValue",
      );
    });
  });

  describe("formatCurrencyText", () => {
    it("should format 156 copper with full names", () => {
      const result = formatCurrencyText(156, DND_CURRENCIES);

      expect(result).toBe(
        "1 Pièce d'or, 5 Pièce d'argents, 6 Pièce de cuivres",
      );
    });

    it("should handle singular (1 unit)", () => {
      const result = formatCurrencyText(100, DND_CURRENCIES);

      expect(result).toBe("1 Pièce d'or");
    });

    it("should handle plural (multiple units)", () => {
      const result = formatCurrencyText(200, DND_CURRENCIES);

      expect(result).toBe("2 Pièce d'ors");
    });

    it("should format 0 copper with base unit", () => {
      const result = formatCurrencyText(0, DND_CURRENCIES);

      expect(result).toBe("0 Pièce de cuivre");
    });

    it("should handle mixed singular and plural", () => {
      const result = formatCurrencyText(111, DND_CURRENCIES);

      expect(result).toBe("1 Pièce d'or, 1 Pièce d'argent, 1 Pièce de cuivre");
    });
  });

  describe("formatCurrencySymbols", () => {
    it("should format 156 copper with symbols (1 po, 5 pa, 6 pc)", () => {
      const result = formatCurrencySymbols(156, DND_CURRENCIES);

      expect(result).toBe("1 po, 5 pa, 6 pc");
    });

    it("should omit zero values by default", () => {
      const result = formatCurrencySymbols(100, DND_CURRENCIES);

      expect(result).toBe("1 po"); // Pas de "0 pa, 0 pc"
    });

    it("should show zero values when showZero=true", () => {
      const result = formatCurrencySymbols(100, DND_CURRENCIES, true);

      expect(result).toBe("1 po"); // formatCurrency ne retourne que les non-zéro
    });

    it("should format 0 copper with base unit symbol", () => {
      const result = formatCurrencySymbols(0, DND_CURRENCIES);

      expect(result).toBe("0 pc");
    });

    it("should handle only silver and copper (no gold)", () => {
      const result = formatCurrencySymbols(56, DND_CURRENCIES);

      expect(result).toBe("5 pa, 6 pc");
    });
  });

  describe("formatCurrencySimple", () => {
    it("should use highest currency with ceiling rounding (156 pc → 1.6 po)", () => {
      const result = formatCurrencySimple(156, DND_CURRENCIES);

      expect(result).toBe("1.6 po");
    });

    it("should round to tenth (150 pc → 1.5 po)", () => {
      const result = formatCurrencySimple(150, DND_CURRENCIES);

      expect(result).toBe("1.5 po");
    });

    it("should use gold when >= 100 copper", () => {
      const result = formatCurrencySimple(100, DND_CURRENCIES);

      expect(result).toBe("1 po");
    });

    it("should switch to silver when < 100 copper (50 pc → 5 pa)", () => {
      const result = formatCurrencySimple(50, DND_CURRENCIES);

      expect(result).toBe("5 pa");
    });

    it("should switch to copper when < 10 copper (5 pc → 5 pc)", () => {
      const result = formatCurrencySimple(5, DND_CURRENCIES);

      expect(result).toBe("5 pc");
    });

    it("should handle fractional amounts (15 pc → 1.5 pa)", () => {
      const result = formatCurrencySimple(15, DND_CURRENCIES);

      expect(result).toBe("1.5 pa");
    });

    it("should ceiling round to tenth (156 pc → 1.6 po, not 1.56)", () => {
      const result = formatCurrencySimple(156, DND_CURRENCIES);

      expect(result).toBe("1.6 po");
    });
  });
});
