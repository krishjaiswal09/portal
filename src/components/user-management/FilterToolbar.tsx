
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type UserFilters, countries } from "./mockData"
import { ChevronDown, X } from "lucide-react"

interface FilterToolbarProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
}

export function FilterToolbar({ filters, onFiltersChange }: FilterToolbarProps) {
  const roleOptions = [
    { value: 'student', label: 'Student', color: 'bg-pink-500' },
    { value: 'instructor', label: 'Instructor', color: 'bg-purple-500' },
    { value: 'parent', label: 'Parent', color: 'bg-blue-500' },
    { value: 'admin', label: 'Admin', color: 'bg-primary' },
    { value: 'support', label: 'Support', color: 'bg-green-500' }
  ]

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ]

  const ageTypeOptions = [
    { value: 'kid', label: 'Kid' },
    { value: 'adult', label: 'Adult' }
  ]

  const clearAllFilters = () => {
    onFiltersChange({
      roles: [],
      status: [],
      ageType: [],
      countries: []
    })
  }

  const hasActiveFilters = Object.values(filters).some(filter => filter.length > 0)

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">
                Roles
                {filters.roles.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                    {filters.roles.length}
                  </Badge>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover border-border text-popover-foreground z-50 overflow-auto max-h-[300px]">
              {roleOptions.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role.value}
                  checked={filters.roles.includes(role.value as any)}
                  onCheckedChange={(checked) => {
                    const newRoles = checked
                      ? [...filters.roles, role.value as any]
                      : filters.roles.filter(r => r !== role.value)
                    onFiltersChange({ ...filters, roles: newRoles })
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${role.color} mr-2`} />
                  {role.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">
                Status
                {filters.status.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                    {filters.status.length}
                  </Badge>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover border-border text-popover-foreground z-50 overflow-auto max-h-[300px]">
              {statusOptions.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status.value}
                  checked={filters.status.includes(status.value as any)}
                  onCheckedChange={(checked) => {
                    const newStatus = checked
                      ? [...filters.status, status.value as any]
                      : filters.status.filter(s => s !== status.value)
                    onFiltersChange({ ...filters, status: newStatus })
                  }}
                >
                  {status.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Age Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">
                Age Type
                {filters.ageType.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                    {filters.ageType.length}
                  </Badge>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover border-border text-popover-foreground z-50 overflow-auto max-h-[300px]">
              {ageTypeOptions.map((ageType) => (
                <DropdownMenuCheckboxItem
                  key={ageType.value}
                  checked={filters.ageType.includes(ageType.value as any)}
                  onCheckedChange={(checked) => {
                    const newAgeType = checked
                      ? [...filters.ageType, ageType.value as any]
                      : filters.ageType.filter(a => a !== ageType.value)
                    onFiltersChange({ ...filters, ageType: newAgeType })
                  }}
                >
                  {ageType.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Country Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">
                Countries
                {filters.countries.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                    {filters.countries.length}
                  </Badge>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover border-border text-popover-foreground z-50 overflow-auto max-h-[300px]">
              {countries.map((country) => (
                <DropdownMenuCheckboxItem
                  key={country.code}
                  checked={filters.countries.includes(country.code)}
                  onCheckedChange={(checked) => {
                    const newCountries = checked
                      ? [...filters.countries, country.code]
                      : filters.countries.filter(c => c !== country.code)
                    onFiltersChange({ ...filters, countries: newCountries })
                  }}
                >
                  <span className="mr-2">{country.flag}</span>
                  {country.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
