
import React, { useState } from 'react'
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Award, Download, Play, BookOpen, Star, CheckCircle } from "lucide-react"

const ExamsCertification = () => {
  const mockExams = [
    {
      id: "exam-1",
      subject: "Bharatanatyam Theory",
      date: "2024-07-20",
      time: "14:00",
      duration: "2 hours",
      status: "upcoming",
      teacher: "Priya Sharma",
      syllabus: "Classical dance forms, history, and techniques"
    },
    {
      id: "exam-2",
      subject: "Classical Vocal - Intermediate",
      date: "2024-06-15",
      time: "10:00", 
      duration: "1.5 hours",
      status: "completed",
      score: 85,
      maxScore: 100,
      teacher: "Ravi Kumar",
      teacherRemarks: "Excellent understanding of ragas. Continue practicing voice modulation."
    },
    {
      id: "exam-3",
      subject: "Piano Fundamentals",
      date: "2024-05-20",
      time: "16:00",
      duration: "1 hour",
      status: "completed", 
      score: 92,
      maxScore: 100,
      teacher: "Sarah Johnson",
      teacherRemarks: "Outstanding performance! Ready to advance to intermediate level."
    }
  ]

  const mockCertificates = [
    {
      id: "cert-1",
      title: "Piano Fundamentals Certification",
      course: "Piano Basics",
      issueDate: "2024-05-25",
      certificateUrl: "/certificates/piano-fundamentals.pdf",
      grade: "A+"
    },
    {
      id: "cert-2", 
      title: "Classical Vocal - Beginner",
      course: "Vocal Foundation",
      issueDate: "2024-04-15",
      certificateUrl: "/certificates/vocal-beginner.pdf",
      grade: "A"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <StudentDashboardLayout title="Exams & Certification">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Exams & Certification</h1>
            <p className="text-gray-600 mt-1">Track your exam schedule and download certificates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exams Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming/Recent Exams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  My Exams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockExams.map((exam) => (
                    <div key={exam.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{exam.subject}</h3>
                          <p className="text-sm text-gray-600">Teacher: {exam.teacher}</p>
                        </div>
                        <Badge className={getStatusColor(exam.status)}>
                          {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{exam.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{exam.time} ({exam.duration})</span>
                        </div>
                        {exam.status === 'completed' && exam.score && (
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            <span className={`font-medium ${getGradeColor(exam.score)}`}>
                              {exam.score}/{exam.maxScore}
                            </span>
                          </div>
                        )}
                      </div>

                      {exam.status === 'completed' && exam.teacherRemarks && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <p className="text-sm"><strong>Teacher's Remarks:</strong></p>
                          <p className="text-sm text-gray-700 mt-1">{exam.teacherRemarks}</p>
                        </div>
                      )}

                      {exam.syllabus && exam.status === 'upcoming' && (
                        <div className="bg-orange-50 p-3 rounded-lg mb-3">
                          <p className="text-sm"><strong>Syllabus:</strong></p>
                          <p className="text-sm text-gray-700 mt-1">{exam.syllabus}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {exam.status === 'upcoming' && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            <Play className="w-4 h-4 mr-2" />
                            Start Exam
                          </Button>
                        )}
                        {exam.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download Result
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  My Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCertificates.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Grade: {cert.grade}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-1">{cert.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{cert.course}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>Issued: {cert.issueDate}</span>
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Progress & Stats */}
          <div className="space-y-6">
            {/* Exam Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exam Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Exams Completed</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {mockExams.filter(e => e.status === 'completed').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Upcoming Exams</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {mockExams.filter(e => e.status === 'upcoming').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Certificates Earned</span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    {mockCertificates.length}
                  </Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="text-sm font-medium text-green-600">88.5%</span>
                  </div>
                  <Progress value={88.5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievement Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-medium">High Achiever</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-medium">Perfect Score</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-medium">Certified</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-medium">Scholar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}

export default ExamsCertification
