
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TeacherNotesModalProps {
  open: boolean;
  onClose: () => void;
  classDate: string;
  classTime: string;
  instructor: string;
  existingNotes?: string;
}

export function TeacherNotesModal({
  open,
  onClose,
  classDate,
  classTime,
  instructor,
  existingNotes = ""
}: TeacherNotesModalProps) {
  const [notes, setNotes] = useState(existingNotes);

  const handleSave = () => {
    console.log('Saving notes:', notes);
    // Here you would typically save to your backend
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Teacher Notes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="notes">Class Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your class notes here..."
              className="min-h-[200px]"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
