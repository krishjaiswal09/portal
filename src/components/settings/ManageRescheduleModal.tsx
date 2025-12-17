import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";

interface RescheduleReason {
  id: string;
  name: string;
  enabled: boolean;
}

interface ManageRescheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageRescheduleModal({
  isOpen,
  onOpenChange,
}: ManageRescheduleModalProps) {
  const [reasons, setReasons] = useState<RescheduleReason[]>([]);
  const [newReason, setNewReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: rescheduleReasonData,
    isLoading: rescheduleReasonDataLoading,
    error: rescheduleReasonDataError,
  } = useQuery({
    queryKey: ["rescheduleReason"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "reschedule-reason",
      }),
    enabled: isOpen,
  });

  const editRescheduleReasonDataMutation = useMutation({
    mutationFn: (payload: { id: string; name: string; enabled: boolean }) =>
      fetchApi<{ data: any; message?: string }>({
        path: `reschedule-reason/${payload.id}`,
        method: "PATCH",
        data: { name: payload.name, enabled: payload.enabled },
      }),
  });

  const addRescheduleReasonDataMutation = useMutation({
    mutationFn: (payload: { name: string; enabled: boolean }) =>
      fetchApi<{ data: any; message?: string }>({
        path: "reschedule-reason",
        method: "POST",
        data: payload,
      }),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Reschedule reason added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["rescheduleReason"] });
      setNewReason("");
    },
    onError: (error: any) => {
      console.error("Error adding reschedule reason:", error);
      toast({
        title: "Error",
        description:
          error?.message ||
          "Failed to add reschedule reason. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteReasonMutation = useMutation({
    mutationFn: (id: string) =>
      fetchApi({
        path: `reschedule-reason/${id}`,
        method: "DELETE",
      }),
  });

  const addReason = () => {
    if (newReason.trim()) {
      const newReasonObj: RescheduleReason = {
        id: Date.now().toString(),
        name: newReason.trim(),
        enabled: true,
      };
      addRescheduleReasonDataMutation.mutate({
        name: newReason.trim(),
        enabled: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a reason name.",
        variant: "destructive",
      });
    }
  };

  const deleteReason = (id: string) => {
    deleteReasonMutation.mutate(id, {
      onSuccess: (data: any) => {
        toast({
          title: "Success",
          description:
            data?.message || "Reschedule reason deleted successfully.",
        });
        setReasons(reasons?.filter((reason) => reason.id !== id));
        queryClient.invalidateQueries({ queryKey: ["rescheduleReason"] });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error?.message ||
            "Failed to delete reschedule reason. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const toggleReason = (id: string) => {
    const reasonToToggle = reasons.find((reason) => reason.id === id);
    if (!reasonToToggle) return;
    const updatedReason = {
      ...reasonToToggle,
      enabled: !reasonToToggle.enabled,
    };
    editRescheduleReasonDataMutation.mutate(
      {
        id: updatedReason.id,
        name: updatedReason.name,
        enabled: updatedReason.enabled,
      },
      {
        onSuccess: (data: any) => {
          toast({
            title: "Success",
            description:
              data?.message || "Reschedule reason updated successfully.",
          });
          setReasons(
            reasons.map((reason) => (reason.id === id ? updatedReason : reason))
          );
          queryClient.invalidateQueries({ queryKey: ["rescheduleReason"] });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.message ||
              "Failed to update reschedule reason. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleSave = () => {
    onOpenChange(false);
  };

  useEffect(() => {
    if (Array.isArray(rescheduleReasonData)) {
      setReasons(rescheduleReasonData);
    }
  }, [rescheduleReasonData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Reschedule Reasons</DialogTitle>
          <DialogDescription>
            Add, edit, or disable reasons for class rescheduling
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Reason */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter new reschedule reason..."
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addReason()}
              disabled={addRescheduleReasonDataMutation.isPending}
            />
            <Button
              onClick={addReason}
              size="sm"
              disabled={
                addRescheduleReasonDataMutation.isPending || !newReason.trim()
              }
            >
              {addRescheduleReasonDataMutation.isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Existing Reasons */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {rescheduleReasonDataLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : rescheduleReasonDataError ? (
              <div className="text-center py-4 text-red-500">
                Error loading reschedule reasons
              </div>
            ) : reasons?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No reschedule reasons found
              </div>
            ) : (
              reasons?.map((reason) => (
                <div
                  key={reason.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="flex-1">{reason.name}</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={reason.enabled}
                      onCheckedChange={() => toggleReason(reason.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReason(reason.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
