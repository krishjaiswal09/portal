import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Calendar, Clock, RefreshCw } from "lucide-react";
import { EnhancedClassSession } from "@/data/studentDashboardData";
interface StudentRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (data: any) => void;
  session: EnhancedClassSession | null;
}
export function StudentRescheduleModal({
  isOpen,
  onClose,
  onReschedule,
  session
}: StudentRescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const rescheduleReasons = ['Schedule Conflict', 'Personal Emergency', 'Prefer Different Time', 'Technical Issues', 'Other'];
  const availableDates = ['Mon, 08 Jul 2025', 'Tue, 09 Jul 2025', 'Wed, 10 Jul 2025', 'Thu, 11 Jul 2025', 'Fri, 12 Jul 2025', 'Sat, 13 Jul 2025', 'Mon, 15 Jul 2025'];
  const timeSlots = ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  const handleReschedule = () => {
    if (!selectedDate || !selectedTime || !rescheduleReason) {
      alert('Please fill all required fields');
      return;
    }
    onReschedule({
      date: selectedDate,
      time: selectedTime,
      reason: rescheduleReason
    });

    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setRescheduleReason('');
    onClose();
  };
  if (!session) return null;
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-blue-600 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Reschedule Class
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Class Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Current Class Details</h3>
            <div className="flex items-center gap-4 text-sm text-blue-800">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(session.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{session.time}</span>
              </div>
            </div>
            <p className="text-blue-900 font-medium mt-2">
              {session.subject} with {session.teacher}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Why are you rescheduling?</Label>
              <Select value={rescheduleReason} onValueChange={setRescheduleReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {rescheduleReasons.map(reason => <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Select new date and time</Label>
              
              <div className="space-y-3">
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose available date" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {availableDates.map(date => <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>)}
                  </SelectContent>
                </Select>

                {selectedDate && <div className="space-y-2">
                    <Label className="text-sm font-medium">Available time slots</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(time => <Button key={time} variant={selectedTime === time ? "default" : "outline"} size="sm" className={selectedTime === time ? "bg-blue-500 hover:bg-blue-600 text-white" : ""} onClick={() => setSelectedTime(time)}>
                          {time}
                        </Button>)}
                    </div>
                  </div>}
              </div>
            </div>

            {selectedDate && selectedTime && <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-1">New Class Schedule</h4>
                <p className="text-green-800">
                  {selectedDate} at {selectedTime}
                </p>
              </div>}

            <div className="flex justify-end gap-3 pt-4">
              
              <Button onClick={handleReschedule} className="bg-blue-500 hover:bg-blue-600 text-white">
                Reschedule Class
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}