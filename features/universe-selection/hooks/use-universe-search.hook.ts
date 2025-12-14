import { useState } from "react";
import type { Universe } from "../data/universes.data";
import { getAllUniverses } from "../helpers/universe-data.helper";
import { filterUniverses } from "../helpers/universe-filter.helper";

export const useUniverseSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchGenres, setSearchGenres] = useState<string[]>([]);
  const [searchPeriods, setSearchPeriods] = useState<string[]>([]);

  const performSearch = (): Universe[] => {
    const allUniverses = getAllUniverses();
    return filterUniverses(allUniverses, {
      searchTerm,
      genres: searchGenres,
      periods: searchPeriods,
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    searchGenres,
    setSearchGenres,
    searchPeriods,
    setSearchPeriods,
    performSearch,
  };
};
