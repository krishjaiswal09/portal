import React, { useState, useMemo } from "react";
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TablePagination } from "@/components/ui/table-pagination";
import { Filter } from "lucide-react";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { SectionLoader } from "@/components/ui/loader";
import { useNavigate } from "react-router-dom";

export default function MyStudents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [classTypeFilter, setClassTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: assignedStudentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assigned-students", user.id],
    queryFn: async () => {
      const response = await fetchApi({
        path: `classes/class-schedule/users/instructor/${user.id}`,
        method: "GET",
      });
      return response;
    },
  });

  const allCoursesData = useQuery({
    queryKey: ["allCoursesData"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: `courses`,
      }),
  });

  const { data: classTypesData } = useQuery({
    queryKey: ["classes/class-types"],
    queryFn: () =>
      fetchApi({
        path: "classes/class-type",
      }),
  });

  const classTypes = Array.isArray(classTypesData) ? classTypesData : [];
  const coursesData: any = allCoursesData?.data?.data as any;

  const students = useMemo(() => {
    if (!assignedStudentsData || !Array.isArray(assignedStudentsData))
      return [];

    return assignedStudentsData.map((student) => {
      const firstClass = student?.class_details?.[0];
      const allCourses =
        student?.class_details
          ?.map((detail) => detail?.course?.title)
          ?.filter(Boolean) || [];
      const uniqueCourses = [...new Set(allCourses)];

      return {
        id: student?.id || 0,
        name:
          `${student?.first_name || ""} ${student?.last_name || ""}`.trim() ||
          "N/A",
        course: firstClass?.course?.title || "N/A",
        allCourses: uniqueCourses,
        ageType: student?.age_type === "kid" ? "Kid" : "Adult",
        classType: firstClass?.classtype?.name || "N/A",
        parentName: student?.parent_name || null,
        status: student?.is_active ? "Active" : "Inactive",
        email: student?.email || "",
      };
    });
  }, [assignedStudentsData]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      return (
        (courseFilter === "all" || student.course === courseFilter) &&
        (statusFilter === "all" || student.status === statusFilter) &&
        (ageFilter === "all" || student.ageType === ageFilter) &&
        (classTypeFilter === "all" || student.classType === classTypeFilter)
      );
    });
  }, [students, courseFilter, statusFilter, ageFilter, classTypeFilter]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
        Inactive
      </Badge>
    );
  };

  return (
    <InstructorDashboardLayout title="My Students">
      <div className="space-y-6">
        {/* Filter Bar */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Course</label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {coursesData?.map((course: any) => (
                      <SelectItem key={course?.id} value={course?.title}>
                        {course?.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Age Type
                </label>
                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Ages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="Kid">Kid</SelectItem>
                    <SelectItem value="Adult">Adult</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Class Type
                </label>
                <Select
                  value={classTypeFilter}
                  onValueChange={setClassTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Class Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Class Types</SelectItem>
                    {classTypes?.map((classType: any) => (
                      <SelectItem key={classType?.id} value={classType?.name}>
                        {classType?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <SectionLoader text="Loading your students..." />
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Error loading students
              </div>
            ) : !paginatedStudents?.length ? (
              <div className="text-center py-8 text-gray-500">
                No students found
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Age Type</TableHead>
                      <TableHead>Class Type</TableHead>
                      <TableHead>Parent Name</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents?.map((student) => (
                      <TableRow key={student?.id || Math.random()}>
                        <TableCell className="font-medium cursor-pointer focus:text-red-900" onClick={() => navigate(`/instructor/students/${student?.id}`)}>
                          {student?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">
                                  {student?.course || "N/A"}
                                  {(student?.allCourses?.length || 0) > 1 && (
                                    <span className="ml-1 text-xs text-gray-500">
                                      (+{(student?.allCourses?.length || 1) - 1}
                                      )
                                    </span>
                                  )}
                                </span>
                              </TooltipTrigger>
                              {(student?.allCourses?.length || 0) > 1 && (
                                <TooltipContent>
                                  <div className="space-y-1">
                                    <p className="font-medium">All Courses:</p>
                                    {student?.allCourses?.map(
                                      (course, index) => (
                                        <p key={index} className="text-sm">
                                          {(course as string) || "N/A"}
                                        </p>
                                      )
                                    )}
                                  </div>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              student?.ageType === "Kid"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            }
                          >
                            {student?.ageType || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>{student?.classType || "N/A"}</TableCell>
                        <TableCell>
                          {student?.parentName || (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(student?.status || "Inactive")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4">
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredStudents.length}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </InstructorDashboardLayout>
  );
}
