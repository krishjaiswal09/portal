import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { X, Clock, Users, MapPin, Calendar, Plus } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { mockStudents } from "@/data/studentData";

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date | null;
  classData?: any;
}

export function ClassFormModal({ isOpen, onClose, selectedDate, classData }: ClassFormModalProps) {
  const [formData, setFormData] = useState({
    title: classData?.title || '',
    instructor: classData?.instructor || '',
    secondaryInstructor: classData?.secondaryInstructor || '',
    students: classData?.students || [],
    startDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    numberOfClasses: classData?.numberOfClasses || 1,
    endDate: '',
    schedule: [], // Array of { day: '', startTime: '', endTime: '' }
    platform: classData?.platform || '',
    ignoreAvailability: false,
    reserveSlots: false,
    description: classData?.description || '',
  });

  const studentOptions = mockStudents.map(student => ({
    label: student.name,
    value: student.id
  }));

  // Calculate end date dynamically based on number of classes and start date
  const calculateEndDate = (startDate: string, numberOfClasses: number) => {
    if (!startDate || numberOfClasses <= 0) return '';
    const date = new Date(startDate);
    date.setDate(date.getDate() + (numberOfClasses - 1) * 7); // Assuming weekly classes
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { day: '', startTime: '', endTime: '' }],
    }));
  };

  const handleScheduleChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const schedule = [...prev.schedule];
      schedule[index][field] = value;
      return { ...prev, schedule };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold">
              {classData ? 'Edit Class' : 'Schedule New Class'}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="students" className="text-sm font-medium">Students</Label>
                  <MultiSelect
                    options={studentOptions}
                    selected={formData.students}
                    onChange={(selected) => handleInputChange('students', selected)}
                    placeholder="Select students"
                    className="h-auto min-h-10 sm:min-h-11"
                  />
                </div>

                {/* Date and Classes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        const startDate = e.target.value;
                        const endDate = calculateEndDate(startDate, formData.numberOfClasses);
                        handleInputChange('startDate', startDate);
                        handleInputChange('endDate', endDate);
                      }}
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfClasses" className="text-sm font-medium">Number of Classes</Label>
                    <Input
                      id="numberOfClasses"
                      type="number"
                      value={formData.numberOfClasses}
                      onChange={(e) => {
                        const numberOfClasses = parseInt(e.target.value, 10) || 1;
                        const endDate = calculateEndDate(formData.startDate, numberOfClasses);
                        handleInputChange('numberOfClasses', numberOfClasses);
                        handleInputChange('endDate', endDate);
                      }}
                      className="h-10 sm:h-11"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      className="h-10 sm:h-11"
                      disabled
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                    Schedule
                  </h3>
                  {formData.schedule.map((slot, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Day of the Week</Label>
                        <Select
                          value={slot.day}
                          onValueChange={(value) => handleScheduleChange(index, 'day', value)}
                        >
                          <SelectTrigger className="h-10 sm:h-11">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="tuesday">Tuesday</SelectItem>
                            <SelectItem value="wednesday">Wednesday</SelectItem>
                            <SelectItem value="thursday">Thursday</SelectItem>
                            <SelectItem value="friday">Friday</SelectItem>
                            <SelectItem value="saturday">Saturday</SelectItem>
                            <SelectItem value="sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Start Time</Label>
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                          className="h-10 sm:h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">End Time</Label>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                          className="h-10 sm:h-11"
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleScheduleChange(index, 'remove', '')}
                        className="h-10 sm:h-11"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddSchedule}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Slot
                  </Button>
                </div>

                {/* Availability Options */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Instructor Availability</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="ignoreAvailability"
                        checked={formData.ignoreAvailability}
                        onChange={(e) => handleInputChange('ignoreAvailability', e.target.checked)}
                      />
                      Ignore Instructor's Availability
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="reserveSlots"
                        checked={formData.reserveSlots}
                        onChange={(e) => handleInputChange('reserveSlots', e.target.checked)}
                      />
                      Reserve Slots
                    </label>
                  </div>
                </div>

                {/* Platform */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Web Conference Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => handleInputChange('platform', value)}
                  >
                    <SelectTrigger className="h-10 sm:h-11">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmeet">Google Meet</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Instructors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Primary Instructor</Label>
                    <Select
                      value={formData.instructor}
                      onValueChange={(value) => handleInputChange('instructor', value)}
                    >
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="priya-sharma">Priya Sharma</SelectItem>
                        <SelectItem value="raj-patel">Raj Patel</SelectItem>
                        <SelectItem value="anita-singh">Anita Singh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Secondary Instructor (Optional)</Label>
                    <Select
                      value={formData.secondaryInstructor}
                      onValueChange={(value) => handleInputChange('secondaryInstructor', value)}
                    >
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Select secondary instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john-doe">John Doe</SelectItem>
                        <SelectItem value="jane-smith">Jane Smith</SelectItem>
                        <SelectItem value="emma-johnson">Emma Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Add class description, notes, or special instructions..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 order-1 sm:order-2"
            >
              {classData ? 'Update Class' : 'Schedule Class'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
