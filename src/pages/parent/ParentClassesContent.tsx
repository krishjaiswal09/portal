import React, { useState } from 'react'
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { ParentMessageIcon } from "@/components/parent/ParentMessageIcon"
import { ParentLearnerSelector } from "@/components/parent/ParentLearnerSelector"
import { ParentClassDetailsModal } from "@/components/parent/ParentClassDetailsModal"
import { ParentCancelModal } from "@/components/parent/ParentCancelModal"
import { ParentRescheduleModal } from "@/components/parent/ParentRescheduleModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Play, RotateCcw, X, FileText } from "lucide-react"
import { useParentLearner } from '@/contexts/ParentLearnerContext'
import { useToast } from "@/hooks/use-toast"

interface ClassDetails {
  id: string
  title: string
  instructor: string
  date: string
  time: string
  duration: string
  status: 'completed' | 'upcoming' | 'cancelled'
  course: string
  courseName: string
  artForm: string
  description: string
  instructorNotes?: string
  hasRecording?: boolean
  attendanceStatus?: 'attended' | 'absent'
}

const mockClasses: ClassDetails[] = [
  {
    id: '1',
    title: 'Hindustani Vocal',
    instructor: 'Ravi Kumar',
    date: '2025-07-18',
    time: '14:00 - 15:00',
    duration: '60 min',
    status: 'completed',
    course: 'Hindustani Vocal Basics',
    courseName: 'Hindustani Vocal Basics',
    artForm: 'Vocal',
    description: 'Basic raag practice and vocal exercises',
    instructorNotes: 'Great progress today! You showed excellent improvement in breath control and tonal accuracy. Continue practicing the scales we covered.',
    hasRecording: true,
    attendanceStatus: 'attended'
  },
  {
    id: '2',
    title: 'Bharatanatyam - Advanced',
    instructor: 'Priya Sharma',
    date: '2025-07-19',
    time: '10:00 - 11:00',
    duration: '60 min',
    status: 'upcoming',
    course: 'Bharatanatyam Fundamentals',
    courseName: 'Bharatanatyam Fundamentals',
    artForm: 'Dance',
    description: 'Advanced level Bharatanatyam focusing on complex choreography'
  },
  {
    id: '3',
    title: 'Kathak - Intermediate',
    instructor: 'Meera Patel',
    date: '2025-07-17',
    time: '16:00 - 17:00',
    duration: '60 min',
    status: 'completed',
    course: 'Kathak Intermediate Level',
    courseName: 'Kathak Intermediate Level',
    artForm: 'Dance',
    description: 'Intermediate Kathak techniques and choreography',
    instructorNotes: 'Excellent performance today. Your spins have improved significantly.',
    hasRecording: true,
    attendanceStatus: 'attended'
  }
]

const ParentClassesContent = () => {
  const { selectedLearner } = useParentLearner()
  const { toast } = useToast()
  const [activeFilter, setActiveFilter] = useState('All Classes')
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)

  const filteredClasses = mockClasses.filter(classItem => {
    if (activeFilter === 'All Classes') return true
    if (activeFilter === 'Today') {
      const today = new Date().toISOString().split('T')[0]
      return classItem.date === today
    }
    if (activeFilter === 'Upcoming') return classItem.status === 'upcoming'
    if (activeFilter === 'Completed') return classItem.status === 'completed'
    return true
  })

  const handleClassClick = (classItem: ClassDetails) => {
    setSelectedClass(classItem)
    setShowDetailsModal(true)
  }

  const handleJoinClass = (classItem: ClassDetails) => {
    toast({
      title: "Joining Class",
      description: `Connecting to ${classItem.title}...`
    })
  }

  const handleWatchRecording = (classItem: ClassDetails) => {
    toast({
      title: "Opening Recording",
      description: `Loading recording for ${classItem.title}...`
    })
  }

  const handleReschedule = (classItem: ClassDetails) => {
    setSelectedClass(classItem)
    setShowRescheduleModal(true)
  }

  const handleCancel = (classItem: ClassDetails) => {
    setSelectedClass(classItem)
    setShowCancelModal(true)
  }

  const handleViewNotes = (classItem: ClassDetails) => {
    setSelectedClass(classItem)
    setShowDetailsModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <ParentDashboardLayout title="Classes">
      <ParentLearnerSelector />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">
              {selectedLearner ? `${selectedLearner.name}'s Classes` : 'My Classes'}
            </h1>
            <p className="text-gray-600 mt-1">Manage upcoming and completed classes</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['All Classes', 'Today', 'Upcoming', 'Completed'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Classes List */}
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{activeFilter}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClasses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No classes found for the selected filter.
                </div>
              ) : (
                filteredClasses.map((classItem) => (
                  <div key={classItem.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Class Info */}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleClassClick(classItem)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{classItem.title}</h3>
                          <Badge className={getStatusColor(classItem.status)}>
                            {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{classItem.instructor}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(classItem.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{classItem.time}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600">{classItem.description}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {classItem.status === 'upcoming' && (
                          <>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleJoinClass(classItem)
                              }}
                            >
                              Join
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReschedule(classItem)
                              }}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Reschedule
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCancel(classItem)
                              }}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}

                        {classItem.status === 'completed' && classItem.hasRecording && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleWatchRecording(classItem)
                            }}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Recording
                          </Button>
                        )}

                        {classItem.instructorNotes && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewNotes(classItem)
                            }}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Notes
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ParentClassDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        classDetails={selectedClass}
      />

      <ParentCancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        classDetails={selectedClass}
        onCancel={(reason) => {
          toast({
            title: "Class Cancelled",
            description: `${selectedClass?.title} has been cancelled. Reason: ${reason}`
          })
          setShowCancelModal(false)
        }}
      />

      <ParentRescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        classDetails={selectedClass}
        onReschedule={(data) => {
          toast({
            title: "Class Rescheduled",
            description: `${selectedClass?.title} has been rescheduled.`
          })
          setShowRescheduleModal(false)
        }}
      />

      <ParentMessageIcon />
    </ParentDashboardLayout>
  )
}

export default ParentClassesContent