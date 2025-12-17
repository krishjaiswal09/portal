import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Save, Trash2, Clock, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { hasPermission } from "@/utils/checkPermission";
import { useNavigate } from "react-router-dom";
import { SectionLoader, InlineLoader } from "@/components/ui/loader";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

interface WorkingHoursPayload {
  teacher_id: number;
  weeklySchedule: {
    day: string;
    timeSlots: {
      id?: number;
      startTime: string;
      endTime: string;
      isActive: boolean;
    }[];
  }[];
}

const InstructorWorkingHours = () => {
  const navigate = useNavigate()

  if (!hasPermission("HAS_READ_WORKING_HOURS")) {
    return (
      <DashboardLayout title="No Permission">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You do not have permission to view this page.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: "Monday", slots: [] },
    { day: "Tuesday", slots: [] },
    { day: "Wednesday", slots: [] },
    { day: "Thursday", slots: [] },
    { day: "Friday", slots: [] },
    { day: "Saturday", slots: [] },
    { day: "Sunday", slots: [] },
  ]);

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeOptions.push(timeString);
    }
  }

  const studentsDataMutation = useQuery({
    queryKey: ["instrcutorData"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "users?roles=instructor",
      }),
  });

  const workingHoursDataMutation = useQuery({
    queryKey: ["workingHoursData", selectedInstructor],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: `working_hours/teacher/${selectedInstructor}`,
      }),
    enabled: !!selectedInstructor,
  });

  // const updateWorkingHours = useQuery({
  //   queryKey: ["updateWorkingHours"],
  //   queryFn: () =>
  //     fetchApi<{ data: any[] }>({
  //       path: `working_hours/${selectedInstructor}`,
  //       method: "PATCH",
  //     }),
  // });

  const deleteWorkingHoursMutation = useMutation({
    mutationFn: (id: number | string) =>
      fetchApi({
        path: `working_hours/${id}`,
        method: "DELETE",
      }),
  });

  const workingHoursData = workingHoursDataMutation?.data?.data;
  const instructorsData = studentsDataMutation?.data?.data;

  // Update schedule when working hours data is loaded
  useEffect(() => {
    if (workingHoursData && Array.isArray(workingHoursData)) {
      const updatedSchedule = schedule.map((day) => {
        const matchingDay = workingHoursData.find(
          (dataDay) => dataDay.day === day.day
        );

        if (matchingDay && matchingDay.timeSlots) {
          return {
            ...day,
            slots: matchingDay.timeSlots.map((slot) => ({
              id: slot.id.toString(),
              startTime: slot.startTime.substring(0, 5), // Convert HH:MM:SS to HH:MM
              endTime: slot.endTime.substring(0, 5), // Convert HH:MM:SS to HH:MM
              isActive: slot.isActive,
            })),
          };
        }
        return { ...day, slots: [] };
      });

      setSchedule(updatedSchedule);
    }
  }, [workingHoursData]);

  const workingHoursMutation = useMutation({
    mutationFn: (payload: WorkingHoursPayload) =>
      fetchApi({
        path: "working_hours",
        method: "PUT",
        data: payload,
      }),
  });

  const addTimeSlot = (dayIndex: number) => {
    // Check if we can add more hours
    const currentMinutes = getTotalDayMinutes(dayIndex);
    if (currentMinutes >= 1440) {
      toast({
        title: "Daily Limit Reached",
        description: "Cannot add more slots. 24-hour daily limit reached.",
        variant: "destructive",
      });
      return;
    }
    
    // Find available time slot
    let startTime = "09:00";
    let endTime = "10:00";
    
    // Try to find a non-overlapping time
    for (let hour = 9; hour < 24; hour++) {
      const testStart = `${hour.toString().padStart(2, "0")}:00`;
      const testEnd = `${(hour + 1).toString().padStart(2, "0")}:00`;
      
      if (!isTimeOverlapping(dayIndex, "", testStart, testEnd)) {
        startTime = testStart;
        endTime = testEnd;
        break;
      }
    }

    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      startTime,
      endTime,
      isActive: true,
    };

    setSchedule((prev) =>
      prev.map((day, index) =>
        index === dayIndex ? { ...day, slots: [...day.slots, newSlot] } : day
      )
    );
  };

  const removeTimeSlot = (dayIndex: number, slotId: string) => {
    if (slotId.startsWith("slot-")) {
      setSchedule((prev) =>
        prev.map((day, index) =>
          index === dayIndex
            ? {
              ...day,
              slots: day.slots.filter((slot) => slot.id !== slotId),
            }
            : day
        )
      );
      toast({
        title: "Time slot removed",
        description: "The time slot has been removed.",
        variant: "default",
      });
      return;
    }
    deleteWorkingHoursMutation.mutate(slotId, {
      onSuccess: () => {
        setSchedule((prev) =>
          prev.map((day, index) =>
            index === dayIndex
              ? {
                ...day,
                slots: day.slots.filter((slot) => slot.id !== slotId),
              }
              : day
          )
        );
        toast({
          title: "Time slot deleted",
          description: "The time slot has been deleted successfully.",
          variant: "default",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to delete time slot",
          description: "Failed to delete time slot. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotId: string,
    field: keyof TimeSlot,
    value: any
  ) => {
    if (field === "startTime" || field === "endTime") {
      const currentSlot = schedule[dayIndex]?.slots.find(s => s.id === slotId);
      if (!currentSlot) return;
      
      const newStartTime = field === "startTime" ? value as string : currentSlot.startTime;
      const newEndTime = field === "endTime" ? value as string : currentSlot.endTime;
      
      // Check if end time is after start time
      const [startHour, startMin] = newStartTime.split(":").map(Number);
      const [endHour, endMin] = newEndTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      if (endMinutes <= startMinutes) {
        toast({
          title: "Invalid Time",
          description: "End time must be after start time",
          variant: "destructive",
        });
        return;
      }
      
      // Check for overlapping
      if (isTimeOverlapping(dayIndex, slotId, newStartTime, newEndTime)) {
        toast({
          title: "Time Overlap",
          description: "This time slot overlaps with an existing slot",
          variant: "destructive",
        });
        return;
      }
      
      // Check 24-hour limit
      const currentDayMinutes = getTotalDayMinutes(dayIndex, slotId);
      const newSlotMinutes = endMinutes - startMinutes;
      if (currentDayMinutes + newSlotMinutes > 1440) {
        toast({
          title: "Daily Limit Exceeded",
          description: "Cannot exceed 24 hours per day",
          variant: "destructive",
        });
        return;
      }
    }
    
    setSchedule((prev) =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
            ...day,
            slots: day.slots.map((slot) =>
              slot.id === slotId ? { ...slot, [field]: value } : slot
            ),
          }
          : day
      )
    );
  };

  const toggleSlotStatus = (dayIndex: number, slotId: string) => {
    setSchedule((prev) =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
            ...day,
            slots: day.slots.map((slot) =>
              slot.id === slotId
                ? { ...slot, isActive: !slot.isActive }
                : slot
            ),
          }
          : day
      )
    );
  };

  const handleSave = () => {
    if (!selectedInstructor) {
      toast({
        title: "Please select an instructor first",
        variant: "destructive",
      });
      return;
    }
    const weeklySchedule = schedule
      .filter((day) => day.slots.length > 0) // Only include days with slots
      .map((day) => ({
        day: day.day,
        timeSlots: day.slots.map((slot) => {
          const timeSlot: any = {
            startTime: slot.startTime + ":00", // Convert HH:MM to HH:MM:SS
            endTime: slot.endTime + ":00", // Convert HH:MM to HH:MM:SS
            isActive: slot.isActive,
          };
          if (!slot.id.startsWith("slot-")) {
            timeSlot.id = parseInt(slot.id);
          }

          return timeSlot;
        }),
      }));
    const payload: WorkingHoursPayload = {
      teacher_id: parseInt(selectedInstructor),
      weeklySchedule,
    };
    workingHoursMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Class Types Updated",
          description: "Assigned class types have been updated successfully.",
          variant: "default",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to save working hours",
          description: "Failed to save working hours. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isTimeOverlapping = (dayIndex: number, slotId: string, startTime: string, endTime: string) => {
    const daySlots = schedule[dayIndex]?.slots || [];
    const [newStartHour, newStartMin] = startTime.split(":").map(Number);
    const [newEndHour, newEndMin] = endTime.split(":").map(Number);
    const newStartMinutes = newStartHour * 60 + newStartMin;
    const newEndMinutes = newEndHour * 60 + newEndMin;
    
    return daySlots.some(slot => {
      if (slot.id === slotId || !slot.isActive) return false;
      const [existingStartHour, existingStartMin] = slot.startTime.split(":").map(Number);
      const [existingEndHour, existingEndMin] = slot.endTime.split(":").map(Number);
      const existingStartMinutes = existingStartHour * 60 + existingStartMin;
      const existingEndMinutes = existingEndHour * 60 + existingEndMin;
      
      return (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes);
    });
  };

  const getTotalDayMinutes = (dayIndex: number, excludeSlotId?: string) => {
    const daySlots = schedule[dayIndex]?.slots || [];
    return daySlots
      .filter(slot => slot.isActive && slot.id !== excludeSlotId)
      .reduce((total, slot) => {
        const [startHour, startMin] = slot.startTime.split(":").map(Number);
        const [endHour, endMin] = slot.endTime.split(":").map(Number);
        return total + (endHour * 60 + endMin) - (startHour * 60 + startMin);
      }, 0);
  };

  return (
    <DashboardLayout title="Instructor Working Hours">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
              Instructor Working Hours
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Set recurring weekly availability for instructors
            </p>
          </div>
          <div className="flex gap-2">
            {
              hasPermission("HAS_CREATE_WORKING_HOURS") && <Button
                onClick={handleSave}
                disabled={workingHoursMutation.isPending}
              >
                {workingHoursMutation.isPending ? (
                  <>
                    <InlineLoader size="sm" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Schedule
                  </>
                )}
              </Button>
            }
          </div>
        </div>

        {/* Instructor Selection */}
        {studentsDataMutation.isLoading ? (
          <SectionLoader text="Loading instructors..." />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Select Instructor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md">
                <Label>Instructor</Label>
                <Select
                  value={selectedInstructor}
                  onValueChange={setSelectedInstructor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(instructorsData) &&
                      instructorsData?.map((instructor) => (
                        <SelectItem
                          key={instructor.id}
                          value={instructor.id.toString()}
                        >
                          {instructor.first_name} {instructor.last_name} -{" "}
                          {instructor.email}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Schedule */}
        {selectedInstructor && (
          workingHoursDataMutation.isLoading ? (
            <SectionLoader text="Loading working hours..." />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Weekly Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {schedule.map((daySchedule, dayIndex) => (
                  <div key={daySchedule.day} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{daySchedule.day}</h3>
                      {hasPermission("HAS_CREATE_WORKING_HOURS") && <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addTimeSlot(dayIndex)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Time Slot
                      </Button>}
                    </div>

                    {daySchedule.slots.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        No time slots set
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {daySchedule.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Select
                                value={slot.startTime}
                                onValueChange={(value) =>
                                  updateTimeSlot(
                                    dayIndex,
                                    slot.id,
                                    "startTime",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {formatTime(time)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span className="text-muted-foreground">–</span>
                              <Select
                                value={slot.endTime}
                                onValueChange={(value) =>
                                  updateTimeSlot(
                                    dayIndex,
                                    slot.id,
                                    "endTime",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {formatTime(time)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center gap-2">
                              <Switch
                                checked={slot.isActive}
                                onCheckedChange={() =>
                                  toggleSlotStatus(dayIndex, slot.id)
                                }
                              />
                              <Badge
                                variant={slot.isActive ? "default" : "secondary"}
                              >
                                {slot.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>

                            {hasPermission("HAS_DELETE_WORKING_HOURS") && <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTimeSlot(dayIndex, slot.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>}
                          </div>
                        ))}
                      </div>
                    )}

                    {dayIndex < schedule.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstructorWorkingHours;
