import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Calendar, Clock, AlertTriangle } from "lucide-react";
import { EnhancedClassSession } from "@/data/studentDashboardData";
import { fetchApi } from "@/services/api/fetchApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface StudentCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: (reason: string) => void;
  session: EnhancedClassSession | null;
}

export function StudentCancelModal({
  isOpen,
  onClose,
  onCancel,
  session,
}: StudentCancelModalProps) {
  const [cancelReason, setCancelReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: cancelationReasonData,
    isLoading: cancelationReasonDataLoading,
    error: cancelationReasonDataError,
  } = useQuery({
    queryKey: ["cancelationReason"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "cancelation-reason",
      }),
    enabled: isOpen,
  });

  const editClassReschdule = useMutation({
    mutationFn: (data: { id: string; payload: any }) =>
      fetchApi({
        path: `classes/class-schedule/${data.id}`,
        method: "PATCH",
        data: data.payload,
      }),
  });

  const cancelReasons =
    cancelationReasonData?.data?.filter((reason) => reason.enabled) || [];

  const handleCancel = () => {
    if (!cancelReason) {
      toast({
        title: "Error",
        description: "Please select a cancellation reason",
        variant: "destructive",
      });
      return;
    }

    const selectedReasonObj = cancelReasons.find(r => r.name === cancelReason);
    if (!selectedReasonObj || !session?.id) {
      toast({
        title: "Error",
        description: "Missing class or reason for cancellation.",
        variant: "destructive",
      });
      return;
    }

    editClassReschdule.mutate(
      {
        id: session.id.toString(),
        payload: {
          reason: selectedReasonObj.id,
          status: "cancelled",
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Class Cancelled",
            description: `Class cancelled. Reason: ${selectedReasonObj.name}`,
            variant: "destructive",
          });
          onCancel(cancelReason);
          setCancelReason("");
          onClose();
          queryClient.invalidateQueries({ queryKey: ["student-classes", user?.id] });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to cancel class.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Cancel Class
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Class Info */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">Class Details</h3>
            <div className="flex items-center gap-4 text-sm text-red-800">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(session.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{session.time}</span>
              </div>
            </div>
            <p className="text-red-900 font-medium mt-2">
              {session.subject} with {session.teacher}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Why are you cancelling this class?
              </Label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cancellation reason" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {cancelReasons.map((reason) => (
                    <SelectItem key={reason.id} value={reason.name}>
                      {reason.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-900 mb-2">
                Cancellation Policy
              </h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>
                  • Cancellations must be made at least 2 hours before class
                </li>
                <li>• Credits will be refunded to your account</li>
                <li>• Late cancellations may result in credit deduction</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Keep Class
              </Button>
              <Button
                onClick={handleCancel}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                disabled={editClassReschdule.isPending}
              >
                {editClassReschdule.isPending ? "Cancelling..." : "Cancel Class"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
