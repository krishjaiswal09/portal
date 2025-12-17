
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Award, Users } from "lucide-react";

interface Instructor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  imageUrl?: string;
  studentsCount: number;
  experience: string;
  description: string;
}

interface BestInstructorsSectionProps {
  instructors: Instructor[];
}

export function BestInstructorsSection({
  instructors
}: BestInstructorsSectionProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Award className="w-6 h-6 text-orange-500" />
          Best Instructors
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={instructor.imageUrl} alt={instructor.name} />
                  <AvatarFallback className="text-sm bg-orange-50 text-orange-700 border border-orange-200">
                    {instructor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{instructor.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{instructor.specialization}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{instructor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{instructor.studentsCount} students</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {instructor.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                  {instructor.experience} experience
                </Badge>
                <Button size="sm" variant="outline" className="hover:bg-orange-50 hover:border-orange-300">
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
