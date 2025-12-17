
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Video, Play, RotateCcw, X } from "lucide-react"
import { ParentCancelModal } from './ParentCancelModal'
import { ParentRescheduleModal } from './ParentRescheduleModal'
import { useParentLearner } from '@/contexts/ParentLearnerContext'

interface ClassSession {
  id: string
  learnerName: string
  courseName: string
  date: string
  time: string
  instructor: string
  status: 'live' | 'upcoming' | 'completed'
  canJoin: boolean
  hasRecording: boolean
}

const mockTodayClasses: ClassSession[] = [
  {
    id: "1",
    learnerName: "Emma Johnson",
    courseName: "Bharatanatyam Fundamentals",
    date: "Today",
    time: "8:00 AM - 9:00 AM",
    instructor: "Priya Sharma",
    status: 'completed',
    canJoin: false,
    hasRecording: true
  },
  {
    id: "2",
    learnerName: "Emma Johnson",
    courseName: "Carnatic Vocal Basics",
    date: "Today",
    time: "9:30 AM - 10:30 AM",
    instructor: "Ravi Kumar",
    status: 'live',
    canJoin: true,
    hasRecording: false
  },
  {
    id: "3",
    learnerName: "Liam Johnson",
    courseName: "Kathak Intermediate",
    date: "Today",
    time: "11:00 AM - 12:00 PM",
    instructor: "Meera Singh",
    status: 'upcoming',
    canJoin: false,
    hasRecording: false
  },
  {
    id: "4",
    learnerName: "Sarah Johnson",
    courseName: "Tabla Advanced",
    date: "Today",
    time: "1:00 PM - 2:00 PM",
    instructor: "Rajesh Gupta",
    status: 'upcoming',
    canJoin: false,
    hasRecording: false
  }
]

const mockUpcomingClasses: ClassSession[] = [
  {
    id: "5",
    learnerName: "Emma Johnson",
    courseName: "Bharatanatyam Advanced",
    date: "Tomorrow",
    time: "8:00 AM - 9:00 AM",
    instructor: "Priya Sharma",
    status: 'upcoming',
    canJoin: false,
    hasRecording: false
  },
  {
    id: "6",
    learnerName: "Liam Johnson",
    courseName: "Tabla Beginners",
    date: "Tomorrow",
    time: "10:00 AM - 11:00 AM",
    instructor: "Dev Sharma",
    status: 'upcoming',
    canJoin: false,
    hasRecording: false
  },
  {
    id: "7",
    learnerName: "Sarah Johnson",
    courseName: "Classical Dance",
    date: "Tomorrow",
    time: "3:00 PM - 4:00 PM",
    instructor: "Anjali Patel",
    status: 'upcoming',
    canJoin: false,
    hasRecording: false
  },
  {
    id: "8",
    learnerName: "Emma Johnson",
    courseName: "Hindustani Vocal",
    date: "Wednesday",
    time: "9:00 AM - 10:00 AM",
    instructor: "Meera Singh",
    status: 'upcoming',
    canJoin: false,
    hasRecording: false
  }
]

export function ParentClassesOverview() {
  const { selectedLearner } = useParentLearner()
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null)

  // Filter classes based on selected learner
  const filterClassesByLearner = (classes: ClassSession[]) => {
    if (!selectedLearner) return classes
    return classes.filter(session => session.learnerName === selectedLearner.name)
  }

  const filteredTodayClasses = filterClassesByLearner(mockTodayClasses)
  const filteredUpcomingClasses = filterClassesByLearner(mockUpcomingClasses)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Ongoing</Badge>
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Scheduled</Badge>
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Completed</Badge>
      default:
        return null
    }
  }

  const handleCancel = (session: ClassSession) => {
    setSelectedClass(session)
    setCancelModalOpen(true)
  }

  const handleReschedule = (session: ClassSession) => {
    setSelectedClass(session)
    setRescheduleModalOpen(true)
  }

  const handleCancelConfirm = (reason: string) => {
    console.log('Cancelling class:', selectedClass?.id, 'Reason:', reason)
  }

  const handleRescheduleConfirm = (data: any) => {
    console.log('Rescheduling class:', selectedClass?.id, 'New details:', data)
  }

  const ClassCard = ({ session }: { session: ClassSession }) => (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{session.courseName}</h4>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <User className="w-4 h-4" />
            Student: {session.learnerName}
          </p>
        </div>
        {getStatusBadge(session.status)}
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {session.date}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {session.time}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Instructor:</span> {session.instructor}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {session.canJoin && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1">
            <Video className="w-4 h-4" />
            Join
          </Button>
        )}
        {session.hasRecording && (
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Play className="w-4 h-4" />
            Recording
          </Button>
        )}
        {session.status === 'upcoming' && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => handleReschedule(session)}
            >
              <RotateCcw className="w-4 h-4" />
              Reschedule
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
              onClick={() => handleCancel(session)}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-600" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {filteredTodayClasses.length > 0 ? (
                filteredTodayClasses.map((session) => (
                  <ClassCard key={session.id} session={session} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No classes scheduled for today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {filteredUpcomingClasses.length > 0 ? (
                filteredUpcomingClasses.map((session) => (
                  <ClassCard key={session.id} session={session} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming classes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ParentCancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onCancel={handleCancelConfirm}
        classDetails={selectedClass ? {
          id: selectedClass.id,
          courseName: selectedClass.courseName,
          date: selectedClass.date,
          time: selectedClass.time,
          instructor: selectedClass.instructor
        } : null}
      />

      <ParentRescheduleModal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        onReschedule={handleRescheduleConfirm}
        classDetails={selectedClass ? {
          id: selectedClass.id,
          courseName: selectedClass.courseName,
          date: selectedClass.date,
          time: selectedClass.time,
          instructor: selectedClass.instructor
        } : null}
      />
    </>
  )
}
