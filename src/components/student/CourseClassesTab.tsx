import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStudentCourseClasses } from "@/data/studentCourseData"
import { Calendar, Clock, Video, RotateCcw, FileText, User } from "lucide-react"
import { StudentCancelRescheduleModal } from "@/components/student/StudentCancelRescheduleModal"
import { fetchApi } from "@/services/api/fetchApi"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { Class } from "@/types/class"
import { useToast } from "@/hooks/use-toast"

interface CourseClassesTabProps {
  courseId: string
}

export function CourseClassesTab({ courseId }: CourseClassesTabProps) {
  // const classes = getStudentCourseClasses(courseId)
  const { user } = useAuth()
  const [selectedClassForReschedule, setSelectedClassForReschedule] = useState<string | null>(null)
  const [classes, setClasses] = useState<any>()
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const getClassesBYCourseQueries = useQuery({
    queryKey: ["getClassesByCourseQueries", courseId],
    queryFn: () =>
      fetchApi<any[]>({
        path: `classes/class-schedule/course/${courseId}/student/${user.id}`
      }),
    enabled: !!courseId && !!user.id
  })

  useEffect(() => {
    if (!getClassesBYCourseQueries.isLoading && getClassesBYCourseQueries.data) {
      setClasses(getClassesBYCourseQueries.data)
    }
  }, [getClassesBYCourseQueries.isLoading, getClassesBYCourseQueries.data])

  const upcomingClasses = classes?.upcoming_classes
  const completedClasses = classes?.completed_classes
  const cancelledClasses = classes?.cancelled_classes
  console.log({upcomingClasses, completedClasses, cancelledClasses});
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleReschedule = (classId: string) => {
    setSelectedClassForReschedule(classId)
    setIsRescheduleModalOpen(true)
  }

  const { toast } = useToast()

  const handlePlayRecording = (classItem: any) => {
    if (!classItem.class_recording) {
      toast({
        title: "Error",
        description: "No recording available for this class.",
        variant: "destructive",
      })
      return
    }
    window.open(classItem.class_recording, '_blank')
  }

  const handleCancelClass = (reason: string) => {
    console.log('Cancelling class with reason:', reason)
    // Handle class cancellation logic here
  }

  const handleRescheduleClass = (data: any) => {
    console.log('Rescheduling class with data:', data)
    // Handle class rescheduling logic here
  }

  const ClassCard = ({ classItem, status }: { classItem: any, status: string }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {/* <CardTitle className="text-lg">{classItem.title || `Class #${classItem.id}`}</CardTitle> */}
            <p className="text-sm text-muted-foreground">{classItem.course_title}</p>
          </div>
          <Badge className={getStatusColor(classItem.status)}>
            {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{formatDate(classItem.start_date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}</span>
            </div>
          </div>
        </div>

        {/* Class Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{classItem.primary_instructor_first_name} {classItem.primary_instructor_last_name}</p>
                <p className="text-xs text-muted-foreground">{classItem.primary_instructor_email}</p>
              </div>
            </div>

            {classItem.student_first_name && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">{classItem.student_first_name} {classItem.student_last_name}</p>
                  <p className="text-xs text-muted-foreground">{classItem.student_email}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                {classItem.class_type_name}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {classItem.class_context === 'individual' ? 'Individual' : 'Group'} Class
              </span>
            </div>

            {classItem.meeting_type && (
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {classItem.meeting_type.charAt(0).toUpperCase() + classItem.meeting_type.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cancellation/Reschedule Reasons */}
        {classItem.cancelation_reason_text && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-red-800">Cancellation Reason:</span>
            </div>
            <p className="text-sm text-red-700">{classItem.cancelation_reason_text}</p>
          </div>
        )}

        {classItem.reschedule_reason_text && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-yellow-800">Reschedule Reason:</span>
            </div>
            <p className="text-sm text-yellow-700">{classItem.reschedule_reason_text}</p>
          </div>
        )}

        {/* Class Notes */}
        {classItem.notes && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Class Notes:</span>
            </div>
            <p className="text-sm text-blue-700">{classItem.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {/* {classItem.meeting_link && status === 'upcoming' && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => window.open(classItem.meeting_link, '_blank')}
            >
              <Video className="w-4 h-4 mr-2" />
              Join Class
            </Button>
          )} */}

          {status === 'completed' && (
            <Button
              size="sm"
              variant="outline"
              className="hover:border-orange-300"
              onClick={() => handlePlayRecording(classItem)}
            >
              <Video className="w-4 h-4 mr-2" />
              Watch Recording
            </Button>
          )}

          {/* {status === 'upcoming' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReschedule(classItem.id)}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reschedule
            </Button>
          )} */}

          {/* {classItem.meeting_link && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(classItem.meeting_link)}
            >
              Copy Meeting Link
            </Button>
          )} */}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Classes</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {classes?.total_classes?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No classes scheduled
                </h3>
                <p className="text-sm text-muted-foreground">
                  Classes will appear here once they are scheduled for this course.
                </p>
              </CardContent>
            </Card>
          ) : (
            classes?.total_classes?.map((classItem) => (
              <ClassCard key={classItem.id} classItem={classItem} status="t" />
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingClasses?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No upcoming classes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your upcoming classes will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            upcomingClasses?.map((classItem) => (
              <ClassCard key={classItem.id} classItem={classItem} status="upcoming" />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedClasses?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No completed classes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your completed classes will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            completedClasses?.map((classItem) => (
              <ClassCard key={classItem.id} classItem={classItem} status={"completed"} />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4 mt-6">
          {cancelledClasses?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No cancelled classes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Any cancelled classes will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            cancelledClasses?.map((classItem) => (
              <ClassCard key={classItem.id} classItem={classItem} status="cancelled" />
            ))
          )}
        </TabsContent>
      </Tabs>

      {selectedClassForReschedule && (
        <StudentCancelRescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          onCancel={handleCancelClass}
          onReschedule={handleRescheduleClass}
          classInfo={{
            id: selectedClassForReschedule,
            date: 'Today',
            time: '10:00 AM - 11:00 AM',
            subject: 'Art Class',
            instructor: 'Instructor'
          }}
        />
      )}
    </div>
  )
}
