import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, FileText, UserCheck, Video } from "lucide-react";
import { type User as UserType } from "@/components/user-management/mockData";
import { ClassRecordingsModal } from "./ClassRecordingsModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";

interface ScheduleRecordingsTabProps {
  user: UserType;
}

export function ScheduleRecordingsTab({ user }: ScheduleRecordingsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [recordingsModalOpen, setRecordingsModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [notesMap, setNotesMap] = useState<{ [key: string]: string }>({});
  const [attendanceEntries, setAttendanceEntries] = useState([]);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: apiScheduleData, isLoading: scheduleLoading } = useQuery({
    queryKey: ["student-class-schedule", user.id],
    queryFn: () =>
      fetchApi<any>({
        path: `classes/class-schedule/student/${user.id}`,
      }),
    enabled: !!user?.id,
  });

  const { data: attendanceApiData, refetch: refetchAttendance } = useQuery({
    queryKey: ["attendance", selectedClass?.originalData?.id],
    queryFn: () =>
      fetchApi({
        path: `classes/attendance/class/${selectedClass?.originalData?.id}`,
        method: "GET",
      }),
    enabled: !!selectedClass?.originalData?.id && attendanceModalOpen,
  });

  const saveNotesMutation = useMutation({
    mutationFn: (data: { id: string; payload: any }) =>
      fetchApi({
        path: `classes/class-schedule/${data.id}`,
        method: "PATCH",
        data: data.payload,
      }),
  });

  const saveAttendanceMutation = useMutation({
    mutationFn: (data: { classId: string; payload: any }) =>
      fetchApi({
        path: `classes/attendance/class/${data.classId}/mark`,
        method: "POST",
        data: data.payload,
      }),
  });

  const transformedScheduleData = apiScheduleData?.total_classes?.map((item: any) => ({
    id: item.id.toString(),
    date: new Date(item.start_date).toLocaleDateString(),
    time: `${item.start_time} - ${item.end_time}`,
    instructor: `${item.primary_instructor_first_name} ${item.primary_instructor_last_name}`,
    status:
      item.status === "scheduled"
        ? "Scheduled"
        : item.status === "completed"
        ? "Completed"
        : item.status === "reschedule"
        ? "Rescheduled"
        : item.status === "cancelled"
        ? "Cancelled"
        : "Missed",
    type: item.class_type_name,
    originalData: item,
  })) || [];

  const filteredData = transformedScheduleData.filter(
    (item) =>
      item.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(
    startIndex,
    startIndex + itemsPerPage
  ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="default" className="bg-green-500 text-white">
            Completed
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge variant="default" className="bg-blue-500 text-white">
            Scheduled
          </Badge>
        );
      case "Rescheduled":
        return (
          <Badge variant="default" className="bg-orange-500 text-white">
            Rescheduled
          </Badge>
        );
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "Missed":
        return <Badge variant="destructive">Missed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleNotesClick = (classItem: any) => {
    setSelectedClass(classItem);
    setNotesModalOpen(true);
  };

  const handleAttendanceClick = (classItem: any) => {
    setSelectedClass(classItem);
    setAttendanceModalOpen(true);
  };

  const handleRecordingClick = (classItem: any) => {
    setSelectedClass(classItem);
    setRecordingsModalOpen(true);
  };

  const handleNoteChange = (classId: string, value: string) => {
    setNotesMap({ ...notesMap, [classId]: value });
  };

  const handleSaveNotes = () => {
    const notes = notesMap[selectedClass?.id] || selectedClass?.originalData?.notes || "";
    saveNotesMutation.mutate(
      { id: selectedClass?.originalData?.id, payload: { notes } },
      {
        onSuccess: () => {
          toast({ title: "Success", description: "Notes saved successfully." });
          queryClient.invalidateQueries({
            queryKey: ["student-class-schedule", user.id],
          });
          setNotesModalOpen(false);
          setNotesMap({});
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to save notes.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const transformAttendanceData = (apiData: any) => {
    if (!apiData) return [];
    const entries = [];
    const students = apiData.students_attendance || [];
    const instructors = apiData.instructors_attendance || [];
    const maxLength = Math.max(students.length, instructors.length, 1);

    for (let i = 0; i < maxLength; i++) {
      const student = students[i];
      const instructor = instructors[i];
      entries.push({
        studentId: student?.user_id,
        studentName: student
          ? `${student.user_first_name} ${student.user_last_name}`
          : "No Student",
        studentPresent: student?.present || false,
        studentLateJoin: student?.late_join || false,
        studentEarlyLeft: student?.left_early || false,
        studentJoinTime: student?.join_time || "",
        studentLeftTime: student?.leave_time || "",
        instructorId: instructor?.user_id,
        instructorName: instructor
          ? `${instructor.user_first_name} ${instructor.user_last_name}`
          : "No Instructor",
        instructorPresent: instructor?.present || false,
        instructorLateJoin: instructor?.late_join || false,
        instructorEarlyLeft: instructor?.left_early || false,
        instructorJoinTime: instructor?.join_time || "",
        instructorLeftTime: instructor?.leave_time || "",
      });
    }
    return entries;
  };

  useEffect(() => {
    if (attendanceApiData) {
      const transformedEntries = transformAttendanceData(attendanceApiData);
      setAttendanceEntries(transformedEntries);
    }
  }, [attendanceApiData]);

  const saveAttendance = () => {
    const attendanceRecords = [];
    attendanceEntries.forEach((entry) => {
      if (entry.studentId) {
        attendanceRecords.push({
          user_id: entry.studentId,
          present: entry.studentPresent,
          late_join: entry.studentLateJoin,
          left_early: entry.studentEarlyLeft,
          join_time: entry.studentJoinTime,
          leave_time: entry.studentLeftTime,
        });
      }
      if (entry.instructorId) {
        attendanceRecords.push({
          user_id: entry.instructorId,
          present: entry.instructorPresent,
          late_join: entry.instructorLateJoin,
          left_early: entry.instructorEarlyLeft,
          join_time: entry.instructorJoinTime,
          leave_time: entry.instructorLeftTime,
        });
      }
    });

    saveAttendanceMutation.mutate(
      {
        classId: selectedClass?.originalData?.id,
        payload: { attendance_records: attendanceRecords },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Attendance saved successfully.",
          });
          setAttendanceModalOpen(false);
          refetchAttendance();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to save attendance.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const updateAttendanceEntry = (index: number, field: string, value: any) => {
    const updated = [...attendanceEntries];
    updated[index] = { ...updated[index], [field]: value };
    setAttendanceEntries(updated);
  };

  if (scheduleLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading classes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Schedule & Recordings
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.instructor}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNotesClick(item)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Notes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAttendanceClick(item)}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Attendance
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecordingClick(item)}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Recording
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Modal */}
      <Dialog open={notesModalOpen} onOpenChange={setNotesModalOpen}>
        <DialogContent className="bg-white border max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Class Notes</DialogTitle>
            <DialogDescription>
              {selectedClass?.date} - {selectedClass?.time} with {selectedClass?.instructor}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Notes:</label>
              <Textarea
                rows={6}
                placeholder="Write notes here..."
                value={
                  notesMap[selectedClass?.id] ||
                  selectedClass?.originalData?.notes ||
                  ""
                }
                onChange={(e) =>
                  handleNoteChange(selectedClass?.id, e.target.value)
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNotesMap({});
                  setNotesModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNotes}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={saveNotesMutation.isPending}
              >
                {saveNotesMutation.isPending ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendance Modal */}
      <Dialog open={attendanceModalOpen} onOpenChange={setAttendanceModalOpen}>
        <DialogContent className="bg-white border max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Attendance – Session {selectedClass?.id || ""}</DialogTitle>
            <DialogDescription>Record attendance with join times</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {attendanceEntries?.map((entry, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Entry {index + 1}</h3>
                    <div className="mt-2">
                      <span className="text-lg font-medium">{entry.studentName || "Student"} (Student)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground min-w-16">Present:</span>
                    <Switch
                      checked={entry.studentPresent}
                      onCheckedChange={(checked) => updateAttendanceEntry(index, "studentPresent", checked)}
                    />
                  </div>
                </div>
                {entry.studentPresent && (
                  <div className="space-y-4 ml-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground min-w-20">Late Join:</span>
                        <Switch
                          checked={entry.studentLateJoin}
                          onCheckedChange={(checked) => updateAttendanceEntry(index, "studentLateJoin", checked)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground min-w-20">Early Left:</span>
                        <Switch
                          checked={entry.studentEarlyLeft}
                          onCheckedChange={(checked) => updateAttendanceEntry(index, "studentEarlyLeft", checked)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">Joined At</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={entry.studentJoinTime}
                          onChange={(e) => updateAttendanceEntry(index, "studentJoinTime", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">Left At</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={entry.studentLeftTime}
                          onChange={(e) => updateAttendanceEntry(index, "studentLeftTime", e.target.value)}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAttendanceModalOpen(false)}>Cancel</Button>
              <Button
                className="bg-orange-500 text-white"
                onClick={saveAttendance}
                disabled={saveAttendanceMutation.isPending}
              >
                {saveAttendanceMutation.isPending ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recordings Modal */}
      {selectedClass && (
        <ClassRecordingsModal
          open={recordingsModalOpen}
          onClose={() => setRecordingsModalOpen(false)}
          classDate={selectedClass.date}
          classTime={selectedClass.time}
          instructor={selectedClass.instructor}
        />
      )}
    </div>
  );
}