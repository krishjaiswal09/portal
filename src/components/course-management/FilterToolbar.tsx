
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, X } from "lucide-react"
import { CourseCategory } from '@/types/course'

interface FilterToolbarProps {
  filters: {
    categories: string[]
  }
  categories: CourseCategory[],
  onFiltersChange: (filters: any) => void
}

export function FilterToolbar({ filters, onFiltersChange, categories = [] }: FilterToolbarProps) {
  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      [type]: checked
        ? [...filters[type], value]
        : filters[type].filter(item => item !== value)
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      categories: []
    })
  }

  const totalFilters = filters.categories.length

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Category Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Category
            {filters.categories.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filters.categories.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <h4 className="font-medium">Filter by Category</h4>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    handleFilterChange('categories', category.id, checked as boolean)
                  }
                />
                <label htmlFor={category.id} className="text-sm">
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {totalFilters > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters ({totalFilters})
        </Button>
      )}
    </div>
  )
}
