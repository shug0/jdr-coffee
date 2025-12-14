import { CheckIcon } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import type { Universe } from "@/legacy/static-data/src/lib/universes/universes.types";
import { cn } from "@/lib/utils";
import { useUniverse } from "../../hooks/use-universe.hook";

export const UniverseItem: React.FC<{
  universe: Universe;
  isActive?: boolean;
  onSelect?: () => void;
}> = ({ universe, isActive, onSelect }) => {
  const { selectedUniverse, selectUniverse } = useUniverse();

  const handleSelect = () => {
    selectUniverse(universe.id);
    onSelect?.();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSelect}
      className={cn(
        "w-full justify-between px-3 py-6 text-left",
        selectedUniverse.id === universe.id && "bg-primary/10",
      )}
      aria-pressed={selectedUniverse.id === universe.id}
    >
      <div className="flex flex-col">
        <div className="font-semibold">{universe.name}</div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {universe.description}
        </p>
        <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
          <span>{universe.genres.join(", ")}</span>
          <span>•</span>
          <span>{universe.period}</span>
        </div>
      </div>
      {selectedUniverse.id === universe.id && (
        <CheckIcon className="h-4 w-4 text-primary" />
      )}
    </Button>
  );
};
