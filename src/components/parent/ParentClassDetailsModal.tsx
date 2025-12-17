
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, BookOpen, Play } from "lucide-react"

interface ClassDetails {
  id: string
  title: string
  instructor: string
  date: string
  time: string
  duration: string
  status: 'completed' | 'upcoming' | 'cancelled'
  course: string
  artForm: string
  description: string
  instructorNotes?: string
  hasRecording?: boolean
  attendanceStatus?: 'attended' | 'absent'
}

interface ParentClassDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  classDetails: ClassDetails | null
}

export function ParentClassDetailsModal({ isOpen, onClose, classDetails }: ParentClassDetailsModalProps) {
  if (!classDetails) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAttendanceColor = (status?: string) => {
    switch (status) {
      case 'attended': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{classDetails.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with instructor and status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold">
                  {classDetails.instructor.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{classDetails.instructor}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(classDetails.status)}>
                {classDetails.status.charAt(0).toUpperCase() + classDetails.status.slice(1)}
              </Badge>
              {classDetails.attendanceStatus && (
                <Badge className={getAttendanceColor(classDetails.attendanceStatus)}>
                  ✓ {classDetails.attendanceStatus.charAt(0).toUpperCase() + classDetails.attendanceStatus.slice(1)}
                </Badge>
              )}
            </div>
          </div>

          {/* Class timing */}
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{classDetails.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{classDetails.time} (EST)</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{classDetails.duration}</span>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Course Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Course</p>
                <p className="font-medium">{classDetails.course}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Art Form</p>
                <Badge variant="outline" className="mt-1">
                  {classDetails.artForm}
                </Badge>
              </div>
            </div>
          </div>

          {/* Class Overview */}
          <div>
            <h4 className="font-semibold mb-2">Class Overview</h4>
            <p className="text-gray-700">{classDetails.description}</p>
          </div>

          {/* Instructor Notes */}
          {classDetails.instructorNotes && (
            <div>
              <h4 className="font-semibold mb-2">Instructor Notes</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 italic">{classDetails.instructorNotes}</p>
              </div>
            </div>
          )}

          {/* Watch Recording Button */}
          {classDetails.hasRecording && classDetails.status === 'completed' && (
            <div className="pt-4 border-t">
              <Button className="w-full" size="lg">
                <Play className="w-4 h-4 mr-2" />
                Watch Recording
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
