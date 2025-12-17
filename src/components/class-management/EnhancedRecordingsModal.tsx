import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";

interface Recording {
  id: string;
  title: string;
  url: string;
}

interface EnhancedRecordingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  initialRecordings?: Recording[];
}

export function EnhancedRecordingsModal({
  isOpen,
  onOpenChange,
  sessionId,
  initialRecordings = [],
}: EnhancedRecordingsModalProps) {
  const [recordings, setRecordings] = useState<Recording[]>(() =>
    initialRecordings.length > 0
      ? initialRecordings
      : [{ id: "1", title: "", url: "" }]
  );

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && initialRecordings.length > 0) {
      setRecordings(initialRecordings);
    }
  }, [isOpen, initialRecordings]);

  const editClassReschedule = useMutation({
    mutationFn: (data: { id: string; payload: any }) =>
      fetchApi({
        path: `classes/class-schedule/${data.id}`,
        method: "PATCH",
        data: data.payload,
      }),
  });

  const addRecording = () => {
    const newRecording: Recording = {
      id: Date.now().toString(),
      title: "",
      url: "",
    };
    setRecordings((prev) => [...prev, newRecording]);
  };

  const removeRecording = (id: string) => {
    if (recordings.length > 1) {
      setRecordings((prev) => prev.filter((rec) => rec.id !== id));
    }
  };

  const updateRecording = (id: string, field: keyof Recording, value: string) => {
    setRecordings((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, [field]: value } : rec))
    );
  };

  const handleCancel = () => {
    setRecordings([{ id: "1", title: "", url: "" }]);
    onOpenChange(false);
  };

  const handleSave = () => {
    editClassReschedule.mutate(
      {
        id: sessionId,
        payload: {
          class_recording: recordings[0]?.url || "",
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Class recordings saved successfully!",
          });
          setRecordings([{ id: "1", title: "", url: "" }]);
          queryClient.invalidateQueries({ queryKey: ["classes"] });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.message ||
              "Failed to save recordings. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Class Recordings – Session {sessionId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recordings Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-base">Recordings</h3>
              <Button
                onClick={addRecording}
                size="sm"
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4" />
                Add Recording
              </Button>
            </div>

            {recordings.map((recording, index) => (
              <div
                key={recording.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Recording {index + 1}
                  </span>
                  {recordings.length > 1 && (
                    <Button
                      onClick={() => removeRecording(recording.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Recording Title
                    </label>
                    <Input
                      placeholder="Enter recording title"
                      value={recording.title}
                      onChange={(e) =>
                        updateRecording(recording.id, "title", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Recording URL
                    </label>
                    <Input
                      placeholder="Enter recording URL"
                      value={recording.url}
                      onChange={(e) =>
                        updateRecording(recording.id, "url", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={editClassReschedule.isPending}
            >
              {editClassReschedule.isPending ? "Saving..." : "Save Recordings"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
