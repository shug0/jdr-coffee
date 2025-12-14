import type React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUniverse } from "../../hooks/use-universe.hook";
import { useUniverseNavigation } from "../../hooks/use-universe-nav.hook";
import { UniverseItem } from "./universe-item.component";

export const UniverseList: React.FC<{
  onUniverse?: () => void;
}> = ({ onUniverse }) => {
  const { filteredUniverses } = useUniverse();
  const { activeIndex, handleKeyboardNavigation } = useUniverseNavigation();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    handleKeyboardNavigation(event);
  };

  return (
    <ScrollArea
      className="h-[400px] rounded-md border"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid gap-4 p-2 grid-cols-2">
        {filteredUniverses.map((universe, index) => (
          <UniverseItem
            key={universe.id}
            universe={universe}
            isActive={index === activeIndex}
            onSelect={onUniverse}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
