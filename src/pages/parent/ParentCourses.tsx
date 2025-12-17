
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, BookOpen } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { fetchApi } from "@/services/api/fetchApi"
import { Course } from "@/types/course"
import { useParentLearner } from "@/contexts/ParentLearnerContext"

export default function ParentCourses() {
  const {
    selectedLearner
  } = useParentLearner();
  if (!selectedLearner?.id) {
    return (
      <ParentDashboardLayout title="Course Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Learner Not selected</h2>
        </div>
      </ParentDashboardLayout>
    )
  }
  const [searchQuery, setSearchQuery] = useState("")
  const [course, setCourse] = useState<any[]>([])

  const getMyCourses = useQuery({
    queryKey: ["getMyCourses", selectedLearner?.id],
    queryFn: () =>
      fetchApi<any>({
        path: `courses/me/${selectedLearner?.id}`
      }),
  });

  useEffect(() => {
    if (
      !getMyCourses.isLoading &&
      getMyCourses.data
    ) {
      const data = getMyCourses.data
      setCourse(data);
    }
  }, [getMyCourses.isLoading, getMyCourses.data]);

  return (
    <ParentDashboardLayout title="My Courses">
      <div className="space-y-6">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Courses List */}
        <Card>
          <CardContent className="p-0">
            {course.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No courses found
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms." : "You haven't enrolled in any courses yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {course.map((course) => (
                  <Link
                    key={course.id}
                    to={`/parent/courses/${course.course_id}`}
                    className="block p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ParentDashboardLayout>
  )
}
