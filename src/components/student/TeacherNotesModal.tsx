
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, FileText, Calendar, Clock, User } from "lucide-react";
import { EnhancedClassSession } from "@/data/studentDashboardData";

interface TeacherNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: EnhancedClassSession | null;
}

export function TeacherNotesModal({ isOpen, onClose, session }: TeacherNotesModalProps) {
  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Teacher Notes
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Class Information */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-3">Class Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-orange-800">
                <Calendar className="w-4 h-4" />
                <span>{new Date(session.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-orange-800">
                <Clock className="w-4 h-4" />
                <span>{session.time}</span>
              </div>
              <div className="flex items-center gap-2 text-orange-800">
                <User className="w-4 h-4" />
                <span>{session.teacher}</span>
              </div>
              <div className="flex items-center gap-2 text-orange-800">
                <FileText className="w-4 h-4" />
                <span>{session.subject}</span>
              </div>
            </div>
          </div>
          
          {/* Notes Content */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Instructor Notes</h4>
            <div className="bg-gray-50 p-4 rounded-lg border">
              {session.instructorNotes ? (
                <p className="text-gray-700 leading-relaxed">{session.instructorNotes}</p>
              ) : (
                <p className="text-gray-500 italic">No notes available for this class.</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
