import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Recording {
  id: string;
  title: string;
  url: string;
}

interface DemoRecordingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recordings: Recording[]) => void;
  demoId?: string;
}

export function DemoRecordingsModal({ isOpen, onClose, onSave, demoId }: DemoRecordingsModalProps) {
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: "1",
      title: "Recording 1",
      url: ""
    }
  ]);

  const addRecording = () => {
    const newRecording: Recording = {
      id: Date.now().toString(),
      title: `Recording ${recordings.length + 1}`,
      url: ""
    };
    setRecordings([...recordings, newRecording]);
  };

  const updateRecording = (id: string, field: string, value: string) => {
    setRecordings(recordings.map(recording => 
      recording.id === id ? { ...recording, [field]: value } : recording
    ));
  };

  const removeRecording = (id: string) => {
    setRecordings(recordings.filter(recording => recording.id !== id));
  };

  const handleSave = () => {
    onSave(recordings);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Class Recordings – Session {demoId || "1"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recordings</h3>
            <Button 
              onClick={addRecording}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Recording
            </Button>
          </div>

          <div className="space-y-4">
            {recordings.map((recording) => (
              <div key={recording.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-muted-foreground">{recording.title}</h4>
                  {recordings.length > 1 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeRecording(recording.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Recording URL</Label>
                  <Input
                    value={recording.url}
                    onChange={(e) => updateRecording(recording.id, 'url', e.target.value)}
                    placeholder="Enter recording URL"
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Save Recordings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}