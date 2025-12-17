import React, { useState } from "react";
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Briefcase } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface DayWorkingHours {
  day: string;
  isActive: boolean;
  slots: TimeSlot[];
}

export default function WorkingHours() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workingHours, setWorkingHours] = useState<DayWorkingHours[]>([]);

  // Transform API data to component format
  const transformApiData = (apiData: any[]) => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return daysOfWeek.map((day) => {
      const dayData = apiData.find((d) => d.day === day);
      if (dayData) {
        const activeSlots = dayData.timeSlots.filter(
          (slot: any) => slot.isActive
        );
        return {
          day,
          isActive: activeSlots.length > 0,
          slots: dayData.timeSlots.map((slot: any) => ({
            id: slot.id.toString(),
            startTime: slot.startTime.substring(0, 5), // Convert HH:MM:SS to HH:MM
            endTime: slot.endTime.substring(0, 5), // Convert HH:MM:SS to HH:MM
            isActive: slot.isActive,
          })),
        };
      }
      return { day, isActive: false, slots: [] };
    });
  };

  const {
    data: workingHoursData,
    isLoading: isWorkingHoursLoading,
    error: workingHoursError,
    refetch: refetchWorkingHours,
  } = useQuery({
    queryKey: ["working_hours", user?.id],
    queryFn: () =>
      fetchApi({
        path: `working_hours/teacher/${user?.id}`,
      }),
    enabled: !!user?.id,
  });

  const allWorkingHours: any = workingHoursData;

  React.useEffect(() => {
    if (allWorkingHours?.data) {
      setWorkingHours(transformApiData(allWorkingHours?.data));
    }
  }, [allWorkingHours?.data]);

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeOptions.push(timeString);
    }
  }

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
    const daySlots = workingHours[dayIndex]?.slots || [];
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
      id: Date.now().toString(),
      startTime,
      endTime,
      isActive: true,
    };

    setWorkingHours((prev) =>
      prev.map((day, index) =>
        index === dayIndex ? { ...day, slots: [...day.slots, newSlot] } : day
      )
    );
  };

  const deleteTimeSlotMutation = useMutation({
    mutationFn: (slotId: string) =>
      fetchApi({
        path: `working_hours/${slotId}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Time slot deleted successfully",
      });
      refetchWorkingHours();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete time slot",
        variant: "destructive",
      });
    },
  });

  const removeTimeSlot = (dayIndex: number, slotId: string) => {
    const isNewSlot = slotId.length > 10;
    if (isNewSlot) {
      setWorkingHours((prev) =>
        prev?.map((day, index) =>
          index === dayIndex
            ? {
                ...day,
                slots: day.slots.filter((slot) => slot.id !== slotId),
              }
            : day
        )
      );
    } else {
      deleteTimeSlotMutation.mutate(slotId);
    }
  };

  const saveWorkingHoursMutation = useMutation({
    mutationFn: (payload: any) =>
      fetchApi({
        path: "working_hours",
        method: "PUT",
        data: payload,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Working hours saved successfully",
      });
      refetchWorkingHours();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to save working hours",
        variant: "destructive",
      });
    },
  });

  const handleSaveWorkingHours = () => {
    const weeklySchedule = workingHours
      .filter((day) => day.slots.length > 0)
      .map((day) => ({
        day: day.day,
        timeSlots: day.slots.map((slot) => ({
          startTime: slot.startTime + ":00", // Convert HH:MM to HH:MM:SS
          endTime: slot.endTime + ":00", // Convert HH:MM to HH:MM:SS
          isActive: slot.isActive,
        })),
      }));

    const payload = {
      teacher_id: user?.id,
      weeklySchedule,
    };

    saveWorkingHoursMutation.mutate(payload);
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotId: string,
    field: keyof TimeSlot,
    value: string | boolean
  ) => {
    if (field === "startTime" || field === "endTime") {
      const currentSlot = workingHours[dayIndex]?.slots.find(s => s.id === slotId);
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
      if (currentDayMinutes + newSlotMinutes > 1440) { // 24 hours = 1440 minutes
        toast({
          title: "Daily Limit Exceeded",
          description: "Cannot exceed 24 hours per day",
          variant: "destructive",
        });
        return;
      }
    }
    
    setWorkingHours((prev) =>
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

  const getTotalHours = (slots: TimeSlot[]) => {
    let totalMinutes = 0;
    slots
      .filter((slot) => slot.isActive)
      .forEach((slot) => {
        const [startHour, startMin] = slot.startTime.split(":").map(Number);
        const [endHour, endMin] = slot.endTime.split(":").map(Number);
        const startTotalMin = startHour * 60 + startMin;
        const endTotalMin = endHour * 60 + endMin;
        totalMinutes += endTotalMin - startTotalMin;
      });
    return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
  };

  const isTimeOverlapping = (dayIndex: number, slotId: string, startTime: string, endTime: string) => {
    const daySlots = workingHours[dayIndex]?.slots || [];
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
    const daySlots = workingHours[dayIndex]?.slots || [];
    return daySlots
      .filter(slot => slot.isActive && slot.id !== excludeSlotId)
      .reduce((total, slot) => {
        const [startHour, startMin] = slot.startTime.split(":").map(Number);
        const [endHour, endMin] = slot.endTime.split(":").map(Number);
        return total + (endHour * 60 + endMin) - (startHour * 60 + startMin);
      }, 0);
  };

  return (
    <InstructorDashboardLayout title="Working Hours">
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Briefcase className="w-6 h-6" />
              Default Weekly Working Schedule
            </CardTitle>
            <p className="text-orange-100">
              Set your regular working hours for each day of the week
            </p>
          </CardHeader>
        </Card>

        {/* Working Hours Setup */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {workingHours?.map((dayHours, dayIndex) => (
                <div key={dayHours.day} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold text-lg">{dayHours.day}</h3>
                      <div className="flex items-center gap-2">
                        {dayHours.slots.length > 0 && (
                          <Badge variant="outline" className="ml-2">
                            Total: {getTotalHours(dayHours.slots)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => addTimeSlot(dayIndex)}
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Slot
                    </Button>
                  </div>

                  {dayHours.slots.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">
                      No working hours set. Click "Add Slot" to define working
                      hours.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayHours.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`flex items-center gap-4 p-3 rounded-lg ${
                            slot.isActive
                              ? "bg-gray-50"
                              : "bg-red-50 opacity-60"
                          }`}
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
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <span className="text-gray-500">to</span>

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
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center gap-2 ml-auto">
                            <Switch
                              checked={slot.isActive}
                              onCheckedChange={(checked) =>
                                updateTimeSlot(
                                  dayIndex,
                                  slot.id,
                                  "isActive",
                                  checked
                                )
                              }
                            />
                            <Button
                              onClick={() => removeTimeSlot(dayIndex, slot.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              disabled={deleteTimeSlotMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <div className="text-sm text-gray-600">
                <p>
                  Total weekly hours:{" "}
                  {getTotalHours(workingHours.flatMap((day) => day.slots))}
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline">Reset to Default</Button>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  onClick={handleSaveWorkingHours}
                  disabled={saveWorkingHoursMutation.isPending}
                >
                  {saveWorkingHoursMutation.isPending
                    ? "Saving..."
                    : "Save Working Hours"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </InstructorDashboardLayout>
  );
}
