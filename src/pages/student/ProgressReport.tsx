
import React from 'react'
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Download, TrendingUp, Calendar, Clock, Award } from "lucide-react"
import { mockCourseProgress, mockStudent } from "@/data/studentDashboardData"

const ProgressReport = () => {
  const student = mockStudent
  const courseProgress = mockCourseProgress

  const overallStats = {
    totalCourses: courseProgress.length,
    completedCourses: courseProgress.filter(c => c.status === 'completed').length,
    averageProgress: Math.round(courseProgress.reduce((acc, course) => acc + course.progressPercentage, 0) / courseProgress.length),
    totalSessionsAttended: student.attendedSessions,
    totalSessions: student.totalSessions
  }

  return (
    <StudentDashboardLayout title="Progress Report">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Progress Report</h1>
            <p className="text-gray-600 mt-1">Track your learning journey and achievements</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{overallStats.averageProgress}%</div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{overallStats.completedCourses}/{overallStats.totalCourses}</div>
                  <div className="text-sm text-gray-600">Courses Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{overallStats.totalSessionsAttended}</div>
                  <div className="text-sm text-gray-600">Sessions Attended</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{Math.round((overallStats.totalSessionsAttended / overallStats.totalSessions) * 100)}%</div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course-wise Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Course-wise Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {courseProgress.map((course) => (
              <div key={course.courseId} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.courseName}</h3>
                    <p className="text-sm text-gray-600">Instructor: {course.teacher}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {course.subject}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={course.status === 'active' ? 'border-green-200 text-green-800' : 'border-gray-200'}
                      >
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">{course.progressPercentage}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Progress value={course.progressPercentage} className="h-3" />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {course.completedSessions}/{course.totalSessions} sessions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.totalSessions - course.completedSessions} remaining
                      </span>
                    </div>
                    <span className="text-green-600 font-medium">
                      {course.progressPercentage >= 75 ? 'On Track' : 'Needs Attention'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements & Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {student.courseBadges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mb-2">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-center">{badge}</span>
                  <span className="text-xs text-gray-500 mt-1">Earned</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  )
}

export default ProgressReport
