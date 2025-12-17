import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Save, CalendarDays, ArrowLeft } from "lucide-react";
import { timezones } from "@/data/instructorData";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { hasPermission } from "@/utils/checkPermission";
import { useNavigate } from "react-router-dom";
import { SectionLoader, InlineLoader } from "@/components/ui/loader";

// Types for the API response
interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface DayAvailability {
  day: string;
  date: string;
  timeSlots: TimeSlot[];
}

interface GeneratedSlotsResponse {
  message: string;
  success: boolean;
  data: {
    teacher_id: number;
    teacher_name: string;
    slot_duration_minutes: number;
    start_date: string;
    end_date: string;
    availability: DayAvailability[];
  };
}

const InstructorAvailability = () => {
  const navigate = useNavigate()

  if (!hasPermission("HAS_READ_AVAILABILITY")) {
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
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Kolkata");
  const [duration, setDuration] = useState("60");
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 1)
    );
    return startOfWeek.toISOString().split("T")[0];
  });

  const [availability, setAvailability] = useState<Record<string, string[]>>(
    {}
  );

  const {
    data: instrcutorDataMutation
  } = useQuery({
    queryKey: ["instrcutorData"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "users?roles=instructor",
      }),
  });

  const instructors = instrcutorDataMutation?.data;

  // Helper function to get start and end dates from selected week
  const getWeekDateRange = (weekStart: string) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  // Helper function to get timezone offset in minutes
  const getTimezoneOffset = (timezone: string) => {
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const targetTime = new Date(utc + (date.getTimezoneOffset() * 60000));
    
    try {
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'longOffset'
      });
      const parts = formatter.formatToParts(targetTime);
      const offsetPart = parts.find(part => part.type === 'timeZoneName')?.value;
      
      if (offsetPart) {
        const match = offsetPart.match(/GMT([+-])(\d{1,2}):(\d{2})/);
        if (match) {
          const sign = match[1] === '+' ? 1 : -1;
          const hours = parseInt(match[2]);
          const minutes = parseInt(match[3]);
          return sign * (hours * 60 + minutes);
        }
      }
    } catch (e) {
      console.warn('Failed to get timezone offset for', timezone);
    }
    
    // Fallback for Asia/Kolkata
    if (timezone === 'Asia/Kolkata') return 330;
    return 0;
  };

  // Query for generated slots with date range and timezone
  const {
    data: generatedSlots,
  } = useQuery({
    queryKey: ["generatedSlots", selectedInstructor, selectedWeek, duration, selectedTimezone],
    queryFn: () => {
      const { startDate, endDate } = getWeekDateRange(selectedWeek);
      const offset = getTimezoneOffset(selectedTimezone);
      return fetchApi<GeneratedSlotsResponse>({
        path: `availability/date-range/${selectedInstructor}/${startDate}/${endDate}/${duration}/${offset}`,
      });
    },
    enabled: !!selectedInstructor && !!duration && !!selectedWeek,
  });

  const timeSlots = [
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  // Helper function to check if a time slot is available from API data
  const isSlotAvailableFromAPI = (dayName: string, time: string): boolean => {
    if (!generatedSlots?.data?.availability) return false;
    const dayData = generatedSlots.data.availability.find((day) => day.day === dayName);
    if (!dayData) return false;
    return dayData.timeSlots.some(
      (slot) => slot.startTime === time && slot.isActive
    );
  };

  // Helper function to get slot details from API data
  const getSlotDetailsFromAPI = (
    dayName: string,
    time: string
  ): TimeSlot | null => {
    if (!generatedSlots?.data?.availability) return null;

    const dayData = generatedSlots.data.availability.find((day) => day.day === dayName);

    if (!dayData) return null;

    return (
      dayData.timeSlots.find(
        (slot) => slot.startTime === time && slot.isActive
      ) || null
    );
  };

  const getDaysOfWeek = (startDate: string) => {
    const start = new Date(startDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push({
        date: day.toISOString().split("T")[0],
        dayName: day.toLocaleDateString("en-US", { weekday: "long" }), // Changed to full day name to match API
        dayNumber: day.getDate(),
        isToday: day.toDateString() === new Date().toDateString(),
      });
    }

    return days;
  };

  // Use API dates if available, otherwise fall back to selected week
  const weekDays = generatedSlots?.data?.availability 
    ? generatedSlots.data.availability.map(dayData => {
        const date = new Date(dayData.date);
        return {
          date: dayData.date,
          dayName: dayData.day,
          dayNumber: date.getDate(),
          isToday: date.toDateString() === new Date().toDateString(),
        };
      })
    : getDaysOfWeek(selectedWeek);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const toggleTimeSlot = (date: string, time: string) => {
    setAvailability((prev) => {
      const daySlots = prev[date] || [];
      const newSlots = daySlots.includes(time)
        ? daySlots.filter((slot) => slot !== time)
        : [...daySlots, time].sort();

      return {
        ...prev,
        [date]: newSlots,
      };
    });
  };

  const handleSave = () => {
    if (!selectedInstructor) {
      toast.error("Please select an instructor first");
      return;
    }
    toast.success("Availability saved successfully!");
  };

  const loadSampleData = () => {
    const sampleAvailability: Record<string, string[]> = {};
    weekDays.forEach((day, index) => {
      if (index < 5) {
        sampleAvailability[day.date] = ["09:00", "10:30", "14:00", "15:30"];
      }
    });
    setAvailability(sampleAvailability);
  };

  const getTotalSlots = () => {
    return Object.values(availability).reduce(
      (total, slots) => total + slots.length,
      0
    );
  };

  // Get total available slots from API
  const getTotalAvailableSlotsFromAPI = () => {
    if (!generatedSlots?.data?.availability) return 0;
    return generatedSlots.data.availability.reduce(
      (total, day) => total + day.timeSlots.filter(slot => slot.isActive).length,
      0
    );
  };

  return (
    <DashboardLayout title="Instructor Availability">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
              Instructor Availability
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Set specific availability slots for instructors (non-recurring)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Availability
            </Button>
          </div>
        </div>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Instructor</Label>
                <Select
                  value={selectedInstructor}
                  onValueChange={setSelectedInstructor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors?.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.first_name} {instructor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={selectedTimezone}
                  onValueChange={setSelectedTimezone}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones?.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration per Slot</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="40">40 minutes</SelectItem>
                    <SelectItem value="50">50 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Week Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <Label>Week Selection</Label>
              </div>
              <input
                type="week"
                value={
                  selectedWeek
                    ? new Date(selectedWeek)
                      .toISOString()
                      .slice(0, 10)
                      .split("-")
                      .slice(0, 2)
                      .join("-W") +
                    String(
                      Math.ceil(
                        (new Date(selectedWeek).getDate() -
                          new Date(selectedWeek).getDay() +
                          1) /
                        7
                      )
                    ).padStart(2, "0")
                    : ""
                }
                onChange={(e) => {
                  const [year, week] = e.target.value.split("-W");
                  const firstDayOfYear = new Date(parseInt(year), 0, 1);
                  const weekStart = new Date(
                    firstDayOfYear.getTime() +
                    (parseInt(week) - 1) * 7 * 24 * 60 * 60 * 1000
                  );
                  weekStart.setDate(
                    weekStart.getDate() - weekStart.getDay() + 1
                  );
                  setSelectedWeek(weekStart.toISOString().split("T")[0]);
                }}
                className="px-3 py-2 border rounded-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* API Data Summary */}
        {/* {generatedSlots?.data && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Generated Availability Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {generatedSlots.data.teacher_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Instructor
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {getTotalAvailableSlotsFromAPI()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Available Slots
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {generatedSlots.data.slot_duration_minutes} min
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Slot Duration
                  </div>
                </div>
              </div>


            </CardContent>
          </Card>
        )} */}

        {/* Availability Calendar */}
        {selectedInstructor && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Availability
                </span>
                <div className="flex gap-2">
                  {/* <Badge variant="outline">
                    {getTotalSlots()} slots selected
                  </Badge> */}
                  {/* {generatedSlots?.data && (
                    <Badge variant="secondary">
                      {getTotalAvailableSlotsFromAPI()} generated slots
                    </Badge>
                  )} */}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays?.map((day) => (
                  <div
                    key={day.date}
                    className={`text-center p-2 rounded-lg border ${day.isToday
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/20"
                      }`}
                  >
                    <div className="font-medium">{day.dayName}</div>
                    <div className="text-sm text-muted-foreground">
                      {day.dayNumber}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-4">
                {weekDays?.map((day) => (
                  <div key={day.date} className="space-y-2 border rounded-lg p-3 bg-muted/5">
                    <div className="text-sm font-medium text-center pb-2 border-b">
                      {day.dayName} {day.dayNumber}
                    </div>
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                      {(() => {
                        // Get slots directly from API data for this day
                        const dayData = generatedSlots?.data?.availability?.find(
                          (d) => d.day === day.dayName
                        );
                        
                        if (!dayData?.timeSlots || dayData.timeSlots.length === 0) {
                          return (
                            <div className="text-center py-4 text-muted-foreground text-xs">
                              No slots available
                            </div>
                          );
                        }
                        
                        return dayData.timeSlots.map((slot) => {
                          const isSelected = availability[day.date]?.includes(slot.startTime) || false;
                          
                          // Determine button variant and styling
                          let variant: "default" | "outline" | "secondary" = "outline";
                          let className = "w-full text-xs h-8";

                          if (isSelected) {
                            variant = "default";
                          } else if (slot.isActive) {
                            variant = "secondary";
                            className += " bg-green-100 hover:bg-green-200 border-green-300";
                          }

                          return (
                            <div
                              key={slot.id}
                              className="w-full text-xs h-8 px-3 py-2 rounded-md border bg-green-100 border-green-300 flex items-center justify-center"
                              title={`Slot ID: ${slot.id} (${slot.startTime} - ${slot.endTime})`}
                            >
                              {formatTime(slot.startTime)}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              {/* <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Selected by user</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                    <span>Working hours (from API)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span>Available slots (from API)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted border rounded"></div>
                    <span>Not available</span>
                  </div>
                </div>
              </div> */}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstructorAvailability;
