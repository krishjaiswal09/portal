import { useState } from "react";
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassFilters } from "@/components/student/ClassFilters";
import { ClassTableView } from "@/components/student/ClassTableView";
import { SessionDetailsModal } from "@/components/student/SessionDetailsModal";
import { StudentCancelModal } from "@/components/student/StudentCancelModal";
import { StudentRescheduleModal } from "@/components/student/StudentRescheduleModal";
import { TeacherNotesModal } from "@/components/student/TeacherNotesModal";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EnhancedClassSession } from "@/data/studentDashboardData";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useAuth } from "@/contexts/AuthContext";
import { SectionLoader } from "@/components/ui/loader";
import { getUTCJoinTime } from "@/utils/caseTransform";

interface ApiClassData {
  id: number;
  title: string;
  course_title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  status: string;
  class_context: string;
  primary_instructor_first_name: string;
  primary_instructor_last_name: string;
  meeting_link: string;
  notes: string | null;
  class_recording: string | null;
  class_type_name: string;
  canReschedule: boolean;
  canCancel: boolean;
  canJoin: boolean;
  cancelation_reason_text?: string;
  reschedule_reason_text?: string;
}

interface StudentClassesResponse {
  today_classes: ApiClassData[];
  upcoming_classes: ApiClassData[];
  past_classes: ApiClassData[];
  completed_classes: ApiClassData[];
  cancelled_classes: ApiClassData[];
}

const MyClasses = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [selectedClass, setSelectedClass] =
    useState<EnhancedClassSession | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const myStudentclasses = useQuery({
    queryKey: ["student-classes", user?.id],
    queryFn: () =>
      fetchApi<StudentClassesResponse>({
        path: `classes/class-schedule/student/${user?.id}`,
      }),
    enabled: !!user?.id,
  });

  const transformApiDataToEnhanced = (
    apiData: ApiClassData[]
  ): EnhancedClassSession[] => {
    return apiData.map((item) => ({
      id: item.id.toString(),
      subject: item.title,
      teacher: `${item.primary_instructor_first_name} ${item.primary_instructor_last_name}`,
      instructor: `${item.primary_instructor_first_name} ${item.primary_instructor_last_name}`,
      teacherPhoto: "/teacher-default.jpg",
      date: item.start_date.split("T")[0],
      time: `${item.start_time} - ${item.end_time}`,
      startTime: item.start_time,
      endTime: item.end_time,
      timezone: "EST",
      duration: "60 min",
      status:
        item.status === "scheduled"
          ? item.status
          : (item.status as "upcoming" | "completed" | "cancelled"),
      type: item.class_context as "individual" | "group",
      courseTitle: item.course_title,
      artFormTag: "Music",
      classDescription: item.title,
      instructorNotes: item.notes,
      isJoinable: item.status === "scheduled",
      canJoin: item.canJoin,
      hasRecording: !!item.class_recording,
      class_recording: item.class_recording,
      recordingUrl: item.class_recording || "",
      hasMaterials: true,
      feedbackGiven: !!item.notes,
      attendanceStatus: item.status === "completed" ? "attended" : undefined,
      reminderSet: false,
      canCancel: item.canCancel,
      canReschedule: item.canReschedule,
      meetingLink: item.meeting_link,
      cancelation_reason_text: item.cancelation_reason_text,
      reschedule_reason_text: item.reschedule_reason_text
    }));
  };

  const getClassesByTab = () => {
    if (!myStudentclasses.data) return [];

    switch (activeTab) {
      case "today":
        return transformApiDataToEnhanced(
          myStudentclasses?.data?.today_classes || []
        );
      case "upcoming":
        return transformApiDataToEnhanced(
          myStudentclasses?.data?.upcoming_classes || []
        );
      case "completed":
        return transformApiDataToEnhanced(
          myStudentclasses?.data?.completed_classes || []
        );
      case "cancelled":
        return transformApiDataToEnhanced(
          myStudentclasses?.data?.cancelled_classes || []
        );
      default:
        return [];
    }
  };

  const handleSessionClick = (classItem: EnhancedClassSession) => {
    setSelectedClass(classItem);
    setShowSessionModal(true);
  };

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
              join_time: getUTCJoinTime()
            }
          ]
        },
      }),
  });

  const handleJoinClass = (classItem: any) => {
    if (classItem?.meetingLink) {
      window.open(classItem?.meetingLink, '_blank');
      markAttendanceMutation.mutate({
        classId: classItem.id.toString(),
        userId: user?.id,
      });
      toast({
        title: "Opening Class",
        description: "Opening class in a new tab...",
      });
    } else {
      toast({
        title: "No Meeting Link",
        description: "Meeting link not available for this class.",
        variant: "destructive",
      });
    }
  }; 

  const handleWatchRecording = (classItem: EnhancedClassSession) => {
    setSelectedClass(classItem);
    if (classItem.class_recording) {
      window.open(classItem.class_recording, "_blank");
    } else {
      toast({
        title: "No Class Recording",
        description: "Class recording not available for this class.",
        variant: "destructive",
      });
    }
  };

  const handleReschedule = (classItem: EnhancedClassSession) => {
    setSelectedClass(classItem);
    setShowRescheduleModal(true);
  };

  const handleCancel = (classItem: EnhancedClassSession) => {
    setSelectedClass(classItem);
    setShowCancelModal(true);
  };

  const handleViewNotes = (classItem: EnhancedClassSession) => {
    setSelectedClass(classItem);
    setShowNotesModal(true);
  };

  const handleToggleReminder = (classItem: EnhancedClassSession) => {
    toast({
      title: "Reminder Updated",
      description: `Reminder ${classItem.reminderSet ? "removed" : "set"} for ${classItem.subject
        }`,
    });
  };

  const canJoinClass = (classItem: EnhancedClassSession) => {
    return classItem.canJoin && classItem.status === "upcoming";
  };

  const handleCancelClass = (reason: string) => {
    toast({
      title: "Class Cancelled",
      description: `Your ${selectedClass?.subject} class has been cancelled. Credits will be refunded.`,
    });
    setShowCancelModal(false);
  };

  const handleRescheduleClass = (data: any) => {
    toast({
      title: "Class Rescheduled",
      description: `Your ${selectedClass?.subject} class has been rescheduled.`,
    });
    setShowRescheduleModal(false);
  };

  const currentClasses = getClassesByTab();

  const classCounts = {
    today: myStudentclasses.data?.today_classes?.length || 0,
    upcoming: myStudentclasses.data?.upcoming_classes?.length || 0,
    completed: myStudentclasses.data?.completed_classes?.length || 0,
    cancelled: myStudentclasses.data?.cancelled_classes?.length || 0,
  };

  if (myStudentclasses.isLoading) {
    return (
      <StudentDashboardLayout title="My Classes">
        <SectionLoader text="Loading your classes..." />
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout title="My Classes">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">
              My Classes
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your upcoming and completed classes
            </p>
          </div>
        </div>

        <ClassFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={classCounts}
        />

        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{activeTab} Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassTableView
              classes={currentClasses}
              onSessionClick={handleSessionClick}
              onJoinClass={handleJoinClass}
              onWatchRecording={handleWatchRecording}
              onViewNotes={handleViewNotes}
              onToggleReminder={handleToggleReminder}
              canJoinClass={canJoinClass}
              onDataUpdate={() => myStudentclasses.refetch()}
              activeTab={activeTab}
            />
          </CardContent>
        </Card>
      </div>

      <SessionDetailsModal
        session={selectedClass}
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
      />

      <StudentCancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onCancel={handleCancelClass}
        session={selectedClass}
      />

      <StudentRescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onReschedule={handleRescheduleClass}
        session={selectedClass}
      />

      <TeacherNotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        session={selectedClass}
      />
    </StudentDashboardLayout>
  );
};

export default MyClasses;
