import React, { useEffect } from "react";
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
import { User } from "lucide-react";
import { countries } from "../user-management/mockData";

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ageType: string;
  gender: string;
  country: string;
  state: string;
  pin: string;
  city: string;
  sameAsParent?: boolean;
}

interface StudentDetailsSectionProps {
  studentData: StudentFormData;
  onStudentDataChange: (data: StudentFormData) => void;
  sameAsParent?: boolean;
  onAgeTypeChange?: (ageType: string) => void;
}

export function StudentDetailsSection({
  studentData,
  onStudentDataChange,
  sameAsParent = false,
  onAgeTypeChange,
}: StudentDetailsSectionProps) {
  const updateField = (field: keyof StudentFormData, value: string) => {
    onStudentDataChange({ ...studentData, [field]: value });

    // If ageType is changing, notify parent component
    if (field === "ageType" && onAgeTypeChange) {
      onAgeTypeChange(value);
    }
  };

  // Clear sameAsParent when ageType changes to adult
  useEffect(() => {
    if (studentData.ageType === "adult" && sameAsParent && onAgeTypeChange) {
      onAgeTypeChange("adult");
    }
  }, [studentData.ageType, sameAsParent, onAgeTypeChange]);

  // Ensure email and phone are enabled for adults
  const isAdult = studentData.ageType === "adult";
  const shouldDisableFields = sameAsParent && !isAdult;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Student Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Student Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={studentData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={studentData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={studentData.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
              disabled={shouldDisableFields}
              className={shouldDisableFields ? "opacity-50 bg-muted" : ""}
            />
            {shouldDisableFields && (
              <p className="text-xs text-muted-foreground">
                Using parent's email
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number {studentData.ageType === "adult" ? "*" : ""}
            </Label>
            <Input
              id="phone"
              value={studentData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required={studentData.ageType === "adult"}
              disabled={shouldDisableFields}
              className={shouldDisableFields ? "opacity-50 bg-muted" : ""}
            />
            {shouldDisableFields && (
              <p className="text-xs text-muted-foreground">
                Using parent's phone
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ageType">Age Type *</Label>
            <Select
              value={studentData.ageType}
              onValueChange={(value) => updateField("ageType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select age type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kid">Kid (Under 18)</SelectItem>
                <SelectItem value="adult">Adult (18+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={studentData.gender}
              onValueChange={(value) => updateField("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={studentData.country}
              onValueChange={(value) => updateField("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries?.map(c => (
                  <SelectItem key={`country${c.code}_${c.name}`} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={studentData.state}
              onChange={(e) => updateField("state", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={studentData.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pin">Pin</Label>
            <Input
              id="pin"
              value={studentData.pin}
              onChange={(e) => updateField("pin", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
