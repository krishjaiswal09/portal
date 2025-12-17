import { DashboardLayout } from "@/components/DashboardLayout"
import { CourseForm } from "@/components/course-management/CourseForm"
import { hasPermission } from "@/utils/checkPermission";
import { ArrowLeft } from "lucide-react";
import { Button } from "react-day-picker";
import { useNavigate, useParams } from 'react-router-dom';
import { Button as NormalButton } from "@/components/ui/button";

const CreateCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const requiredPermission = id
    ? "HAS_EDIT_COURSE" // Edit mode
    : "HAS_CREATE_COURSE"; // Create mode

  if (!hasPermission(requiredPermission)) {
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
  return (
    <DashboardLayout title="Add New Course">
      <div className="space-y-6">
        <div className="text-center md:text-left">
          <NormalButton variant="outline" onClick={() => navigate('/courses')} className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </NormalButton>
          <h1 className="text-2xl md:text-4xl font-playfair font-bold text-foreground">{id ? "Update Course" : "Create New Course"}</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {id ? "Update course to" : "Add a new course to"} your curriculum with modules and learning materials.
          </p>
        </div>

        <div className="bg-background border border-border rounded-lg md:rounded-xl p-4 md:p-6 shadow-md">
          <CourseForm />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateCourse
