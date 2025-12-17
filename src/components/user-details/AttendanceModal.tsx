
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AttendanceModalProps {
  open: boolean;
  onClose: () => void;
  classDate: string;
  classTime: string;
  instructor: string;
  studentName: string;
}

export function AttendanceModal({
  open,
  onClose,
  classDate,
  classTime,
  instructor,
  studentName
}: AttendanceModalProps) {
  const [studentAttendance, setStudentAttendance] = useState(true);
  const [teacherAttendance, setTeacherAttendance] = useState(true);
  const [studentJoinTime, setStudentJoinTime] = useState('10:00 AM');
  const [teacherJoinTime, setTeacherJoinTime] = useState('9:58 AM');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleSave = () => {
    console.log('Saving attendance:', {
      studentAttendance,
      teacherAttendance,
      studentJoinTime,
      teacherJoinTime,
      additionalNotes
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Attendance</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Date:</span> {classDate}
            </div>
            <div>
              <span className="font-medium">Time:</span> {classTime}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Instructor:</span> {instructor}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base font-medium">{studentName} (Student)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="student-attendance" className="text-sm">Present</Label>
                    <Switch
                      id="student-attendance"
                      checked={studentAttendance}
                      onCheckedChange={setStudentAttendance}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Join Time:</Label>
                    <Input
                      value={studentJoinTime}
                      onChange={(e) => setStudentJoinTime(e.target.value)}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base font-medium">{instructor} (Teacher)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="teacher-attendance" className="text-sm">Present</Label>
                    <Switch
                      id="teacher-attendance"
                      checked={teacherAttendance}
                      onCheckedChange={setTeacherAttendance}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Join Time:</Label>
                    <Input
                      value={teacherJoinTime}
                      onChange={(e) => setTeacherJoinTime(e.target.value)}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additional-notes">Additional Notes</Label>
            <Textarea
              id="additional-notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any additional attendance notes..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Attendance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
