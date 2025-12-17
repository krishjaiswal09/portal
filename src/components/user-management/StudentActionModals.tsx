import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
interface NotesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  existingNotes?: string;
}
export function NotesModal({
  isOpen,
  onOpenChange,
  sessionId,
  existingNotes = ''
}: NotesModalProps) {
  const [notes, setNotes] = useState(existingNotes);
  const handleSave = () => {
    onOpenChange(false);
  };
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Teacher Notes - Session {sessionId}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Class Notes</Label>
            <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Enter class notes, student progress, topics covered, homework assigned, etc..." className="min-h-32" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
interface AttendanceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  studentName: string;
  teacherName: string;
}
export function AttendanceModal({
  isOpen,
  onOpenChange,
  sessionId,
  studentName,
  teacherName
}: AttendanceModalProps) {
  const [attendance, setAttendance] = useState({
    studentJoined: true,
    teacherJoined: true,
    studentJoinTime: '10:00 AM',
    teacherJoinTime: '10:00 AM',
    studentLeaveTime: '11:00 AM',
    teacherLeaveTime: '11:00 AM',
    notes: ''
  });
  const handleSave = () => {
    console.log('Saving attendance for session:', sessionId, attendance);
    onOpenChange(false);
  };
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Attendance - Session {sessionId}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">{studentName} (Student)</Label>
                <p className="text-sm text-muted-foreground">Student attendance status</p>
              </div>
              <Switch checked={attendance.studentJoined} onCheckedChange={checked => setAttendance(prev => ({
              ...prev,
              studentJoined: checked
            }))} />
            </div>
            
            {attendance.studentJoined && <div className="grid grid-cols-2 gap-2 ml-4">
                <div>
                  <Label className="text-sm">Join Time</Label>
                  <Input value={attendance.studentJoinTime} onChange={e => setAttendance(prev => ({
                ...prev,
                studentJoinTime: e.target.value
              }))} placeholder="10:00 AM" />
                </div>
                <div>
                  
                  
                </div>
              </div>}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">{teacherName} (Teacher)</Label>
                <p className="text-sm text-muted-foreground">Teacher attendance status</p>
              </div>
              <Switch checked={attendance.teacherJoined} onCheckedChange={checked => setAttendance(prev => ({
              ...prev,
              teacherJoined: checked
            }))} />
            </div>
            
            {attendance.teacherJoined && <div className="grid grid-cols-2 gap-2 ml-4">
                <div>
                  <Label className="text-sm">Join Time</Label>
                  <Input value={attendance.teacherJoinTime} onChange={e => setAttendance(prev => ({
                ...prev,
                teacherJoinTime: e.target.value
              }))} placeholder="10:00 AM" />
                </div>
                <div>
                  
                  
                </div>
              </div>}
          </div>

          <div>
            <Label htmlFor="attendanceNotes">Additional Notes</Label>
            <Textarea id="attendanceNotes" value={attendance.notes} onChange={e => setAttendance(prev => ({
            ...prev,
            notes: e.target.value
          }))} placeholder="Any additional attendance notes..." />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
interface RecordingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
}
export function RecordingModal({
  isOpen,
  onOpenChange,
  sessionId
}: RecordingModalProps) {
  const [recordings, setRecordings] = useState([{
    id: 1,
    title: 'Main Class Recording',
    url: '',
    description: ''
  }]);
  const addRecording = () => {
    setRecordings(prev => [...prev, {
      id: Date.now(),
      title: '',
      url: '',
      description: ''
    }]);
  };
  const removeRecording = (id: number) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
  };
  const updateRecording = (id: number, field: string, value: string) => {
    setRecordings(prev => prev.map(r => r.id === id ? {
      ...r,
      [field]: value
    } : r));
  };
  const handleSave = () => {
    console.log('Saving recordings for session:', sessionId, recordings);
    onOpenChange(false);
  };
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Class Recordings - Session {sessionId}
            <Button onClick={addRecording} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Recording
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {recordings.map(recording => <div key={recording.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Recording {recordings.indexOf(recording) + 1}</Label>
                {recordings.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeRecording(recording.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>}
              </div>
              
              <div className="space-y-2">
                <div>
                  <Label className="text-sm">Recording Title</Label>
                  <Input value={recording.title} onChange={e => updateRecording(recording.id, 'title', e.target.value)} placeholder="Enter recording title" />
                </div>
                
                <div>
                  <Label className="text-sm">Recording URL</Label>
                  <Input value={recording.url} onChange={e => updateRecording(recording.id, 'url', e.target.value)} placeholder="https://..." />
                </div>
                
                
              </div>
            </div>)}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Recordings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}