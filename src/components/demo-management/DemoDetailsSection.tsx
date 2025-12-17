
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock } from "lucide-react";

interface DemoFormData {
  date: string;
  startTime: string;
  endTime: string;
  ignoreInstructorAvailability: boolean;
}

interface DemoDetailsSectionProps {
  demoData: DemoFormData;
  onDemoDataChange: (data: DemoFormData) => void;
}

export function DemoDetailsSection({ demoData, onDemoDataChange }: DemoDetailsSectionProps) {
  const updateField = (field: keyof DemoFormData, value: string | boolean) => {
    onDemoDataChange({ ...demoData, [field]: value });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Date & Time Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={demoData.date}
              onChange={(e) => updateField('date', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="startTime"
                type="time"
                value={demoData.startTime}
                onChange={(e) => updateField('startTime', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="endTime"
                type="time"
                value={demoData.endTime}
                onChange={(e) => updateField('endTime', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Instructor Availability Override */}
        <div className="flex items-center space-x-2 p-3 border rounded-lg">
          <Checkbox
            id="ignoreAvailability"
            checked={demoData.ignoreInstructorAvailability}
            onCheckedChange={(checked) => updateField('ignoreInstructorAvailability', checked === true)}
          />
          <div>
            <Label htmlFor="ignoreAvailability" className="text-sm font-medium cursor-pointer">
              Ignore Instructor Availability
            </Label>
            <p className="text-xs text-muted-foreground">
              Schedule this demo even if the instructor is not available at the selected time
            </p>
          </div>
        </div>

        {/* Availability Warning */}
        {demoData.date && demoData.startTime && !demoData.ignoreInstructorAvailability && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <strong>Note:</strong> Please verify instructor availability for the selected time slot.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
