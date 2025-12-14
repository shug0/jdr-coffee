import {
  getAllUniverses,
  getDefaultUniverse,
  getUniverseById,
  type Universe,
} from "../data/universes.data";

export { getUniverseById, getAllUniverses, getDefaultUniverse };

export const findUniverseById = (universeId: string): Universe | undefined =>
  getUniverseById(universeId);

export const findUniversesByGenre = (genre: string): Universe[] =>
  getAllUniverses().filter((universe) =>
    universe.genres.some((g) => g.toLowerCase().includes(genre.toLowerCase())),
  );

export const findUniversesByPeriod = (period: string): Universe[] =>
  getAllUniverses().filter((universe) =>
    universe.period.toLowerCase().includes(period.toLowerCase()),
  );

export const getUniverseDescriptionById = (universeId: string): string => {
  const universe = findUniverseById(universeId);
  return universe?.description || "No description available";
};
