
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trophy, Users, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

const starTeachers = [
  {
    id: '1',
    name: 'Priya Sharma',
    specialization: 'Bharatanatyam',
    avatar: '/placeholder-avatar.png',
    rating: 4.9,
    students: 45,
    classes: 128,
    achievements: ['Top Rated', 'Most Popular']
  },
  {
    id: '2',
    name: 'Ravi Kumar',
    specialization: 'Hindustani Vocal',
    avatar: '/placeholder-avatar.png',
    rating: 4.8,
    students: 38,
    classes: 105,
    achievements: ['Excellence Award', 'Student Favorite']
  },
  {
    id: '3',
    name: 'Meera Singh',
    specialization: 'Kathak',
    avatar: '/placeholder-avatar.png',
    rating: 4.7,
    students: 32,
    classes: 89,
    achievements: ['Rising Star', 'Dedication Award']
  },
  {
    id: '4',
    name: 'Arjun Patel',
    specialization: 'Tabla',
    avatar: '/placeholder-avatar.png',
    rating: 4.8,
    students: 29,
    classes: 95,
    achievements: ['Innovation Award', 'Most Dedicated']
  },
  {
    id: '5',
    name: 'Lakshmi Iyer',
    specialization: 'Carnatic Vocal',
    avatar: '/placeholder-avatar.png',
    rating: 4.9,
    students: 41,
    classes: 112,
    achievements: ['Excellence Award', 'Top Performer']
  }
];

export function StarTeachersSection({ existingAssignments }: { existingAssignments: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-playfair">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Star Teachers of the Month
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={scrollPrev}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={scrollNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {existingAssignments.map((teacher, index) => (
              <div key={teacher.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-2">
                <div className="relative p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-pink-50 hover:shadow-md transition-shadow h-full">
                  {/* Rank Badge */}
                  <div className="absolute -top-2 -right-2">
                    <Badge className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                      }`}>
                      {index + 1}
                    </Badge>
                  </div>

                  <div className="text-center space-y-3">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src={teacher.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-lg">
                        {teacher.first_name} {teacher.last_name}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold text-lg">{teacher.first_name} {teacher.last_name}</h3>
                      <p className="text-sm text-gray-600">{teacher.specialization}</p>
                    </div>

                    {/* <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{teacher.rating || 5}</span>
                    </div> */}

                    {/* <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{teacher.students}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span>{teacher.classes}</span>
                      </div>
                    </div> */}

                    <div className="flex flex-wrap gap-1 justify-center">
                      {teacher.achievements?.map((achievement, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
