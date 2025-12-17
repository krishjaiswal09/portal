import React, { useState } from "react";
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout";
import { ParentMessageIcon } from "@/components/parent/ParentMessageIcon";
import { ParentLearnerSelector } from "@/components/parent/ParentLearnerSelector";
import { ParentCancelRescheduleModal } from "@/components/parent/ParentCancelRescheduleModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  BookOpen,
  User,
  Calendar,
  Clock,
  RotateCcw,
  X,
  Video,
} from "lucide-react";
import { useParentLearner } from "@/contexts/ParentLearnerContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ClassItem {
  id: string;
  name: string;
  instructor: string;
  artform: string;
  date: string;
  time: string;
  status: "today" | "upcoming" | "completed" | "cancelled" | "reschedule";
  studentName: string;
  originalData: any;
  canJoin: boolean;
  canCancel?: boolean;
  canReschedule?: boolean;
}



const ParentClasses = () => {
  const { selectedLearner } = useParentLearner();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "today" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [showCancelRescheduleModal, setShowCancelRescheduleModal] =
    useState(false);
  const [selectedClassForAction, setSelectedClassForAction] =
    useState<any>(null);

  const parentStudentClassData = useQuery({
    queryKey: ["parentStudentClassData", selectedLearner?.id],
    queryFn: () =>
      fetchApi<any>({
        path: `classes/class-schedule/student/${selectedLearner?.id}`,
      }),
    enabled: !!selectedLearner?.id,
  });

  const markAttendanceMutation = useMutation({
    mutationFn: (data: { classId: string; userId: number }) =>
      fetchApi({
        path: `classes/attendance/class/${data.classId}/mark`,
        method: "POST",
        data: {
          attendance_records: [
            {
              user_id: data.userId,
              present: true,
              join_time: new Date().toISOString(),
            },
          ],
        },
      }),
  });

  // Transform API data to match the expected format
  const transformClassData = (
    apiData: any[],
    type: "today" | "upcoming" | "past"
  ) => {
    return apiData.map((item) => ({
      id: item.id.toString(),
      name: item.title,
      instructor: `${item.primary_instructor_first_name} ${item.primary_instructor_last_name}`,
      date: item.start_date ? format(new Date(item.start_date), "MMM dd") : "",
      time: `${item.start_time} - ${item.end_time}`,
      status: item.status as
        | "today"
        | "upcoming"
        | "completed"
        | "cancelled"
        | "reschedule",
      studentName: selectedLearner?.name || "Student",
      artform: item.course_title || "Music",
      canJoin: item.meeting_link && (type === "today"),
      canCancel: item.canCancel,
      canReschedule: item.canReschedule,
      originalData: item,
    }));
  };

  // Get classes from API data
  const todaysClasses = parentStudentClassData?.data?.today_classes
    ? transformClassData(parentStudentClassData.data.today_classes, "today")
    : [];

  const upcomingClasses = parentStudentClassData?.data?.upcoming_classes
    ? transformClassData(
      parentStudentClassData.data.upcoming_classes,
      "upcoming"
    )
    : [];

  const pastClasses = parentStudentClassData?.data?.past_classes
    ? transformClassData(parentStudentClassData.data.past_classes, "past")
    : [];

  // Combine all classes
  const allClasses = [...todaysClasses, ...upcomingClasses, ...pastClasses];

  const filteredClasses = allClasses.filter((classItem) => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.artform.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "today")
      return matchesSearch && todaysClasses.some((c) => c.id === classItem.id);
    if (activeFilter === "upcoming")
      return (
        matchesSearch && upcomingClasses.some((c) => c.id === classItem.id)
      );
    if (activeFilter === "completed")
      return matchesSearch && classItem.status === "completed";
    if (activeFilter === "cancelled")
      return matchesSearch && classItem.status === "cancelled";
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "reschedule":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Scheduled";
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "reschedule":
        return "Rescheduled";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const filters = [
    {
      key: "all" as const,
      label: "All Classes",
      count: allClasses.length,
    },
    {
      key: "today" as const,
      label: "Today",
      count: todaysClasses.length,
    },
    {
      key: "upcoming" as const,
      label: "Upcoming",
      count: upcomingClasses.length,
    },
    {
      key: "completed" as const,
      label: "Completed",
      count: pastClasses.filter((c) => c.status === "completed").length,
    },
    {
      key: "cancelled" as const,
      label: "Cancelled",
      count: allClasses.filter((c) => c.status === "cancelled").length,
    },
  ];

  const handleReschedule = (classId: string) => {
    const classInfo = allClasses.find((c) => c.id === classId);
    setSelectedClassForAction(classInfo?.originalData);
    setShowCancelRescheduleModal(true);
  };

  const handleCancel = (classId: string) => {
    const classInfo = allClasses.find((c) => c.id === classId);
    setSelectedClassForAction(classInfo?.originalData);
    setShowCancelRescheduleModal(true);
  };

  const handleCancelClass = (reason: string) => {
    toast({
      title: "Class Cancelled",
      description: `Your ${selectedClassForAction?.title} class has been cancelled. Credits will be refunded to your account.`,
    });
    setShowCancelRescheduleModal(false);
    setSelectedClassForAction(null);
  };

  const handleRescheduleClass = (data: any) => {
    toast({
      title: "Class Rescheduled",
      description: `Your ${selectedClassForAction?.title} class has been rescheduled to ${data.date} at ${data.time}.`,
    });
    setShowCancelRescheduleModal(false);
    setSelectedClassForAction(null);
  };

  return (
    <ParentDashboardLayout title="Classes">
      <ParentLearnerSelector />

      <div className="space-y-6">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <Card>
          <CardContent className="p-0">
            <div className="border-b">
              <div className="flex overflow-x-auto">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeFilter === filter.key
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Classes List */}
            {filteredClasses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No classes found
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "No classes scheduled yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {classItem.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{classItem.artform}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{classItem.instructor}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{classItem.studentName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{classItem.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{classItem.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        <Badge className={getStatusColor(classItem.status)}>
                          {getStatusLabel(classItem.status)}
                        </Badge>
                        {classItem.canJoin && classItem.status !== "cancelled" && classItem.status !== "completed" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              if (classItem.originalData.meeting_link) {
                                window.open(classItem.originalData.meeting_link, "_blank");
                                if (classItem?.id && user?.id) {
                                  markAttendanceMutation.mutate({
                                    classId: classItem.id.toString(),
                                    userId: user.id,
                                  });
                                }
                              }
                            }}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Join
                          </Button>
                        )}
                        {(classItem.status === "upcoming" ||
                          classItem.status === "today") && (
                            <div className="flex gap-1">
                              {classItem.canReschedule && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2"
                                  onClick={() => handleReschedule(classItem.id)}
                                >
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  Reschedule
                                </Button>
                              )}
                              {classItem.canCancel && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2"
                                  onClick={() => handleCancel(classItem.id)}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Cancel
                                </Button>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ParentMessageIcon />

      {/* Cancel/Reschedule Modal */}
      <ParentCancelRescheduleModal
        isOpen={showCancelRescheduleModal}
        onClose={() => setShowCancelRescheduleModal(false)}
        onCancel={handleCancelClass}
        onReschedule={handleRescheduleClass}
        classInfo={selectedClassForAction ? {
          ...selectedClassForAction,
          canCancel: allClasses.find(c => c.id === selectedClassForAction.id)?.canCancel,
          canReschedule: allClasses.find(c => c.id === selectedClassForAction.id)?.canReschedule
        } : null}
      />
    </ParentDashboardLayout>
  );
};

export default ParentClasses;