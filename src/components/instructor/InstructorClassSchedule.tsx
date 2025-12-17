import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, RotateCcw, X } from "lucide-react";
import { ClassCancelRescheduleModal } from "@/components/class-management/ClassCancelRescheduleModal";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/services/api/fetchApi";
import { getUTCJoinTime } from "@/utils/caseTransform";

interface ClassData {
  id: number;
  course: number;
  title: string;
  course_title: string;
  start_date: string;
  start_time: string;
  end_time: string;
  canJoin?: boolean;
  status: string;
  student_first_name?: string;
  student_last_name?: string;
  group_name?: string;
  class_type_name: string;
  meeting_link?: string;
  primary_instructor: number;
  secondary_instructor?: number;
  student?: number;
  group?: number;
  notes?: string;
  meeting_type: string;
  reason?: number;
  canCancel?: boolean;
  canReschedule?: boolean;
}

interface InstructorClassScheduleProps {
  todayClasses: ClassData[];
  upcomingClasses: ClassData[];
}

export function InstructorClassSchedule({
  todayClasses,
  upcomingClasses,
}: InstructorClassScheduleProps) {
  const [cancelRescheduleModal, setCancelRescheduleModal] = useState({
    isOpen: false,
    classInfo: null as any,
  });
  const queryClient = useQueryClient();
  const { user } = useAuth();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "completed":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleReschedule = (classItem: ClassData) => {
    setCancelRescheduleModal({
      isOpen: true,
      classInfo: {
        id: classItem.id,
        title: classItem.course_title,
        startDate: classItem.start_date.split("T")[0],
        startTime: classItem.start_time,
        endTime: classItem.end_time,
        student: getStudentName(classItem),
      },
    });
  };

  const handleCancel = (classItem: ClassData) => {
    setCancelRescheduleModal({
      isOpen: true,
      classInfo: {
        id: classItem.id,
        title: classItem.course_title,
        startDate: classItem.start_date.split("T")[0],
        startTime: classItem.start_time,
        endTime: classItem.end_time,
        student: getStudentName(classItem),
      },
    });
  };

  const handleModalCancel = (reason: any) => {
    queryClient.invalidateQueries({
      queryKey: ["instructor-classes", user?.id],
    });
  };

  const handleModalReschedule = (data: any) => {
    queryClient.invalidateQueries({
      queryKey: ["instructor-classes", user?.id],
    });
  };

  const formatTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  const getStudentName = (classItem: ClassData) => {
    if (classItem.student_first_name && classItem.student_last_name) {
      return `${classItem.student_first_name} ${classItem.student_last_name}`;
    }
    return classItem.group_name || classItem.title;
  };

  const formatDate = (dateString: string) => {
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
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleJoinClass = (classItem: ClassData) => {
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-playfair">
              <Calendar className="w-5 h-5 text-orange-600" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
              {todayClasses?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No classes scheduled for today
                </div>
              ) : (
                todayClasses?.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-orange-100 text-orange-700 font-medium"
                      >
                        {classItem.class_type_name}
                      </Badge>
                      <Badge
                        className={`text-white text-xs ${getStatusColor(
                          classItem.status
                        )}`}
                      >
                        {classItem.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {classItem.course_title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Student: {getStudentName(classItem)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatTime(classItem.start_time, classItem.end_time)}
                      </div>
                      <div className="flex items-center gap-2">
                    {classItem.canJoin && classItem.status !== "cancelled" && classItem.status !== "completed" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleJoinClass(classItem)}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Join
                          </Button>
                        )}
                        {
                          <div className="flex gap-1">
                            {classItem.canReschedule && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs group-hover:bg-orange-50 group-hover:border-orange-300 group-hover:text-orange-700 transition-colors"
                                onClick={() => handleReschedule(classItem)}
                              >
                                <RotateCcw className="w-3 h-3" />
                              </Button>
                            )}
                            {classItem.canCancel && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 text-xs hover:bg-red-50 hover:border-red-300"
                                onClick={() => handleCancel(classItem)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-playfair">
              <Calendar className="w-5 h-5 text-orange-600" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
              {upcomingClasses?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No upcoming classes
                </div>
              ) : (
                upcomingClasses?.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-orange-100 text-orange-700 font-medium"
                      >
                        {classItem.class_type_name}
                      </Badge>
                      <Badge
                        className={`text-white text-xs ${getStatusColor(
                          classItem.status
                        )}`}
                      >
                        {classItem.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {classItem.course_title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Student: {getStudentName(classItem)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDate(classItem.start_date)},{" "}
                        {formatTime(classItem.start_time, classItem.end_time)}
                      </div>
                      <div className="flex items-center gap-2">
                        {classItem.status !== "cancelled" && (
                          <div className="flex gap-1">
                            {classItem.canJoin && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleJoinClass(classItem)}
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Join
                              </Button>
                            )}
                            {classItem.canReschedule && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs group-hover:bg-orange-50 group-hover:border-orange-300 group-hover:text-orange-700 transition-colors"
                                onClick={() => handleReschedule(classItem)}
                              >
                                <RotateCcw className="w-3 h-3" />
                              </Button>
                            )}
                            {classItem.canCancel && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 text-xs hover:bg-red-50 hover:border-red-300"
                                onClick={() => handleCancel(classItem)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ClassCancelRescheduleModal
        isOpen={cancelRescheduleModal.isOpen}
        onClose={() =>
          setCancelRescheduleModal({ ...cancelRescheduleModal, isOpen: false })
        }
        onCancel={handleModalCancel}
        onReschedule={handleModalReschedule}
        classInfo={cancelRescheduleModal.classInfo}
        loggedInInstructor={user}
      />
    </>
  );
}
