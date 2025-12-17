import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, Calendar, StickyNote, UserCheck, Video, Settings, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface DemoClass {
  id: number;
  primary_instructor: number;
  course_id: number;
  secondary_instructor: number | null;
  date: string;
  start_time: string;
  end_time: string;
  student_id: number;
  group: string | null;
  status: string;
  student_first_name: string;
  student_last_name: string;
  student_email: string;
  student_phone: string;
  primary_instructor_first_name: string;
  primary_instructor_last_name: string;
  secondary_instructor_first_name: string | null;
  secondary_instructor_last_name: string | null;
  group_name: string | null;
  course_name: string;
  notes: string | null;
  attendance: string | null;
  recording: string | null;
  meeting_link: string | null;
}

interface DemoTableProps {
  demos: DemoClass[];
  selectedDemos: number[];
  onToggleSelection: (demoId: number) => void;
  onSelectAll: (select: boolean) => void;
  onJoinDemo: (demoId: number, demoLink: string) => void;
  onCancelReschedule: (demoId: number) => void;
  onAddNotes: (demoId: number, notes: string) => void;
  onMarkAttendance: (demoId: number) => void;
  onViewRecordings: (demoId: number) => void;
  onDeleteDemo: (demoId: number) => void;
}

export function DemoTable({
  demos,
  selectedDemos,
  onToggleSelection,
  onSelectAll,
  onJoinDemo,
  onCancelReschedule,
  onAddNotes,
  onMarkAttendance,
  onViewRecordings,
  onDeleteDemo,
}: DemoTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [columns, setColumns] = useState({
    date: true,
    course: true,
    startTime: true,
    endTime: true,
    studentName: true,
    instructor: true,
    group: true,
    status: true,
  });
  const itemsPerPage = 10;
  const totalPages = Math.ceil(demos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDemos = demos.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      Scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      rescheduled: "bg-yellow-100 text-yellow-800",
    };
    return (
      statusColors[status as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const allSelected = demos.length > 0 && selectedDemos.length === demos.length;
  const someSelected =
    selectedDemos.length > 0 && selectedDemos.length < demos.length;

  return (
    <div className="space-y-4">
      {/* Header with Customize Columns Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Demo Classes</h3>
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                />
              </TableHead>
              {columns.date && <TableHead>Date</TableHead>}
              {columns.course && <TableHead>Course</TableHead>}
              {columns.startTime && <TableHead>Start Time</TableHead>}
              {columns.endTime && <TableHead>End Time</TableHead>}
              {columns.studentName && <TableHead>Student Name(s)</TableHead>}
              {columns.instructor && <TableHead>Instructor</TableHead>}
              {columns.group && <TableHead>Group</TableHead>}
              {columns.status && <TableHead>Status</TableHead>}
              <TableHead>Join Class</TableHead>
              <TableHead>Cancel/Reschedule</TableHead>
              <TableHead className="min-w-[280px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDemos?.map((demo) => (
              <TableRow key={demo.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedDemos.includes(demo.id)}
                    onCheckedChange={() => onToggleSelection(demo.id)}
                  />
                </TableCell>
                {columns.date && (
                  <TableCell className="font-medium">
                    {format(new Date(demo.date), "MMM dd, yyyy")}
                  </TableCell>
                )}
                {columns.course && (
                  <TableCell>
                    <Badge variant="outline">{demo.course_name}</Badge>
                  </TableCell>
                )}
                {columns.startTime && <TableCell>{demo.start_time}</TableCell>}
                {columns.endTime && <TableCell>{demo.end_time}</TableCell>}
                {columns.studentName && (
                  <TableCell>
                    <div className="max-w-48">
                      {demo.student_first_name} {demo.student_last_name}
                    </div>
                  </TableCell>
                )}
                {columns.instructor && (
                  <TableCell>
                    {demo.primary_instructor_first_name}{" "}
                    {demo.primary_instructor_last_name}
                    {demo.secondary_instructor_first_name && (
                      <div className="text-xs text-muted-foreground">
                        + {demo.secondary_instructor_first_name}{" "}
                        {demo.secondary_instructor_last_name}
                      </div>
                    )}
                  </TableCell>
                )}
                {columns.group && <TableCell>{demo.group_name || "Individual"}</TableCell>}
                {columns.status && (
                  <TableCell>
                    <Badge className={getStatusBadge(demo.status)}>
                      {demo.status}
                    </Badge>
                  </TableCell>
                )}
                <TableCell>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onJoinDemo(demo.id, demo.meeting_link)}
                    disabled={demo.status === "Cancelled"}
                    className="flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Start Class
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCancelReschedule(demo.id)}
                    disabled={
                      demo.status === "Cancelled" || demo.status === "Completed"
                    }
                    className="flex items-center gap-1"
                  >
                    <Calendar className="h-3 w-3" />
                    Cancel/Reschedule
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddNotes(demo.id, demo.notes)}
                    >
                      <StickyNote className="mr-1 h-3 w-3" />
                      Notes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkAttendance(demo.id)}
                    >
                      <UserCheck className="mr-1 h-3 w-3" />
                      Attendance
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewRecordings(demo.id)}
                    >
                      <Video className="mr-1 h-3 w-3" />
                      Recordings
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteDemo(demo.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, demos.length)} of{" "}
            {demos.length} demos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Column Customization Modal */}
      <Dialog open={showColumnModal} onOpenChange={setShowColumnModal}>
        <DialogContent className="bg-background border shadow-lg">
          <DialogHeader>
            <DialogTitle>Customize Columns</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {Object.entries(columns).map(([key, value]) => (
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
    </div>
  );
}
