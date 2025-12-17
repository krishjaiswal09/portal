
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { fetchApi } from '@/services/api/fetchApi';
import { useQuery } from '@tanstack/react-query';

interface Course {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  students: number;
  price: string;
}

interface FeaturedCoursesSectionProps {
  courses?: Course[];
}

export function FeaturedCoursesSection() {
  const handleViewAll = () => {
    window.open('https://www.artgharana.com/courses/all', '_blank');
  };

  const featuredQueries = useQuery({
    queryKey: ["featuredQueries"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "courses",
        params: {
          detailed: true
        }
      }),
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Musical Instrument': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Dance': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Vocal': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-gray-900">Featured Courses</h2>
            <p className="text-gray-600 mt-1">Discover our most popular art courses</p>
          </div>
          <Button onClick={handleViewAll} variant="outline" className="flex items-center gap-2 hover:bg-orange-50 hover:border-orange-300">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {featuredQueries?.data?.data?.filter(v => v.is_featured)?.map(course => (
            <div key={course.id} className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="relative overflow-hidden">
                <img src={course?.thumbnail_image} alt={course?.title} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute top-3 left-3">
                  <Badge className={getCategoryColor(course.category.name)}>
                    {course.category.name}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-center group-hover:text-orange-600 transition-colors text-lg">
                  {course.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
