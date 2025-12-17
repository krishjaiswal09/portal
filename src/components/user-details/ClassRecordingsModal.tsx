
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface Recording {
  id: string;
  url: string;
  title: string;
}

interface ClassRecordingsModalProps {
  open: boolean;
  onClose: () => void;
  classDate: string;
  classTime: string;
  instructor: string;
  existingRecordings?: Recording[];
}

export function ClassRecordingsModal({
  open,
  onClose,
  classDate,
  classTime,
  instructor,
  existingRecordings = []
}: ClassRecordingsModalProps) {
  const [recordings, setRecordings] = useState<Recording[]>(
    existingRecordings.length > 0 
      ? existingRecordings 
      : [{ id: '1', url: '', title: 'Main Recording' }]
  );

  const addRecording = () => {
    const newRecording: Recording = {
      id: Date.now().toString(),
      url: '',
      title: `Recording ${recordings.length + 1}`
    };
    setRecordings([...recordings, newRecording]);
  };

  const removeRecording = (id: string) => {
    if (recordings.length > 1) {
      setRecordings(recordings.filter(r => r.id !== id));
    }
  };

  const updateRecording = (id: string, field: 'url' | 'title', value: string) => {
    setRecordings(recordings.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const handleSave = () => {
    console.log('Saving recordings:', recordings);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Class Recordings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
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
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Recording URLs</Label>
              <Button variant="outline" size="sm" onClick={addRecording}>
                <Plus className="w-4 h-4 mr-2" />
                Add Recording
              </Button>
            </div>
            
            {recordings.map((recording, index) => (
              <div key={recording.id} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Recording {index + 1}</Label>
                  {recordings.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRecording(recording.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={recording.title}
                      onChange={(e) => updateRecording(recording.id, 'title', e.target.value)}
                      placeholder="Recording title"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">URL</Label>
                    <Input
                      value={recording.url}
                      onChange={(e) => updateRecording(recording.id, 'url', e.target.value)}
                      placeholder="https://example.com/recording"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Recordings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
