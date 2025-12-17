
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface RescheduleClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (data: any) => void;
  classInfo?: any;
}

export function RescheduleClassModal({ isOpen, onClose, onReschedule, classInfo }: RescheduleClassModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const availableDates = [
    'Sat, 05 Jul 2025',
    'Mon, 07 Jul 2025',
    'Tue, 08 Jul 2025',
    'Wed, 09 Jul 2025',
    'Thu, 10 Jul 2025',
    'Fri, 11 Jul 2025',
    'Sat, 12 Jul 2025',
    'Mon, 14 Jul 2025',
    'Wed, 16 Jul 2025'
  ];

  const timeSlots = ['04:00 PM', '04:40 PM', '05:20 PM'];
  const rescheduleReasons = ['Student Request', 'Technical Issues', 'Schedule Conflict', 'Other'];

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Reschedule Class</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Class Info */}
          <div className="text-sm text-muted-foreground">
            Class Time: {classInfo?.startDate || 'Sat, 05 Jul 2025'}, {classInfo?.startTime || '06:30 PM'} - {classInfo?.endTime || '07:10 PM'} ({classInfo?.type || 'HINDUSTANI VOCALS BEGINNERS COURSE'})
          </div>

          {/* Reason for Rescheduling */}
          <div className="space-y-2">
            <Label>Reason for Rescheduling</Label>
            <Select value={rescheduleReason} onValueChange={setRescheduleReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {rescheduleReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time Selection */}
          <div className="space-y-4">
            <Label>Select date and timeslot</Label>
            
            {/* Date Selection */}
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {availableDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={selectedTime === time ? "bg-orange-500 text-white" : ""}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>

                {/* Available dates list */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableDates.filter(date => date !== selectedDate).map((date) => (
                    <div key={date} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <span className="text-sm">{date}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(date)}
                      >
                        →
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reschedule Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-sm font-medium text-orange-800">
                Reschedule To - {selectedDate}, {selectedTime}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={handleReschedule}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Reschedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
