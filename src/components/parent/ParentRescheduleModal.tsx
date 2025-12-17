
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, RotateCcw, X } from "lucide-react"

interface ClassDetails {
  id: string
  courseName: string
  date: string
  time: string
  instructor: string
}

interface ParentRescheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onReschedule: (data: any) => void
  classDetails: ClassDetails | null
}

export function ParentRescheduleModal({ isOpen, onClose, onReschedule, classDetails }: ParentRescheduleModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const rescheduleReasons = [
    'Schedule Conflict',
    'Emergency',
    'Student Request',
    'Technical Issues',
    'Other'
  ]

  const availableDates = [
    'Mon, 08 Jul 2025',
    'Tue, 09 Jul 2025',
    'Wed, 10 Jul 2025',
    'Thu, 11 Jul 2025',
    'Fri, 12 Jul 2025'
  ]

  const timeSlots = ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

  const handleReschedule = () => {
    if (!selectedReason || !selectedDate || !selectedTime) {
      alert('Please fill all required fields')
      return
    }

    onReschedule({
      reason: selectedReason,
      date: selectedDate,
      time: selectedTime
    })

    // Reset form
    setSelectedReason('')
    setSelectedDate('')
    setSelectedTime('')
    onClose()
  }

  if (!classDetails) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-500" />
            <DialogTitle className="text-xl font-semibold text-blue-600">Reschedule Class</DialogTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Class Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">Current Class Details</h3>
            <div className="space-y-2 text-blue-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>18/07/2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>10:00 AM - 11:00 AM</span>
              </div>
              <div className="font-medium">
                {classDetails.courseName} with {classDetails.instructor}
              </div>
            </div>
          </div>

          {/* Reschedule Reason */}
          <div className="space-y-3">
            <label className="text-base font-medium text-gray-900">
              Why are you rescheduling?
            </label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Schedule Conflict" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                {rescheduleReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-3">
            <label className="text-base font-medium text-gray-900">
              Select new date and time
            </label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Mon, 08 Jul 2025" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                {availableDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="space-y-3">
              <label className="text-base font-medium text-gray-900">
                Available time slots
              </label>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={`h-12 ${selectedTime === time ? "bg-blue-500 text-white" : "hover:bg-blue-50"}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* New Schedule Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">New Class Schedule</h3>
              <p className="text-green-700">
                {selectedDate} at {selectedTime}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button 
              onClick={handleReschedule}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Reschedule Class
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
