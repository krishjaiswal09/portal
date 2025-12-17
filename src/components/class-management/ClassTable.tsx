import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { EnhancedRecordingsModal } from "./EnhancedRecordingsModal";
import { useToast } from "@/hooks/use-toast";
import { formatStudentDisplay } from "@/utils/studentHelpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ClassTableProps {
  classes: any[];
  onEdit: (classItem: any) => void;
  onDelete: (classId: string) => void;
  onJoin?: (classId: string) => void;
  onCancel?: (classId: string) => void;
  onReschedule?: (classId: string) => void;
}

export function ClassTable({
  classes,
  onEdit,
  onDelete,
  onJoin,
  onCancel,
  onReschedule,
}: ClassTableProps) {
  const [columns, setColumns] = useState({
    date: true,
    title: true,
    course: true,
    classType: true,
    startTime: true,
    endTime: true,
    studentName: true,
    instructor: true,
    meetingLink: true,
    status: true,
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [notesMap, setNotesMap] = useState<{
    [key: string]: string;
  }>({});
  const [openNotesId, setOpenNotesId] = useState<string | null>(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [recordingsDialogOpen, setRecordingsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);

  const editClassReschdule = useMutation({
    mutationFn: (data: { id: string; payload: any }) =>
      fetchApi({
        path: `classes/class-schedule/${data.id}`,
        method: "PATCH",
        data: data.payload,
      }),
  });

  const { data: attendanceApiData, refetch: refetchAttendance } = useQuery({
    queryKey: ["attendance", selectedClass?.id],
    queryFn: () =>
      fetchApi({
        path: `classes/attendance/class/${selectedClass?.id}`,
        method: "GET",
      }),
    enabled: !!selectedClass?.id && attendanceDialogOpen,
  });

  const saveAttendanceMutation = useMutation({
    mutationFn: (data: { classId: string; payload: any }) =>
      fetchApi({
        path: `classes/attendance/class/${data.classId}/mark`,
        method: "POST",
        data: data.payload,
      }),
  });

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
              join_time: new Date().toTimeString().slice(0, 8),
            },
          ],
        },
      }),
  });

  // Attendance states with enhanced fields
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceEntries, setAttendanceEntries] = useState([]);

  const getClassTypeDisplay = (classItem: any) => {
    if (classItem.type === "Private") {
      return classItem.duration === 40 ? "Pvt 40 min" : "Pvt 60 minutes";
    }
    return "Group 60 minutes";
  };

  const handleDownload = () => {
    const csvContent = [
      [
        "Date",
        "Class Type",
        "Start Time",
        "End Time",
        "Student/Group",
        "Instructor",
        "Meeting Link",
        "Status",
      ],
      ...classes?.map((classItem) => [
        classItem.startDate || classItem.date,
        classItem.type,
        classItem.startTime,
        classItem.endTime || "N/A",
        classItem.studentName || "N/A",
        classItem.instructor,
        classItem.meetingLink || "N/A",
        classItem.status || "N/A",
      ]),
    ]
      ?.map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "classes_export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCancelReschedule = (classItem: any) => {
    onCancel && onCancel(classItem.id);
  };

  const openAttendanceDialog = (classItem: any) => {
    setSelectedClass(classItem);
    setAttendanceDialogOpen(true);
  };

  // Transform API data to UI format
  const transformAttendanceData = (apiData: any) => {
    if (!apiData) return [];

    const entries = [];
    const students = apiData.students_attendance || [];
    const instructors = apiData.instructors_attendance || [];

    // Sort instructors: primary first, then secondary
    const sortedInstructors = instructors.sort((a, b) => {
      if (a.user_role === "primary_instructor") return -1;
      if (b.user_role === "primary_instructor") return 1;
      if (a.user_role === "secondary_instructor") return -1;
      if (b.user_role === "secondary_instructor") return 1;
      return 0;
    });

    // Add instructors first
    sortedInstructors.forEach((instructor) => {
      entries.push({
        type: "instructor",
        id: instructor.user_id,
        name: `${instructor.user_first_name} ${instructor.user_last_name}`,
        role:
          instructor.user_role === "primary_instructor"
            ? "Primary Instructor"
            : "Secondary Instructor",
        present: instructor.present || false,
        lateJoin: instructor.late_join || false,
        earlyLeft: instructor.left_early || false,
        joinTime: instructor.join_time || "",
        leftTime: instructor.leave_time || "",
      });
    });

    // Add students after instructors
    students.forEach((student) => {
      entries.push({
        type: "student",
        id: student.user_id,
        name: `${student.user_first_name} ${student.user_last_name}`,
        role: "Student",
        present: student.present || false,
        lateJoin: student.late_join || false,
        earlyLeft: student.left_early || false,
        joinTime: student.join_time || "",
        leftTime: student.leave_time || "",
      });
    });

    return entries;
  };

  // Update entries when API data changes
  React.useEffect(() => {
    if (attendanceApiData) {
      setAttendanceData(attendanceApiData);
      const transformedEntries = transformAttendanceData(attendanceApiData);
      setAttendanceEntries(transformedEntries);
    }
  }, [attendanceApiData]);

  const openRecordingsDialog = (classItem: any) => {
    setSelectedClass(classItem);
    setRecordingsDialogOpen(true);
  };

  const handleNoteChange = (classId: string, value: string) => {
    setNotesMap({
      ...notesMap,
      [classId]: value,
    });
  };

  const handleSaveNotes = (classId: string) => {
    const notes = notesMap[classId];
    editClassReschdule.mutate(
      { id: classId, payload: { notes } },
      {
        onSuccess: (data: any) => {
          toast({ title: "Success", description: "Notes saved successfully." });
          setOpenNotesId(null);
          queryClient.invalidateQueries({ queryKey: ["classes"] });
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

  // Check if there are any late joins to disable save button
  const hasLateJoins = attendanceEntries.some((entry) => entry.lateJoin);

  const saveAttendance = () => {
    const attendanceRecords = attendanceEntries.map((entry) => ({
      user_id: entry.id,
      present: entry.present,
      late_join: entry.lateJoin,
      left_early: entry.earlyLeft,
      join_time: entry.joinTime,
      leave_time: entry.leftTime,
    }));

    saveAttendanceMutation.mutate(
      {
        classId: selectedClass?.id,
        payload: { attendance_records: attendanceRecords },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Attendance saved successfully.",
          });
          setAttendanceDialogOpen(false);
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
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setAttendanceEntries(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header with Download Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Class Schedule</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColumnModal(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Customize Columns
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.date && <TableHead>Date</TableHead>}
              {/* {columns.title && <TableHead>Title</TableHead>} */}
              {columns.course && <TableHead>Course</TableHead>}
              {columns.classType && <TableHead>Class Type</TableHead>}
              {columns.startTime && <TableHead>Start Time</TableHead>}
              {columns.endTime && <TableHead>End Time</TableHead>}
              {columns.studentName && <TableHead>Student/Group</TableHead>}
              {columns.instructor && <TableHead>Instructor</TableHead>}
              {columns.status && <TableHead>Status</TableHead>}
              <TableHead>Cancellation Reason</TableHead>
              <TableHead>Reschedule Reason</TableHead>
              <TableHead>Join Class</TableHead>
              <TableHead>Cancel/Reschedule</TableHead>
              <TableHead className="min-w-[280px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes?.map((classItem) => (
              <>
                <TableRow key={classItem.id} className="hover:bg-muted/30">
                  {columns.date && <TableCell>{classItem.startDate}</TableCell>}
                  {/* {columns.title && <TableCell>{classItem.title}</TableCell>} */}
                  {columns.course && <TableCell>{classItem.course}</TableCell>}
                  {columns.classType && <TableCell>{classItem.type}</TableCell>}
                  {columns.startTime && (
                    <TableCell>{classItem.startTime}</TableCell>
                  )}
                  {columns.endTime && (
                    <TableCell>{classItem.endTime}</TableCell>
                  )}
                  {columns.studentName && (
                    <TableCell>{classItem.studentName || "N/A"}</TableCell>
                  )}
                  {columns.instructor && (
                    <TableCell>{classItem.instructor}</TableCell>
                  )}
                  {columns.status && (
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          classItem.status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : classItem.status === "ongoing"
                            ? "bg-green-100 text-green-800"
                            : classItem.status === "completed"
                            ? "bg-gray-100 text-gray-800"
                            : classItem.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {classItem.status?.charAt(0).toUpperCase() +
                          classItem.status?.slice(1) || "Unknown"}
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="text-center">
                    {classItem.cancelation_reason_text || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {classItem.reschedule_reason_text || "N/A"}
                  </TableCell>
                  <TableCell>
                    {classItem.canJoin && classItem.status !== "cancelled" && classItem.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => {
                          if (classItem.meetingLink) {
                            window.open(classItem.meetingLink, "_blank");
                            markAttendanceMutation.mutate({
                              classId: classItem.id,
                              userId: user.id,
                            });
                          }
                        }}
                      >
                        Join Class
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {(classItem.canCancel || classItem.canReschedule) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelReschedule(classItem)}
                      >
                        Cancel/Reschedule
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setOpenNotesId(
                            openNotesId === classItem.id ? null : classItem.id
                          )
                        }
                      >
                        Notes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAttendanceDialog(classItem)}
                      >
                        Attendance
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRecordingsDialog(classItem)}
                      >
                        Class Recordings
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(classItem.id)}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {openNotesId === classItem.id && (
                  <TableRow className="bg-muted/10">
                    <TableCell colSpan={11}>
                      <div className="space-y-3 p-2">
                        <label className="text-sm font-medium">
                          Class Notes:
                        </label>
                        <Textarea
                          rows={3}
                          placeholder="Write notes here..."
                          value={notesMap[classItem.id] || classItem.notes}
                          onChange={(e) =>
                            handleNoteChange(classItem.id, e.target.value)
                          }
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setNotesMap((prev) => ({
                                ...prev,
                                [classItem.id]: classItem.notes ?? "",
                              }));
                              setOpenNotesId(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveNotes(classItem.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            Save Notes
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
        {classes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No classes found matching your filters.
          </div>
        )}
      </div>

      {/* Column Modal */}
      <Dialog open={showColumnModal} onOpenChange={setShowColumnModal}>
        <DialogContent className="bg-background border shadow-lg">
          <DialogHeader>
            <DialogTitle>Customize Columns</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {Object.entries(columns)?.map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={(e) =>
                    setColumns({
                      ...columns,
                      [key]: e.target.checked,
                    })
                  }
                />
                <label htmlFor={key} className="capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Attendance Dialog */}
      <Dialog
        open={attendanceDialogOpen}
        onOpenChange={setAttendanceDialogOpen}
      >
        <DialogContent className="bg-white border max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              Attendance – Session {selectedClass?.id || ""}
            </DialogTitle>
            <DialogDescription>
              Record attendance with join times
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {/* Instructors Section */}
            {attendanceEntries?.filter((entry) => entry.type === "instructor")
              .length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">
                  Instructors
                </h3>
                {attendanceEntries
                  ?.filter((entry) => entry.type === "instructor")
                  ?.map((entry, index) => {
                    const originalIndex = attendanceEntries.findIndex(
                      (e) => e.id === entry.id
                    );
                    return (
                      <div
                        key={entry.id}
                        className="border-b border-gray-200 pb-4 ml-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-lg font-medium">
                              {entry.name} ({entry.role})
                            </span>
                            {/* {entry.lateJoin && (
                              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Late Join
                              </span>
                            )} */}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground min-w-16">
                              Present:
                            </span>
                            <Switch
                              checked={entry.present}
                              onCheckedChange={(checked) =>
                                updateAttendanceEntry(
                                  originalIndex,
                                  "present",
                                  checked
                                )
                              }
                            />
                          </div>
                        </div>

                        {entry.present && (
                          <div className="ml-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm text-muted-foreground mb-1">
                                  Joined At
                                </label>
                                <input
                                  type="time"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  value={entry.joinTime}
                                  onChange={(e) =>
                                    updateAttendanceEntry(
                                      originalIndex,
                                      "joinTime",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Students Section */}
            {attendanceEntries?.filter((entry) => entry.type === "student")
              .length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">
                  Students
                </h3>
                {attendanceEntries
                  ?.filter((entry) => entry.type === "student")
                  ?.map((entry, index) => {
                    const originalIndex = attendanceEntries.findIndex(
                      (e) => e.id === entry.id
                    );
                    return (
                      <div
                        key={entry.id}
                        className="border-b border-gray-200 pb-4 last:border-b-0 ml-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-lg font-medium">
                              {entry.name}
                            </span>
                            {entry.lateJoin && (
                              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Late Join
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground min-w-16">
                              Present:
                            </span>
                            <Switch
                              checked={entry.present}
                              onCheckedChange={(checked) =>
                                updateAttendanceEntry(
                                  originalIndex,
                                  "present",
                                  checked
                                )
                              }
                            />
                          </div>
                        </div>

                        {entry?.present && (
                          <div className="space-y-4 ml-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm text-muted-foreground mb-1">
                                  Joined At
                                </label>
                                <input
                                  type="time"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  value={entry.joinTime}
                                  onChange={(e) =>
                                    updateAttendanceEntry(
                                      originalIndex,
                                      "joinTime",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              {/* <div>
                                <label className="block text-sm text-muted-foreground mb-1">
                                  Left At
                                </label>
                                <input
                                  type="time"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  value={entry.leftTime}
                                  onChange={(e) =>
                                    updateAttendanceEntry(
                                      originalIndex,
                                      "leftTime",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Optional"
                                />
                              </div> */}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-6">
              <Button
                variant="outline"
                onClick={() => setAttendanceDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-orange-500 text-white"
                onClick={saveAttendance}
                disabled={saveAttendanceMutation.isPending}
              >
                {saveAttendanceMutation.isPending
                  ? "Saving..."
                  : "Save Attendance"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Class Recordings Modal */}
      <EnhancedRecordingsModal
        isOpen={recordingsDialogOpen}
        onOpenChange={setRecordingsDialogOpen}
        sessionId={selectedClass?.id || ""}
        initialRecordings={
          selectedClass?.class_recording
            ? [
                {
                  id: "1",
                  title: "",
                  url: selectedClass.class_recording,
                },
              ]
            : []
        }
      />
    </div>
  );
}
