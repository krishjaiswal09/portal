
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface NotesModalProps {
  isOpen: boolean
  onClose: () => void
  classInfo: {
    id: number
    student: string
    course: string
  } | null
  existingNotes?: string
  onSave: (notes: string) => void
}

export function NotesModal({ isOpen, onClose, classInfo, existingNotes = "", onSave }: NotesModalProps) {
  const [notes, setNotes] = useState(existingNotes)

  const handleSave = () => {
    onSave(notes)
    onClose()
  }

  const handleClose = () => {
    setNotes(existingNotes)
    onClose()
  }

  // Don't render if classInfo is null
  if (!classInfo) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair">Class Notes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <p><strong>Student:</strong> {classInfo.student}</p>
              <p><strong>Course:</strong> {classInfo.course}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add your notes about this class..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">
              Save Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
