import { Globe } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUniverse } from "../hooks/use-universe.hook";

export const UniverseTrigger: React.FC<{
  className?: string;
  onOpenChange?: (open: boolean) => void;
}> = ({ className, onOpenChange }) => {
  const { selectedUniverse } = useUniverse();

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("group", className)}
      aria-label="Select Universe"
      onClick={() => onOpenChange?.(true)}
    >
      <Globe
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all group-hover:rotate-45"
        strokeWidth={1.5}
      />
      <span className="sr-only">Universe: {selectedUniverse.name}</span>
    </Button>
  );
};
