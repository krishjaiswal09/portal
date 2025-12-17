
import React, { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Calendar, 
  Clock, 
  Video, 
  Play,
  X,
  FileText,
  BookOpen
} from "lucide-react"
import { EnhancedClassSession } from "@/data/studentDashboardData"
import { StudentCancelRescheduleModal } from "@/components/student/StudentCancelRescheduleModal"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface ClassTableViewProps {
  classes: EnhancedClassSession[]
  onSessionClick: (session: EnhancedClassSession) => void
  onJoinClass: (classItem: any) => void
  onWatchRecording: (session: EnhancedClassSession) => void
  onViewNotes?: (session: EnhancedClassSession) => void
  onToggleReminder: (session: EnhancedClassSession) => void
  canJoinClass: (session: EnhancedClassSession) => boolean
  onDataUpdate?: () => void
  activeTab?: string
}

export function ClassTableView({
  classes,
  onSessionClick,
  onJoinClass,
  onWatchRecording,
  onViewNotes,
  canJoinClass,
  onDataUpdate,
  activeTab
}: ClassTableViewProps) {
  const [showCancelRescheduleModal, setShowCancelRescheduleModal] = useState(false)
  const [selectedClassForAction, setSelectedClassForAction] = useState<EnhancedClassSession | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAttendanceIcon = (attendanceStatus: string) => {
    return attendanceStatus === 'attended' ? '✅' : '❌'
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground">
          No classes found
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          You don't have any classes scheduled for this period
        </p>
      </div>
    )
  }

  const handleReschedule = (classItem: EnhancedClassSession) => {
    setSelectedClassForAction(classItem)
    setShowCancelRescheduleModal(true)
  }

  const handleCancel = (classItem: EnhancedClassSession) => {
    setSelectedClassForAction(classItem)
    setShowCancelRescheduleModal(true)
  }

  const handleCancelClass = (reason: any) => {
    if (selectedClassForAction) {
      toast({
        title: "Class Cancelled",
        description: `Your ${selectedClassForAction.subject} class has been cancelled. Credits will be refunded to your account.`,
      })
      queryClient.invalidateQueries({ queryKey: ["student-classes"] })
      queryClient.invalidateQueries({ queryKey: ["classes"] })
      onDataUpdate?.()
    }
    setShowCancelRescheduleModal(false)
    setSelectedClassForAction(null)
  }

  const handleRescheduleClass = (data: any) => {
    if (selectedClassForAction) {
      toast({
        title: "Class Rescheduled",
        description: `Your ${selectedClassForAction.subject} class has been rescheduled to ${data.date} at ${data.time}.`,
      })
      queryClient.invalidateQueries({ queryKey: ["student-classes"] })
      queryClient.invalidateQueries({ queryKey: ["classes"] })
      onDataUpdate?.()
    }
    setShowCancelRescheduleModal(false)
    setSelectedClassForAction(null)
  }

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            {/* <TableHead className="font-semibold">Class Details</TableHead> */}
            <TableHead className="font-semibold">Instructor</TableHead>
            <TableHead className="font-semibold">Schedule</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            {activeTab === 'cancelled' && <TableHead className="font-semibold">Cancel Reason</TableHead>}
            {activeTab === 'upcoming' && <TableHead className="font-semibold">Reschedule Reason</TableHead>}
            <TableHead className="font-semibold text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes?.map((classItem) => (
            <TableRow 
              key={classItem.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onSessionClick(classItem)}
            >
              {/* Class Details */}
              {/* <TableCell className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{classItem.subject}</p>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                    {classItem.artFormTag}
                  </Badge>
                  <p className="text-sm text-gray-600">{classItem.courseTitle}</p>
                </div>
              </TableCell> */}

              {/* Instructor */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={classItem.teacherPhoto} alt={classItem.teacher} />
                    <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                      {classItem.teacher.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{classItem.teacher}</p>
                    <p className="text-xs text-gray-600">{classItem.timezone}</p>
                  </div>
                </div>
              </TableCell>

              {/* Schedule */}
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span>{classItem.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{classItem.startTime} - {classItem.endTime}</span>
                  </div>
                  <p className="text-xs text-gray-600">{classItem.duration}</p>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <div className="space-y-1">
                  <Badge className={getStatusColor(classItem.status)}>
                    {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                  </Badge>
                  {classItem.status === 'completed' && (
                    <div className="text-xs">
                      {getAttendanceIcon(classItem.attendanceStatus)} {classItem.attendanceStatus === 'attended' ? 'Attended' : 'Missed'}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Cancel Reason - only show for cancelled tab */}
              {activeTab === 'cancelled' && (
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {classItem.cancelation_reason_text || "No reason provided"}
                  </span>
                </TableCell>
              )}

              {/* Reschedule Reason - only show for upcoming tab */}
              {activeTab === 'upcoming' && (
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {classItem.reschedule_reason_text || "No reschedule"}
                  </span>
                </TableCell>
              )}

              {/* Actions */}
              <TableCell>
                <div className="flex flex-wrap gap-1">
                {classItem.canJoin && classItem.status !== 'completed' && classItem.status !== 'cancelled' && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        onJoinClass(classItem)
                      }}
                    >
                      <Video className="w-3 h-3 mr-1" />
                      Join
                    </Button>
                  )}

                  {(classItem.class_recording !== null)&& (
                    <Button 
                      size="sm" 
                      variant="outline"   
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        onWatchRecording(classItem)
                      }}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Recording
                    </Button>
                  )}
                  
                  {classItem.canReschedule && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReschedule(classItem)
                      }}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Reschedule
                    </Button>
                  )}
                  
                  {classItem.canCancel && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCancel(classItem)
                      }}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  )}

                  {(classItem.status === 'completed' || classItem.instructorNotes !== null) && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewNotes && onViewNotes(classItem)
                      }}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Notes
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <StudentCancelRescheduleModal
      isOpen={showCancelRescheduleModal}
      onClose={() => setShowCancelRescheduleModal(false)}
      onCancel={handleCancelClass}
      onReschedule={handleRescheduleClass}
      classInfo={selectedClassForAction ? {
        id: selectedClassForAction.id,
        title: selectedClassForAction.subject,
        type: selectedClassForAction.subject,
        startDate: selectedClassForAction.date,
        startTime: selectedClassForAction.startTime,
        endTime: selectedClassForAction.endTime,
        canCancel: selectedClassForAction.canCancel,
        canReschedule: selectedClassForAction.canReschedule
      } : null}
    />
  </>
  )
}
