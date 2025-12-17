
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from "@/components/DashboardLayout";
import { CourseSettingsForm } from "@/components/course-management/CourseSettingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const CourseSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get course data from location state
  const courseData = location.state?.courseData;
  
  // If no course data, redirect back to create course
  React.useEffect(() => {
    if (!courseData) {
      navigate('/courses/create');
    }
  }, [courseData, navigate]);
  
  const handleSubmit = async (settingsData: any) => {
    setIsSubmitting(true);
    
    try {
      // Combine course data with settings
      const completeCourse = {
        ...courseData,
        settings: {
          enrollment: {
            maxStudents: settingsData.maxStudents,
            enrollmentDeadline: settingsData.enrollmentDeadline?.toISOString(),
            enableWaitlist: settingsData.enableWaitlist,
            autoApproveEnrollment: settingsData.autoApproveEnrollment,
          },
          access: {
            courseVisibility: settingsData.courseVisibility,
            accessDuration: settingsData.accessDuration,
            accessDurationValue: settingsData.accessDurationValue,
          },
          completion: {
            minimumAttendanceRequired: settingsData.minimumAttendanceRequired,
            assessmentCompletionRequired: settingsData.assessmentCompletionRequired,
            feedbackMandatory: settingsData.feedbackMandatory,
          },
          certificate: {
            issueCertificate: settingsData.issueCertificate,
            certificateTemplate: settingsData.certificateTemplate,
            certificateIssuedBy: settingsData.certificateIssuedBy,
          },
          notifications: {
            notifyStudentNewClass: settingsData.notifyStudentNewClass,
            notifyInstructorEnrollment: settingsData.notifyInstructorEnrollment,
            enableWhatsAppAlerts: settingsData.enableWhatsAppAlerts,
            courseCompletionReminder: settingsData.courseCompletionReminder,
          },
          pricing: {
            courseCostInCredits: settingsData.courseCostInCredits,
            allowPartialPayments: settingsData.allowPartialPayments,
            markAsFreeTerial: settingsData.markAsFreeTerial,
            displayAsFree: settingsData.displayAsFree,
          },
          display: {
            showOnHomepage: settingsData.showOnHomepage,
            showInPopularCourses: settingsData.showInPopularCourses,
            showCourseLanguage: settingsData.showCourseLanguage,
            displayInCourseCatalog: settingsData.displayInCourseCatalog,
          },
          workflow: {
            linkToDemoFlow: settingsData.linkToDemoFlow,
          },
          instructorPermissions: {
            canRescheduleClasses: settingsData.canRescheduleClasses,
            canAddModules: settingsData.canAddModules,
          },
        }
      };
      
      // Here you would typically save to your backend
      console.log('Complete course with settings:', completeCourse);
      
      toast({
        title: "Course Created Successfully",
        description: `${courseData.name} has been created with all settings configured.`,
      });
      
      // Navigate to courses list
      navigate('/courses');
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBack = () => {
    navigate('/courses/create', { state: { courseData } });
  };
  
  if (!courseData) {
    return null;
  }
  
  return (
    <DashboardLayout title="Course Settings">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Course Info</span>
          <span>→</span>
          <span className="text-foreground font-medium">Settings</span>
        </div>
        
        {/* Course Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Course Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{courseData.name}</h3>
                <p className="text-muted-foreground mt-1">{courseData.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{courseData.artform}</Badge>
                  {courseData.topicsCovered?.slice(0, 3).map((topic: string, index: number) => (
                    <Badge key={index} variant="secondary">{topic}</Badge>
                  ))}
                  {courseData.topicsCovered?.length > 3 && (
                    <Badge variant="secondary">+{courseData.topicsCovered.length - 3} more</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Instructors: {courseData.instructors?.join(', ')}</p>
                  <p>Learning Outcomes: {courseData.learningOutcomes?.length} defined</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Settings Form */}
        <div className="bg-background border border-border rounded-lg md:rounded-xl p-4 md:p-6 shadow-md">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">Configure Course Settings</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Set up enrollment, access, completion criteria, and other course configurations.
            </p>
          </div>
          
          <CourseSettingsForm
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseSettings;
