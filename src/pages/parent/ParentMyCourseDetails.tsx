
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, BookOpen, User, Calendar } from "lucide-react"
import { TopicsCoveredTab } from "@/components/student/TopicsCoveredTab"
import { ModulesTab } from "@/components/student/ModulesTab"
import { CourseClassesTab } from "@/components/student/CourseClassesTab"
import { useQuery } from "@tanstack/react-query"
import { fetchApi } from "@/services/api/fetchApi"
import { useEffect, useState } from "react"
import { Course } from "@/types/course"
import { useParentLearner } from "@/contexts/ParentLearnerContext"

export default function ParentMyCourseDetails() {
  const { selectedLearner } = useParentLearner()

  if (!selectedLearner?.id) {
    return (
      <ParentDashboardLayout title="Course Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Learner Not selected</h2>
        </div>
      </ParentDashboardLayout>
    )
  }

  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<Course>()
  const getCourseQueries = useQuery({
    queryKey: ["getCourseQueries", courseId],
    queryFn: () =>
      fetchApi<any>({
        path: `courses/${courseId}`,
        params: {
          userId: selectedLearner?.id
        }
      }),
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
        learningOutcomes: data.learning_outcomes || [],
        objectives: data.objectives || [],
        displayInCourseCatalog: data.display_as_course_catalog || false,
        displayAsFree: data.display_as_free || false,
        is_published: data.is_published || false,
        linkToManageDemos: data.link_to_manage_demos || false,
        topics: data.topics || [],
        id: data.id,
        progress: data.progress
      }
      setCourse(updatedMapping);
    }
  }, [getCourseQueries.isLoading, getCourseQueries.data]);

  if (!course) {
    return (
      <ParentDashboardLayout title="Course Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Course not found</h2>
          <Button asChild>
            <Link to="/parent/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Courses
            </Link>
          </Button>
        </div>
      </ParentDashboardLayout>
    )
  }

  const progressStats: any = () => {
    if (!course.topics || course.topics.length === 0) {
      return {
        totalTopics: 0,
        completedTopics: 0,
        totalSubtopics: 0,
        completedSubtopics: 0,
        overallProgress: 0,
        topicProgress: 0,
        subtopicProgress: 0
      }
    }

    const topics = course.topics

    // Count topics
    const totalTopics = topics.length
    const completedTopics = topics.filter(topic => topic.progress_check).length

    // Count subtopics
    const allSubtopics = topics.flatMap(topic => topic.subtopics || [])
    const totalSubtopics = allSubtopics.length
    const completedSubtopics = allSubtopics.filter(subtopic => subtopic.progress_check).length

    // Calculate progress percentages
    const topicProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
    const subtopicProgress = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0

    // Calculate overall progress
    // If there are subtopics, weight them more heavily (70% subtopics, 30% topics)
    // If no subtopics, use topic progress only
    let overallProgress: number
    if (totalSubtopics > 0) {
      overallProgress = Math.round((subtopicProgress * 0.7) + (topicProgress * 0.3))
    } else {
      overallProgress = topicProgress
    }

    return {
      totalTopics,
      completedTopics,
      totalSubtopics,
      completedSubtopics,
      overallProgress,
      topicProgress,
      subtopicProgress
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <ParentDashboardLayout title={course.title}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/parent/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>

        {/* Course Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {course.thumbnail && (
                <div className="w-full md:w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={course.thumbnail}
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
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {/* {course.artform} */}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {/* {course.instructor} */}
                      </div>
                      {/* {course.nextClassDate && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Next: {new Date(course.nextClassDate).toLocaleDateString()}
                        </div>
                      )} */}
                    </div>
                  </div>
                  <Badge className={getStatusColor(course.status)}>
                    {/* {course.status.charAt(0).toUpperCase() + course.status.slice(1)} */}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{course?.progress?.completed_subtopics}/{course?.progress?.total_subtopics} topics completed</span>
                  </div>
                  <Progress value={course?.progress?.percentage} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {course?.progress?.percentage}% Complete
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Course Content Tabs */}
        <Tabs defaultValue="topics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="topics">Topics Covered</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="space-y-4">
            <TopicsCoveredTab courseId={course.id} user={selectedLearner} />
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <ModulesTab courseId={course.id} />
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <CourseClassesTab courseId={course.id} />
          </TabsContent>
        </Tabs>
      </div>
    </ParentDashboardLayout>
  )
}
