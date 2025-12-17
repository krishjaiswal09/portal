
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, ExternalLink } from "lucide-react";

interface Recording {
  id: string;
  title: string;
  duration: string;
  date: string;
  url: string;
  downloadUrl: string;
}

interface ClassRecordingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: {
    id: number;
    student: string;
    course: string;
  } | null;
}

const mockRecordings: Recording[] = [
  {
    id: '1',
    title: 'Main Class Recording',
    duration: '58:42',
    date: '2024-01-15',
    url: 'https://example.com/recording1',
    downloadUrl: 'https://example.com/download1'
  },
  {
    id: '2',
    title: 'Practice Session',
    duration: '15:30',
    date: '2024-01-15',
    url: 'https://example.com/recording2',
    downloadUrl: 'https://example.com/download2'
  }
];

export function ClassRecordingsModal({ isOpen, onClose, classInfo }: ClassRecordingsModalProps) {
  const handlePlayRecording = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadRecording = (downloadUrl: string) => {
    window.open(downloadUrl, '_blank');
  };

  if (!classInfo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Class Recordings - {classInfo.course}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Student: {classInfo.student}
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {mockRecordings.length > 0 ? (
            mockRecordings.map((recording) => (
              <div key={recording.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{recording.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {recording.duration}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(recording.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handlePlayRecording(recording.url)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadRecording(recording.downloadUrl)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlayRecording(recording.url)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recordings available for this class
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
