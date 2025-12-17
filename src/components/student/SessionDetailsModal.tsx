
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Clock, Calendar, Users, Video, Play, Bell } from "lucide-react"
import { EnhancedClassSession } from "@/data/studentDashboardData"
import { useToast } from "@/hooks/use-toast"

interface SessionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  session: EnhancedClassSession | null
}

export function SessionDetailsModal({ isOpen, onClose, session }: SessionDetailsModalProps) {
  const { toast } = useToast()
  
  if (!session) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'missed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAttendanceIcon = (attendanceStatus: string) => {
    return attendanceStatus === 'attended' ? '✅' : '❌'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {session.subject}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={session.teacherPhoto} alt={session.teacher} />
              <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                {session.teacher.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getStatusColor(session.status)}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </Badge>
                {session.status === 'completed' && (
                  <Badge variant="outline" className="text-sm">
                    {getAttendanceIcon(session.attendanceStatus)} {session.attendanceStatus === 'attended' ? 'Attended' : 'Missed'}
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{session.teacher}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{session.startTime} - {session.endTime} ({session.timezone})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{session.duration}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Course Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Course Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Course</p>
                <p className="text-gray-900">{session.courseTitle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Art Form</p>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {session.artFormTag}
                </Badge>
              </div>
            </div>
          </div>

          {/* Class Description */}
          {session.classDescription && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Class Overview</h4>
              <p className="text-gray-700 leading-relaxed">{session.classDescription}</p>
            </div>
          )}

          {/* Instructor Notes */}
          {session.instructorNotes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Instructor Notes</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 italic">{session.instructorNotes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {session.canJoin && session.status === 'upcoming' && (
              <Button className="bg-green-600 hover:bg-green-700 flex-1">
                <Video className="w-4 h-4 mr-2" />
                Join Class
              </Button>
            )}
            
            {session.hasRecording && session.recordingUrl && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  if (session.recordingUrl) {
                    window.open(session.recordingUrl, "_blank")
                  } else {
                    toast({
                      title: "No Class Recording",
                      description: "Class recording not available for this class.",
                      variant: "destructive",
                    })
                  }
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Recording
              </Button>
            )}
            
            {session.status === 'upcoming' && !session.reminderSet && (
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Set Reminder
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
