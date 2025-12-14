import type React from 'react';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useUniverse } from '../hooks/use-universe.hook';
import { UniverseList } from './universe-list/universe-list.component';
import { UniverseFilters } from './universe-search/universe-filters.component';
import { UniverseSearch } from './universe-search/universe-search.component';

export const UniverseModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const { searchTerm, setSearchTerm, universeStats } = useUniverse();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent >
        <DialogHeader >
          <DialogTitle>
            Select Universe
          </DialogTitle>
          <DialogDescription>
            Choose a universe to set the context for all tools and features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-grow ">
          <UniverseSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            className="w-full"
          />
          
          <div className="flex items-center justify-between gap-4">
            <UniverseFilters className="flex-grow" />
            <div className="text-sm text-muted-foreground shrink-0">
              {universeStats.filtered} of {universeStats.total} universes
            </div>
          </div>
          
          <div className="flex-grow overflow-auto">
            <UniverseList onUniverse={() => onOpenChange(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
