
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Clock, Users, Star, Filter, ArrowLeft } from "lucide-react";
import { Course, CourseStatus } from "@/types/course";
import { fetchApi } from '@/services/api/fetchApi'
import { useQuery } from '@tanstack/react-query'
import { hasPermission } from '@/utils/checkPermission';

const CourseCatalog = () => {
  const navigate = useNavigate();
  if (!hasPermission("HAS_READ_COURSE_CATALOG")) {
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
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedArtform, setSelectedArtform] = useState("all");
  // const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [courses, setCourses] = useState<Course[]>([])
  const getCoursesQueries = useQuery({
    queryKey: ["getCoursesQueries"],
    queryFn: () =>
      fetchApi<{ data: Course[] }>({
        path: "courses",
        params: { detailed: true }
      }),
  });

  useEffect(() => {
    if (
      !getCoursesQueries.isLoading &&
      getCoursesQueries.data &&
      getCoursesQueries.data.data
    ) {
      setCourses(getCoursesQueries.data.data.filter(v => v.display_as_course_catalog));
    }
  }, [getCoursesQueries.isLoading, getCoursesQueries.data]);

  // Get unique artforms for filter
  // const artforms = Array.from(new Set(courses.map(course => course?.art_form)));
  // const levels = ["Beginner", "Intermediate", "Advanced"];
  const statuses = ["Published", "Unpublished"];

  const filteredCourses = courses.filter(course => {
    const stt = course.is_published ? "Published" : "Unpublished"
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stt.toLowerCase().includes(searchQuery.toLowerCase());

    // const matchesArtform = selectedArtform === "all" || course.art_form === selectedArtform;
    // const courseLevel = (course as any).level || "Beginner"; // Fallback to Beginner
    // const matchesLevel = selectedLevel === "all" || courseLevel === selectedLevel;

    const st = selectedStatus === "Published"
    // Use the actual course status from the CourseStatus enum
    const matchesStatus = selectedStatus === "all" || course?.is_published === st;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (course: any) => {
    const status = course.is_published;
    switch (status) {
      case true:
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case false:
        return <Badge className="bg-gray-100 text-gray-800">Unpublished</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // const getLevelBadge = (course: any) => {
  //   const level = course.level || "Beginner";
  //   switch (level) {
  //     case 'Beginner':
  //       return <Badge variant="outline" className="text-green-600 border-green-600">Beginner</Badge>;
  //     case 'Intermediate':
  //       return <Badge variant="outline" className="text-blue-600 border-blue-600">Intermediate</Badge>;
  //     case 'Advanced':
  //       return <Badge variant="outline" className="text-purple-600 border-purple-600">Advanced</Badge>;
  //     default:
  //       return <Badge variant="outline">{level}</Badge>;
  //   }
  // };
  return (
    <DashboardLayout title="Course Catalog">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-playfair font-bold text-foreground">Course Catalog</h1>
            <p className="text-base text-muted-foreground mt-1">
              Browse and discover available courses across different art forms
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredCourses.length} course(s) found
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses by name, description, or art form..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* <Select value={selectedArtform} onValueChange={setSelectedArtform}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Art Forms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Art Forms</SelectItem>
                  {artforms.map(artform => (
                    <SelectItem key={artform} value={artform}>{artform}</SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

              {/* <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-start md:justify-end lg:justify-end">
                  {getStatusBadge(course)}
                </div>
                <div>
                  <div className="flex gap-3 items-start">
                    <div className="w-[100px] h-[100px] flex-shrink-0">
                      <img
                        src={course?.thumbnail_image || "/placeholder.svg"}
                        alt={course?.title || "Course thumbnail"}
                        className="w-full h-full rounded-md object-cover border border-gray-200"
                      />
                    </div>
                    <CardTitle className="text-lg font-semibold mb-1 line-clamp-2 flex-1">
                      {course?.title || "Untitled Course"}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description}
                </p>

                {/* <div className="flex flex-wrap gap-2">
                  {getLevelBadge(course)}
                  <Badge variant="outline" className="text-xs">
                    {course.category?.name}
                  </Badge>
                </div> */}

                {/* <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{(course as any).duration || '8 weeks'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.totalStudents || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{(course as any).rating || '4.5'}</span>
                  </div>
                </div> */}

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/courses/catalog/${course.id}`)}
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters to find courses.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseCatalog;
