import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  User,
  Video,
  BookOpen,
  Edit,
  X,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useAuth } from "@/contexts/AuthContext";
import { getUTCJoinTime } from "@/utils/caseTransform";

interface ClassScheduleProps {
  todaysClasses: Array<{
    id: string;
    subject: string;
    time: string;
    instructor: string;
    type: "individual" | "group";
    status: "scheduled" | "completed" | "cancelled" | "upcoming";
    attendees?: number;
    maxAttendees?: number;
    feedbackGiven?: boolean;
    date: string;
    cancelation_reason_text?: string;
    canCancel?: boolean;
    canJoin?: boolean;
    canReschedule?: boolean;
    meeting_link?: string;
  }>;
  upcomingClasses: Array<{
    id: string;
    subject: string;
    time: string;
    instructor: string;
    type: "individual" | "group";
    status: "scheduled" | "completed" | "cancelled" | "upcoming";
    attendees?: number;
    maxAttendees?: number;
    date: string;
    cancelation_reason_text?: string;
    canCancel?: boolean;
    canJoin?: boolean;
    canReschedule?: boolean;
    meeting_link?: string;
  }>;
  cancelledClasses: Array<{
    id: string;
    subject: string;
    time: string;
    instructor: string;
    type: "individual" | "group";
    status: "scheduled" | "completed" | "cancelled" | "upcoming";
    attendees?: number;
    maxAttendees?: number;
    date: string;
    cancelation_reason_text?: string;
    canCancel?: boolean;
    canJoin?: boolean;
    canReschedule?: boolean;
    meeting_link?: string;
  }>;
  onReschedule?: (classId: string) => void;
  onCancel?: (classId: string) => void;
}

export function EnhancedClassSchedule({
  todaysClasses,
  upcomingClasses,
  cancelledClasses = [],
  onReschedule,
  onCancel,
}: ClassScheduleProps) {

  const { user } = useAuth()

  const markAttendanceMutation = useMutation({
    mutationFn: (data: { classId: string; userId: number }) =>
      fetchApi({
        path: `classes/attendance/class/${data.classId}/mark`,
        method: "POST",
        data: {
          attendance_records: [
            {
              user_id: user?.id,
              present: true,
              join_time: getUTCJoinTime(),
            },
          ],
        },
      }),
  });

  // Filter out cancelled classes from upcoming and combine with cancelledClasses prop
  const filteredUpcomingClasses = upcomingClasses.filter(
    (classItem) => classItem.status !== "cancelled"
  );
  const allCancelledClasses = [
    ...cancelledClasses,
    ...upcomingClasses?.filter((classItem) => classItem.status === "cancelled"),
    ...todaysClasses?.filter((classItem) => classItem.status === "cancelled"),
  ];
  const filteredTodaysClasses = todaysClasses.filter(
    (classItem) => classItem.status !== "cancelled"
  );
  const formatClassDate = (dateString: string, timeString: string) => {
    try {
      const classDate = new Date(dateString);
      return {
        dayName: format(classDate, "EEEE"),
        fullDate: format(classDate, "MMMM d, yyyy"),
        time: timeString,
      };
    } catch (error) {
      return {
        dayName: "Today",
        fullDate: dateString,
        time: timeString,
      };
    }
  };

  const handleReschedule = (classId: string) => {
    if (onReschedule) {
      onReschedule(classId);
    }
  };

  const handleCancel = (classId: string) => {
    if (onCancel) {
      onCancel(classId);
    }
  };

  const handleJoinClass = (classItem: any) => {
    if (classItem.meeting_link) {
      window.open(classItem.meeting_link, "_blank");
      if (classItem?.id && user?.id) {
        markAttendanceMutation.mutate({
          classId: classItem.id.toString(),
          userId: user?.id,
        });
      }
    }
  };

  const renderClassCard = (
    classItem: any,
    showReschedule,
    showCancel,
    showJoin
  ) => {
    const dateInfo = formatClassDate(classItem.date, classItem.time);
    const displayStatus =
      classItem.status === "upcoming" ? "scheduled" : classItem.status;

    return (
      <div
        key={classItem.id}
        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Badge
              variant={
                displayStatus === "completed"
                  ? "default"
                  : displayStatus === "cancelled"
                    ? "destructive"
                    : "secondary"
              }
              className="text-xs"
            >
              {displayStatus === "completed"
                ? "Completed"
                : displayStatus === "cancelled"
                  ? "Cancelled"
                  : "Scheduled"}
            </Badge>
            {classItem.type === "group" && (
              <Badge
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                <Users className="w-3 h-3" />
                Group Class
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="font-bold text-orange-600 text-lg bg-orange-50 px-3 py-1 rounded-md">
              {dateInfo.time}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2 text-lg">
              {classItem.subject}
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 font-medium">
                {classItem.instructor}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {dateInfo.dayName}, {dateInfo.fullDate}
              </span>
            </div>
            {classItem.type === "group" &&
              classItem.attendees !== undefined && (
                <p className="text-sm text-gray-500 mt-1">
                  {classItem.attendees}/{classItem.maxAttendees} students
                  enrolled
                </p>
              )}
            {displayStatus === "cancelled" &&
              classItem.cancelation_reason_text && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">
                    <strong>Cancellation Reason:</strong>{" "}
                    {classItem.cancelation_reason_text}
                  </p>
                </div>
              )}
          </div>

          <div className="flex gap-2 ml-4">
            {showJoin &&
              (displayStatus === "scheduled" ||
                classItem.status === "upcoming") && (
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => handleJoinClass(classItem)}
                >
                  <Video className="w-4 h-4 mr-1" />
                  Join
                </Button>
              )}
            {displayStatus === "completed" && !classItem.feedbackGiven && (
              <Button size="sm" variant="outline">
                Give Feedback
              </Button>
            )}
            {showReschedule &&
              displayStatus !== "cancelled" &&
              displayStatus !== "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReschedule(classItem.id)}
                  className="hover:bg-blue-50 hover:border-blue-300"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Reschedule
                </Button>
              )}
            {showCancel &&
              displayStatus !== "cancelled" &&
              displayStatus !== "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancel(classItem.id)}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="w-6 h-6 text-orange-500" />
          My Classes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="today" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Today's Classes</span>
              <span className="sm:hidden">Today</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Upcoming Classes</span>
              <span className="sm:hidden">Upcoming</span>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Cancelled Classes</span>
              <span className="sm:hidden">Cancelled</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-6">
            {filteredTodaysClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>No classes scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodaysClasses.map((classItem) =>
                  renderClassCard(
                    classItem,
                    classItem.canReschedule,
                    classItem.canCancel,
                    classItem.canJoin
                  )
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {filteredUpcomingClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>No upcoming classes scheduled</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 space-y-3">
                {filteredUpcomingClasses.map((classItem) =>
                  renderClassCard(
                    classItem,
                    classItem.canReschedule,
                    classItem.canCancel,
                    classItem.canJoin
                  )
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            {allCancelledClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <X className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>No cancelled classes</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 space-y-3">
                {allCancelledClasses.map((classItem) =>
                  renderClassCard(
                    classItem,
                    classItem.canReschedule,
                    classItem.canCancel,
                    classItem.canJoin
                  )
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
