import { create } from "zustand";
import {
  getAllUniverses,
  getDefaultUniverse,
  getUniverseById,
} from "../data/universes.data";
import { filterUniverses } from "../helpers/universe-filter.helper";
import type { UniverseSelectionState } from "../types/universe-selection.types";

export const useUniverseStore = create<UniverseSelectionState>((set) => ({
  selectedUniverse: getDefaultUniverse(),
  availableUniverses: getAllUniverses(),
  setSelectedUniverse: (universeId: string) =>
    set((state) => ({
      selectedUniverse: getUniverseById(universeId) ?? state.selectedUniverse,
    })),
  searchTerm: "",
  setSearchTerm: (term: string) =>
    set((state) => ({
      searchTerm: term,
      filteredUniverses: filterUniverses(state.availableUniverses, {
        searchTerm: term,
      }),
    })),
  filteredUniverses: getAllUniverses(),
}));
