import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";

interface CourseSelectionSectionProps {
  selectedCourse: string;
  onCourseChange: (course: string) => void;
  instructorCourses?: any[];
  primaryInstructor?: string;
}

export function CourseSelectionSection({
  selectedCourse,
  onCourseChange,
  instructorCourses,
  primaryInstructor,
}: CourseSelectionSectionProps) {
  const { data: allCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "courses",
      }),
  });

  const AllCourses: any = allCourses;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Course Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course">Select Course *</Label>
          <Select value={selectedCourse} onValueChange={onCourseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a course for the demo" />
            </SelectTrigger>
            <SelectContent>
              {(primaryInstructor && instructorCourses
                ? instructorCourses?.map((course: any) => (
                  <SelectItem key={course.course_id} value={String(course.course_id)}>
                    <div className="flex flex-col">
                      <span className="font-medium">{course.course_title}</span>
                    </div>
                  </SelectItem>
                ))
                : AllCourses?.data?.map((course: any) => (
                  <SelectItem key={course.id} value={String(course.id)}>
                    <div className="flex flex-col">
                      <span className="font-medium">{course.title}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedCourse && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <Label className="text-sm font-medium">Selected Course</Label>

            {/* Show course title instead of ID */}
            <div className="font-medium text-primary">
              {
                primaryInstructor && instructorCourses
                  ? instructorCourses.find(
                    (course: any) => String(course.course_id) === selectedCourse
                  )?.course_title
                  : AllCourses?.data?.find(
                    (course: any) => String(course.id) === selectedCourse
                  )?.title
              }
            </div>

            {/* Show description if available */}
            {AllCourses?.data?.find(
              (course: any) => String(course.id) === selectedCourse
            )?.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {
                    AllCourses?.data?.find(
                      (course: any) => String(course.id) === selectedCourse
                    )?.description
                  }
                </p>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
