
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type ClassFilters } from "@/types/class";
import { instructors } from "@/data/classData";

interface ClassFiltersProps {
  filters: ClassFilters;
  onFiltersChange: (filters: ClassFilters) => void;
}

export function ClassFilters({
  filters,
  onFiltersChange
}: ClassFiltersProps) {
  const updateFilter = (key: keyof ClassFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search classes..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-9 w-64"
        />
      </div>

      <Select value={filters.instructor} onValueChange={(value) => updateFilter('instructor', value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Instructors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Instructors</SelectItem>
          {instructors.map((instructor) => (
            <SelectItem key={instructor} value={instructor}>
              {instructor}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="Dance">Dance</SelectItem>
          <SelectItem value="Vocal">Vocal</SelectItem>
          <SelectItem value="Instrument">Instrument</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Private">Private</SelectItem>
          <SelectItem value="Group">Group</SelectItem>
          <SelectItem value="Trial">Trial</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
