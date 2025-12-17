
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, AlertTriangle, X } from "lucide-react"

interface ClassDetails {
  id: string
  courseName: string
  date: string
  time: string
  instructor: string
}

interface ParentCancelModalProps {
  isOpen: boolean
  onClose: () => void
  onCancel: (reason: string) => void
  classDetails: ClassDetails | null
}

export function ParentCancelModal({ isOpen, onClose, onCancel, classDetails }: ParentCancelModalProps) {
  const [selectedReason, setSelectedReason] = useState('')

  const cancelReasons = [
    'Student Request',
    'Emergency',
    'Schedule Conflict',
    'Illness',
    'Technical Issues',
    'Other'
  ]

  const handleCancel = () => {
    if (!selectedReason) {
      alert('Please select a cancellation reason')
      return
    }
    onCancel(selectedReason)
    setSelectedReason('')
    onClose()
  }

  if (!classDetails) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-lg w-full">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <DialogTitle className="text-xl font-semibold text-red-600">Cancel Class</DialogTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Class Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-3">Class Details</h3>
            <div className="space-y-2 text-red-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{classDetails.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{classDetails.time}</span>
              </div>
              <div className="font-medium">
                {classDetails.courseName} with {classDetails.instructor}
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div className="space-y-3">
            <label className="text-base font-medium text-gray-900">
              Why are you cancelling this class?
            </label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select cancellation reason" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                {cancelReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-3">Cancellation Policy</h3>
            <ul className="space-y-1 text-red-700 text-sm">
              <li>• Cancellations must be made at least 2 hours before class</li>
              <li>• Credits will be refunded to your account</li>
              <li>• Late cancellations may result in credit deduction</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Keep Class
            </Button>
            <Button 
              onClick={handleCancel}
              variant="destructive"
              className="flex-1"
            >
              Cancel Class
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
