
import React, { useState } from 'react'
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Calendar as CalendarIcon, TrendingUp, AlertCircle } from "lucide-react"

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const attendanceData = [
    {
      id: 1,
      date: "2024-01-20",
      course: "Classical Dance",
      instructor: "Ms. Priya Sharma",
      status: "present",
      duration: "60 min"
    },
    {
      id: 2,
      date: "2024-01-18",
      course: "Classical Dance",
      instructor: "Ms. Priya Sharma",
      status: "present",
      duration: "60 min"
    },
    {
      id: 3,
      date: "2024-01-15",
      course: "Folk Dance",
      instructor: "Mr. Raj Kumar",
      status: "absent",
      duration: "45 min",
      reason: "Sick"
    },
    {
      id: 4,
      date: "2024-01-13",
      course: "Classical Dance",
      instructor: "Ms. Priya Sharma",
      status: "late",
      duration: "45 min"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Present</Badge>
      case 'absent':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Absent</Badge>
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Late</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'late':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const presentDays = attendanceData.filter(item => item.status === 'present').length
  const totalDays = attendanceData.length
  const attendancePercentage = Math.round((presentDays / totalDays) * 100)

  return (
    <ParentDashboardLayout title="Attendance">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            Attendance Tracker
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Monitor Arya's class attendance and patterns
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{attendancePercentage}%</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Classes Attended</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{presentDays}</div>
              <p className="text-xs text-gray-500 mt-1">Out of {totalDays} classes</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Missed Classes</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">1</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Late Arrivals</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">1</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <Card className="bg-white shadow-lg border-0 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl font-playfair font-bold flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Attendance Records */}
          <Card className="bg-white shadow-lg border-0 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-playfair font-bold">Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recent">Recent Classes</TabsTrigger>
                  <TabsTrigger value="summary">Monthly Summary</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recent" className="mt-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Instructor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceData.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              {new Date(record.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>{record.course}</TableCell>
                            <TableCell>{record.instructor}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(record.status)}
                                {getStatusBadge(record.status)}
                              </div>
                            </TableCell>
                            <TableCell>{record.duration}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="summary" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{presentDays}</div>
                        <div className="text-sm text-green-700">Present</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {attendanceData.filter(item => item.status === 'absent').length}
                        </div>
                        <div className="text-sm text-red-700">Absent</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Attendance Pattern</h4>
                      <p className="text-sm text-gray-600">
                        Arya maintains excellent attendance with {attendancePercentage}% attendance rate. 
                        Keep up the great work!
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ParentDashboardLayout>
  )
}
