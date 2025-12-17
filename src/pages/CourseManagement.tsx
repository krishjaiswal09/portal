
import React, { useEffect, useState } from 'react'
import { DashboardLayout } from "@/components/DashboardLayout"
import { CourseTable } from "@/components/course-management/CourseTable"
import { FilterToolbar } from "@/components/course-management/FilterToolbar"
import { CategoryManagement } from "@/components/course-management/CategoryManagement"
import { SubcategoryManagement } from "@/components/course-management/SubcategoryManagement"
import { TopicsCoveredManagement } from "@/components/course-management/TopicsCoveredManagement"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Course, CourseCategory, CourseSubcategory } from "@/types/course"
import { Plus, BookOpen, FolderOpen, Layers, List, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { fetchApi } from '@/services/api/fetchApi'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useToast } from "@/hooks/use-toast";
import { hasPermission } from '@/utils/checkPermission'
import { SectionLoader } from "@/components/ui/loader"

const CourseManagement = () => {
  const navigate = useNavigate()
  if (!hasPermission("HAS_READ_COURSE")) {
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
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [subcategories, setSubcategories] = useState<CourseSubcategory[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    categories: []
  })

  const categoriesQueries = useQuery({
    queryKey: ["categoriesQueries"],
    queryFn: () =>
      fetchApi<CourseCategory[]>({
        path: "courses/categories",
      }),
  });

  const getCoursesQueries = useQuery({
    queryKey: ["getCoursesQueries"],
    queryFn: () =>
      fetchApi<{ data: Course[] }>({
        path: "courses",
        params: { detailed: true }
      }),
  });

  const subCategoriesQueries = useQuery({
    queryKey: ["subCategoriesQueries"],
    queryFn: () =>
      fetchApi<CourseSubcategory[]>({
        path: "courses/subcategories/all",
      }),
  });

  const createUpdateCategoryMutation = useMutation({
    mutationKey: ['createOrUpdateCategory'],
    mutationFn: (data: { id?: string; payload: any }) => {
      const { id, payload } = data;
      const method = id ? 'PUT' : 'POST';
      const path = id ? `courses/category/${id}` : 'courses/categories';

      return fetchApi<any>({
        path,
        method,
        data: payload,
      });
    },
    onSuccess: (data, variables) => {
      const isUpdate = !!variables.id;
      toast({
        title: isUpdate ? "Category Updated Successfully" : "Category Created Successfully",
        description: isUpdate ? `The category has been updated.` : `A new category has been created.`,
        duration: 3000,
      });
      // Invalidate and refetch the categories query to update the UI
      categoriesQueries.refetch();
    },
    onError: (error: any, variables) => {
      const isUpdate = !!variables.id;
      toast({
        title: isUpdate ? "Failed to Update Category" : "Failed to Create Category",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationKey: ['deleteCategory'],
    mutationFn: (id?: string) => fetchApi<any>({
      path: `courses/category/${id}`,
      method: "DELETE"
    }),
    onSuccess: () => {
      toast({
        title: "Category Deleted Successfully",
        description: `The category has been deleted.`,
        duration: 3000,
      });
      categoriesQueries.refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed to delete Category",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const deleteSubCategoryMutation = useMutation({
    mutationKey: ['deleteSubCategory'],
    mutationFn: (id?: string) => fetchApi<any>({
      path: `courses/subcategories/${id}`,
      method: "DELETE"
    }),
    onSuccess: () => {
      toast({
        title: "Sub-category Deleted Successfully",
        description: `The sub-category has been deleted.`,
        duration: 3000,
      });
      subCategoriesQueries.refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed to delete Sub-category",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const deleteCourseMutation = useMutation({
    mutationKey: ['deleteCourseMutation'],
    mutationFn: (id?: string) => fetchApi<any>({
      path: `courses/${id}`,
      method: "DELETE"
    }),
    onSuccess: () => {
      toast({
        title: "Course Deleted Successfully",
        description: `The course has been deleted.`,
        duration: 3000,
      });
      getCoursesQueries.refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed to delete course",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const createUpdateSubCategoryMutation = useMutation({
    mutationKey: ['createOrUpdateSubCategory'],
    mutationFn: (data: { id?: string; payload: any }) => {
      const { id, payload } = data;
      const method = id ? 'PUT' : 'POST';
      const path = id ? `courses/subcategories/${id}` : 'courses/subcategories';

      return fetchApi<any>({
        path,
        method,
        data: payload,
      });
    },
    onSuccess: (_data, variables) => {
      const isUpdate = !!variables.id;
      toast({
        title: isUpdate ? "Sub-Category Updated Successfully" : "Sub-Category Created Successfully",
        description: isUpdate ? `The sub-category has been updated.` : `A new sub-category has been created.`,
        duration: 3000,
      });
      // Invalidate and refetch the categories query to update the UI
      subCategoriesQueries.refetch();
    },
    onError: (error: any, variables) => {
      const isUpdate = !!variables.id;
      toast({
        title: isUpdate ? "Failed to Update Category" : "Failed to Create Category",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  useEffect(() => {
    if (
      !categoriesQueries.isLoading &&
      categoriesQueries.data
    ) {
      setCategories(categoriesQueries.data);
    }
  }, [categoriesQueries.isLoading, categoriesQueries.data]);

  useEffect(() => {
    if (
      !getCoursesQueries.isLoading &&
      getCoursesQueries.data &&
      getCoursesQueries.data.data
    ) {
      setCourses(getCoursesQueries.data.data);
    }
  }, [getCoursesQueries.isLoading, getCoursesQueries.data]);

  useEffect(() => {
    if (
      !subCategoriesQueries.isLoading &&
      subCategoriesQueries.data
    ) {
      setSubcategories(subCategoriesQueries.data);
    }
  }, [subCategoriesQueries.isLoading, subCategoriesQueries.data]);

  const filteredCourses = courses.filter(course => {
    const searchMatch = !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase())

    const categoryMatch = filters.categories.length === 0 ||
      filters.categories.includes(course.category_id)
    console.log(filters.categories)

    return searchMatch && categoryMatch
  })

  const handleCreateCourse = () => {
    navigate('/courses/create')
  }

  const handleViewCourse = (course: Course) => {
    navigate(`/courses/catalog/${course.id}`)
  }

  const handleDeleteCourse = (courseId: string) => {
    deleteCourseMutation.mutate(courseId)
  }

  const handleCreateCategory = (categoryData: Omit<CourseCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    createUpdateCategoryMutation.mutate({ payload: categoryData });
  }

  const handleEditCategory = (id: string, categoryData: Partial<CourseCategory>) => {
    createUpdateCategoryMutation.mutate({ id, payload: categoryData });
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id)
  }

  const handleCreateSubcategory = (subcategoryData: Omit<CourseSubcategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    createUpdateSubCategoryMutation.mutate({
      payload: {
        category_id: +subcategoryData.categoryId,
        description: subcategoryData.description,
        name: subcategoryData.name
      }
    })
  }

  const handleEditSubcategory = (id: string, subcategoryData: Partial<CourseSubcategory>) => {
    createUpdateSubCategoryMutation.mutate({
      id, payload: {
        category_id: +subcategoryData.categoryId,
        description: subcategoryData.description,
        name: subcategoryData.name
      }
    });
  }

  const handleDeleteSubcategory = (id: string) => {
    deleteSubCategoryMutation.mutate(id)
  }

  return (
    <DashboardLayout title="Course Management">
      <div className="space-y-4 md:space-y-6 px-2 md:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Course Management</h1>
            <p className="text-muted-foreground text-sm md:text-lg mt-2">
              Manage course categories, subcategories, courses, modules, and content
            </p>
          </div>
        </div>

        <Tabs defaultValue="courses" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:w-fit">
            {
              hasPermission("HAS_READ_COURSE_CATEGORY") && <TabsTrigger value="categories" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <FolderOpen className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Categories</span>
                <span className="sm:hidden">Cat.</span>
              </TabsTrigger>
            }
            {
              hasPermission("HAS_READ_COURSE_CATEGORY") && <TabsTrigger value="subcategories" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <Layers className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Subcategories</span>
                <span className="sm:hidden">Sub.</span>
              </TabsTrigger>
            }
            {
              hasPermission("HAS_READ_COURSE") && <TabsTrigger value="courses" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Courses</span>
                <span className="sm:hidden">Courses</span>
              </TabsTrigger>
            }
            {
              hasPermission("HAS_READ_COURSE") && <TabsTrigger value="topics" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <List className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Topics Covered</span>
                <span className="sm:hidden">Topics</span>
              </TabsTrigger>
            }
          </TabsList>

          <TabsContent value="categories">
            {categoriesQueries.isLoading ? (
              <SectionLoader text="Loading categories..." />
            ) : (
              <CategoryManagement
                categories={categories}
                subcategories={subcategories}
                onCreateCategory={handleCreateCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            )}
          </TabsContent>

          <TabsContent value="subcategories">
            {subCategoriesQueries.isLoading ? (
              <SectionLoader text="Loading subcategories..." />
            ) : (
              <SubcategoryManagement
                categories={categories}
                subcategories={subcategories}
                onCreateSubcategory={handleCreateSubcategory}
                onEditSubcategory={handleEditSubcategory}
                onDeleteSubcategory={handleDeleteSubcategory}
              />
            )}
          </TabsContent>

          <TabsContent value="topics">
            {getCoursesQueries.isLoading ? (
              <SectionLoader text="Loading topics..." />
            ) : (
              <TopicsCoveredManagement
                courses={courses} />
            )}
          </TabsContent>

          <TabsContent value="courses" className="space-y-4 md:space-y-6">
            {/* Course Management Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {
                hasPermission("HAS_CREATE_COURSE") && <Button
                  onClick={handleCreateCourse}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Create Course
                </Button>
              }
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search courses by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <FilterToolbar
                categories={categories}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>

            {/* Course Table */}
            <div className="bg-background border rounded-lg overflow-hidden">
              {getCoursesQueries.isLoading ? (
                <SectionLoader text="Loading courses..." />
              ) : (
                <CourseTable
                  courses={filteredCourses}
                  onView={handleViewCourse}
                  onDelete={handleDeleteCourse}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default CourseManagement
