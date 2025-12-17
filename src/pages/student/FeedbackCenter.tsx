
import React, { useState } from 'react'
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageSquare, Calendar, Clock, Send, CheckCircle } from "lucide-react"

const FeedbackCenter = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const mockPendingFeedback = [
    {
      id: "class-1",
      subject: "Bharatanatyam - Advanced",
      teacher: "Priya Sharma",
      teacherPhoto: "/avatars/teacher-1.png",
      date: "2024-06-20",
      startTime: "10:00",
      endTime: "11:00",
      status: "pending"
    },
    {
      id: "class-2",
      subject: "Classical Vocal",
      teacher: "Ravi Kumar", 
      teacherPhoto: "/avatars/teacher-2.png",
      date: "2024-06-19",
      startTime: "15:00",
      endTime: "16:00",
      status: "pending"
    }
  ]

  const mockSubmittedFeedback = [
    {
      id: "feedback-1",
      subject: "Piano Fundamentals",
      teacher: "Sarah Johnson",
      teacherPhoto: "/avatars/teacher-3.png",
      date: "2024-06-18",
      rating: 5,
      comment: "Excellent teaching style! The teacher explained complex concepts very clearly.",
      submittedDate: "2024-06-19"
    },
    {
      id: "feedback-2", 
      subject: "Contemporary Dance",
      teacher: "Mike Davis",
      teacherPhoto: "/avatars/teacher-4.png",
      date: "2024-06-17",
      rating: 4,
      comment: "Great energy and enthusiasm. Would like more focus on technique.",
      submittedDate: "2024-06-18"
    }
  ]

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleSubmitFeedback = () => {
    if (selectedClass && rating > 0) {
      // Handle feedback submission
      console.log('Submitting feedback:', { selectedClass, rating, feedback })
      setSelectedClass(null)
      setRating(0)
      setFeedback("")
    }
  }

  return (
    <StudentDashboardLayout title="Feedback Center">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Feedback Center</h1>
            <p className="text-gray-600 mt-1">Share your thoughts and help us improve</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Pending Feedback ({mockPendingFeedback.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockPendingFeedback.length > 0 ? (
                  <div className="space-y-4">
                    {mockPendingFeedback.map((classItem) => (
                      <div key={classItem.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={classItem.teacherPhoto} alt={classItem.teacher} />
                              <AvatarFallback>
                                {classItem.teacher.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{classItem.subject}</h3>
                              <p className="text-sm text-gray-600">{classItem.teacher}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            Feedback Required
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{classItem.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{classItem.startTime} - {classItem.endTime}</span>
                          </div>
                        </div>

                        <Button 
                          size="sm" 
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => setSelectedClass(classItem.id)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Give Feedback
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No pending feedback at the moment</p>
                    <p className="text-sm">All your feedback is up to date!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submitted Feedback History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Feedback History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSubmittedFeedback.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={item.teacherPhoto} alt={item.teacher} />
                            <AvatarFallback className="text-xs">
                              {item.teacher.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{item.subject}</h4>
                            <p className="text-sm text-gray-600">{item.teacher}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {[1,2,3,4,5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">Submitted: {item.submittedDate}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{item.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Form Sidebar */}
          <div className="space-y-6">
            {selectedClass && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submit Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Rate this class</label>
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleStarClick(star)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`w-8 h-8 transition-colors ${
                              star <= rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300 hover:text-yellow-200'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Comments</label>
                    <Textarea 
                      placeholder="Share your thoughts about the class, teaching style, content, etc..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      onClick={handleSubmitFeedback}
                      disabled={rating === 0}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedClass(null)
                        setRating(0)
                        setFeedback("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feedback Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feedback Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <p className="text-sm text-gray-600">Be honest and constructive in your feedback</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <p className="text-sm text-gray-600">Focus on specific aspects of the class</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <p className="text-sm text-gray-600">Suggest improvements when possible</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">4</span>
                  </div>
                  <p className="text-sm text-gray-600">Keep feedback respectful and professional</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}

export default FeedbackCenter
