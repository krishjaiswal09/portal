import React, { useState, useMemo, useEffect } from 'react';
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TablePagination } from "@/components/ui/table-pagination";
import { Video, RotateCcw, X, Edit, Play } from "lucide-react";
import { NotesModal } from "@/components/instructor/NotesModal";
import { AttendanceDisplay } from "@/components/instructor/AttendanceDisplay";
import { ClassRecordingsModal } from "@/components/instructor/ClassRecordingsModal";
import { ClassCancelRescheduleModal } from "@/components/class-management/ClassCancelRescheduleModal";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SectionLoader } from "@/components/ui/loader";
import { getUTCJoinTime } from '@/utils/caseTransform';

interface ApiClassData {
  id: number;
  course: number;
  title: string;
  course_title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  status: string;
  class_context: string;
  primary_instructor: number;
  primary_instructor_first_name: string;
  primary_instructor_last_name: string;
  secondary_instructor?: number;
  student?: number;
  group?: number;
  meeting_link?: string;
  meeting_type: string;
  notes: string | null;
  class_recording: string | null;
  class_type_name: string;
  student_first_name?: string;
  student_last_name?: string;
  group_name?: string;
  reason?: number;
  canJoin?: boolean;
  canCancel?: boolean;
  canReschedule?: boolean;
  reschedule_reason_text?: string;
  cancelation_reason_text?: string;
}

export interface InstructorClassesResponse {
  instructor_id: number;
  instructor_name: string;
  instructor_email: string;
  total_classes_count: number;
  primary_instructor_classes_count: number;
  secondary_instructor_classes_count: number;
  past_classes_count: number;
  today_classes_count: number;
  upcoming_classes_count: number;
  completed_classes_count: number;
  total_classes: ApiClassData[];
  past_classes: ApiClassData[];
  today_classes: ApiClassData[];
  upcoming_classes: ApiClassData[];
  completed_classes: ApiClassData[];
}

export default function Classes() {
  const [activeTab, setActiveTab] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notesModal, setNotesModal] = useState({ isOpen: false, classInfo: null as any, existingNotes: "" });
  const [recordingsModal, setRecordingsModal] = useState({ isOpen: false, classInfo: null as any });
  const [cancelRescheduleModal, setCancelRescheduleModal] = useState({ isOpen: false, classInfo: null as any });
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Periodically check for ongoing classes
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["instructor-classes", user?.id] });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [queryClient, user?.id]);

  const instructorClasses = useQuery({
    queryKey: ["instructor-classes", user?.id],
    queryFn: () =>
      fetchApi<InstructorClassesResponse>({
        path: `classes/class-schedule/instructor/${user?.id}`,
      }),
    enabled: !!user?.id,
  });

  const isClassOngoing = (classDate: string, startTime: string, endTime: string) => {
    const now = new Date();
    const classDateTime = new Date(`${classDate}T${startTime}`);
    const classEndTime = new Date(`${classDate}T${endTime}`);
    
    return now >= classDateTime && now <= classEndTime;
  };

  const transformApiDataToClasses = (apiData: ApiClassData[]) => {
    return apiData.map((item) => {
      const classDate = item.start_date.split("T")[0];
      
      return {
        id: item.id,
        date: classDate,
        time: `${item.start_time} - ${item.end_time}`,
        course: item.course_title,
        student: item.student_first_name && item.student_last_name 
          ? `${item.student_first_name} ${item.student_last_name}`
          : item.title,
        status: item.status === "scheduled" ? "upcoming" : item.status,
        type: item.class_context as "individual" | "batch",
        duration: "60 min",
        classType: item.class_type_name || "PVT 60 Min",
        teacherAttendance: "present" as const,
        studentAttendance: "present" as const,
        notes: item.notes || "",
        meetingLink: item.meeting_link,
        recording: item.class_recording,
        canJoin: item.canJoin,
        canCancel: item.canCancel,
        canReschedule: item.canReschedule,
        rescheduleReason: item.reschedule_reason_text || "N/A",
        cancelReason: item.cancelation_reason_text || "N/A"
      };
    });
  };

  const getClassesByTab = () => {
    if (!instructorClasses?.data) return [];

    switch (activeTab) {
      case "today":
        return transformApiDataToClasses(instructorClasses.data?.today_classes || []);
      case "upcoming":
        return transformApiDataToClasses(instructorClasses.data?.upcoming_classes || []);
      case "completed":
        return transformApiDataToClasses(instructorClasses.data?.completed_classes || []);
      default:
        return [];
    }
  };

  const filteredClasses = useMemo(() => getClassesByTab(), [activeTab, instructorClasses.data]);
  
  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredClasses.slice(startIndex, startIndex + pageSize);
  }, [filteredClasses, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredClasses.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'ongoing':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          {status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
        </Badge>;
      case 'scheduled':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleNotesClick = (classItem: any) => {
    setNotesModal({
      isOpen: true,
      classInfo: {
        id: classItem.id,
        student: classItem.student,
        course: classItem.course
      },
      existingNotes: classItem.notes || ""
    });
  };

  const handleRecordingsClick = (classItem: any) => {
    setRecordingsModal({
      isOpen: true,
      classInfo: {
        id: classItem.id,
        student: classItem.student,
        course: classItem.course
      }
    });
  };

  const saveNotesMutation = useMutation({
    mutationFn: (data: { id: string; notes: string }) =>
      fetchApi({
        path: `classes/class-schedule/${data.id}`,
        method: "PATCH",
        data: { notes: data.notes },
      }),
    onSuccess: () => {
      toast({
        title: "Notes Saved",
        description: "Class notes have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["instructor-classes", user?.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to save notes.",
        variant: "destructive",
      });
    },
  });

  const handleSaveNotes = (notes: string) => {
    if (notesModal.classInfo?.id) {
      saveNotesMutation.mutate({
        id: notesModal.classInfo.id.toString(),
        notes: notes
      });
    }
  };

  const markAttendanceMutation = useMutation({
    mutationFn: (data: { classId: string; userId: number }) =>
      fetchApi({
        path: `classes/attendance/class/${data.classId}/mark`,
        method: "POST",
        data: {
          attendance_records: [
            {
              user_id: data.userId,
              present: true,
              join_time: getUTCJoinTime()
            }
          ]
        },
      }),
  });

  const handleJoinClass = (classItem: any) => {
    if (classItem.meetingLink) {
      window.open(classItem.meetingLink, '_blank');
    }
    if (user?.id) {
      markAttendanceMutation.mutate({
        classId: classItem.id.toString(),
        userId: user.id
      });
    }
    toast({
      title: "Joining Class",
      description: `Connecting you to ${classItem.course}...`,
    });
  };

  const handleReschedule = (classItem: any) => {
    setCancelRescheduleModal({
      isOpen: true,
      classInfo: {
        id: classItem.id,
        title: classItem.course,
        startDate: classItem.date,
        startTime: classItem.time.split(' - ')[0],
        endTime: classItem.time.split(' - ')[1],
        student: classItem.student
      }
    });
  };

  const handleCancel = (classItem: any) => {
    setCancelRescheduleModal({
      isOpen: true,
      classInfo: {
        id: classItem.id,
        title: classItem.course,
        startDate: classItem.date,
        startTime: classItem.time.split(' - ')[0],
        endTime: classItem.time.split(' - ')[1],
        student: classItem.student
      }
    });
  };

  const handleModalCancel = (reason: any) => {
    queryClient.invalidateQueries({ queryKey: ["instructor-classes", user?.id] });
  };

  const handleModalReschedule = (data: any) => {
    queryClient.invalidateQueries({ queryKey: ["instructor-classes", user?.id] });
  };

  const getActionButtons = (classItem: any) => {
    if (classItem.status === 'upcoming') {
      return (
        <div className="flex gap-2">
          {classItem.canJoin && classItem.status !== "completed" && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleJoinClass(classItem)}>
              <Video className="w-4 h-4 mr-1" />
              Join
            </Button>
          )}
          {classItem.canReschedule && (
            <Button size="sm" variant="outline" onClick={() => handleReschedule(classItem)}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reschedule
            </Button>
          )}
          {classItem.canCancel && (
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleCancel(classItem)}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      );
    } else if (classItem.status === 'scheduled') {
      return (
        <div className="flex gap-2">
          {classItem.canReschedule && (
            <Button size="sm" variant="outline" onClick={() => handleReschedule(classItem)}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reschedule
            </Button>
          )}
          {classItem.canCancel && (
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleCancel(classItem)}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      );
    } else if (classItem.status === 'completed') {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleNotesClick(classItem)}>
            <Edit className="w-4 h-4 mr-1" />
            Notes
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleRecordingsClick(classItem)} className="bg-blue-50 hover:bg-blue-100">
            <Play className="w-4 h-4 mr-1" />
            Recordings
          </Button>
        </div>
      );
    }
    return null;
  };

  const classCounts = {
    today: instructorClasses.data?.today_classes?.length || 0,
    upcoming: instructorClasses.data?.upcoming_classes?.length || 0,
    completed: instructorClasses.data?.completed_classes?.length || 0
  };

  if (instructorClasses.isLoading) {
    return (
      <InstructorDashboardLayout title="Classes">
        <SectionLoader text="Loading your classes..." />
      </InstructorDashboardLayout>
    );
  }

  return (
    <InstructorDashboardLayout title="Classes">
      <div className="space-y-6">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">Class Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="today">Today ({classCounts.today})</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming ({classCounts.upcoming})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({classCounts.completed})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="mt-6">
                <ClassTable 
                  filteredClasses={paginatedClasses} 
                  getStatusBadge={getStatusBadge} 
                  getActionButtons={getActionButtons} 
                  emptyMessage="No classes scheduled for today"
                  showAttendance={false}
                />
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredClasses.length}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-6">
                <ClassTable 
                  filteredClasses={paginatedClasses} 
                  getStatusBadge={getStatusBadge} 
                  getActionButtons={getActionButtons} 
                  emptyMessage="No upcoming classes"
                  showAttendance={false}
                />
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredClasses.length}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </TabsContent>
              
              <TabsContent value="completed" className="mt-6">
                <ClassTable 
                  filteredClasses={paginatedClasses} 
                  getStatusBadge={getStatusBadge} 
                  getActionButtons={getActionButtons} 
                  emptyMessage="No completed classes"
                  showAttendance={true}
                />
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredClasses.length}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <NotesModal
        isOpen={notesModal.isOpen}
        onClose={() => setNotesModal({ ...notesModal, isOpen: false })}
        classInfo={notesModal.classInfo}
        existingNotes={notesModal.existingNotes}
        onSave={handleSaveNotes}
      />

      <ClassRecordingsModal
        isOpen={recordingsModal.isOpen}
        onClose={() => setRecordingsModal({ ...recordingsModal, isOpen: false })}
        classInfo={recordingsModal.classInfo}
      />

      <ClassCancelRescheduleModal
        isOpen={cancelRescheduleModal.isOpen}
        onClose={() => setCancelRescheduleModal({ ...cancelRescheduleModal, isOpen: false })}
        onCancel={handleModalCancel}
        onReschedule={handleModalReschedule}
        classInfo={cancelRescheduleModal.classInfo}
        loggedInInstructor={user}
      />
    </InstructorDashboardLayout>
  );
}

function ClassTable({
  filteredClasses,
  getStatusBadge,
  getActionButtons,
  emptyMessage,
  showAttendance
}: any) {
  if (filteredClasses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Class Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cancel Reason</TableHead>
            <TableHead>Reschedule Reason</TableHead>
            {showAttendance && <TableHead>Attendance</TableHead>}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClasses.map((classItem: any) => (
            <TableRow key={classItem.id}>
              <TableCell className="font-medium">
                {new Date(classItem.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{classItem.time}</TableCell>
              <TableCell>{classItem.course}</TableCell>
              <TableCell>{classItem.student}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  {classItem.classType}
                </Badge>
              </TableCell>
              <TableCell>{classItem.duration}</TableCell>
              <TableCell>{getStatusBadge(classItem.status)}</TableCell>
              <TableCell>{classItem.cancelReason}</TableCell>
              <TableCell>{classItem.rescheduleReason}</TableCell>
              {showAttendance && (
                <TableCell>
                  <AttendanceDisplay
                    teacherAttendance={classItem.teacherAttendance}
                    studentAttendance={classItem.studentAttendance}
                    studentName={classItem.student}
                  />
                </TableCell>
              )}
              <TableCell>{getActionButtons(classItem)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
