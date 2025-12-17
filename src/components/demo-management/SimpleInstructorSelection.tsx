import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Search, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";

// Interface matching the API data structure
interface ApiInstructor {
  id: number;
  email: string;
  phone_number: string;
  date_of_birth: string;
  country: string;
  timezone: string;
  city: string;
  state: string;
  pin: string;
  age_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  family_id: number | null;
  parent_id: number | null;
  account_manager: number | null;
  gender: string;
  username: string | null;
  description: string | null;
  notes: string;
  email_notification: boolean;
  whatsapp_notification: boolean;
  profile_picture_url: string | null;
  address: string;
  first_name: string;
  last_name: string;
  content_manager: number | null;
  credits: number;
  assign_demos: boolean;
  transfer_students: boolean;
  kid_friendly: boolean;
  languages: string[];
  age_group: Array<{ id: number; name: string }>;
  certifications: string[];
  meeting_link: string | null;
  art_form: string | null;
  parent_first_name: string | null;
  parent_last_name: string | null;
  parent_email: string | null;
  family_name: string | null;
  discount_percentage: number | null;
  auto_payment: boolean | null;
  roles: string[];
  parent: any | null;
  family: any | null;
}

interface SimpleInstructorSelectionProps {
  primaryInstructor: string;
  secondaryInstructor: string;
  onPrimaryInstructorChange: (instructor: string) => void;
  onSecondaryInstructorChange: (instructor: string) => void;
}

export function SimpleInstructorSelection({
  primaryInstructor,
  secondaryInstructor,
  onPrimaryInstructorChange,
  onSecondaryInstructorChange,
}: SimpleInstructorSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const Instructor = useQuery({
    queryKey: ["allInstructor"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "users?roles=instructor",
      }),
  });

  const AllInstrcutors: any = Instructor?.data;

  // Filter instructors based on search term
  const filteredInstructors = AllInstrcutors?.data.filter(
    (instructor: ApiInstructor) =>
      instructor.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get available instructors for secondary selection (exclude primary)
  const availableSecondaryInstructors = filteredInstructors?.filter(
    (instructor: ApiInstructor) => {
      const instructorId = instructor.id?.toString();
      return instructorId !== primaryInstructor;
    }
  );

  // Helper function to get instructor display name
  const getInstructorDisplayName = (instructor: ApiInstructor) => {
    const firstName = instructor.first_name || "";
    const lastName = instructor.last_name || "";
    return `${firstName} ${lastName}`.trim() || instructor.email || "Unknown";
  };

  // Helper function to get instructor art forms
  const getInstructorArtForms = (instructor: ApiInstructor) => {
    if (instructor.art_form) {
      return [instructor.art_form];
    }
    return [];
  };

  // Helper function to get instructor languages
  const getInstructorLanguages = (instructor: ApiInstructor) => {
    return instructor.languages || [];
  };

  // Prepare options for SearchableSelect
  const primaryInstructorOptions = useMemo(() => {
    return filteredInstructors
      ?.filter((instructor: ApiInstructor) => instructor.is_active)
      ?.map((instructor: ApiInstructor) => ({
        value: instructor.id.toString(),
        label: `${getInstructorDisplayName(instructor)} - ${getInstructorLanguages(instructor).slice(0, 2).join(", ")}${getInstructorLanguages(instructor).length > 2 ? ` +${getInstructorLanguages(instructor).length - 2} more` : ""}`
      })) || [];
  }, [filteredInstructors]);

  const secondaryInstructorOptions = useMemo(() => {
    const options = availableSecondaryInstructors
      ?.filter((instructor: ApiInstructor) => instructor.is_active)
      ?.map((instructor: ApiInstructor) => ({
        value: instructor.id.toString(),
        label: `${getInstructorDisplayName(instructor)} - ${getInstructorLanguages(instructor).slice(0, 2).join(", ")}${getInstructorLanguages(instructor).length > 2 ? ` +${getInstructorLanguages(instructor).length - 2} more` : ""}`
      })) || [];
    return [{ value: "none", label: "None" }, ...options];
  }, [availableSecondaryInstructors]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Instructor Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search instructors by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div> */}

        {/* Primary Instructor */}
        <div className="space-y-2">
          <Label htmlFor="primaryInstructor">Primary Instructor *</Label>
          <SearchableSelect
            options={primaryInstructorOptions}
            value={primaryInstructor}
            onValueChange={onPrimaryInstructorChange}
            placeholder="Select primary instructor"
            searchPlaceholder="Search instructors..."
            className="w-full"
          />
        </div>

        {/* Secondary Instructor */}
        <div className="space-y-2">
          <Label htmlFor="secondaryInstructor">
            Secondary Instructor (Optional)
          </Label>
          <SearchableSelect
            options={secondaryInstructorOptions}
            value={secondaryInstructor}
            onValueChange={onSecondaryInstructorChange}
            placeholder="Select secondary instructor"
            searchPlaceholder="Search instructors..."
            className="w-full"
          />
        </div>

        {/* Selected Instructors Summary */}
        {(primaryInstructor || secondaryInstructor) && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
            <Label className="text-sm font-medium">Selected Instructors</Label>
            {primaryInstructor && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Primary:</span>
                <span className="font-medium text-primary">
                  {getInstructorDisplayName(
                    AllInstrcutors?.data.find(
                      (i: ApiInstructor) =>
                        i.id.toString() === primaryInstructor
                    )
                  )}
                </span>
              </div>
            )}
            {secondaryInstructor && secondaryInstructor !== "none" && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Secondary:</span>
                <span className="font-medium text-primary">
                  {getInstructorDisplayName(
                    AllInstrcutors?.data.find(
                      (i: ApiInstructor) =>
                        i.id.toString() === secondaryInstructor
                    )
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
