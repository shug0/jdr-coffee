import { useCallback, useState } from "react";
import { useUniverse } from "./use-universe.hook";

export const useUniverseNavigation = () => {
  const { availableUniverses, selectUniverse } = useUniverse();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyboardNavigation = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((prev) =>
            prev < availableUniverses.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : availableUniverses.length - 1,
          );
          break;
        case "Enter":
          event.preventDefault();
          selectUniverse(availableUniverses[activeIndex].id);
          break;
      }
    },
    [availableUniverses, selectUniverse, activeIndex],
  );

  return {
    activeIndex,
    handleKeyboardNavigation,
  };
};
