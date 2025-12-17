
import React, { useState } from 'react'
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Video, MessageSquare, User } from "lucide-react"

export default function ClassSchedule() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingClasses = [
    {
      id: 1,
      date: "2024-01-20",
      time: "10:00 AM",
      duration: "60 min",
      course: "Classical Dance",
      instructor: "Ms. Priya Sharma",
      status: "scheduled",
      type: "individual"
    },
    {
      id: 2,
      date: "2024-01-22",
      time: "4:00 PM",
      duration: "45 min",
      course: "Folk Dance",
      instructor: "Mr. Raj Kumar",
      status: "scheduled",
      type: "group"
    }
  ]

  const completedClasses = [
    {
      id: 3,
      date: "2024-01-18",
      time: "10:00 AM",
      duration: "60 min",
      course: "Classical Dance",
      instructor: "Ms. Priya Sharma",
      status: "completed",
      type: "individual"
    },
    {
      id: 4,
      date: "2024-01-15",
      time: "4:00 PM",
      duration: "45 min",
      course: "Folk Dance",
      instructor: "Mr. Raj Kumar",
      status: "missed",
      type: "group"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Scheduled</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
      case 'missed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Missed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <ParentDashboardLayout title="Class Schedule">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            Class Schedule
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Track Arya's upcoming and completed classes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <p className="text-xs text-gray-500 mt-1">Classes scheduled</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Next Class</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2 Days</div>
              <p className="text-xs text-gray-500 mt-1">Classical Dance - Jan 20</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
              <User className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <p className="text-xs text-gray-500 mt-1">Classes completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Table */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">Schedule Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
                <TabsTrigger value="completed">Past Classes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingClasses.map((classItem) => (
                        <TableRow key={classItem.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{formatDate(classItem.date)}</span>
                              <span className="text-sm text-gray-500">{classItem.time}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{classItem.course}</TableCell>
                          <TableCell>{classItem.instructor}</TableCell>
                          <TableCell>{classItem.duration}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {classItem.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(classItem.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Video className="w-4 h-4 mr-1" />
                                Join
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedClasses.map((classItem) => (
                        <TableRow key={classItem.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{formatDate(classItem.date)}</span>
                              <span className="text-sm text-gray-500">{classItem.time}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{classItem.course}</TableCell>
                          <TableCell>{classItem.instructor}</TableCell>
                          <TableCell>{classItem.duration}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {classItem.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(classItem.status)}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Feedback
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ParentDashboardLayout>
  )
}
