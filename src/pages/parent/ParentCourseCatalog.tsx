import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout";
import { ParentMessageIcon } from "@/components/parent/ParentMessageIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Clock, Users, BookOpen } from "lucide-react";
import { fetchApi } from '@/services/api/fetchApi';
import { useQuery } from '@tanstack/react-query';
import { Course } from '@/types/course';

const ParentCourseCatalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtForm, setSelectedArtForm] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

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
      setCourses(getCoursesQueries.data.data.filter(v => v.display_as_course_catalog && v.is_published));
    }
  }, [getCoursesQueries.isLoading, getCoursesQueries.data]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    // const matchesArtForm = selectedArtForm === 'all' || course.artForm === selectedArtForm;
    // const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    // const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
    return matchesSearch;
  });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Starting Soon':
        return 'bg-blue-100 text-blue-800';
      case 'Full':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleViewDetails = (courseId: string) => {
    navigate(`/parent/catalog/${courseId}`);
  };
  return <ParentDashboardLayout title="Course Catalog">
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-3xl font-playfair font-bold mb-2">Explore Our Course Catalog</h2>
        <p className="text-gray-600">Discover and enroll in new courses for your family</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search courses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>

            {/* Art Form Filter */}
            <Select value={selectedArtForm} onValueChange={setSelectedArtForm}>
              <SelectTrigger>
                <SelectValue placeholder="Art Form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Art Forms</SelectItem>
                <SelectItem value="Vocal">Vocal</SelectItem>
                <SelectItem value="Dance">Dance</SelectItem>
                <SelectItem value="Percussion">Percussion</SelectItem>
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Wind">Wind</SelectItem>
              </SelectContent>
            </Select>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Starting Soon">Starting Soon</SelectItem>
                <SelectItem value="Full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Results */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
        </h3>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => <Card key={course.id} className="hover:shadow-lg transition-shadow duration-200">
          <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 rounded-t-lg flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-orange-600" />
          </div>

          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-lg mb-1">{course.title}</h4>
                {/* <p className="text-sm text-gray-600 mb-2">{course.instructor}</p> */}
              </div>

            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{course.description}</p>

            <div className="space-y-3">
              {/* Course Info */}


              {/* Rating & Enrollments */}


              {/* Action Button */}
              <Button className="w-full" onClick={() => handleViewDetails(course.id)}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>)}
      </div>

      {filteredCourses.length === 0 && <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or filters</p>
      </div>}
    </div>

    <ParentMessageIcon />
  </ParentDashboardLayout>;
};
export default ParentCourseCatalog;