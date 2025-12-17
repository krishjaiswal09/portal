import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudentCancelRescheduleModal } from "@/components/student/StudentCancelRescheduleModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SectionLoader } from "@/components/ui/loader";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "ongoing":
      return "bg-green-500";
    case "scheduled":
      return "bg-blue-500";
    case "cancelled":
      return "bg-red-500";
    case "reschedule":
      return "bg-gray-500";
    default:
      return "bg-blue-500";
  }
};

const formatTime = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return "Time TBD";

  const formatTimeString = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return `${formatTimeString(startTime)} - ${formatTimeString(endTime)}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "Date TBD";
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
};

export function MyClassesSection() {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: allClasses, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: () =>
      fetchApi<any>({
        path: "classes/class-schedule",
      }),
  });

  const { data: cancelationReasons } = useQuery({
    queryKey: ["cancelationReason"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "cancelation-reason",
      }),
  });

  const cancelClassMutation = useMutation({
    mutationFn: (data: { id: string; reason: number }) =>
      fetchApi({
        path: `classes/class-schedule/${data.id}`,
        method: "PATCH",
        data: {
          reason: data.reason,
          status: "cancelled",
        },
      }),
    onSuccess: () => {
      toast({
        title: "Class Cancelled",
        description: "Your class has been successfully cancelled.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to cancel class.",
        variant: "destructive",
      });
    },
  });

  const todaysClasses = allClasses?.today_classes || [];
  const upcomingClasses = allClasses?.upcoming_classes || [];

  const transformClass = (classItem: any) => ({
    id: classItem.id.toString(),
    title: classItem.title || classItem.course_title || "Untitled Class",
    instructor:
      `${classItem.primary_instructor_first_name || ""} ${
        classItem.primary_instructor_last_name || ""
      }`.trim() || "Unknown Instructor",
    time: formatTime(classItem.start_time, classItem.end_time),
    date: formatDate(classItem.start_date),
    status: classItem.status,
    statusColor: getStatusColor(classItem.status),
    originalData: classItem,
  });

  const handleCancelReschedule = (classInfo: any) => {
    setSelectedClass(classInfo);
    setIsModalOpen(true);
  };

  const handleCancel = (reason: string) => {
    if (!selectedClass?.originalData?.id) {
      toast({
        title: "Error",
        description: "No class selected for cancellation.",
        variant: "destructive",
      });
      return;
    }

    const reasonObj = cancelationReasons?.data?.find(
      (r: any) => r.name === reason
    );

    if (!reasonObj) {
      toast({
        title: "Error",
        description: "Invalid cancellation reason selected.",
        variant: "destructive",
      });
      return;
    }

    cancelClassMutation.mutate({
      id: selectedClass.originalData.id.toString(),
      reason: reasonObj.id,
    });
  };

  const handleReschedule = (data: any) => {
    toast({
      title: "Reschedule Request",
      description: "Reschedule functionality will be implemented soon.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Classes</h2>
        <Button variant="outline" size="sm" onClick={() => navigate("/classes")}>
          View All Classes
        </Button>
      </div>

      {isLoadingClasses ? (
        <SectionLoader text="Loading classes..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Classes */}
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {todaysClasses?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No classes scheduled for today</p>
                </div>
              ) : (
                todaysClasses?.map((classItem: any) => {
                  const transformedClass = transformClass(classItem);
                  return (
                    <div
                      key={transformedClass.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">
                          {transformedClass.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-1">
                          Instructor: {transformedClass.instructor}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          {transformedClass.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-white text-xs ${transformedClass.statusColor}`}
                        >
                          {transformedClass.status}
                        </Badge>
                        {transformedClass.status !== "Cancelled" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleCancelReschedule(transformedClass)
                                }
                              >
                                Cancel/Reschedule
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {upcomingClasses?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming classes scheduled</p>
                </div>
              ) : (
                upcomingClasses?.map((classItem: any) => {
                  const transformedClass = transformClass(classItem);
                  return (
                    <div
                      key={transformedClass.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">
                          {transformedClass.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-1">
                          Instructor: {transformedClass.instructor}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          {transformedClass.date}, {transformedClass.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-white text-xs ${transformedClass.statusColor}`}
                        >
                          {transformedClass.status}
                        </Badge>
                        {transformedClass.status !== "Cancelled" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleCancelReschedule(transformedClass)
                                }
                              >
                                Cancel/Reschedule
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
          </Card>
        </div>
      )}

      <StudentCancelRescheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancel={handleCancel}
        onReschedule={handleReschedule}
        classInfo={{
          id: selectedClass?.originalData?.id,
          title: selectedClass?.title,
          type: selectedClass?.title,
          startDate: selectedClass?.originalData?.start_date,
          startTime: selectedClass?.time,
          canCancel: selectedClass?.originalData?.canCancel,
          canReschedule: selectedClass?.originalData?.canReschedule,
        }}
      />
    </div>
  );
}
