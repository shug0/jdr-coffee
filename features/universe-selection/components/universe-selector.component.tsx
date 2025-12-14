import type React from "react";
import { useState } from "react";
import { UniverseModal } from "./universe-sheet.component";
import { UniverseTrigger } from "./universe-trigger.component";

export const UniverseSelector: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <UniverseTrigger onOpenChange={setIsSheetOpen} className="w-10 h-10" />
      <UniverseModal open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
};
