import { useCallback, useMemo } from "react";
import { useUniverseStore } from "../stores/universe.store";

export const useUniverse = () => {
  const {
    selectedUniverse,
    availableUniverses,
    setSelectedUniverse,
    searchTerm,
    setSearchTerm,
    filteredUniverses,
  } = useUniverseStore();

  const selectUniverse = useCallback(
    (universeId: string) => {
      setSelectedUniverse(universeId);
    },
    [setSelectedUniverse],
  );

  const universeStats = useMemo(
    () => ({
      total: availableUniverses.length,
      filtered: filteredUniverses.length,
    }),
    [availableUniverses, filteredUniverses],
  );

  return {
    selectedUniverse,
    availableUniverses,
    selectUniverse,
    searchTerm,
    setSearchTerm,
    filteredUniverses,
    universeStats,
  };
};
