
import React from 'react'
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Star, Calendar, Award } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function MyChildProgress() {
  const { user } = useAuth()

  const childData = {
    name: "Arya Sharma",
    age: 8,
    courses: [
      {
        id: 1,
        title: "Classical Dance - Bharatanatyam",
        progress: 75,
        classesAttended: 15,
        totalClasses: 20,
        milestones: ["Started", "Basic Steps Completed", "Mid-Term Assessment Done"],
        nextMilestone: "Final Performance"
      },
      {
        id: 2,
        title: "Folk Dance - Punjabi",
        progress: 45,
        classesAttended: 9,
        totalClasses: 20,
        milestones: ["Started", "Basic Movements"],
        nextMilestone: "Rhythm Training"
      }
    ]
  }

  const getMilestoneColor = (milestone: string) => {
    switch (milestone) {
      case "Started":
        return "bg-blue-100 text-blue-700"
      case "Basic Steps Completed":
      case "Basic Movements":
        return "bg-green-100 text-green-700"
      case "Mid-Term Assessment Done":
        return "bg-orange-100 text-orange-700"
      case "Final Performance":
      case "Rhythm Training":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <ParentDashboardLayout title="My Child's Progress">
      <div className="space-y-6">
        {/* Greeting */}
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-playfair font-bold">
            Hello {user?.name || 'Parent'} 👋
          </h1>
          <p className="text-orange-100 mt-2">
            Here's {childData.name}'s learning journey at Art Gharana
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="text-sm font-medium">{childData.name}</span>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="text-sm font-medium">Age: {childData.age}</span>
            </div>
          </div>
        </div>

        {/* Course Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {childData.courses.map((course) => (
            <Card key={course.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-playfair font-bold text-gray-900 flex items-center justify-between">
                  {course.title}
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{course.progress}% Complete</span>
                  </div>
                  <Progress value={course.progress} className="h-3" />
                </div>

                {/* Classes Attended */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Classes</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {course.classesAttended} / {course.totalClasses}
                  </span>
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Course Milestones
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.milestones.map((milestone, index) => (
                      <Badge 
                        key={index} 
                        className={`${getMilestoneColor(milestone)} hover:${getMilestoneColor(milestone)}`}
                      >
                        {milestone}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Next Milestone: </span>
                    <Badge variant="outline" className="text-purple-700 border-purple-300">
                      {course.nextMilestone}
                    </Badge>
                  </div>
                </div>

                {/* Download Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                  onClick={() => console.log(`Download progress report for ${course.title}`)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Progress Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Summary */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold text-gray-900">
              Overall Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">2</div>
                <div className="text-sm text-blue-600">Active Courses</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-700">24</div>
                <div className="text-sm text-green-600">Classes Attended</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">60%</div>
                <div className="text-sm text-orange-600">Average Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ParentDashboardLayout>
  )
}
