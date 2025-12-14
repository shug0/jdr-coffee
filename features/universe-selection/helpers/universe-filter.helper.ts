import type { Universe } from "../data/universes.data";

export const filterUniverses = (
  universes: Universe[],
  options: {
    searchTerm?: string;
    genres?: string[];
    periods?: string[];
  } = {},
): Universe[] => {
  const { searchTerm = "", genres = [], periods = [] } = options;

  return universes.filter((universe) => {
    const matchesTerm =
      !searchTerm ||
      universe.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      universe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesGenres =
      genres.length === 0
        ? true
        : genres.some((genre) =>
            universe.genres.some((g) =>
              g.toLowerCase().includes(genre.toLowerCase()),
            ),
          );

    const matchesPeriods =
      periods.length === 0
        ? true
        : periods.some((period) =>
            universe.period.toLowerCase().includes(period.toLowerCase()),
          );

    return matchesTerm && matchesGenres && matchesPeriods;
  });
};

export const searchUniverses = (
  searchTerm: string = "",
  searchGenres: string[] = [],
  searchPeriods: string[] = [],
  universes: Universe[],
): Universe[] =>
  filterUniverses(universes, {
    searchTerm,
    genres: searchGenres,
    periods: searchPeriods,
  });
