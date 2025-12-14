import type { Universe } from "../data/universes.data";

export interface UniverseSelectionState {
  selectedUniverse: Universe;
  availableUniverses: Universe[];
  setSelectedUniverse: (universeId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredUniverses: Universe[];
}

export interface UniverseSearchState {
  searchTerm: string;
  searchGenres: string[];
  searchPeriods: string[];
  setSearchTerm: (term: string) => void;
  setSearchGenres: (genres: string[]) => void;
  setSearchPeriods: (periods: string[]) => void;
}
