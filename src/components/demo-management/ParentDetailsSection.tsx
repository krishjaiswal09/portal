import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";

interface ParentFormData {
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  sameAsParent: boolean;
}

interface ParentDetailsSectionProps {
  parentData: ParentFormData;
  onParentDataChange: (data: ParentFormData) => void;
  onSameAsParentChange: (checked: boolean) => void;
}

export function ParentDetailsSection({
  parentData,
  onParentDataChange,
  onSameAsParentChange,
}: ParentDetailsSectionProps) {
  const updateField = (
    field: keyof ParentFormData,
    value: string | boolean
  ) => {
    onParentDataChange({ ...parentData, [field]: value });
  };

  const handleSameAsParentChange = (checked: boolean) => {
    updateField("sameAsParent", checked);
    onSameAsParentChange(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Parent/Guardian Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parentFirstName">First Name *</Label>
            <Input
              id="parentFirstName"
              value={parentData.parentFirstName}
              onChange={(e) => updateField("parentFirstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentLastName">Last Name *</Label>
            <Input
              id="parentLastName"
              value={parentData.parentLastName}
              onChange={(e) => updateField("parentLastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parentEmail">Email Address *</Label>
            <Input
              id="parentEmail"
              type="email"
              value={parentData.parentEmail}
              onChange={(e) => updateField("parentEmail", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentPhone">Phone Number *</Label>
            <Input
              id="parentPhone"
              value={parentData.parentPhone}
              onChange={(e) => updateField("parentPhone", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Same as Parent Checkbox */}
        <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Checkbox
            id="sameAsParent"
            checked={parentData.sameAsParent}
            onCheckedChange={handleSameAsParentChange}
          />
          <div>
            <Label
              htmlFor="sameAsParent"
              className="text-sm font-medium cursor-pointer"
            >
              Same as Parent
            </Label>
            <p className="text-xs text-muted-foreground">
              Use parent's email and phone for student contact details
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
