
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock } from "lucide-react"

interface ImpactedClass {
  id: number
  start_date: string
  start_time: string
  end_time: string
  title: string
  course: number
  class_type: number
  student?: any
  group?: any
}

interface ImpactedClassesModalProps {
  isOpen: boolean
  onClose: () => void
  impactedClasses: ImpactedClass[]
  vacationPeriod: string
}

export function ImpactedClassesModal({ isOpen, onClose, impactedClasses, vacationPeriod }: ImpactedClassesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-playfair flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Impacted Classes - {vacationPeriod}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>The following classes will be affected during your vacation period:</p>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Class Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impactedClasses.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(classItem.start_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {classItem.start_time} - {classItem.end_time}
                      </div>
                    </TableCell>
                    <TableCell>{classItem.student ? 'Individual' : classItem.group ? 'Group' : 'N/A'}</TableCell>
                    <TableCell>{classItem.title}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        Class Type {classItem.class_type}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
