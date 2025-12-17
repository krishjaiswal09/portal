import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";

interface DemoAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDemo: any;
}

export function DemoAttendanceModal({ 
  isOpen, 
  onClose, 
  selectedDemo
}: DemoAttendanceModalProps) {
  const { toast } = useToast();
  const [attendanceEntries, setAttendanceEntries] = useState([]);

  const { data: attendanceApiData, refetch: refetchAttendance } = useQuery({
    queryKey: ['demoAttendance', selectedDemo?.id],
    queryFn: () => fetchApi({
      path: `classes/demo-attendance/demo-class/${selectedDemo?.id}`,
      method: "GET",
    }),
    enabled: !!selectedDemo?.id && isOpen,
  });

  const saveAttendanceMutation = useMutation({
    mutationFn: (data: { demoId: string; payload: any }) =>
      fetchApi({
        path: `classes/demo-attendance/demo-class/${data.demoId}/mark`,
        method: "POST",
        data: data.payload,
      }),
  });

  const transformAttendanceData = (apiData: any) => {
    if (!apiData) return [];

    const entries = [];
    const students = apiData.students_attendance || [];
    const instructors = apiData.instructors_attendance || [];

    // Sort instructors: primary first, then secondary
    const sortedInstructors = instructors.sort((a, b) => {
      if (a.user_role === 'primary_instructor') return -1;
      if (b.user_role === 'primary_instructor') return 1;
      if (a.user_role === 'secondary_instructor') return -1;
      if (b.user_role === 'secondary_instructor') return 1;
      return 0;
    });

    // Add instructors first
    sortedInstructors.forEach(instructor => {
      entries.push({
        type: 'instructor',
        id: instructor.user_id,
        name: `${instructor.user_first_name} ${instructor.user_last_name}`,
        role: instructor.user_role === 'primary_instructor' ? 'Primary Instructor' : 'Secondary Instructor',
        present: instructor.present || false,
        lateJoin: instructor.late_join || false,
        earlyLeft: instructor.left_early || false,
        joinTime: instructor.join_time || "",
        leftTime: instructor.leave_time || "",
      });
    });

    // Add students after instructors
    students.forEach(student => {
      entries.push({
        type: 'student',
        id: student.user_id,
        name: `${student.user_first_name} ${student.user_last_name}`,
        role: 'Student',
        present: student.present || false,
        lateJoin: student.late_join || false,
        earlyLeft: student.left_early || false,
        joinTime: student.join_time || "",
        leftTime: student.leave_time || "",
      });
    });

    return entries;
  };

  React.useEffect(() => {
    if (attendanceApiData) {
      const transformedEntries = transformAttendanceData(attendanceApiData);
      setAttendanceEntries(transformedEntries);
    }
  }, [attendanceApiData]);



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
        demoId: selectedDemo?.id,
        payload: { attendance_records: attendanceRecords }
      },
      {
        onSuccess: () => {
          toast({ title: "Success", description: "Attendance saved successfully." });
          onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Attendance – Session {selectedDemo?.id || ""}
          </DialogTitle>
          <DialogDescription>
            Record attendance with join times
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Instructors Section */}
          {attendanceEntries?.filter(entry => entry.type === 'instructor').length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">
                Instructors
              </h3>
              {attendanceEntries
                ?.filter(entry => entry.type === 'instructor')
                ?.map((entry, index) => {
                  const originalIndex = attendanceEntries.findIndex(e => e.id === entry.id);
                  return (
                    <div key={entry.id} className="border-b border-gray-200 pb-4 ml-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-lg font-medium">
                            {entry.name} ({entry.role})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground min-w-16">
                            Present:
                          </span>
                          <Switch
                            checked={entry.present}
                            onCheckedChange={(checked) =>
                              updateAttendanceEntry(originalIndex, "present", checked)
                            }
                          />
                        </div>
                      </div>

                      {entry.present && (
                        <div className="space-y-4 ml-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground min-w-20">
                                Late Join:
                              </span>
                              <Switch
                                checked={entry.lateJoin}
                                onCheckedChange={(checked) =>
                                  updateAttendanceEntry(originalIndex, "lateJoin", checked)
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground min-w-20">
                                Early Left:
                              </span>
                              <Switch
                                checked={entry.earlyLeft}
                                onCheckedChange={(checked) =>
                                  updateAttendanceEntry(originalIndex, "earlyLeft", checked)
                                }
                              />
                            </div>
                          </div>

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
                                  updateAttendanceEntry(originalIndex, "joinTime", e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-muted-foreground mb-1">
                                Left At
                              </label>
                              <input
                                type="time"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={entry.leftTime}
                                onChange={(e) =>
                                  updateAttendanceEntry(originalIndex, "leftTime", e.target.value)
                                }
                                placeholder="Optional"
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
          {attendanceEntries?.filter(entry => entry.type === 'student').length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">
                Students
              </h3>
              {attendanceEntries
                ?.filter(entry => entry.type === 'student')
                ?.map((entry, index) => {
                  const originalIndex = attendanceEntries.findIndex(e => e.id === entry.id);
                  return (
                    <div key={entry.id} className="border-b border-gray-200 pb-4 last:border-b-0 ml-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-lg font-medium">
                            {entry.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground min-w-16">
                            Present:
                          </span>
                          <Switch
                            checked={entry.present}
                            onCheckedChange={(checked) =>
                              updateAttendanceEntry(originalIndex, "present", checked)
                            }
                          />
                        </div>
                      </div>

                      {entry.present && (
                        <div className="space-y-4 ml-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground min-w-20">
                                Late Join:
                              </span>
                              <Switch
                                checked={entry.lateJoin}
                                onCheckedChange={(checked) =>
                                  updateAttendanceEntry(originalIndex, "lateJoin", checked)
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground min-w-20">
                                Early Left:
                              </span>
                              <Switch
                                checked={entry.earlyLeft}
                                onCheckedChange={(checked) =>
                                  updateAttendanceEntry(originalIndex, "earlyLeft", checked)
                                }
                              />
                            </div>
                          </div>

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
                                  updateAttendanceEntry(originalIndex, "joinTime", e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-muted-foreground mb-1">
                                Left At
                              </label>
                              <input
                                type="time"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={entry.leftTime}
                                onChange={(e) =>
                                  updateAttendanceEntry(originalIndex, "leftTime", e.target.value)
                                }
                                placeholder="Optional"
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

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
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
  );
}
