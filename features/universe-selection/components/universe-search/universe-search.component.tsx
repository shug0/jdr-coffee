import { Search } from "lucide-react";
import type React from "react";
import { Input } from "@/components/ui/input";

export const UniverseSearch: React.FC<{
  searchTerm: string;
  onSearchChange: (value: string) => void;
  className?: string;
}> = ({ searchTerm, onSearchChange, className }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Search universes..."
        className={`pl-10 ${className || ''}`}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
