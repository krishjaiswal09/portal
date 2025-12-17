import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";

interface DemoNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: any) => void;
  demoId?: string;
  existingNotes?: string;
}

export function DemoNotesModal({
  isOpen,
  onClose,
  onSave,
  demoId,
  existingNotes,
}: DemoNotesModalProps) {
  const [notes, setNotes] = useState(existingNotes);

  useEffect(() => {
    setNotes(existingNotes);
  }, [existingNotes]);

  const handleSave = () => {
    const savedNotes = {
      demoId,
      notes,
    };
    onSave(savedNotes);
    onClose();
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Class Notes:</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write notes here..."
              rows={6}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Save Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
