
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { InstructorFilters as IInstructorFilters } from "@/types/instructor"
const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Korean', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese', 'Maithili', 'Santali', 'Kashmiri', 'Nepali', 'Konkani', 'Sindhi', 'Dogri', 'Manipuri (Meitei)', 'Bodo', 'Rajasthani', 'Haryanvi', 'Chhattisgarhi', 'Bhojpuri', 'Awadhi', 'Magahi', 'Marwari', 'Garhwali', 'Kumaoni', 'Tulu'];

interface InstructorFiltersProps {
  filters: IInstructorFilters
  onFiltersChange: (filters: IInstructorFilters) => void
  artForms?: any[]
  certifications?: any[]
}

export const InstructorFilters: React.FC<InstructorFiltersProps> = ({
  filters,
  onFiltersChange,
  artForms = [],
  certifications = []
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false)

  const updateFilter = (key: keyof IInstructorFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: 'artForms' | 'languages' | 'certifications', value: string | number) => {
    const currentArray = filters[key] as (string | number)[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      artForms: [],
      status: 'all',
      languages: [],
      kidFriendly: 'all',
      gender: 'all',
      certifications: []
    })
  }

  const activeFiltersCount =
    (filters.artForms.length > 0 ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.languages?.length > 0 ? 1 : 0) +
    (filters.kidFriendly !== 'all' ? 1 : 0) +
    (filters.gender !== 'all' ? 1 : 0) +
    (filters.certifications?.length > 0 ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Toggle */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value: any) => updateFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={filters.gender} onValueChange={(value: any) => updateFilter('gender', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Kid Friendly Filter */}
            <div className="space-y-2">
              <Label>Kid Friendly</Label>
              <Select value={filters.kidFriendly} onValueChange={(value: any) => updateFilter('kidFriendly', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Multi-select Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Art Forms */}
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium mb-3 block">Art Forms</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {artForms?.map((form) => (
                    <div key={form.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`artform-${form.id}`}
                        checked={filters.artForms.includes(form.id)}
                        onCheckedChange={() => toggleArrayFilter('artForms', form.id)}
                      />
                      <Label htmlFor={`artform-${form.id}`} className="text-sm">
                        {form.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium mb-3 block">Languages</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {languages?.map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={`language-${language}`}
                        checked={filters.languages.includes(language)}
                        onCheckedChange={() => toggleArrayFilter('languages', language)}
                      />
                      <Label htmlFor={`language-${language}`} className="text-sm">
                        {language}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium mb-3 block">Certifications</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {certifications?.map((certification) => (
                    <div key={certification.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cert-${certification.id}`}
                        checked={filters.certifications.includes(certification.id)}
                        onCheckedChange={() => toggleArrayFilter('certifications', certification.id)}
                      />
                      <Label htmlFor={`cert-${certification.id}`} className="text-sm">
                        {certification.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {filters.status}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('status', 'all')} />
                </Badge>
              )}
              {filters.gender !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Gender: {filters.gender}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('gender', 'all')} />
                </Badge>
              )}
              {filters.kidFriendly !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Kid Friendly: {filters.kidFriendly}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('kidFriendly', 'all')} />
                </Badge>
              )}
              {filters.artForms?.map((form) => (
                <Badge key={form} variant="secondary" className="flex items-center gap-1">
                  {form}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter('artForms', form)} />
                </Badge>
              ))}
              {filters.certifications?.map((cert) => (
                <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                  {cert}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter('certifications', cert)} />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
