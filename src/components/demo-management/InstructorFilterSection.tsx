
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, ChevronDown, Users } from "lucide-react";
import { mockInstructors, artForms, countries, languages, certifications } from "@/data/instructorData";

interface InstructorFilters {
  search: string;
  artForms: string[];
  countries: string[];
  languages: string[];
  certifications: string[];
  gender: string;
  status: string;
  kidFriendly: string;
}

interface InstructorFilterSectionProps {
  selectedInstructor: string;
  onInstructorChange: (instructor: string) => void;
  onInstructorSelect: (instructor: string) => void;
}

export function InstructorFilterSection({
  selectedInstructor,
  onInstructorChange,
  onInstructorSelect
}: InstructorFilterSectionProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<InstructorFilters>({
    search: '',
    artForms: [],
    countries: [],
    languages: [],
    certifications: [],
    gender: '',
    status: '',
    kidFriendly: '',
  });

  const toggleArrayFilter = (key: 'artForms' | 'countries' | 'languages' | 'certifications', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    setFilters(prev => ({ ...prev, [key]: newArray }));
  };

  const filteredInstructors = mockInstructors.filter(instructor => {
    const matchesSearch = !filters.search || 
      instructor.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      instructor.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesArtForms = filters.artForms.length === 0 || 
      filters.artForms.some(form => instructor.artForms.includes(form));
    
    const matchesCountries = filters.countries.length === 0 || 
      filters.countries.includes(instructor.country);
    
    const matchesLanguages = filters.languages.length === 0 || 
      filters.languages.some(lang => instructor.languagesKnown.includes(lang));
    
    const matchesCertifications = filters.certifications.length === 0 || 
      filters.certifications.some(cert => instructor.certifications.includes(cert));
    
    const matchesGender = !filters.gender || instructor.gender === filters.gender;
    
    const matchesStatus = !filters.status || instructor.status === filters.status;
    
    const matchesKidFriendly = !filters.kidFriendly || 
      (filters.kidFriendly === 'yes' && instructor.kidFriendly) ||
      (filters.kidFriendly === 'no' && !instructor.kidFriendly);

    return matchesSearch && matchesArtForms && matchesCountries && 
           matchesLanguages && matchesCertifications && matchesGender &&
           matchesStatus && matchesKidFriendly;
  });

  const handleInstructorSelect = (instructorName: string) => {
    onInstructorChange(instructorName);
    onInstructorSelect(instructorName);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Select Instructor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search instructors by name or email"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>

        {/* Filters Toggle */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <RadioGroup
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="status-all" />
                    <Label htmlFor="status-all" className="text-sm">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Active" id="status-active" />
                    <Label htmlFor="status-active" className="text-sm">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Inactive" id="status-inactive" />
                    <Label htmlFor="status-inactive" className="text-sm">Inactive</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Gender</Label>
                <RadioGroup
                  value={filters.gender}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="gender-all" />
                    <Label htmlFor="gender-all" className="text-sm">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="gender-male" />
                    <Label htmlFor="gender-male" className="text-sm">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="gender-female" />
                    <Label htmlFor="gender-female" className="text-sm">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="gender-other" />
                    <Label htmlFor="gender-other" className="text-sm">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Kid Friendly Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Kid Friendly</Label>
                <RadioGroup
                  value={filters.kidFriendly}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, kidFriendly: value }))}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="kid-all" />
                    <Label htmlFor="kid-all" className="text-sm">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="kid-yes" />
                    <Label htmlFor="kid-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="kid-no" />
                    <Label htmlFor="kid-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Art Forms */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Art Forms</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  {artForms.slice(0, 10).map((form) => (
                    <div key={form} className="flex items-center space-x-2">
                      <Checkbox
                        id={`artform-${form}`}
                        checked={filters.artForms.includes(form)}
                        onCheckedChange={() => toggleArrayFilter('artForms', form)}
                      />
                      <Label htmlFor={`artform-${form}`} className="text-sm">
                        {form}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Countries</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  {countries.map((country) => (
                    <div key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`country-${country}`}
                        checked={filters.countries.includes(country)}
                        onCheckedChange={() => toggleArrayFilter('countries', country)}
                      />
                      <Label htmlFor={`country-${country}`} className="text-sm">
                        {country}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Languages</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  {languages.slice(0, 8).map((language) => (
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
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Certifications</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  {certifications.map((certification) => (
                    <div key={certification} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cert-${certification}`}
                        checked={filters.certifications.includes(certification)}
                        onCheckedChange={() => toggleArrayFilter('certifications', certification)}
                      />
                      <Label htmlFor={`cert-${certification}`} className="text-sm">
                        {certification}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Instructor List */}
        <div className="space-y-2">
          <Label>Available Instructors ({filteredInstructors.length})</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {filteredInstructors.map((instructor) => (
              <div
                key={instructor.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedInstructor === instructor.fullName
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleInstructorSelect(instructor.fullName)}
              >
                <div className="font-medium">{instructor.fullName}</div>
                <div className="text-sm text-muted-foreground">{instructor.email}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant={instructor.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                    {instructor.status}
                  </Badge>
                  {instructor.kidFriendly && (
                    <Badge variant="outline" className="text-xs">
                      Kid Friendly
                    </Badge>
                  )}
                  {instructor.artForms.slice(0, 2).map((form) => (
                    <Badge key={form} variant="secondary" className="text-xs">
                      {form}
                    </Badge>
                  ))}
                  {instructor.artForms.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{instructor.artForms.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
