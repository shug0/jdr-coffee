import { Filter } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUniverseSearch } from "../../hooks/use-universe-search.hook";

const GENRES = ["Fantasy", "Sci-Fi", "Horror", "Historical", "Modern"];
const PERIODS = ["Medieval", "Modern", "Future", "Past", "Contemporary"];

export const UniverseFilters: React.FC<{ className?: string }> = ({ className }) => {
  const { searchGenres, setSearchGenres, searchPeriods, setSearchPeriods } =
    useUniverseSearch();

  const toggleGenre = (genre: string) => {
    setSearchGenres(
      searchGenres.includes(genre)
        ? searchGenres.filter((g) => g !== genre)
        : [...searchGenres, genre],
    );
  };

  const togglePeriod = (period: string) => {
    setSearchPeriods(
      searchPeriods.includes(period)
        ? searchPeriods.filter((p) => p !== period)
        : [...searchPeriods, period],
    );
  };

  return (
    <div className={className}>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Genres</DropdownMenuLabel>
        {GENRES.map((genre) => (
          <DropdownMenuCheckboxItem
            key={genre}
            checked={searchGenres.includes(genre)}
            onCheckedChange={() => toggleGenre(genre)}
          >
            {genre}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuLabel>Periods</DropdownMenuLabel>
        {PERIODS.map((period) => (
          <DropdownMenuCheckboxItem
            key={period}
            checked={searchPeriods.includes(period)}
            onCheckedChange={() => togglePeriod(period)}
          >
            {period}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
};
