
import React from 'react'
import { Course } from "@/types/course"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Trash2, BookOpen, MoreVertical, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { hasPermission } from '@/utils/checkPermission'

interface CourseTableProps {
  courses: Course[]
  onView: (course: Course) => void
  onDelete: (courseId: string) => void
}

export function CourseTable({ courses, onView, onDelete }: CourseTableProps) {
  const isMobile = useIsMobile()

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={`${course.id}_course`} className="bg-card border border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <h3 className="font-semibold text-base text-foreground truncate">{course.title}</h3>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {
                      hasPermission("HAS_EDIT_COURSE") && <DropdownMenuItem onClick={() => onView(course)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                    }
                    {
                      hasPermission("HAS_DELETE_COURSE") && <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-amber-500" />
                              Delete Course
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{course.title}"?
                              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                                <p className="text-amber-800 font-medium">Impact Warning:</p>
                                <p className="text-amber-700 text-sm">
                                  This may affect scheduled classes and student enrollments.
                                </p>
                              </div>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(course.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Course
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    }
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">{course.category?.name || "No Category"}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{course.topics?.length || 0} topics</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Total Topics</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={`${course.id}_course_desktop`} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  {course.title}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">{course.category?.name || "No Category"}</Badge>
              </TableCell>
              <TableCell>{course.topics?.length || 0}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {
                    hasPermission("HAS_EDIT_COURSE") && <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(course)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  }
                  {
                    hasPermission("HAS_DELETE_COURSE") && <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Delete Course
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{course.title}"?
                            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                              <p className="text-amber-800 font-medium">Impact Warning:</p>
                              <p className="text-amber-700 text-sm">
                                This may affect scheduled classes and student enrollments.
                              </p>
                            </div>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(course.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Course
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  }
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
