
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Course } from "@/types/course";
import { PlayCircle, BookOpen, Target, CheckCircle, Users, Calendar, ArrowLeft } from "lucide-react";

interface CourseDetailViewProps {
  course: Course;
  onBack: () => void;
}

export function CourseDetailView({ course, onBack }: CourseDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Catalog
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>{course.category?.name}</span>
            <span>→</span>
            <span>{course.subcategory?.name}</span>
          </div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">{course.artform}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {course.totalStudents} students
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {course.modules.length} modules
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Introduction Video */}
          {course.introductionVideoUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Introduction Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Video Player</p>
                    <p className="text-xs text-muted-foreground mt-1">{course.introductionVideoUrl}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          {course.learningOutcomes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Learning Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(typeof course.learningOutcomes === 'string'
                    ? (course.learningOutcomes as string).split('\n').filter(outcome => outcome.trim())
                    : course.learningOutcomes
                  ).map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{outcome}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Objectives */}
          {course.objectives && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Course Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(typeof course.objectives === 'string'
                    ? course.objectives.split('\n').filter(objective => objective.trim())
                    : course.objectives
                  ).map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{objective}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Modules */}
          {course.modules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Modules ({course.modules.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Module {index + 1}
                            </span>
                            <Badge variant={module.status === 'published' ? 'default' : 'secondary'}>
                              {module.status}
                            </Badge>
                          </div>
                          <h4 className="font-semibold mb-1">{module.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                          {module.duration && (
                            <p className="text-xs text-muted-foreground">Duration: {module.duration}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Topics Covered */}
          {course.topicsCovered.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Topics Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.topicsCovered.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Instructors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.instructors.map((instructor, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{instructor}</p>
                      <p className="text-sm text-muted-foreground">Instructor</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Art Form</p>
                <Badge variant="outline">{course.artform}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Category</p>
                <p className="text-sm text-muted-foreground">{course.category?.name}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Subcategory</p>
                <p className="text-sm text-muted-foreground">{course.subcategory?.name}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Total Students</p>
                <p className="text-sm text-muted-foreground">{course.totalStudents}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Status</p>
                <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                  {course.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
