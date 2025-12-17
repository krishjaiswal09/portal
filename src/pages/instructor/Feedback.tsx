
import React, { useState } from 'react'
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Eye, MessageSquare, Calendar } from "lucide-react"

export default function InstructorFeedback() {
  const [activeTab, setActiveTab] = useState("received")

  const feedbackData = [
    {
      id: 1,
      student: "Arya Sharma",
      course: "Classical Dance",
      date: "2024-01-14",
      rating: 5,
      feedback: "Excellent teaching methods and very patient with corrections.",
      status: "new"
    },
    {
      id: 2,
      student: "Priya Gupta",
      course: "Bharatanatyam",
      date: "2024-01-13",
      rating: 4,
      feedback: "Great explanation of traditional techniques.",
      status: "read"
    },
    {
      id: 3,
      student: "Batch A - Kids",
      course: "Folk Dance",
      date: "2024-01-12",
      rating: 5,
      feedback: "Kids love the interactive sessions!",
      status: "replied"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">New</Badge>
      case 'read':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Read</Badge>
      case 'replied':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Replied</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-current' : 'stroke-current'}`} />
        ))}
      </div>
    )
  }

  return (
    <InstructorDashboardLayout title="Feedback">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                {renderStars(5)}
              </div>
              <p className="text-xs text-gray-500 mt-1">From 67 reviews</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <p className="text-xs text-gray-500 mt-1">Total feedback received</p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Table */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">Feedback Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="received">Received Feedback</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="received" className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedbackData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.student}</TableCell>
                          <TableCell>{item.course}</TableCell>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>{renderStars(item.rating)}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.feedback}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              {item.status !== 'replied' && (
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Reply
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-6">
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback Analytics</h3>
                  <p>Detailed analytics and insights coming soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </InstructorDashboardLayout>
  )
}
