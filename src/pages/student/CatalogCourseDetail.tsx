
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, BookOpen, User, Clock, Users, Star, Target, CheckCircle } from "lucide-react"
import { fetchApi } from "@/services/api/fetchApi"
import { Course } from "@/types/course"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

export default function CatalogCourseDetail() {
  const { toast } = useToast();
  const { user } = useAuth()
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<Course>()
  const getCourseQueries = useQuery({
    queryKey: ["getCourseQueries", courseId],
    queryFn: () =>
      fetchApi<any>({
        path: `courses/${courseId}`
      }),
  });

  const getEnrollmentQueries = useQuery({
    queryKey: ["getEnrollmentQueries", courseId],
    queryFn: () =>
      fetchApi<any>({
        path: `courses/get-enroll`,
        params: {
          user_id: +user.id,
          course_id: +courseId
        }
      }),
  });

  const enrollUserCourseMutation = useMutation({
    mutationFn: (enroll: any) =>
      fetchApi<any>({
        path: `courses/enroll`,
        method: 'POST',
        data: enroll
      }),
    onSuccess: () => {
      toast({
        title: "Course Enrollment",
        description: `You have enrolled to course successfully`,
        duration: 3000
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error enrolling course",
        description: `${error.message}`,
        variant: "destructive",
        duration: 5000
      });
    },
  });

  useEffect(() => {
    if (
      !getCourseQueries.isLoading &&
      getCourseQueries.data
    ) {
      const data = getCourseQueries.data
      const updatedMapping = {
        title: data.title || "",
        description: data.description || "",
        sub_category_id: data.sub_category_id || "",
        categoryId: data.category_id || "",
        introductionVideoUrl: data.introduction_video_url || "",
        learningOutcomes: data.learning_outcomes || '',
        objectives: data.objectives || '',
        displayInCourseCatalog: data.display_as_course_catalog || false,
        displayAsFree: data.display_as_free || false,
        is_published: data.is_published || false,
        linkToManageDemos: data.link_to_manage_demos || false,
        topics: data.topics || [],
        id: data.id
      }
      setCourse(updatedMapping);
    }
  }, [getCourseQueries.isLoading, getCourseQueries.data]);

  if (!course) {
    return (
      <StudentDashboardLayout title="Course Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Course not found</h2>
          <Button asChild>
            <Link to="/student/catalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course Catalog
            </Link>
          </Button>
        </div>
      </StudentDashboardLayout>
    )
  }

  return (
    <StudentDashboardLayout title={course.title}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/student/catalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Catalog
            </Link>
          </Button>
        </div>

        {/* Course Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {course.thumbnail_image && (
                <div className="w-full md:w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={course.thumbnail_image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        Expert Instructors
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {/* {course.duration} */}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                      {course.category && (
                        <Badge variant="outline">{course.category.name}</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {/* <span>{course.totalStudents} students enrolled</span> */}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {/* <span>{courseDetails.rating}/5.0</span> */}
                    </div>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => {
                    enrollUserCourseMutation.mutate({
                      user_id: user.id,
                      course_id: course.id,
                      status: "Active"
                    })
                  }}>
                    {getEnrollmentQueries.data ? "Enrolled" : "Enroll Now"}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Course Description */}
        <Card>
          <CardHeader>
            <CardTitle>About This Course</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {course.description}
            </p>
          </CardContent>
        </Card>

        {/* Course Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Objectives */}
          {course.objectives && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(typeof course.objectives === 'string'
                    ? (course.objectives as string).split('\n').filter(objective => objective.trim())
                    : course.objectives
                  ).map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Learning Outcomes */}
          {course.learningOutcomes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Learning Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(typeof course.learningOutcomes === 'string'
                    ? (course.learningOutcomes as string).split('\n').filter(outcome => outcome.trim())
                    : course.learningOutcomes
                  ).map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Topics Covered */}
        <Card>
          <CardHeader>
            <CardTitle>Topics Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{topic.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        {!getEnrollmentQueries.data && <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">Ready to Start Learning?</h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of students already enrolled in this course
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600" onClick={() => {
              enrollUserCourseMutation.mutate({
                user_id: user.id,
                course_id: course.id,
                status: "Active"
              })
            }}>
              Enroll in This Course
            </Button>
          </CardContent>
        </Card>}
      </div>
    </StudentDashboardLayout>
  )
}
