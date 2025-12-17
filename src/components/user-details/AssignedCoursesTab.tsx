
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, X } from "lucide-react";
import { type User } from "../user-management/mockData";
import { AssignCourseModal } from "./AssignCourseModal";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";

interface InstructorCourse {
  id: string;
  instructor_id: string;
  course_id: string;
  created_at: string;
  updated_at: string;
  course_title: string;
  course_code: string;
  course_description: string;
  course_start_date: string;
  course_end_date: string;
  course_is_active: boolean;
}

interface AssignedCoursesTabProps {
  user: User;
}

export function AssignedCoursesTab({ user }: AssignedCoursesTabProps) {
  const [isAssignCourseModalOpen, setIsAssignCourseModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: assignedCourses = [], isLoading } = useQuery<InstructorCourse[]>({
    queryKey: ['instructor-courses', user.id],
    queryFn: () => fetchApi({
      path: `instructor-courses/instructor/${user.id}`,
    }),
  });

  const removeMutation = useMutation({
    mutationFn: (courseId: string) => fetchApi({
      path: `instructor-courses/instructor/${user.id}/course/${courseId}`,
      method: 'DELETE'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-courses', user.id] });
    }
  });

  const handleAssignCourse = () => {
    setIsAssignCourseModalOpen(false);
  };

  const handleRemoveCourse = (courseId: string) => {
    removeMutation.mutate(courseId);
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2 text-xl">
              <BookOpen className="w-6 h-6 text-primary" />
              Assigned Courses ({isLoading ? '...' : assignedCourses.length})
            </CardTitle>
            <Button
              onClick={() => setIsAssignCourseModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Assign Course
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <span className="font-medium text-foreground block">{course.course_title}</span>
                      <span className="text-sm text-muted-foreground">{course.course_code}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCourse(course.course_id)}
                    disabled={removeMutation.isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {assignedCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-4">No courses assigned yet</p>
                  <Button
                    onClick={() => setIsAssignCourseModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Assign First Course
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AssignCourseModal
        isOpen={isAssignCourseModalOpen}
        onClose={() => setIsAssignCourseModalOpen(false)}
        onAssignCourse={handleAssignCourse}
        instructorName={user.name}
        instructorId={+user.id}
      />
    </>
  );
}
