import React, { useState, useEffect, useRef } from "react";
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bell, Play, Users, BarChart, CreditCard, User, Settings, MessageSquare, BookOpen } from "lucide-react";
import { SectionLoader } from "@/components/ui/loader";

// New components
import { AdminBannerSection } from "@/components/student/AdminBannerSection";
import { EnhancedClassSchedule } from "@/components/student/EnhancedClassSchedule";
import { CreditBalanceCard } from "@/components/student/CreditBalanceCard";
import { FirstLoginSurveyModal } from "@/components/student/FirstLoginSurveyModal";
import { TermsAndConditionsModal } from "@/components/student/TermsAndConditionsModal";
import { HelpWidget } from "@/components/student/HelpWidget";
import { FeaturedCoursesSection } from "@/components/student/FeaturedCoursesSection";
import { StudentCancelRescheduleModal } from "@/components/student/StudentCancelRescheduleModal";
import {
  EnhancedClassSession,
} from "@/data/studentDashboardData";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

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
  cancelation_reason_text?: string;
  canJoin: boolean;
  canCancel: boolean;
  canReschedule: boolean;
}

interface StudentClassesResponse {
  today_classes: ApiClassData[];
  upcoming_classes: ApiClassData[];
  past_classes: ApiClassData[];
  total_classes: ApiClassData[];
}

const StudentDashboard = () => {
  const [showFirstLoginSurvey, setShowFirstLoginSurvey] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCancelRescheduleModal, setShowCancelRescheduleModal] =
    useState(false);
  const [selectedClassForAction, setSelectedClassForAction] =
    useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch recent activities for the student
  const recentActivities = useQuery({
    queryKey: ['studentActivities', user?.id],
    queryFn: () => fetchApi<any[]>({
      path: `activity/user/${user?.id}`
    }),
    enabled: !!user?.id,
  });

  const getActivityIcon = (description: string) => {
    if (description.includes('user created')) return User;
    if (description.includes('class') || description.includes('lesson')) return BookOpen;
    if (description.includes('credit') || description.includes('payment')) return CreditCard;
    if (description.includes('message')) return MessageSquare;
    return Settings;
  };

  const getActivityColor = (description: string) => {
    if (description.includes('user created')) return { color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (description.includes('class') || description.includes('lesson')) return { color: 'text-purple-600', bgColor: 'bg-purple-100' };
    if (description.includes('credit') || description.includes('payment')) return { color: 'text-green-600', bgColor: 'bg-green-100' };
    if (description.includes('message')) return { color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const notifications = recentActivities?.data?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())?.slice(0, 1)?.map(activity => ({
    id: activity.id.toString(),
    title: activity.activity_description.split(':')[0] || 'Activity',
    message: activity.activity_description,
    timestamp: format(new Date(activity.created_at), 'MMM dd, h:mm a'),
    read: false,
    icon: getActivityIcon(activity.activity_description),
    ...getActivityColor(activity.activity_description)
  })) || [];

  const myStudentClasses = useQuery({
    queryKey: ["student-classes", user?.id],
    queryFn: () =>
      fetchApi<StudentClassesResponse>({
        path: `classes/class-schedule/student/${user?.id}`,
      }),
    enabled: !!user?.id,
  });

  const getMyCourses = useQuery({
    queryKey: ["getMyCourses", user.id],
    queryFn: () =>
      fetchApi<any>({
        path: `courses/me/${user.id}`
      }),
  });

  const leadSourceCheckRef = useRef(false);
  const leadSourceCheck = useQuery({
    queryKey: ["leadSourceCheck", user?.id],
    queryFn: () => {
      if (leadSourceCheckRef.current) {
        return Promise.resolve(undefined);
      }
      leadSourceCheckRef.current = true;
      return fetchApi<any>({
        path: `lead-source/user/${user?.id}`,
      });
    },
    enabled: !!user?.id,
  });

  const studentRoleBanner = useQuery({
    queryKey: ["student-role-banner"],
    queryFn: () =>
      fetchApi<any>({
        path: `setting/banner/role/4`,
      }),
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
          ? "upcoming"
          : (item.status as "upcoming" | "completed" | "cancelled"),
      type: item.class_context as "individual" | "group",
      courseTitle: item.course_title,
      artFormTag: "Music",
      classDescription: item.title,
      instructorNotes: item.notes || "",
      isJoinable: item.status === "scheduled",
      canJoin: item.canJoin,
      hasRecording: !!item.class_recording,
      recordingUrl: item.class_recording || "",
      hasMaterials: true,
      feedbackGiven: !!item.notes,
      attendanceStatus: item.status === "completed" ? "attended" : undefined,
      reminderSet: false,
      canCancel: item.canCancel || false,
      canReschedule: item.canReschedule || false,
      cancelation_reason_text: item.cancelation_reason_text,
      meeting_link: item.meeting_link,
    }));
  };

  // Check for first login and lead source data
  useEffect(() => {
    if (!leadSourceCheck.isLoading && (leadSourceCheck.data === null || leadSourceCheck.data === undefined)) {
      setShowFirstLoginSurvey(true);
    }
  }, [leadSourceCheck.isLoading, leadSourceCheck.data]);

  const handleTermsAccept = () => {
    localStorage.setItem("student-terms-accepted", "true");
    setShowTermsModal(false);

    // Check if it's first login after terms
    const isFirstLogin = localStorage.getItem("student-first-login") === null;
    if (isFirstLogin) {
      setShowFirstLoginSurvey(true);
    }
  };

  const leadSourceMutation = useMutation({
    mutationFn: async (payload: { user_id: number; source_name: string }) => {
      return await fetchApi<any>({
        method: "POST",
        path: "lead-source",
        data: payload,
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Art Gharana!",
        description: "Thank you for sharing how you found us.",
      });
      setShowFirstLoginSurvey(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message || "Failed to save your response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFirstLoginSurveyComplete = (payload: {
    user_id: number;
    source_name: string;
  }) => {
    leadSourceMutation.mutate(payload);
  };

  const handleSetupAutoPayment = () => {
    toast({
      title: "Setup Auto Payment",
      description: "Redirecting to auto payment setup...",
    });
    // Navigate to credits & transactions page
    window.location.href = "/student/credits-transactions";
  };

  const handleReschedule = (classItem: EnhancedClassSession | string) => {
    let classInfo;
    if (typeof classItem === 'string') {
      // Handle string ID from EnhancedClassSchedule
      classInfo = [...transformApiDataToEnhanced(myStudentClasses.data?.today_classes || []),
      ...transformApiDataToEnhanced(myStudentClasses.data?.upcoming_classes || [])].find(
        (c) => c.id === classItem
      );
    } else {
      // Handle EnhancedClassSession object from ClassTableView
      classInfo = classItem;
    }
    setSelectedClassForAction(classInfo);
    setShowCancelRescheduleModal(true);
  };

  const handleCancel = (classItem: EnhancedClassSession | string) => {
    let classInfo;
    if (typeof classItem === 'string') {
      // Handle string ID from EnhancedClassSchedule
      classInfo = [...transformApiDataToEnhanced(myStudentClasses.data?.today_classes || []),
      ...transformApiDataToEnhanced(myStudentClasses.data?.upcoming_classes || [])].find(
        (c) => c.id === classItem
      );
    } else {
      // Handle EnhancedClassSession object from ClassTableView
      classInfo = classItem;
    }
    setSelectedClassForAction(classInfo);
    setShowCancelRescheduleModal(true);
  };

  const handleCancelClass = (reason: any) => {
    toast({
      title: "Class Cancelled",
      description: `Your ${selectedClassForAction?.subject} class has been cancelled. Credits will be refunded to your account.`,
    });
    // Refetch student classes after cancellation
    myStudentClasses.refetch();
    setShowCancelRescheduleModal(false);
    setSelectedClassForAction(null);
  };

  const handleRescheduleClass = (data: any) => {
    toast({
      title: "Class Rescheduled",
      description: `Your ${selectedClassForAction?.subject} class has been rescheduled to ${data.date} at ${data.time}.`,
    });
    // Refetch student classes after rescheduling
    myStudentClasses.refetch();
    setShowCancelRescheduleModal(false);
    setSelectedClassForAction(null);
  };

  const handleWatchRecording = (recordingUrl: string) => {
    if (recordingUrl) {
      window.open(recordingUrl, '_blank');
    } else {
      toast({
        title: "Recording Not Available",
        description: "This class recording is not available yet.",
        variant: "destructive",
      });
    }
  };

  return (
    <StudentDashboardLayout title="Student Dashboard">
      {/* Admin Banner Section */}
      <AdminBannerSection banners={studentRoleBanner?.data || []} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Enhanced Class Schedule - with better spacing */}
          <div className="space-y-4">
            {myStudentClasses.isLoading ? (
              <SectionLoader text="Loading your classes..." />
            ) : (
              <EnhancedClassSchedule
                todaysClasses={transformApiDataToEnhanced(
                  myStudentClasses.data?.today_classes || []
                )}
                upcomingClasses={transformApiDataToEnhanced(
                  myStudentClasses.data?.upcoming_classes || []
                )}
                cancelledClasses={[]}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
              />
            )}
          </div>

          {/* Featured Courses Section */}
          <FeaturedCoursesSection />

          {/* Recent Class Recordings */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Play className="w-6 h-6 text-orange-500" />
                Recent Class Recordings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {myStudentClasses?.data?.total_classes?.filter(classItem => classItem.status !== 'cancelled').slice(0, 2).map((classItem) => (
                  <div
                    key={classItem.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-orange-100 text-orange-700 font-medium"
                      >
                        {classItem.course_title}
                      </Badge>
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(classItem.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {classItem.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {classItem.primary_instructor_first_name} {classItem.primary_instructor_last_name}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full group-hover:bg-orange-50 group-hover:border-orange-300 group-hover:text-orange-700 transition-colors"
                      onClick={() => handleWatchRecording(classItem.class_recording)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Recording
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="xl:col-span-1 space-y-6">
          {/* Credit Balance Card */}
          <CreditBalanceCard creditBalance={+user?.credits} />

          {/* Setup Auto Payment Card */}
          {/* <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={handleSetupAutoPayment}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Setup Auto Payment
              </Button>
            </CardContent>
          </Card> */}

          {/* Recent Updates */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-orange-500" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {recentActivities?.isLoading ? (
                <SectionLoader text="Loading activities..." />
              ) : notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className="p-3 rounded-lg border transition-colors bg-blue-50 border-blue-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 ${notification.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className={`w-4 h-4 ${notification.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2 font-medium">
                              {notification.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No recent activities</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Updates */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart className="w-5 h-5 text-orange-500" />
                Progress Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {getMyCourses.isLoading ? (
                <SectionLoader text="Loading course progress..." />
              ) : (
                getMyCourses?.data?.map((course) => (
                  <div
                    key={course.course_id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-900 truncate pr-2">
                        {course.title}
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        {course?.progress?.percentage}%
                      </span>
                    </div>
                    <Progress
                      value={course?.progress?.percentage}
                      className="h-2 mb-2"
                    />
                    <p className="text-xs text-gray-600 font-medium">
                      {course?.progress?.completed_subtopics}/{course?.progress?.total_subtopics} topics
                      completed
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Widget */}
      <HelpWidget />

      {/* Terms and Conditions Modal */}
      {/* <TermsAndConditionsModal
        isOpen={showTermsModal}
        onAccept={handleTermsAccept}
      /> */}

      {/* First Login Survey Modal */}
      <FirstLoginSurveyModal
        isOpen={showFirstLoginSurvey}
        onComplete={handleFirstLoginSurveyComplete}
      />

      {/* Cancel/Reschedule Modal */}
      <StudentCancelRescheduleModal
        isOpen={showCancelRescheduleModal}
        onClose={() => setShowCancelRescheduleModal(false)}
        onCancel={handleCancelClass}
        onReschedule={handleRescheduleClass}
        classInfo={selectedClassForAction ? {
          id: selectedClassForAction.id,
          title: selectedClassForAction.subject,
          type: selectedClassForAction.subject,
          startDate: selectedClassForAction.date,
          startTime: selectedClassForAction.startTime,
          endTime: selectedClassForAction.endTime
        } : null}
      />
    </StudentDashboardLayout>
  );
};

export default StudentDashboard;
