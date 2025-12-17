
import React, { useState } from 'react'
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, Play, MessageSquare, Calendar, Clock } from "lucide-react"

const ClassHistory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const mockClassHistory = [
    {
      id: "hist-1",
      date: "2024-06-20",
      subject: "Bharatanatyam - Advanced",
      teacher: "Priya Sharma",
      teacherPhoto: "/avatars/teacher-1.png",
      startTime: "10:00",
      endTime: "11:00",
      attendanceStatus: "attended",
      hasRecording: true,
      feedbackGiven: true,
      notes: "Excellent progress in hand movements"
    },
    {
      id: "hist-2",
      date: "2024-06-19",
      subject: "Classical Vocal",
      teacher: "Ravi Kumar",
      teacherPhoto: "/avatars/teacher-2.png",
      startTime: "15:00",
      endTime: "16:00",
      attendanceStatus: "attended",
      hasRecording: true,
      feedbackGiven: false,
      notes: ""
    },
    {
      id: "hist-3",
      date: "2024-06-18",
      subject: "Bharatanatyam - Theory",
      teacher: "Priya Sharma",
      startTime: "10:00",
      endTime: "11:00",
      attendanceStatus: "missed",
      hasRecording: true,
      feedbackGiven: false,
      notes: "Absent due to illness"
    }
  ]

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'attended': return 'bg-green-100 text-green-800 border-green-200'
      case 'missed': return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <StudentDashboardLayout title="Class History">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Class History</h1>
            <p className="text-gray-600 mt-1">Review your past classes and sessions</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Recording</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClassHistory.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{classItem.date}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {classItem.startTime} - {classItem.endTime}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{classItem.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={classItem.teacherPhoto} alt={classItem.teacher} />
                            <AvatarFallback className="text-xs">
                              {classItem.teacher.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{classItem.teacher}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAttendanceColor(classItem.attendanceStatus)}>
                          {classItem.attendanceStatus.charAt(0).toUpperCase() + classItem.attendanceStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {classItem.hasRecording ? (
                          <Button size="sm" variant="outline" className="h-8">
                            <Play className="w-3 h-3 mr-1" />
                            Watch
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {classItem.feedbackGiven ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Given
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="h-8">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Give
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-8 px-2">
                          <Download className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  )
}

export default ClassHistory
