import { ParentDashboardLayout } from "@/components/ParentDashboardLayout";
import { ParentFeaturedCourses } from "@/components/parent/ParentFeaturedCourses";
import { ParentMessageIcon } from "@/components/parent/ParentMessageIcon";
import { ParentCancelRescheduleModal } from "@/components/parent/ParentCancelRescheduleModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  CreditCard,
  Bell,
  Users,
  BookOpen,
  Gift,
  Video,
  User,
  Settings,
  MessageSquare,
} from "lucide-react";
import { AdminBannerSection } from "@/components/student/AdminBannerSection";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useParentLearner } from "@/contexts/ParentLearnerContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { SectionLoader } from "@/components/ui/loader";

const ParentDashboard = () => {
  const { user } = useAuth();
  const { selectedLearner, learners } = useParentLearner();
  const { toast } = useToast();
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

  const studentRoleBanner = useQuery({
    queryKey: ["parent-role-banner"],
    queryFn: () =>
      fetchApi<any>({
        path: `setting/banner/role/5`,
      }),
  });

  // Transform API data to match the expected format
  const transformClassData = (apiData: any[]) => {
    return apiData.map((item) => ({
      id: item.id.toString(),
      name: item.title,
      instructor: `${item.primary_instructor_first_name} ${item.primary_instructor_last_name}`,
      date: item.start_date ? format(new Date(item.start_date), "MMM dd") : "",
      time: `${item.start_time} - ${item.end_time}`,
      status: item.status,
      studentName: selectedLearner?.name || "Student",
      courseTitle: item.course_title,
      classContext: item.class_context,
      meetingLink: item.meeting_link,
      notes: item.notes,
      classRecording: item.class_recording,
      startDate: item.start_date,
      startTime: item.start_time,
      endTime: item.end_time,
      // Add the original API data for the modal
      originalData: item,
    }));
  };

  // Get today's and upcoming classes from API data
  const todaysClasses = parentStudentClassData?.data?.today_classes
    ? transformClassData(parentStudentClassData.data.today_classes)
    : [];

  const upcomingClasses = parentStudentClassData?.data?.upcoming_classes
    ? transformClassData(parentStudentClassData.data.upcoming_classes)
    : [];

  // Fetch recent activities for the selected learner
  const recentActivities = useQuery({
    queryKey: ['recentActivities', selectedLearner?.id],
    queryFn: () => fetchApi<any[]>({
      path: `activity/user/${selectedLearner?.id}`
    }),
    enabled: !!selectedLearner?.id,
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

  const recentUpdates = recentActivities?.data?.slice(0, 5)?.map(activity => ({
    id: activity.id.toString(),
    title: activity.activity_description.split(':')[0] || 'Activity',
    description: activity.activity_description,
    time: format(new Date(activity.created_at), 'MMM dd, h:mm a'),
    icon: getActivityIcon(activity.activity_description),
    ...getActivityColor(activity.activity_description)
  })) || [];

  const handleReschedule = (classId: string) => {
    const classInfo = [...todaysClasses, ...upcomingClasses].find(
      (c) => c.id === classId
    );
    setSelectedClassForAction(classInfo?.originalData);
    setShowCancelRescheduleModal(true);
  };

  const handleCancel = (classId: string) => {
    const classInfo = [...todaysClasses, ...upcomingClasses].find(
      (c) => c.id === classId
    );
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Scheduled
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            Cancelled
          </Badge>
        );
      case "reschedule":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            Rescheduled
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  return (
    <ParentDashboardLayout title="Parent Dashboard">
      <div className="space-y-6">
        {/* Top Banner Section */}
        <AdminBannerSection banners={studentRoleBanner?.data || []} />

        {/* Enhanced Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Classes Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  My Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {parentStudentClassData.isLoading ? (
                  <SectionLoader text="Loading class schedule..." />
                ) : (
                  <>
                    {/* Today's Classes */}
                    <div>
                      <h3 className="font-semibold mb-3">Today&apos;s Classes</h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {todaysClasses.length > 0 ? (
                          todaysClasses.map((classItem) => (
                            <div
                              key={classItem.id}
                              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                  <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">
                                    {classItem.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {classItem.instructor} • {classItem.studentName}
                                  </p>
                                  <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span>{classItem.time}</span>
                                  </div>
                                  <div className="mt-1">
                                    {getStatusBadge(classItem.status)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                {classItem.status === "scheduled" &&
                                  classItem.meetingLink && (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Join
                                    </Button>
                                  )}
                                {classItem.status === "scheduled" && (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs px-2"
                                      onClick={() => handleReschedule(classItem.id)}
                                    >
                                      Reschedule
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs px-2"
                                      onClick={() => handleCancel(classItem.id)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No classes scheduled for today</p>
                          </div>
                        )}
                      </div>

                      {/* Upcoming Classes */}
                      <div>
                        <h3 className="font-semibold mb-3">Upcoming Classes</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                          {upcomingClasses.length > 0 ? (
                            upcomingClasses.map((classItem) => (
                              <div
                                key={classItem.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">
                                      {classItem.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {classItem.instructor} • {classItem.studentName}
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Calendar className="w-4 h-4" />
                                      <span>
                                        {classItem.date} • {classItem.time}
                                      </span>
                                    </div>
                                    <div className="mt-1">
                                      {getStatusBadge(classItem.status)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {classItem.status === "scheduled" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReschedule(classItem.id)}
                                      >
                                        Reschedule
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleCancel(classItem.id)}
                                      >
                                        Cancel
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                              <p>No upcoming classes scheduled</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Credits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Your Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  {/* <div className="text-3xl font-bold text-blue-600">
                    {user?.credits}
                  </div>
                  <p className="text-sm text-gray-600">Credits remaining</p> */}
                  <Button variant="outline" size="sm" className="w-full">
                    View full credit history
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Setup Auto Payment</Button>
              </CardContent>
            </Card> */}

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivities?.isLoading ? (
                  <SectionLoader text="Loading activities..." />
                ) : recentUpdates.length > 0 ? (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {recentUpdates.map((update) => {
                      const IconComponent = update.icon;
                      return (
                        <div key={update.id} className="flex items-start gap-3">
                          <div className={`w-8 h-8 ${update.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className={`w-4 h-4 ${update.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{update.title}</h4>
                            <p className="text-xs text-gray-600 mb-1">
                              {update.description}
                            </p>
                            <p className="text-xs text-gray-500">{update.time}</p>
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
          </div>
        </div>

        {/* Featured Courses */}
        <ParentFeaturedCourses />
      </div>

      {/* Persistent Message Icon */}
      <ParentMessageIcon />

      {/* Cancel/Reschedule Modal */}
      <ParentCancelRescheduleModal
        isOpen={showCancelRescheduleModal}
        onClose={() => setShowCancelRescheduleModal(false)}
        onCancel={handleCancelClass}
        onReschedule={handleRescheduleClass}
        classInfo={selectedClassForAction}
      />
    </ParentDashboardLayout>
  );
};

export default ParentDashboard;