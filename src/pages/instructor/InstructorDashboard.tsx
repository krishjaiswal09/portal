import React, { useEffect, useRef, useState } from "react";
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen } from "lucide-react";
import { InstructorClassSchedule } from "@/components/instructor/InstructorClassSchedule";
import { StarTeachersSection } from "@/components/instructor/StarTeachersSection";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { InstructorClassesResponse } from "./Classes";
import { useAuth } from "@/contexts/AuthContext";
import { AdminBannerSection } from "@/components/student/AdminBannerSection";
import { FirstLoginSurveyModal } from "@/components/student/FirstLoginSurveyModal";
import { useToast } from "@/hooks/use-toast";
import { SectionLoader } from "@/components/ui/loader";

interface TeacherAssignment {
  id?: number;
  teacher_id: number;
  year: number;
  month: number;
  slot_number: number;
  assigned_at?: string;
  created_at?: string;
  updated_at?: string;
}
export default function InstructorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showFirstLoginSurvey, setShowFirstLoginSurvey] = useState(false);

  // Remove the ref approach and use a more reliable method
  const leadSourceCheck = useQuery({
    queryKey: ["leadSourceCheck", user?.id],
    queryFn: () => fetchApi<any>({
      path: `lead-source/user/${user?.id}`,
    }),
    enabled: !!user?.id,
    retry: 1, // Only retry once to avoid infinite loops
  });

  const studentRoleBanner = useQuery({
    queryKey: ["instructor-role-banner"],
    queryFn: () =>
      fetchApi<any>({
        path: `setting/banner/role/3`,
      }),
  });

  const instructorClasses = useQuery({
    queryKey: ["instructor-classes", user?.id],
    queryFn: () =>
      fetchApi<InstructorClassesResponse>({
        path: `classes/class-schedule/instructor/${user?.id}`,
      }),
    enabled: !!user?.id,
  });

  const selectedYear = new Date().getFullYear();
  const selectedMonth = new Date().getMonth() + 1;

  const { data: existingAssignments, isLoading: assignmentsLoading } = useQuery(
    {
      queryKey: ["teacher-assignments", selectedYear, selectedMonth],
      queryFn: () =>
        fetchApi<TeacherAssignment[]>({
          path: `teacher-assignments?year=${selectedYear}&month=${selectedMonth}`,
        }),
      enabled: !!(selectedYear && selectedMonth),
    }
  );

  const leadSourceMutation = useMutation({
    mutationFn: async (payload: { user_id: number; source_name: string }) => {
      return await fetchApi<any>({
        method: "POST",
        path: "lead-source",
        data: payload,
      });
    },
    onSuccess: () => {
      // Mark as completed for this session
      if (user?.id) {
        sessionStorage.setItem(`first-login-completed-${user.id}`, 'true');
      }
      
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

  // Improved first login detection logic
  useEffect(() => {
    if (!leadSourceCheck.isLoading && user?.id) {
      // Check if user has already completed the survey in this session
      const hasCompletedThisSession = sessionStorage.getItem(`first-login-completed-${user.id}`);
      
      if (!hasCompletedThisSession) {
        // If API returns null (no lead source found) and user hasn't completed this session
        if (leadSourceCheck.data === null) {
          setShowFirstLoginSurvey(true);
        }
        // If API returns an error, we might want to show the modal as fallback
        else if (leadSourceCheck.error) {
          console.warn('Failed to check lead source, showing first login modal as fallback');
          setShowFirstLoginSurvey(true);
        }
      }
    }
  }, [leadSourceCheck.isLoading, leadSourceCheck.data, leadSourceCheck.error, user?.id]);

  return (
    <InstructorDashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-playfair font-bold mb-2">
            Good Morning, Instructor!
          </h1>
          <p className="text-orange-100">
            Ready to inspire your students today? You have classes scheduled and
            students waiting to learn.
          </p>
        </div>

        <AdminBannerSection banners={studentRoleBanner?.data || []} />

        {/* Key Metrics */}
        {instructorClasses.isLoading ? (
          <SectionLoader text="Loading class statistics..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Classes
                </CardTitle>
                <BookOpen className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {instructorClasses.data?.today_classes_count || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {instructorClasses.data?.completed_classes_count || 0}{" "}
                  completed, {instructorClasses.data?.upcoming_classes_count || 0}{" "}
                  upcoming
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Classes
                </CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {instructorClasses.data?.total_classes_count || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Primary:{" "}
                  {instructorClasses.data?.primary_instructor_classes_count || 0},
                  Secondary:{" "}
                  {instructorClasses.data?.secondary_instructor_classes_count ||
                    0}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <FirstLoginSurveyModal
          isOpen={showFirstLoginSurvey}
          onComplete={handleFirstLoginSurveyComplete}
        />

        {/* Today's and Upcoming Classes */}
        {instructorClasses.isLoading ? (
          <SectionLoader text="Loading class schedule..." />
        ) : (
          <InstructorClassSchedule
            todayClasses={instructorClasses.data?.today_classes || []}
            upcomingClasses={instructorClasses.data?.upcoming_classes || []}
          />
        )}

        {/* Star Teachers of the Month */}
        <StarTeachersSection existingAssignments={existingAssignments || []} />
      </div>
    </InstructorDashboardLayout>
  );
}
