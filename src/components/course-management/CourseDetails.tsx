
import React from 'react'
import { Course } from "@/types/course"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Clock, Plus, GripVertical } from "lucide-react"

interface CourseDetailsProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
}

export function CourseDetails({ isOpen, onClose, course }: CourseDetailsProps) {
  if (!course) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Course Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex items-center p-4">
                <BookOpen className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Artform</p>
                  <p className="font-semibold">{course.artform}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <Users className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-semibold">{course.totalStudents}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <Clock className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Modules</p>
                  <p className="font-semibold">{course.modules.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Category</h4>
                <Badge variant="outline">{course.category?.name || 'No Category'}</Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{course.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Assigned Instructors</h4>
                <div className="flex flex-wrap gap-2">
                  {course.instructors.map((instructor, index) => (
                    <Badge key={index} variant="secondary">
                      {instructor}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Modules */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Course Modules</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.modules
                  .sort((a, b) => a.order - b.order)
                  .map((module, index) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{module.title}</h4>
                              {module.duration && (
                                <Badge variant="outline" className="text-xs">
                                  {module.duration}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {module.description}
                            </p>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                Notes: {module.notes.length}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
