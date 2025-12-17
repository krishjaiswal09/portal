import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  subCategories: any[];
  courses: any[];
}

interface Subcategory {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  category_id: number;
  created_at: string;
  updated_at: string;
}

interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
  credits: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  learning_outcomes: any[];
  objectives: any[];
  is_published: boolean;
  introduction_video_url: string | null;
  display_as_course_catalog: boolean;
  display_as_free: boolean;
  link_to_manage_demos: boolean;
  thumbnail_image: string;
  category_id: number;
  sub_category_id: number;
  is_featured: boolean;
  topics: any[];
  resources: any[];
  teachers: any[];
}

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignCourse: () => void;
  instructorName: string;
  instructorId: number;
}

export function AssignCourseModal({
  isOpen,
  onClose,
  onAssignCourse,
  instructorName,
  instructorId,
}: AssignCourseModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("none");
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>("none");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("none");
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () =>
      fetchApi({
        path: "courses/categories",
      }),
    enabled: isOpen,
  });

  const subcategoriesQuery = useQuery<Subcategory[]>({
    queryKey: ["subcategories", selectedCategoryId],
    queryFn: () =>
      fetchApi({
        path: `courses/categories/${selectedCategoryId}/subcategories`,
      }),
    enabled: selectedCategoryId !== "none",
  });

  const coursesQuery = useQuery<Course[]>({
    queryKey: ["courses", selectedCategoryId, selectedSubcategoryId],
    queryFn: () =>
      fetchApi({
        path: `courses/category?categoryId=${selectedCategoryId}&detailed=true&subcategoryId=${selectedSubcategoryId}`,
      }),
    enabled: selectedCategoryId !== "none" && selectedSubcategoryId !== "none",
  });

  const subcategories = subcategoriesQuery.data || [];
  const courses = coursesQuery.data || [];

  const assignCourseMutation = useMutation({
    mutationFn: (payload: { instructor_id: number; course_id: number }) =>
      fetchApi({
        path: "instructor-courses",
        method: "POST",
        data: payload,
      }),
    onSuccess: () => {
      toast.success("Course assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ['instructor-courses', instructorId] });
      onAssignCourse();
      handleClose();
    },
    onError: () => {
      toast.error("Failed to assign course. Please try again.");
    },
  });

  useEffect(() => {
    setSelectedSubcategoryId("none");
    setSelectedCourseId("none");
  }, [selectedCategoryId]);

  useEffect(() => {
    setSelectedCourseId("none");
  }, [selectedSubcategoryId]);

  const handleSubmit = () => {
    if (selectedCategoryId !== "none" && selectedSubcategoryId !== "none" && selectedCourseId !== "none") {
      assignCourseMutation.mutate({
        instructor_id: instructorId,
        course_id: parseInt(selectedCourseId),
      });
    }
  };

  const handleClose = () => {
    setSelectedCategoryId("none");
    setSelectedSubcategoryId("none");
    setSelectedCourseId("none");
    onClose();
  };

  const isSubmitDisabled =
    selectedCategoryId === "none" || selectedSubcategoryId === "none" || selectedCourseId === "none";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Course to {instructorName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a category</SelectItem>
                {categoriesQuery.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Select
              value={selectedSubcategoryId}
              onValueChange={setSelectedSubcategoryId}
              disabled={selectedCategoryId === "none"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a subcategory</SelectItem>
                {subcategories.map((subcategory) => (
                  <SelectItem
                    key={subcategory.id}
                    value={subcategory.id.toString()}
                  >
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
              disabled={selectedSubcategoryId === "none"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a course</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled || assignCourseMutation.isPending}
          >
            {assignCourseMutation.isPending ? "Assigning..." : "Assign Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
