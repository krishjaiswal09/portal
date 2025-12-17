
import React, { useState } from 'react'
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MessageSquare, TrendingUp, Award } from "lucide-react"

export default function FeedbackPerformance() {
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(0)

  const performanceData = [
    {
      id: 1,
      date: "2024-01-18",
      course: "Classical Dance",
      instructor: "Ms. Priya Sharma",
      rating: 5,
      feedback: "Arya showed excellent improvement in posture and rhythm. Keep practicing the basic steps.",
      performance: "excellent",
      areas: ["Posture", "Rhythm", "Expression"]
    },
    {
      id: 2,
      date: "2024-01-15",
      course: "Folk Dance",
      instructor: "Mr. Raj Kumar",
      rating: 4,
      feedback: "Good energy and enthusiasm. Need to work on coordination.",
      performance: "good",
      areas: ["Energy", "Enthusiasm"]
    }
  ]

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Excellent</Badge>
      case 'good':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Good</Badge>
      case 'needs-improvement':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Needs Improvement</Badge>
      default:
        return <Badge variant="secondary">{performance}</Badge>
    }
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <ParentDashboardLayout title="Feedback & Performance">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            Feedback & Performance
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Track Arya's progress and provide feedback
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">4.5</div>
              <p className="text-xs text-gray-500 mt-1">Based on 12 sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Progress Trend</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">Improving</div>
              <p className="text-xs text-gray-500 mt-1">+15% this month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Strong Areas</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <p className="text-xs text-gray-500 mt-1">Rhythm, Posture, Energy</p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Tabs */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">Performance Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="received" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="received">Received Feedback</TabsTrigger>
                <TabsTrigger value="give">Give Feedback</TabsTrigger>
              </TabsList>
              
              <TabsContent value="received" className="mt-6">
                <div className="space-y-4">
                  {performanceData.map((item) => (
                    <Card key={item.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{item.course}</h3>
                            <p className="text-sm text-gray-600">{item.instructor} • {new Date(item.date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {renderStars(item.rating)}
                            {getPerformanceBadge(item.performance)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-3">{item.feedback}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-medium text-gray-600">Strong in:</span>
                          {item.areas.map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="give" className="mt-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Share Your Feedback</h3>
                    <p className="text-sm text-gray-600">Help us improve Arya's learning experience</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Overall Rating</label>
                      {renderStars(rating, true, setRating)}
                    </div>
                    <div>
                      <label htmlFor="feedback" className="block text-sm font-medium mb-2">
                        Your Feedback
                      </label>
                      <Textarea
                        id="feedback"
                        placeholder="Share your thoughts about the classes, instructor, or any suggestions..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ParentDashboardLayout>
  )
}
