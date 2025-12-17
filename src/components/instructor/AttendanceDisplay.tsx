
import React from 'react'
import { Check, X } from "lucide-react"

interface AttendanceDisplayProps {
  teacherAttendance: 'present' | 'absent'
  studentAttendance: 'present' | 'absent'
  studentName: string
}

export function AttendanceDisplay({ teacherAttendance, studentAttendance, studentName }: AttendanceDisplayProps) {
  return (
    <div className="space-y-1 text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">Teacher:</span>
        {teacherAttendance === 'present' ? (
          <div className="flex items-center gap-1 text-green-600">
            <Check className="w-4 h-4" />
            <span>Present</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-600">
            <X className="w-4 h-4" />
            <span>Absent</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Student:</span>
        {studentAttendance === 'present' ? (
          <div className="flex items-center gap-1 text-green-600">
            <Check className="w-4 h-4" />
            <span>Present</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-600">
            <X className="w-4 h-4" />
            <span>Absent</span>
          </div>
        )}
      </div>
    </div>
  )
}
