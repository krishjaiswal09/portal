
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ReportFilter } from '@/types/report';

interface ReportFiltersProps {
  filters: ReportFilter[];
  onFiltersChange: (filters: { [key: string]: string }) => void;
}

export function ReportFilters({ filters, onFiltersChange }: ReportFiltersProps) {
  const [currentFilters, setCurrentFilters] = React.useState<{ [key: string]: string }>(() => {
    const initial: { [key: string]: string } = {};
    filters.forEach(filter => {
      // Handle both string and string[] types
      const value = filter.value;
      initial[filter.key] = Array.isArray(value) ? value[0] || '' : value || '';
    });
    return initial;
  });

  const handleFilterChange = (key: string, value: string) => {
    const updated = { ...currentFilters, [key]: value };
    setCurrentFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const cleared: { [key: string]: string } = {};
    filters.forEach(filter => {
      cleared[filter.key] = '';
    });
    setCurrentFilters(cleared);
    onFiltersChange(cleared);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {filters.map((filter) => (
          <div key={filter.key} className="min-w-[200px]">
            {filter.type === 'text' && (
              <Input
                placeholder={filter.label}
                value={currentFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              />
            )}
            
            {filter.type === 'select' && (
              <Select 
                value={currentFilters[filter.key] || ''} 
                onValueChange={(value) => handleFilterChange(filter.key, value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="">All {filter.label}s</SelectItem>
                  {filter.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {filter.type === 'date' && (
              <Input
                type="date"
                placeholder={filter.label}
                value={currentFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      
      <Button variant="outline" onClick={clearFilters} size="sm">
        Clear All Filters
      </Button>
    </div>
  );
}
